import Link from 'next/link';
import React from 'react'


export const navItemData = [
    {
        name: "Home",
        url: "/",
    },
    {
        name: "Courses",
        url: "/courses",
    },
    {
        name: "About",
        url: "/about",
    },

    {
        name: "Profile",
        url: "/profile",
    },
    {
        name: "FAQ",
        url: "/faq",
    }
]
type Props = {
    activeItem: number;
    isMobile: boolean;
}

const NavItem: React.FC<Props> = ({ activeItem, isMobile }) => {
    return (
        <div>
            <div className="hidden md:flex">
                {
                    navItemData && navItemData.map((item, index) => (
                        <Link href={`${item.url}`} key={index}>
                            <span className={`${activeItem === index ? "dark:text-[#37a39a] text-[cromson]" : "dark:text-white text-black"
                                } text-[18px] px-6 font-Poppins font-[400]`}>
                                {item.name}
                            </span>
                        </Link>
                    ))
                }

            </div>
            {
                isMobile && (
                    <div className='md:hidden mt-5'>
                        <div className='w-full text-center py-6'>
                            {
                                navItemData && navItemData.map((item, index) => (
                                    <Link href={`${item.url}`} key={index}>
                                        <span className={`${activeItem === index ? "dark:text-[#37a39a] text-[cromson]" : "dark:text-white text-black"
                                            } text-[18px] px-6 font-Poppins font-[400]`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                ))
                            }

                        </div>
                    </div>
                )
            }
        </div>
    )
}
export default NavItem