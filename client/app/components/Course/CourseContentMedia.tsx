import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import { format } from "timeago.js";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import Ratings from "@/app/utils/Ratings";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: Props) => {
  // Safety check for user
  if (!user) {
    return (
      <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
        <div className="w-full h-[400px] bg-slate-800 flex items-center justify-center rounded">
          <p className="text-white text-center">User information is missing. Please log in again.</p>
        </div>
      </div>
    );
  }

  const [activeBar, setactiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);

  // Check if data is valid
  const isValidData = Array.isArray(data) && data.length > 0 && activeVideo >= 0 && activeVideo < data.length;
  const currentVideo = isValidData ? data[activeVideo] : null;

  const [
    addNewQuestion,
    { isSuccess, error, isLoading: questionCreationLoading },
  ] = useAddNewQuestionMutation();
  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    { refetchOnMountOrArgChange: true }
  );
  const [
    addAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerInQuestionMutation();
  const course = courseData?.course;
  const [
    addReviewInCourse,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInCourseMutation();

  const [
    addReplyInReview,
    {
      isSuccess: replySuccess,
      error: replyError,
      isLoading: replyCreationLoading,
    },
  ] = useAddReplyInReviewMutation();

  const isReviewExists = course?.reviews?.find(
    (item: any) => item.user._id === user._id
  );

  const handleQuestion = () => {
    if (!currentVideo) {
      toast.error("No active video content available");
      return;
    }
    
    if (question.length === 0) {
      toast.error("Question can't be empty");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: currentVideo._id,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
      if (currentVideo) {
        socketId.emit("notification", {
          title: `New Question Received`,
          message: `You have a new question in ${currentVideo.title}`,
          userId: user._id,
        });
      }
    }
    if (answerSuccess) {
      setAnswer("");
      refetch();
      if (user.role !== "admin" && currentVideo) {
        socketId.emit("notification", {
          title: `New Reply Received`,
          message: `You have a new question in ${currentVideo.title}`,
          userId: user._id,
        });
      }
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        if (errorMessage.data?.message?.includes("token") || errorMessage.data?.message?.includes("login")) {
          toast.error("Session expired. Please wait while we refresh your session.");
        } else {
          toast.error(errorMessage.data?.message || "An error occurred");
        }
      }
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorMessage = answerError as any;
        if (errorMessage.data?.message?.includes("token") || errorMessage.data?.message?.includes("login")) {
          toast.error("Session expired. Please wait while we refresh your session.");
        } else {
          toast.error(errorMessage.data?.message || "An error occurred");
        }
      }
    }
    if (reviewSuccess) {
      setReview("");
      setRating(1);
      courseRefetch();
      if (currentVideo) {
        socketId.emit("notification", {
          title: `New Question Received`,
          message: `You have a new question in ${currentVideo.title}`,
          userId: user._id,
        });
      }
    }
    if (reviewError) {
      if ("data" in reviewError) {
        const errorMessage = reviewError as any;
        if (errorMessage.data?.message?.includes("token") || errorMessage.data?.message?.includes("login")) {
          toast.error("Session expired. Please wait while we refresh your session.");
        } else {
          toast.error(errorMessage.data?.message || "An error occurred");
        }
      }
    }
    if (replySuccess) {
      setReply("");
      courseRefetch();
    }
    if (replyError) {
      if ("data" in replyError) {
        const errorMessage = replyError as any;
        if (errorMessage.data?.message?.includes("token") || errorMessage.data?.message?.includes("login")) {
          toast.error("Session expired. Please wait while we refresh your session.");
        } else {
          toast.error(errorMessage.data?.message || "An error occurred");
        }
      }
    }
  }, [
    isSuccess,
    error,
    answerSuccess,
    answerError,
    reviewSuccess,
    reviewError,
    replySuccess,
    replyError,
    currentVideo,
  ]);

  const handleAnswerSubmit = () => {
    if (!currentVideo) {
      toast.error("No active video content available");
      return;
    }
    
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: currentVideo._id,
      questionId: questionId,
    });
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review can't be empty");
    } else {
      addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleReviewReplySubmit = () => {
    if (!replyCreationLoading) {
      if (reply === "") {
        toast.error("Reply can't be empty");
      } else {
        addReplyInReview({ comment: reply, courseId: id, reviewId });
      }
    }
  };

  // If no valid data is available, show a placeholder
  if (!isValidData || !currentVideo) {
    return (
      <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
        <div className="w-full h-[400px] bg-slate-800 flex items-center justify-center rounded">
          <p className="text-white text-center">No course content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={currentVideo.title}
        videoUrl={currentVideo.videoUrl}
      />
      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${
            styles.button
          } text-white  !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" />
          Prev Lesson
        </div>
        <div
          className={`${
            styles.button
          } !w-[unset] text-white  !min-h-[40px] !py-[unset] ${
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          Next Lesson
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600] dark:text-white text-black ">
        {currentVideo.title}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <div 
            key={index}
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              activeBar === index
                ? "bg-red-500 text-white"
                : "hover:bg-slate-600 hover:bg-opacity-20"
            }`}
            onClick={() => setactiveBar(index)}
          >
            <h5 className={`800px:text-[20px] cursor-pointer text-center ${
              activeBar === index
                ? "text-white"
                : "text-black dark:text-white"
            }`}>
              {text}
            </h5>
          </div>
        ))}
      </div>
      <br />
      <div className="mt-5 transition-all duration-300">
        {activeBar === 0 && (
          <div className="text-black dark:text-white mb-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3">Course Description</h3>
            <p className="whitespace-pre-line">
              {currentVideo?.description || "No description available for this lesson."}
            </p>
          </div>
        )}

        {activeBar === 1 && (
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Resources & Links</h3>
            {currentVideo?.links && currentVideo?.links.length > 0 ? (
              <div className="space-y-3">
                {currentVideo?.links.map((item: any, index: number) => (
                  <div className="mb-5 bg-white dark:bg-slate-700 p-3 rounded-md" key={index}>
                    <h2 className="800px:text-[18px] font-medium 800px:inline-block text-black dark:text-white">
                      {item.title && item.title}:
                    </h2>
                    <a
                      className="inline-block text-[#4395c4] 800px:text-[18px] 800px:pl-2 hover:underline"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.url}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black dark:text-white bg-white dark:bg-slate-700 p-4 rounded-md">
                No resources available for this lesson.
              </p>
            )}
          </div>
        )}

        {activeBar === 2 && (
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Questions & Answers</h3>
            <div className="flex w-full bg-white dark:bg-slate-700 p-4 rounded-md mb-4">
              <Image
                src={
                  user.avatar
                    ? user.avatar.url
                    : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                }
                width={50}
                height={50}
                alt=""
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <textarea
                name=""
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                id=""
                cols={40}
                rows={5}
                placeholder="Write your question..."
                className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins dark:text-white text-black"
              ></textarea>
            </div>
            <div className="w-full flex justify-end">
              <div
                className={`${
                  styles.button
                } !w-[120px] !h-[40px] text-[18px] mt-2 ${
                  questionCreationLoading ? "cursor-not-allowed opacity-70" : ""
                }`}
                onClick={questionCreationLoading ? () => {} : handleQuestion}
              >
                {questionCreationLoading ? "Submitting..." : "Submit"}
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#ffffff3b] my-4"></div>
            <div>
              <CommentReply
                data={currentVideo?.questions}
                activeVideo={activeVideo}
                answer={answer}
                setAnswer={setAnswer}
                handleAnswerSubmit={handleAnswerSubmit}
                questionId={questionId}
                setQuestionId={setQuestionId}
                answerCreationLoading={answerCreationLoading}
              />
            </div>
          </div>
        )}

        {activeBar === 3 && (
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Course Reviews</h3>
            <>
              {!isReviewExists && (
                <div className="bg-white dark:bg-slate-700 p-4 rounded-md mb-4">
                  <div className="flex w-full">
                    <Image
                      src={
                        user.avatar
                          ? user.avatar.url
                          : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                      }
                      width={50}
                      height={50}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                    <div className="w-full">
                      <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black ">
                        Give a Rating <span className="text-red-500">*</span>
                      </h5>
                      <div className="flex w-full ml-2 pb-3">
                        {[1, 2, 3, 4, 5].map((i) =>
                          rating >= i ? (
                            <AiFillStar
                              key={i}
                              className="mr-1 cursor-pointer"
                              color="rgb(246,186,0)"
                              size={25}
                              onClick={() => setRating(i)}
                            />
                          ) : (
                            <AiOutlineStar
                              key={i}
                              className="mr-1 cursor-pointer"
                              color="rgb(246,186,0)"
                              size={25}
                              onClick={() => setRating(i)}
                            />
                          )
                        )}
                      </div>
                      <textarea
                        name=""
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        id=""
                        cols={40}
                        rows={5}
                        placeholder="Write your review..."
                        className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins dark:text-white text-black"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full flex justify-end">
                    <div
                      className={`${
                        styles.button
                      } !w-[120px] !h-[40px] text-[18px] mt-5 ${
                        reviewCreationLoading ? "cursor-not-allowed opacity-70" : ""
                      }`}
                      onClick={
                        reviewCreationLoading ? () => {} : handleReviewSubmit
                      }
                    >
                      {reviewCreationLoading ? "Submitting..." : "Submit"}
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full h-[1px] bg-[#ffffff3b] my-4"></div>
              <div className="w-full space-y-4">
                {(course?.reviews && [...course.reviews].reverse()).map(
                  (item: any, index: number) => (
                    <div className="bg-white dark:bg-slate-700 p-4 rounded-md" key={index}>
                      <div className="w-full flex">
                        <Image
                          src={
                            item.user.avatar
                              ? item.user.avatar.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                        <div className="ml-2">
                          <h1 className="text-[18px] font-medium dark:text-white text-black">
                            {item?.user.name}
                          </h1>
                          <Ratings rating={item.rating} />
                          <p className="dark:text-white text-black">
                            {item.comment}
                          </p>
                          <small className="dark:text-[#ffffff83] text-[#000000b8]">
                            {format(item.createdAt)} •
                          </small>
                        </div>
                      </div>
                      {user.role === "admin" && (
                        <span
                          className={`${
                            styles.label
                          } !ml-10 cursor-pointer ${
                            isReviewReply && "cursor-not-allowed"
                          }`}
                          onClick={() => {
                            if (!isReviewReply) {
                              setIsReviewReply(true);
                              setReviewId(item._id);
                            }
                          }}
                        >
                          Add Reply
                        </span>
                      )}
                      {isReviewReply && reviewId === item._id && (
                        <div className="w-full flex relative mt-2">
                          <input
                            type="text"
                            placeholder="Enter your reply..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-[#fff] p-[5px] w-[95%]"
                          />
                          <button
                            type="submit"
                            className="absolute right-0 bottom-1 bg-blue-500 text-white px-3 py-1 rounded"
                            onClick={handleReviewReplySubmit}
                            disabled={replyCreationLoading}
                          >
                            {replyCreationLoading ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                      )}
                      {item.commentReplies.map((i: any, index: number) => (
                        <div className="w-full flex 800px:ml-16 my-5" key={index}>
                          <Image
                            src={
                              i.user.avatar
                                ? i.user.avatar.url
                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                          <div className="pl-2">
                            <div className="flex items-center">
                              <h5 className="text-[18px] dark:text-white text-black">
                                {i.user.name}
                              </h5>{" "}
                              <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                            </div>
                            <p className="dark:text-white text-black">{i.comment}</p>
                            <small className="dark:text-[#ffffff83] text-[#000000b8]">
                              {format(i.createdAt)} •
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </>
          </div>
        )}
      </div>
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  return (
    <div className="w-full my-3">
      {data && data.length === 0 && (
        <div className="bg-white dark:bg-slate-700 p-4 rounded-md text-center">
          <h5 className="text-center dark:text-white text-black text-[18px]">
            No questions yet. Be the first to ask!
          </h5>
        </div>
      )}

      {data &&
        [...data].reverse().map((item: any, index: number) => (
          <CommentItem
            key={index}
            data={data}
            activeVideo={activeVideo}
            item={item}
            answer={answer}
            setAnswer={setAnswer}
            questionId={questionId}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
    </div>
  );
};

const CommentItem = ({
  questionId,
  setQuestionId,
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  answerCreationLoading,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);
  return (
    <div className="my-4 bg-white dark:bg-slate-700 p-4 rounded-md">
      <div className="flex mb-2">
        <Image
          src={
            item.user.avatar
              ? item.user.avatar.url
              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
          }
          width={50}
          height={50}
          alt=""
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <div className="pl-3 dark:text-white text-black">
          <h5 className="text-[20px] font-medium">{item?.user.name}</h5>
          <p className="text-[16px]">{item?.question}</p>
          <small className="dark:text-[#ffffff83] text-[#000000b8]">
            {!item.createdAt ? "" : format(item?.createdAt)} •
          </small>
        </div>
      </div>
      <div className="w-full flex mt-2">
        <button
          className="flex items-center px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-all"
          onClick={() => {
            setReplyActive(!replyActive);
            setQuestionId(item._id);
          }}
        >
          <BiMessage size={18} className="mr-1 dark:text-[#ffffff83] text-[#000000b8]" />
          <span className="dark:text-[#ffffff83] text-[#000000b8]">
            {!replyActive
              ? item.questionReplies.length !== 0
                ? `View ${item.questionReplies.length} Replies`
                : "Add Reply"
              : "Hide Replies"}
          </span>
        </button>
      </div>

      {replyActive && (
        <div className="mt-4 pl-4 border-l-2 border-slate-300 dark:border-slate-600">
          {item.questionReplies.length > 0 ? (
            item.questionReplies.map((item: any, index: number) => (
              <div className="w-full flex mb-4" key={index}>
                <Image
                  src={
                    item.user.avatar
                      ? item.user.avatar.url
                      : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                  }
                  width={40}
                  height={40}
                  alt=""
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[18px] font-medium dark:text-white text-black">
                      {item.user.name}
                    </h5>{" "}
                    <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[18px]" />
                  </div>
                  <p className="dark:text-white text-black">{item.answer}</p>
                  <small className="dark:text-[#ffffff83] text-[#000000b8]">
                    {format(item.createdAt)} •
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 mb-4">No replies yet</p>
          )}
          <div className="w-full flex relative">
            <input
              type="text"
              placeholder="Enter your answer..."
              value={answer}
              onChange={(e: any) => setAnswer(e.target.value)}
              className={`block w-full p-3 rounded-md outline-none border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white text-black ${
                answer === "" || answerCreationLoading
                  ? "cursor-not-allowed"
                  : "cursor-text"
              }`}
            />
            <button
              type="submit"
              className={`absolute right-2 bottom-2 px-4 py-1 rounded-md ${
                answer === "" || answerCreationLoading
                  ? "bg-slate-400 text-slate-200 cursor-not-allowed"
                  : "bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
              }`}
              onClick={handleAnswerSubmit}
              disabled={answer === "" || answerCreationLoading}
            >
              {answerCreationLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseContentMedia;
