import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import html2canvas from "html2canvas";
import { Card, Typography } from "@material-tailwind/react";
const ReportCard = () => {
  const { loading, error, orders } = useSelector((state) => state.allOrders);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const TABLE_HEAD = [
    "No",
    "ORDER ID",
    "Item Name",
    "Num of Items",
    "Quantity",
    "Amount",
    "Total",
  ];

  const filterOrdersByMonth = () => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === selectedDate.getMonth() &&
        orderDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  console.log("orders", orders);

  const filterOrdersByDay = () => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const selectedDayDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      return (
        orderDate.getFullYear() === selectedDayDate.getFullYear() &&
        orderDate.getMonth() === selectedDayDate.getMonth() &&
        orderDate.getDate() === selectedDayDate.getDate()
      );
    });
  };

  const filterOrdersByWeek = () => {
    const weekStart = new Date(selectedWeek);
    const weekEnd = new Date(selectedWeek);

    weekStart.setDate(selectedWeek.getDate() - selectedWeek.getDay());
    weekEnd.setDate(selectedWeek.getDate() - selectedWeek.getDay() + 6);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= weekStart && orderDate <= weekEnd;
    });
  };

  let filteredOrders = [];
  if (showDayPicker) {
    filteredOrders = filterOrdersByDay();
  } else if (selectedWeek) {
    filteredOrders = filterOrdersByWeek();
  } else {
    filteredOrders = filterOrdersByMonth();
  }

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "day") {
      setShowDayPicker(true);
      setSelectedWeek(null);
    } else if (selectedValue === "month") {
      setShowDayPicker(false);
      setSelectedWeek(null);
    } else if (selectedValue === "week") {
      setShowDayPicker(false);
      setSelectedDate(new Date());
      setSelectedWeek(new Date());
    }
  };

  const [totalTotalPrice, setTotalTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate the total of totalPrice column whenever filteredOrders changes
    const newTotalTotalPrice = filteredOrders
      .filter((filtOrder) => filtOrder.paymentMethod === "CARD")
      .reduce((total, order) => total + order.totalPrice, 0);
    setTotalTotalPrice(newTotalTotalPrice);
  }, [filteredOrders]);

  const pdfTableRef = useRef();
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    const title = "Vaping Sidewalk";
    doc.setFontSize(18);
    doc.text(title, 105, 10, { align: "center" });

    // Add date
    const dateString = selectedDate.toDateString(); // Format the selected date as a string
    doc.setFontSize(12);
    doc.text(dateString, 105, 20, { align: "center" });

    const tableRef = pdfTableRef.current; // Get the DOM element of the table
    const imagePromise = html2canvas(tableRef); // Convert the table to an image

    imagePromise.then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      doc.addImage(imageData, "PNG", 15, 30, 180, 0);
      doc.save("report.pdf");
    });
  };

  return (
    <div className="flex font-helvetica  flex-col lg:flex-row  ">
      <Sidebar />
      <div className="w-full mt-20">
        <h1 className="mt-6 px-6 text-2xl uppercase">Online Payment</h1>

        <div className="flex justify-between px-6 items-center my-6 ">
          <div className="lg:space-x-3 sm:w-1/2">
            <select
              value={showDayPicker ? "day" : selectedWeek ? "week" : "month"}
              onChange={handleSelectChange}
              className="border rounded px-4 py-2 w-full lg:w-auto"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            {showDayPicker ? (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="border rounded px-4 py-2 w-full lg:w-auto"
              />
            ) : selectedWeek ? (
              <DatePicker
                selected={selectedWeek}
                onChange={(date) => setSelectedWeek(date)}
                showWeekNumbers
                className="border rounded px-4 py-2 w-full lg:w-auto"
              />
            ) : (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showMonthYearPicker
                dateFormat="MMMM yyyy"
                className="border rounded px-4 py-2 mr-4 w-full lg:w-auto"
              />
            )}
          </div>

          <button
            className="px-4 py-2 ml-4 rounded bg-blue-500 text-white "
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex container mx-auto ">
            <div className="flex flex-col w-full justify-center ">
              <Card className="h-full w-full overflow-scroll">
                <table
                  className="w-full min-w-max table-auto text-left"
                  ref={pdfTableRef}
                >
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th
                          key={head}
                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders
                      .filter((filtOrder) => filtOrder.paymentMethod === "CARD")
                      .map((order, index) => {
                        const isLast = index === filteredOrders.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";

                        return (
                          <tr key={order._id}>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {index + 1}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {order._id}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {order.orderItems.map((item) => (
                                  <div key={item._id}>{item.name}</div>
                                ))}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {order.orderItems.length}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                as="a"
                                href="#"
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                              >
                                {order.orderItems && order.orderItems.length > 0
                                  ? order.orderItems[0].quantity
                                  : "N/A"}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                as="a"
                                href="#"
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                              >
                                ₱{order.totalPrice.toLocaleString()}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                as="a"
                                href="#"
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                              >
                                ₱{order.totalPrice.toLocaleString()}
                              </Typography>
                            </td>
                          </tr>
                        );
                      })}
                    <tr>
                      <td className="border px-4 py-2" colSpan="6"></td>
                      <td className="border px-4 py-2">
                        Total Price: ₱{totalTotalPrice.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
