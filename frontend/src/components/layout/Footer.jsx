import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <footer className="bg-[#212121] py-6  w-full">
        {/* <p className="text-white text-center ">
          ©2023 Vapers Sidewalk. All rights reserved.
        </p> */}

        <section id="contact">
          <div
            className="flex flex-col justify-center items-center h-screen space-y-12 text-white bg-no-repeat bg-center"
            // style={{ backgroundImage: `url(${image2})` }}
          >
            <h2 className="md:text-7xl max-w-7xl text-center container px-6 mx-auto underline-offset-2 text-3xl">
              Let's{" "}
              <span className="opacity-50">
                {" "}
                connect to discuss how we can{" "}
              </span>{" "}
              bring your vision to life ↣
            </h2>
            <div className="border-t border-gray-300 py-8 text-xs md:text-xl opacity-80">
              <a href="#href" className="mr-6">
                caburatanjayson@gmail.com
              </a>
              <a href="#href" className="mr-6">
                behance
              </a>
              <a href="#href" className="mr-6">
                linkedin
              </a>
              <a href="#href" className="mr-6">
                instagram
              </a>
            </div>
          </div>
        </section>
      </footer>
    </Fragment>
  );
};

export default Footer;
