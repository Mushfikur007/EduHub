'use client'
import CourseContent from "@/app/components/Course/CourseContent";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
    params:any;
}

const Page = ({params}: Props) => {
    const id = params.id;
  const { isLoading, error, data, refetch } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (data && data.user) {
      // Check if the course exists in the user's courses array
      const isPurchased = data.user.courses.some(
        (item: any) => item.courseId === id
      );
      
      if (!isPurchased) {
        redirect("/");
      }
    }
    if (error) {
      redirect("/");
    }
  }, [data, error, id]);

  // If still loading or no data yet, show loader
  if (isLoading || !data || !data.user) {
    return <Loader />;
  }

  return (
    <CourseContent id={id} user={data.user} />
  );
}

export default Page