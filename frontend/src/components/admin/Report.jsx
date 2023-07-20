import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import html2canvas from "html2canvas";

const Report = () => {
  const { loading, error, orders } = useSelector((state) => state.allOrders);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const pdfTableRef = useRef();

  const downloadPDF = () => {
    const doc = new jsPDF();

    const tableRef = pdfTableRef.current; // Get the DOM element of the table
    const imagePromise = html2canvas(tableRef); // Convert the table to an image

    imagePromise.then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      doc.addImage(imageData, "PNG", 15, 15, 180, 0);
      doc.save("report.pdf");
    });
  };

  const filterOrdersByMonth = () => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === selectedDate.getMonth() &&
        orderDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

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

  return (
    <div className="flex container mx-auto px-12">
      <Sidebar />
      <div className="w-10/12 bg-slate-500">
        <div className="flex justify-between px-12 items-center my-6 ">
          <div className="space-x-3">
            <select
              value={showDayPicker ? "day" : selectedWeek ? "week" : "month"}
              onChange={handleSelectChange}
              className="border rounded px-4 py-2"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            {showDayPicker ? (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="border rounded px-4 py-2"
              />
            ) : selectedWeek ? (
              <DatePicker
                selected={selectedWeek}
                onChange={(date) => setSelectedWeek(date)}
                showWeekNumbers
                className="border rounded px-4 py-2"
              />
            ) : (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showMonthYearPicker
                dateFormat="MMMM yyyy"
                className="border rounded px-4 py-2 mr-4"
              />
            )}
          </div>

          <button
            className="px-4 py-2 ml-4 rounded bg-blue-500 text-white"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex container mx-auto px-12">
            <div className="flex w-full justify-center ">
              <table ref={pdfTableRef} className="table-fixed  w-full h-32">
                <thead className="bg-[#ECEFF1]">
                  <tr>
                    <th className="px-4 py-2">ORDER ID</th>
                    <th className="px-4 py-2">Item Name</th>
                    <th className="px-4 py-2">Num of Items</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="border px-4 py-2 break-all">
                        {order._id}
                      </td>
                      <td className="border px-4 py-2">
                        {order.orderItems.map((item) => (
                          <div key={item._id}>{item.name}</div>
                        ))}
                      </td>
                      <td className="border px-4 py-2">
                        {order.orderItems.length}
                      </td>
                      <td className="border px-4 py-2">
                        {order.orderItems[0].quantity}
                      </td>
                      <td className="border px-4 py-2">₱{order.totalPrice}</td>
                      <td className="border px-4 py-2">₱{order.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
