import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);
  const { data } = useGetHeroDataQuery("Categories", {});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout?.categories);
    }
  }, [data]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual file for later upload
      setCourseInfo({ ...courseInfo, thumbnailFile: file });
      
      // Also create a preview URL for display
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setCourseInfo({ 
            ...courseInfo, 
            thumbnailFile: file,
            thumbnail: reader.result 
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      // Store the actual file for later upload
      setCourseInfo({ ...courseInfo, thumbnailFile: file });
      
      // Also create a preview URL for display
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ 
          ...courseInfo, 
          thumbnailFile: file,
          thumbnail: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit} className={`${styles.label}`}>
        <div>
          <label htmlFor="">Course Name</label>
          <input
            type="name"
            name=""
            required
            value={courseInfo.name}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="MERN stack LMS platform with next 13"
            className={`
            ${styles.input}`}
          />
        </div>
        <br />
        <div className="mb-5">
          <label className={`${styles.label}`}>Course Description</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="Write something amazing..."
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Course Price</label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              id="price"
              placeholder="29"
              className={`
            ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>
              Estimated Price (optional)
            </label>
            <input
              type="number"
              name=""
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="price"
              placeholder="79"
              className={`
            ${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`} htmlFor="email">
              Course Tags
            </label>
            <input
              type="text"
              required
              name=""
              value={courseInfo.tags}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
              id="tags"
              placeholder="MERN,Next 13,Socket io,tailwind css,LMS"
              className={`
            ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>
              Course Categories
            </label>
            <select
              name=""
              id=""
              className={`${styles.input}`}
              value={courseInfo.category}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, categories: e.target.value })
              }
            >
              <option className="dark:bg-[#000] text-[#fff]" value="">
                Select Category
              </option>
              {categories &&
                categories.map((item: any) => (
                  <option
                    className="dark:bg-[#000] text-[#fff]"
                    value={item.title}
                    key={item._id}
                  >
                    {item.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Course Level</label>
            <input
              type="text"
              name=""
              value={courseInfo.level}
              required
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              id="level"
              placeholder="Beginner/Intermediate/Expert"
              className={`
            ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>Demo Url</label>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name=""
                required
                value={courseInfo.demoUrl}
                onChange={(e: any) =>
                  setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
                }
                id="demoUrl"
                placeholder="Enter Demo Url or upload video"
                className={`${styles.input}`}
              />
              
              <div 
                className={`w-full min-h-[150px] border-2 border-dashed ${dragging ? 'border-[#37a39a] bg-[#37a39a1a]' : 'border-gray-300 dark:border-gray-600'} rounded-md flex flex-col items-center justify-center cursor-pointer relative`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('video/')) {
                    // Create a FormData object
                    const formData = new FormData();
                    formData.append("video", file);
                    
                    toast.loading("Uploading demo video...");
                    
                    // Upload the video
                    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000/api/v1/';
                    console.log("Uploading to:", `${apiUrl}upload-video`);
                    fetch(`${apiUrl}upload-video`, {
                      method: "POST",
                      body: formData,
                      credentials: "include",
                      headers: {
                        // Don't set Content-Type header when using FormData
                        // Browser will automatically set it with correct boundary
                        "Accept": "application/json",
                      }
                    })
                    .then(response => {
                      if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                      }
                      return response.json();
                    })
                    .then(data => {
                      toast.dismiss();
                      if (data.success) {
                        toast.success("Demo video uploaded successfully");
                        setCourseInfo({ ...courseInfo, demoUrl: data.videoUrl });
                      } else {
                        toast.error("Failed to upload demo video");
                      }
                    })
                    .catch(error => {
                      toast.dismiss();
                      toast.error("Error uploading demo video");
                      console.error("Error uploading demo video:", error);
                    });
                  } else {
                    toast.error("Please upload a valid video file");
                  }
                }}
              >
                <input
                  type="file"
                  accept="video/*"
                  id="demoVideo"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Create a FormData object
                      const formData = new FormData();
                      formData.append("video", file);
                      
                      toast.loading("Uploading demo video...");
                      
                      // Upload the video
                      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000/api/v1/';
                      console.log("Uploading to:", `${apiUrl}upload-video`);
                      fetch(`${apiUrl}upload-video`, {
                        method: "POST",
                        body: formData,
                        credentials: "include",
                        headers: {
                          // Don't set Content-Type header when using FormData
                          // Browser will automatically set it with correct boundary
                          "Accept": "application/json",
                        }
                      })
                      .then(response => {
                        if (!response.ok) {
                          throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                      })
                      .then(data => {
                        toast.dismiss();
                        if (data.success) {
                          toast.success("Demo video uploaded successfully");
                          setCourseInfo({ ...courseInfo, demoUrl: data.videoUrl });
                        } else {
                          toast.error("Failed to upload demo video");
                        }
                      })
                      .catch(error => {
                        toast.dismiss();
                        toast.error("Error uploading demo video");
                        console.error("Error uploading demo video:", error);
                      });
                    }
                  }}
                />
                <label
                  htmlFor="demoVideo"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Drag and drop your demo video here or click to browse</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">MP4, WebM, AVI, MOV up to 500MB</p>
                </label>
              </div>
              
              {courseInfo.demoUrl && courseInfo.demoUrl.startsWith('http') && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Current demo video:</span> {courseInfo.demoUrl.split('/').pop()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt=""
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span className="text-black dark:text-white">
                Drag and drop your thumbnail here or click to browse
              </span>
            )}
          </label>
        </div>
        <br />
        <div className="w-full flex items-center justify-end">
          <input
            type="submit"
            value="Next"
            className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          />
        </div>
        <br />
        <br />
      </form>
    </div>
  );
};

export default CourseInformation;