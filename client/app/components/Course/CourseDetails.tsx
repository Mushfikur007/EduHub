import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import { usePurchaseCourseMutation } from "@/redux/features/orders/ordersApi";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";

type Props = {
  data: any;
  stripePromise: any;
  clientSecret: string;
  setRoute: any;
  setOpen: any;
  stripeError?: string | null;
};

const CourseDetails = ({
  data,
  stripePromise,
  clientSecret,
  setRoute,
  setOpen: openAuthModal,
  stripeError,
}: Props) => {
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);
  const [confirmPurchase, setConfirmPurchase] = useState(false);
  const [purchaseCourse, { isLoading: purchaseLoading, error: purchaseError, isSuccess }] = usePurchaseCourseMutation();

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course purchased successfully!");
      refetch();
    }
    if (purchaseError) {
      if ("data" in purchaseError) {
        const errorMessage = purchaseError as any;
        toast.error(errorMessage.data.message || "Something went wrong");
      }
    }
  }, [isSuccess, purchaseError, refetch]);

  const dicountPercentenge =
    ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);
  
  const isPurchased =
    user && user?.courses?.some((item: any) => item.courseId === data._id);

  const handleOrder = (e: any) => {
    if (user) {
      setOpen(true);
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  const handleDirectPurchase = () => {
    if (!user) {
      setRoute("Login");
      openAuthModal(true);
      return;
    }
    
    if (!data || !data._id) {
      toast.error("Course information is missing");
      return;
    }
    
    setConfirmPurchase(true);
  };

  const confirmDirectPurchase = () => {
    try {
      toast.loading("Processing your purchase...", { id: "purchaseToast" });
      purchaseCourse(data._id)
        .then(() => {
          toast.success("Course purchased successfully!", { id: "purchaseToast" });
          setConfirmPurchase(false);
        })
        .catch((error) => {
          console.error("Purchase error:", error);
          toast.error("Failed to purchase course. Please try again.", { id: "purchaseToast" });
        });
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to purchase course. Please try again.", { id: "purchaseToast" });
    }
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {data.purchased} Students
              </h5>
            </div>

            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What you will learn from this course?
            </h1>
            <div>
              {data.benefits?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What are the prerequisites for starting this course?
            </h1>
            {data.prerequisites?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Overview
              </h1>
              <CourseContentList 
                data={data?.courseData} 
                isDemo={true} 
                setActiveVideo={() => {}}
              />
            </div>
            <br />
            <br />
            {/* course description */}
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}{" "}
                  Course Rating • {data?.reviews?.length} Reviews
                </h5>
              </div>
              <br />
              {(data?.reviews && [...data.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div className="w-full pb-4" key={index}>
                    <div className="flex">
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={
                            item.user.avatar
                              ? item.user.avatar.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full"
                          objectFit="cover"
                        />
                      </div>
                      <div className="hidden 800px:block pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[18px] pr-2 text-black dark:text-white">
                            {item.user.name}
                          </h5>
                          <Ratings rating={item.rating} />
                        </div>
                        <p className="text-black dark:text-white">
                          {item.comment}
                        </p>
                        <small className="text-[#000000d1] dark:text-[#ffffff83]">
                          {format(item.createdAt)} •
                        </small>
                      </div>
                      <div className="pl-2 flex 800px:hidden items-center">
                        <h5 className="text-[18px] pr-2 text-black dark:text-white">
                          {item.user.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                    </div>
                    {item.commentReplies.map((i: any, index: number) => (
                      <div className="w-full flex 800px:ml-16 my-5" key={index}>
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={
                              i.user.avatar
                                ? i.user.avatar.url
                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full"
                            objectFit="cover"
                          />
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                            <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                          </div>
                          <p>{i.comment}</p>
                          <small className="text-[#ffffff83]">
                            {format(i.createdAt)} •
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {data.price === 0 ? "Free" : data.price + "$"}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                  {data.estimatedPrice}$
                </h5>

                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPercentengePrice}% Off
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}
                  >
                    Enter to Course
                  </Link>
                ) : (
                  <>
                    <div
                      className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                      onClick={handleOrder}
                    >
                      Buy this Course {data.price}$
                    </div>
                    <div
                      className={`${styles.button} !w-[180px] my-3 ml-4 font-Poppins cursor-pointer !bg-[#4f5ef1]`}
                      onClick={handleDirectPurchase}
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      {purchaseLoading ? 'Purchasing...' : 'Purchase Now'}
                    </div>
                  </>
                )}
              </div>
              {stripeError && (
                <div className="mt-2 mb-4 text-sm text-[#ff6b6b]">
                  <p>Card payment may not work without Stripe keys. You can use the "Purchase Now" option instead.</p>
                </div>
              )}
              <br />
              <p className="pb-1 text-black dark:text-white">
                • Source code included
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Full lifetime access
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Certificate of completion
              </p>
              <p className="pb-3 800px:pb-1 text-black dark:text-white">
                • Premium Support
              </p>
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {stripeError ? (
                  <div className="p-5 text-center">
                    <h2 className="text-[22px] font-[600] font-Poppins text-center mb-5 text-black">Payment Error</h2>
                    <p className="text-[red] mb-4">{stripeError}</p>
                    <div className="flex flex-col gap-3">
                      <button 
                        className={`${styles.button} !w-[200px] mx-auto !h-[45px]`}
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </button>
                      <button 
                        className={`${styles.button} !w-[200px] mx-auto !h-[45px] !bg-[#37a39a]`}
                        onClick={() => {
                          setOpen(false);
                          handleDirectPurchase();
                        }}
                      >
                        Try Direct Purchase
                      </button>
                    </div>
                  </div>
                ) : stripePromise && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckOutForm
                      data={data}
                      user={user}
                      refetch={refetch}
                      setOpen={setOpen}
                    />
                  </Elements>
                ) : (
                  <div className="p-5 text-center">
                    <h2 className="text-[22px] font-[600] font-Poppins text-center mb-5 text-black">Loading Payment</h2>
                    <p className="mb-4 text-black">Please wait while we initialize the payment system...</p>
                    <div className="flex justify-center mb-4">
                      <div className="w-6 h-6 border-2 border-t-0 border-l-0 border-[#37a39a] rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      If loading takes too long, you may want to try the direct purchase option instead.
                    </p>
                    <button 
                      className={`${styles.button} !w-[200px] mx-auto !h-[45px] !bg-[#37a39a] mt-4`}
                      onClick={() => {
                        setOpen(false);
                        handleDirectPurchase();
                      }}
                    >
                      Try Direct Purchase
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {confirmPurchase && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] bg-white rounded-xl shadow p-6">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setConfirmPurchase(false)}
                />
              </div>
              <div className="w-full text-center">
                <h2 className="text-[25px] font-[600] text-black mb-6">Confirm Purchase</h2>
                <p className="text-[18px] mb-2">You are about to purchase:</p>
                <p className="text-[22px] font-[600] text-[#37a39a] mb-6">{data.name}</p>
                <p className="text-[18px] mb-6">Price: <span className="font-[600] text-[#37a39a]">${data.price}</span></p>
                <div className="flex justify-center gap-4">
                  <button 
                    className={`${styles.button} !w-[150px] !h-[45px] !bg-[#f63b3b]`}
                    onClick={() => setConfirmPurchase(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={`${styles.button} !w-[150px] !h-[45px] !bg-[#37a39a]`}
                    onClick={confirmDirectPurchase}
                    disabled={purchaseLoading}
                  >
                    {purchaseLoading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;
