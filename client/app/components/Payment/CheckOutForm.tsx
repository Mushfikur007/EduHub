import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: any;
  data: any;
  user:any;
  refetch:any;
};

const CheckOutForm = ({ data, user, refetch, setOpen }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>("");
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const router = useRouter();

  // Check if elements are ready
  useEffect(() => {
    if (!stripe || !elements) {
      console.log("Stripe or elements not initialized yet");
      return;
    }

    console.log("Checking for payment element");
    // Wait a bit for elements to be mounted
    const checkElement = setTimeout(() => {
      try {
        console.log("Elements object:", elements);
        const paymentElement = elements.getElement(PaymentElement);
        console.log("Payment element:", paymentElement ? "Found" : "Not found");
        
        if (paymentElement) {
          setElementReady(true);
          console.log("Payment element found and ready");
        } else {
          console.log("Payment element not found yet");
        }
      } catch (err) {
        console.error("Error checking payment element:", err);
      }
    }, 1000);

    return () => clearTimeout(checkElement);
  }, [stripe, elements]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Payment form submitted");
    
    // Check if Stripe and elements are initialized
    if (!stripe || !elements) {
      setMessage("Stripe has not been properly initialized. Please try again later.");
      return;
    }

    // Check if the payment element is ready
    if (!elementReady) {
      setMessage("Payment form is not ready yet. Please wait a moment and try again.");
      return;
    }

    setIsLoading(true);
    console.log("Processing payment...");
    
    try {
      // Confirm payment without explicitly checking for the element
      // This approach is more reliable as it lets Stripe handle the element validation
      console.log("Calling stripe.confirmPayment");
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      
      if (error) {
        console.error("Payment confirmation error:", error);
        setMessage(error.message || "An error occurred during payment processing.");
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);
        setIsLoading(false);
        createOrder({ courseId: data._id, payment_info: paymentIntent });
      } else {
        console.log("Payment status:", paymentIntent?.status);
        setMessage("Payment failed or was cancelled. Please try again.");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setMessage(err.message || "An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
   if(orderData){
    console.log("Order created successfully:", orderData);
    refetch();
    socketId.emit("notification", {
       title: "New Order",
       message: `You have a new order from ${data.name}`,
       userId: user._id,
    });
    toast.success("Payment successful! Redirecting to course...");
    router.push(`/course-access/${data._id}`);
   }
   if(error){
    console.error("Order creation error:", error);
    if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message || "Payment failed. Please try again.");
      }
   }
  }, [orderData, error, data._id, data.name, refetch, router, user._id]);
  
  // Handle direct purchase as a fallback
  const handleDirectPurchase = () => {
    setOpen(false);
    // Give a small delay before showing the toast
    setTimeout(() => {
      toast.success("Please use the Purchase Now button for direct purchase.");
    }, 300);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <h2 className="text-[22px] font-[600] font-Poppins text-center mb-5 text-black">Complete Your Purchase</h2>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-[500] text-[18px] text-black">Course:</span>
          <span className="font-[600] text-[18px] text-black">{data.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-[500] text-[18px] text-black">Price:</span>
          <span className="font-[600] text-[18px] text-[#37a39a]">${data.price}</span>
        </div>
      </div>
      <div className="mb-4">
        <LinkAuthenticationElement id="link-authentication-element" options={{
          defaultValues: {
            email: user?.email || '',
          }
        }} />
      </div>
      <div className="mb-6">
        <PaymentElement 
          id="payment-element" 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            },
            fields: {
              billingDetails: {
                name: 'auto',
                email: 'auto',
              }
            }
          }}
        />
      </div>
      <button 
        disabled={isLoading || !stripe || !elements || !elementReady} 
        id="submit" 
        className="w-full"
      >
        <span id="button-text" className={`${styles.button} w-full !h-[45px] flex items-center justify-center`}>
          {isLoading ? "Processing Payment..." : `Pay $${data.price} Now`}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="text-[red] font-Poppins pt-4 text-center">
          {message}
        </div>
      )}
      {(!stripe || !elements || !elementReady) && (
        <div className="text-[#ff6b6b] font-Poppins pt-4 text-center">
          <p>Stripe payment may not be available. You may need to add Stripe keys.</p>
          <p className="mt-2">
            <button 
              type="button" 
              className="underline text-[#37a39a]"
              onClick={handleDirectPurchase}
            >
              Try direct purchase instead
            </button>
          </p>
        </div>
      )}
    </form>
  );
};

export default CheckOutForm;
