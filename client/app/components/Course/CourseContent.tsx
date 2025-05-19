import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {
  id: string;
  user: any;
};

const CourseContent = ({ id, user }: Props) => {
  // Redirect if no user data is provided
  if (!user) {
    toast.error("User information is missing");
    redirect("/login");
    return null;
  }

  const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState('Login');
  const data = contentData?.content || [];
  
  const [activeVideo, setActiveVideo] = useState(0);

  // Reset activeVideo if data changes or is empty
  useEffect(() => {
    if (data && data.length > 0) {
      setActiveVideo(0); // Reset to first video when data loads
    }
  }, [data]);

  // Check if we have valid data to display
  const hasValidData = data && data.length > 0;
  const currentVideo = hasValidData ? data[activeVideo] : null;

  if (isLoading) return <Loader />;

  if (!hasValidData) {
    return (
      <>
        <Header activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute} />
        <div className="w-full flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-black dark:text-white">No course content available</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">The content for this course could not be loaded.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute} />
      <div className="w-full grid 800px:grid-cols-10">
        <Heading
          title={currentVideo?.title || "Course Content"}
          description="Course learning material"
          keywords={currentVideo?.tags || "education, course, learning"}
        />
        <div className="col-span-7">
          <CourseContentMedia
            data={data}
            id={id}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
            user={user}
            refetch={refetch}
          />
        </div>
        <div className="hidden 800px:block 800px:col-span-3">
          <CourseContentList
            setActiveVideo={setActiveVideo}
            data={data}
            activeVideo={activeVideo}
          />
        </div>
      </div>
    </>
  );
};

export default CourseContent;
