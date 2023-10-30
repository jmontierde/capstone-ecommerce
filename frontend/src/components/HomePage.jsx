import React from "react";
import { Carousel } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-[#000] text-white">
      <video autoPlay loop muted playsInline>
        <source src="./product-image/main-video-armour.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Carousel
        className="rounded-xl"
        autoPlay
        style={{ height: "lg:calc(100vh - 46.448px)" }}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        <img
          src="/product-image/carousel-3.jpg"
          alt="image 1"
          className="h-full lg:w-full lg:object-cover"
        />
        <img
          src="/product-image/carousel-6.jpg"
          alt="image 2"
          className="h-full lg:w-full lg:object-cover"
        />
        <img
          src="/product-image/carousel-4.jpg"
          alt="image 3"
          className="h-full lg:w-full lg:object-cover"
        />
        <img
          src="/product-image/carousel-5.jpg"
          alt="image 3"
          className="h-full lg:w-full lg:object-cover"
        />
      </Carousel>
      <div
        className="flex flex-col justify-center items-center space-y-6  py-6 lg:gap-24 lg:h-screen "
        // style={{ height: "calc(100vh - 60.448px)" }}
      >
        <div className="bg-[#000] px-6 lg:w-1/2 mx-auto text-center space-y-6">
          <h4 className="font-bold text-xl lg:text-2xl">
            Elevate Your Vaping Experience with VapingSidewalk
          </h4>
          <p className="text-sm lg:text-base text-[#d5d5d5]">
            We're your one-stop destination for the latest and greatest in
            vaping products. Explore our extensive collection of premium
            e-liquids, cutting-edge vape devices, and accessories to elevate
            your vaping experience. We're here to help you find your perfect
            flavor, style, and satisfaction, making your vaping journey
            enjoyable and hassle-free.
          </p>
        </div>
        <div className="bg-[#000] px-6 lg:w-1/2 mx-auto text-center space-y-6">
          <h4 className="font-bold text-xl  lg:text-2xl">
            The VapingSidewalk Adventure
          </h4>
          <p className="text-sm lg:text-base text-[#d5d5d5]">
            The VapingSidewalk Adventure is more than just a shopping
            experience; it's a journey tailored to you. We're dedicated to
            providing a voyage that's seamless and satisfying for our customers.
            At VapingSidewalk, we understand that it's not just about the
            destination but the entire expedition. Our wide selection of
            top-notch products, combined with expert guidance, ensures that
            every twist and turn of your vaping journey is met with satisfaction
            and excitement. Let us be your trusted companion as you navigate the
            fascinating landscape of vaping, discovering that the best is yet to
            come.
          </p>
        </div>
      </div>
      <div className="lg:mx-12 mx-6 py-6">
        <img
          src="/product-image/main-kv.jpg"
          alt=""
          className="h-3/4  opacity-50"
        />
        <div className=" grid grid-cols-4 place-items-center h-2/6 bg-[#1A1A1A] text-[#6A6D6F] font-bold text-center">
          <Link to="/pod">
            <div className="py-6 hover:text-[#e6e355] cursor-pointer">
              <img
                src="/product-image/pod.webp"
                alt="pod"
                className="h-32 w-full lg:h-52"
              />
              <h4>Pod</h4>
            </div>
          </Link>

          <Link to="/pod-mod">
            <div className="py-6 hover:text-[#e6e355] cursor-pointer">
              <img
                src="/product-image/podMod.png"
                alt="pod-mod"
                className="h-32 w-full lg:h-52"
              />
              <h4>Pod Mod</h4>
            </div>
          </Link>
          <Link to="/tank-mod">
            <div className="py-6 hover:text-[#e6e355] cursor-pointer">
              <img
                src="/product-image/armour.png"
                alt="tank-mod"
                className="h-32 w-full lg:h-52"
              />
              <h4>Tank Mod</h4>
            </div>
          </Link>
          <Link to="/pen-style">
            <div className="py-6 hover:text-[#e6e355] cursor-pointer">
              <img
                src="/product-image/pen style.webp"
                alt="pen style"
                className="h-32 w-full lg:h-52"
              />
              <h4>Pen Style</h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
