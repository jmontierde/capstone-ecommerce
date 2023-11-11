import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const About = () => {
  const image1 = "./images/bg-about.png";
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  return (
    <div className="bg-[#1B201F]">
      <div className=" relative">
        <img src={image1} className="h-screen" alt="" />
        <div className="absolute w-5/6 top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="container px-12 text-3xl text-white md:text-7xl max-w-7xl font-satoshi">
            Discover a world of exceptional{" "}
            <span className="opacity-50">vaping experiences, </span> where
            quality and satisfaction
            <span className="opacity-50"> are our top priorities.</span>
          </h1>
        </div>
      </div>
      <div className="min-h-screen container mx-auto px-6 lg:w-1/2 flex justify-center text-white space-y-6  flex-col">
        <h4 className=" font-semibold text-2xl lg:text-4xl text-center">
          HISTORY
        </h4>
        <p className=" text-[#ababab] text-sm lg:text-lg leading-8">
          Vapers SideWalk was founded in 2015 by Jesse Paner. It all began with
          a passion for vaping and a desire to create a welcoming space for the
          vaping community. Since then, we've grown into a trusted source for
          all things vape-related in 6 L bustamante st. east gracepark caloocan
          city. <br /> <br />
          Vapers SideWalk provides a wide range of vape products and
          accessories, as well as premium vape juice, to meet your needs. We
          have an unwavering passion for the latest technology and products as
          the industry grows and becomes more innovative. We are able to receive
          the best pricing available due to our continued partnership with major
          manufacturers, creating an outlet of significant savings for our
          customers with unbeatable prices and thousands of selections. The
          Vapers SideWALK team strives to push the boundaries of service to
          provide customers with an entirely satisfying experience.
        </p>
      </div>

      <div className="min-h-screen  container mx-auto px-6 flex space-y-6 justify-center flex-col">
        <h4 className="text-left text-white font-semibold text-2xl lg:text-4xl">
          Mission
        </h4>
        <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(1)}
            className="text-white hover:text-[#ababab] text-base lg:text-2xl "
          >
            <div>
              <span className="text-[#ababab]">01.</span> Safety First
            </div>
          </AccordionHeader>
          <AccordionBody className="text-[#cecece] text-sm lg:text-lg">
            Our commitment to safety is paramount, and we ensure that our
            products adhere to the highest safety standards to protect our
            customers.
          </AccordionBody>
        </Accordion>
        <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(2)}
            className="text-white hover:text-[#ababab] text-base lg:text-2xl "
          >
            <div>
              <span className="text-[#ababab]">02.</span> Innovation and Quality
            </div>
          </AccordionHeader>
          <AccordionBody className="text-[#cecece] text-sm lg:text-lg">
            We strive to stay at the forefront of vaping technology and
            innovation while maintaining a focus on product quality and
            consistency.
          </AccordionBody>
        </Accordion>
        <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(3)}
            className="text-white hover:text-[#ababab] text-base lg:text-2xl "
          >
            <div>
              <span className="text-[#ababab]">03.</span> Environmental
              Responsibility
            </div>
          </AccordionHeader>
          <AccordionBody className="text-[#cecece] text-sm lg:text-lg">
            We are committed to reducing our environmental impact and encourage
            responsible disposal and recycling of vaping products.
          </AccordionBody>
        </Accordion>
      </div>
    </div>
  );
};

export default About;
