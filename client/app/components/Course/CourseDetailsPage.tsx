import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishablekeyQuery,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { toast } from "react-hot-toast";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config, isLoading: keyLoading, error: keyError } = useGetStripePublishablekeyQuery({}, {
    // Skip the query if we've already tried and failed
    skip: false
  });
  const [createPaymentIntent, { data: paymentIntentData, isLoading: paymentLoading, error: paymentError }] =
    useCreatePaymentIntentMutation();
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [stripeError, setStripeError] = useState<string | null>(null);

  // For debugging
  useEffect(() => {
    console.log("Stripe config:", config);
    console.log("Stripe key error:", keyError);
    console.log("Payment intent data:", paymentIntentData);
    console.log("Payment intent error:", paymentError);
  }, [config, keyError, paymentIntentData, paymentError]);

  useEffect(() => {
    if (config && config.publishablekey) {
      try {
        const publishablekey = config.publishablekey;
        console.log("Loading Stripe with key:", publishablekey.substring(0, 8) + "...");
        
        // Try with direct publishable key from environment if available
        const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (envKey && !publishablekey.startsWith('pk_test_')) {
          console.log("Using key from client environment instead");
          setStripePromise(loadStripe(envKey));
        } else {
          setStripePromise(loadStripe(publishablekey));
        }
      } catch (error) {
        console.error("Error loading Stripe:", error);
        setStripeError("Failed to load payment system. Please try again later.");
      }
    } else if (keyError) {
      console.error("Error fetching Stripe key:", keyError);
      
      // Try with direct publishable key from environment if available
      const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (envKey) {
        console.log("Attempting to use key from client environment");
        try {
          setStripePromise(loadStripe(envKey));
        } catch (error) {
          console.error("Error loading Stripe with env key:", error);
          setStripeError("Stripe key not configured. Card payment may not work properly.");
        }
      } else {
        setStripeError("Stripe key not configured. Card payment may not work properly.");
      }
    }
  }, [config, keyError]);

  useEffect(() => {
    if (data && userData?.user) {
      const amount = Math.round(data.course.price * 100);
      if (amount > 0) {
        console.log("Creating payment intent for amount:", amount);
        createPaymentIntent(amount)
          .unwrap()
          .then(result => {
            console.log("Payment intent created successfully:", result);
            if (result.client_secret) {
              setClientSecret(result.client_secret);
            }
          })
          .catch(err => {
            console.error("Error creating payment intent:", err);
            setStripeError("Failed to initialize payment. Please try again later.");
          });
      }
    }
  }, [data, userData, createPaymentIntent]);

  useEffect(() => {
    if (paymentIntentData && paymentIntentData.client_secret) {
      console.log("Setting client secret:", paymentIntentData.client_secret.substring(0, 10) + "...");
      setClientSecret(paymentIntentData.client_secret);
    } else if (paymentError) {
      console.error("Payment intent error:", paymentError);
      setStripeError("Failed to initialize payment. Card payment may not work properly.");
    }
  }, [paymentIntentData, paymentError]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data?.course?.name + " - EduHub"}
            description={
              "EduHub is a programming community which is developed by shahriar sajeeb for helping programmers"
            }
            keywords={data?.course?.tags}
          />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <CourseDetails
            data={data.course}
            stripePromise={stripePromise}
            clientSecret={clientSecret}
            setRoute={setRoute}
            setOpen={setOpen}
            stripeError={stripeError}
          />
          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
