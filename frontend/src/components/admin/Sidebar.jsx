import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = React.useState(0);

  const [openSidebarAdmin, setOpenSidebarAdmin] = useState(false);

  useEffect(() => {
    if (openSidebarAdmin) {
      document.body.style.overflow = "auto"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  }, [openSidebarAdmin]);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const checkScreenSize = () => {
    if (window.innerWidth >= 1024) {
      // You can adjust this breakpoint for lg screens
      setOpenSidebarAdmin(true);
    } else {
      setOpenSidebarAdmin(false);
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="flex flex-col mt-20">
      {/* <img
        src="./images/hamburger.png"
        alt=""
        className="w-6 h-6 mx-3 block lg:hidden cursor-pointer sm:relative"
        onClick={() => setOpenSidebarAdmin(!openSidebarAdmin)}
      /> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6  mx-3 block lg:hidden cursor-pointer "
        onClick={() => setOpenSidebarAdmin(!openSidebarAdmin)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>

      {openSidebarAdmin ? (
        <Card className="min-h-screen h-full  w-full max-w-[20rem] lg:p-6 shadow-xl shadow-blue-gray-900/5 lg:block absolute  lg:relative mt-6 lg:mt-0 z-50">
          <List>
            <Link to="/dashboard">
              <ListItem>
                <ListItemPrefix>
                  <img
                    src="/images/business.png"
                    alt="Business"
                    className="h-5 w-5"
                  />
                </ListItemPrefix>
                Dashboard
              </ListItem>
            </Link>

            <Accordion
              open={open === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 1}>
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    {/* <PresentationChartBarIcon className="h-5 w-5" /> */}
                    <img
                      src="/images/product-icon.png"
                      className="h-5 w-5"
                      alt=""
                    />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className="mr-auto font-normal text-base"
                  >
                    Products
                  </Typography>
                </AccordionHeader>
              </ListItem>
              {open === 1 ? (
                <AccordionBody className="py-1">
                  <List className="p-0">
                    <Link to="/admin/products">
                      <ListItem>
                        <ListItemPrefix>
                          <ChevronRightIcon
                            strokeWidth={3}
                            className="h-3 w-5"
                          />
                        </ListItemPrefix>
                        All Product
                      </ListItem>
                    </Link>

                    <Link to="/admin/product">
                      <ListItem>
                        <ListItemPrefix>
                          <ChevronRightIcon
                            strokeWidth={3}
                            className="h-3 w-5"
                          />
                        </ListItemPrefix>
                        Create Product
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              ) : null}
            </Accordion>
            <Accordion
              open={open === 2}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 2 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 2}>
                <AccordionHeader
                  onClick={() => handleOpen(2)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    </svg>
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className="mr-auto font-normal text-base"
                  >
                    Users
                  </Typography>
                </AccordionHeader>
              </ListItem>
              {open === 2 ? (
                <AccordionBody className="py-1">
                  <List className="p-0">
                    <Link to="/admin/users">
                      <ListItem>
                        <ListItemPrefix>
                          <ChevronRightIcon
                            strokeWidth={3}
                            className="h-3 w-5"
                          />
                        </ListItemPrefix>
                        All Users
                      </ListItem>
                    </Link>
                    <Link to="/admin/verify/:userId">
                      <ListItem>
                        <ListItemPrefix>
                          <ChevronRightIcon
                            strokeWidth={3}
                            className="h-3 w-5"
                          />
                        </ListItemPrefix>
                        Verify Users
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              ) : null}
            </Accordion>
            <Link to="/admin/orders">
              <ListItem>
                <ListItemPrefix>
                  <img
                    src="/images/order.png"
                    alt="Order"
                    className="h-5 w-5"
                  />
                </ListItemPrefix>
                Orders
                <ListItemSuffix></ListItemSuffix>
              </ListItem>
            </Link>

            <Link to="/admin/reviews">
              <ListItem>
                <ListItemPrefix>
                  {/* <InboxIcon className="h-5 w-5" /> */}
                  <img
                    src="/images/review.png"
                    className="h-5 w-5"
                    alt="review"
                  />
                </ListItemPrefix>
                Reviews
                <ListItemSuffix></ListItemSuffix>
              </ListItem>
            </Link>

            <Link to="/admin/refunds">
              <ListItem>
                <ListItemPrefix>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M8.25 9.75L10.5 7.5M8.25 9.75L10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"
                    />
                  </svg>
                </ListItemPrefix>
                Refunds
                <ListItemSuffix></ListItemSuffix>
              </ListItem>
            </Link>

            <Link to="/admin/report">
              <ListItem>
                <ListItemPrefix>
                  <img
                    src="/images/report.png"
                    alt="Report"
                    className="h-5 w-5"
                  />
                </ListItemPrefix>
                Report
                <ListItemSuffix></ListItemSuffix>
              </ListItem>
            </Link>

            <Accordion
              open={open === 3}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 2 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 3}>
                <AccordionHeader
                  onClick={() => handleOpen(3)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    {/* <ShoppingBagIcon className="h-5 w-5" /> */}
                    <img
                      src="/images/maintenance.png"
                      alt="Maintenance"
                      className="h-5 w-5"
                    />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className="mr-auto font-normal text-base"
                  >
                    Maintenance
                  </Typography>
                </AccordionHeader>
              </ListItem>
              {open === 3 ? (
                <AccordionBody className="py-1">
                  <List className="p-0">
                    <Link to="/admin/maintenance/category">
                      <ListItem>
                        <ListItemPrefix>
                          <ChevronRightIcon
                            strokeWidth={3}
                            className="h-3 w-5"
                          />
                        </ListItemPrefix>
                        Category
                      </ListItem>
                    </Link>

                    <Link to="/admin/maintenance/update/term">
                      <ListItem>
                        <ListItemPrefix>
                          <ChevronRightIcon
                            strokeWidth={3}
                            className="h-3 w-5"
                          />
                        </ListItemPrefix>
                        Terms and Conditions
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              ) : null}
            </Accordion>
          </List>
        </Card>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default Sidebar;
