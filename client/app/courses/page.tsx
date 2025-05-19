"use client";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

type Props = {};

// Define a type for course items
interface CourseItem {
  _id: string;
  name: string;
  tags: string;
  price: number;
  level: string;
  thumbnail: {
    url: string;
  };
  ratings: number;
  purchased: number;
  [key: string]: any; // For any other properties
}

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (!data?.courses) return;
    
    let filteredCourses = [...data.courses] as CourseItem[];
    
    // Apply category filter
    if (category !== "All") {
      filteredCourses = filteredCourses.filter((item: CourseItem) => {
        // Check if the course has tags
        if (!item.tags) return false;
        
        // Split tags by comma and trim whitespace
        const courseTags = item.tags.split(',').map(tag => tag.trim().toLowerCase());
        
        // Check if any tag matches or contains the category
        return courseTags.some(tag => 
          tag === category.toLowerCase() || 
          tag.includes(category.toLowerCase()) ||
          category.toLowerCase().includes(tag)
        );
      });
    }
    
    // Apply search filter if present
    if (search) {
      filteredCourses = filteredCourses.filter((item: CourseItem) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setCourses(filteredCourses);
    
  }, [data, category, search]);

  const categories = categoriesData?.layout?.categories;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title={"All courses - EduHub"}
              description={"EduHub is a programming community."}
              keywords={
                "programming community, coding skills, expert insights, collaboration, growth"
              }
            />
            <br />
            <div className="w-full flex items-center flex-wrap">
              <div
                className={`h-[35px] ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                onClick={() => setCategory("All")}
              >
                All
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${
                        category === item.title
                          ? "bg-[crimson]"
                          : "bg-[#5050cb]"
                      } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer text-white`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
            {
                courses && courses.length === 0 && (
                    <p className={`${styles.label} justify-center min-h-[50vh] flex items-center`}>
                    {search ? "No courses found!" : "No courses found in this category. Please try another one!"}
                  </p>
                )
            }
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
              {courses &&
                courses.map((item: CourseItem, index: number) => (
                  <CourseCard item={item} key={index} />
                ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
