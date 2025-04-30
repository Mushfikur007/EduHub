"use client";

import React, { FC } from "react";
import Heading from "./Utils/Heading";

interface Props {}

const Page: FC<Props> = () => {
  return (
    <div>
      <Heading 
        title="E-Learning"
        description="E-Learning is a platform for students to learn and get help from teachers."
        keywords="Programming, MERN, Education, Online Learning"
      />
      hello
      {/* Add page content here */}
    </div>
  );
};

export default Page;
