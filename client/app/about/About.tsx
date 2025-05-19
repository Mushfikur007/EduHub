import React from "react";
import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">E-Learning?</span>
      </h1>

      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins">
          Welcome to EduHub, a cutting-edge E-learning platform designed to transform online education. EduHub is a full-featured Learning Management System (LMS) built with the latest technologies to provide a seamless, interactive, and engaging learning experience for students, instructors, and administrators alike.

In a world where access to quality education is paramount, EduHub aims to bridge the gap by offering a comprehensive solution that enables students to learn, instructors to teach, and administrators to manage courses efficiently. Whether you are a student looking to enhance your skills, an instructor wanting to create and manage courses, or an administrator overseeing operations, EduHub provides all the tools you need.
          <br />
          <br />
          <h2><b>Key Features:</b></h2>
          <b>For Students</b>
          <br />
Secure Access: With secure login and social login options (OAuth), students can quickly and safely access their learning materials.

Interactive Learning: Engage with interactive content, progress tracking, course discussions, and reviews that ensure a rich learning experience.

Personalized Dashboards: A customized dashboard that tracks learning progress, course completion, and upcoming events.
          <br />
          <br />
          <h2><b>Our Vision:</b></h2>
          At <b>EduHub</b>, we believe in democratizing education. We aim to provide a platform that not only allows students to access high-quality learning materials but also empowers instructors to create, share, and manage content efficiently. Our goal is to create an environment where learners and educators alike can thrive—no matter where they are in the world.
          <br />
          <br />
          <b>Why Choose EduHub?</b>
          <br />
          <b>EduHub</b> is more than just a learning management system. It's an all-in-one platform that provides a smooth, responsive, and intuitive interface for students, instructors, and administrators. Our mission is to provide users with the best possible online learning experience, and we're constantly innovating to make that happen.
          <br />
          <br />
          <b>Start your learning journey with EduHub today—where quality education meets cutting-edge technology.</b>
        </p>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
