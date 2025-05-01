"use client"
import Link from 'next/link';
import React, { FC, useState } from 'react'
import NavItem from '../Utils/NavItem';
import ThemeSwitcher from "../Utils/ThemeSwitcher";


type Props = {
    open: boolean
    setOpen: (open: boolean) => void;
    activeItem: number;
}

const Header: FC<Props> = ({ activeItem }) => {
    const [active, setActive] = useState(false);


    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 0) {
                setActive(true);
            } else {
                setActive(false);
            }
        })
    }

    return (
        <div className='w-full relative'>
            <div
                className={`w-full h-[80px] z-[80] border-b  ${active
                    ? "fixed top-0 left-0 transition duration-500 dark:bg-gradient-to-b dark:bg-gray-900 dark:bg-opacity-50 dark:shadow-xl"
                    : "dark:bg-gradient-to-b dark:bg-gray-900  dark:shadow"
                    }`}
            >
                <div className='w-[95%] 800px:w-[90%] h-full m-auto py-2'>
                    <div className='w-full h-[80px] flex items-center justify-between p-3'>
                        <Link href={"/"} className={`text-2xl font-Poppins font-[500] text-black dark:text-white`}>
                            EduHub
                        </Link>
                        <div className="flex items-center">
                            <NavItem
                                activeItem={activeItem}
                                isMobile={false}
                            />
                            <ThemeSwitcher />
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}
export default Header