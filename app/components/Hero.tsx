import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className='relative h-screen lg:w-full w-screen bg-cover bg-no-repeat bg-fixed bg-center bg-[url("/im7.png")]'>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-white flex items-start lg:mx-52 md:mx-28 md:ml-60 m-5 justify-center flex-col h-full">
        <div className='md:flex md:justify-between w-full '>
          <div>
            <h1 className="uppercase font-['Poppins'] text-[100px] font-bold text-wrap">
              PLANIO
            </h1>
            <p className="font-['Playfair_Display'] text-[30px] w-fit text-wrap">
              Plan, track, and achieve your goals!
            </p>
            <button className='bg-[#32aa27] py-3 px-8 my-5 uppercase'>
              View services
            </button>
          </div>
          <div className='hidden md:block'>
            {/* <Login /> */}
          </div>
        </div>
      </div>

      <div className=" h-screen flex items-center justify-center md:my-0 my-10 px-10 md:p-0">
        <div className='lg:flex md:flex-row lg:justify-between md:items-center w-full lg:mx-52 flex-col'>
          <div className='lg:w-[40%] w-full text-wrap'>
            <h3 className='text-[#32aa27]'>Empower your habits</h3>
            <h1 className='font-bold text-3xl py-5'>Transform your daily routine</h1>
            <p className='mb-5'>
              Habit Maker is a vibrant and engaging app designed to help you build and track habits effectively. Create personalized tasks by choosing a name, setting a duration, and scheduling reminders. Visualize your progress with our interactive graph, and stay motivated with daily phrases. Based in Monastir, TN, we are dedicated to helping you achieve your goals with ease and enjoyment.
            </p>
            <Link href="#" className='underline text-gray-500 my-10'>Get in touch</Link>
          </div>
          <div>
            <div className='relative md:w-96 md:h-[500px] h-[300px] mt-10 bg-black'>
              <Image
                src="/im4.jpg"
                layout='fill'
                alt="A visual representation of Habit Maker"
                objectFit='cover'
              />
            </div>
          </div>
        </div>
      </div>

      <div className=" w-screen md:h-screen flex flex-wrap justify-center bg-[#EEF1EF]">
        <div className='w-full mx-52 my-28'>
          <h4 className='text-[#32aa27] font-bold'>Build better habits</h4>
          <h1 className='font-bold text-2xl pb-5 font-["Playfair_Display"]'>
            Track your progress effortlessly
          </h1>
          <div className='w-full flex-col flex md:flex-row gap-10 my-10'>
            <div className="relative w-[340px] h-[300px]">
              <Image
                src="/im3.jpg"
                layout="fill"
                alt="A visual of habit tracking"
                objectFit="cover"
              />
            </div>
            <div className="relative w-[340px] h-[300px]">
              <Image
                src="/im2.jpg"
                layout="fill"
                alt="An example of habit tracking feature"
                objectFit="cover"
              />
            </div>
            <div className="relative w-[340px] h-[300px]">
              <Image
                src="/im1.jpg"
                layout="fill"
                alt="A user interface example"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
    
      </div>

      
    </div>
  );
};

export default Hero;
