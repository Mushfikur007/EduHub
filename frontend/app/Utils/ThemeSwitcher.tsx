"use client"

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 
  return (
    <div className='flex items-center justify-center mx-4'>
      {theme === 'dark' ? (
        <BsFillSunFill
          onClick={() => setTheme('light')}
          className='text-2xl text-yellow-400 cursor-pointer'
        />
      ) : (
        <BsFillMoonFill
          onClick={() => setTheme('dark')}
          className='text-2xl text-black dark:text-white cursor-pointer'
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
