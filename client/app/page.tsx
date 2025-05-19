"use client";
import React, { FC, useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer";
import Head from "next/head";

interface Props { }

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <>
      <Head>
        <title>EduHub</title>
        <meta name="description" content="EduHub is a platform for students to learn and get help from teachers" />
        <meta name="keywords" content="Programming,MERN,Redux,Machine Learning" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Hero />
        <Courses />
        <Reviews />
        <FAQ />
        <Footer />
      </div>
    </>
  );
};

export default Page;
