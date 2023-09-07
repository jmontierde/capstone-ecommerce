import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  allRefund,
  deleteRefund,
  updateRefund,
} from "../../actions/orderActions"; // Import updateRefund action
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import ImageModal from "../layout/ImageModal";
import {
  DELETE_REFUND_RESET,
  UPDATE_REFUND_RESET,
} from "../../constants/orderConstants";

const AllRefunds = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, refunds } = useSelector((state) => state.allRefund);
  const [selectedRefunds, setSelectedRefunds] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState(null);
  const [status, setStatus] = useState(""); // Added status state

  const { isDeleted, isUpdated } = useSelector((state) => state.refund);

  useEffect(() => {
    dispatch(allRefund());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Order deleted successfully");
      navigate("/admin/refunds");
      dispatch({ type: DELETE_REFUND_RESET });
    }
    if (isUpdated) {
      alert.success("Refund status updated successfully");
      dispatch({ type: UPDATE_REFUND_RESET }); // Reset the update state here
    }
  }, [dispatch, error, alert, isDeleted, isUpdated]);

  const openImageModal = (imageUrl) => {
    setEnlargedImageUrl(imageUrl);
  };

  const closeImageModal = () => {
    setEnlargedImageUrl(null);
  };

  const deleteRefundHandler = (id) => {
    dispatch(deleteRefund(id));
  };

  const deleteSelectedRefunds = () => {
    if (selectedRefunds.length > 0) {
      selectedRefunds.forEach((refundId) => {
        deleteRefundHandler(refundId);
      });
      setSelectedRefunds([]);
    } else {
      alert("Please select refunds to delete.");
    }
  };

  const handleStatusUpdate = (refundId) => {
    if (status.trim() === "") {
      alert("Please select a status.");
      return;
    }

    if (isUpdated) {
      alert.success("Refund status updated successfully");
      dispatch({ type: UPDATE_REFUND_RESET });
    }

    dispatch(updateRefund(refundId, { status }));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex container mx-auto px-6">
          <Sidebar />

          <div className="flex flex-col w-10/12 h-full justify-center">
            <div className="flex justify-start">
              <button
                className="bg-red-500 text-white px-3 py-2"
                onClick={deleteSelectedRefunds}
              >
                Delete Selected Refund
              </button>
            </div>

            <table className="table-auto w-full">
              <thead className="bg-[#ECEFF1]">
                <tr>
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={masterCheckboxChecked}
                      onChange={() => {
                        if (masterCheckboxChecked) {
                          setSelectedRefunds([]);
                        } else {
                          setSelectedRefunds(
                            refunds.map((refund) => refund._id)
                          );
                        }
                        setMasterCheckboxChecked(!masterCheckboxChecked);
                      }}
                    />
                  </th>
                  <th>No</th>
                  <th className="px-4 py-2">Order Id</th>
                  <th className="px-4 py-2">Image Reason</th>
                  <th className="px-4 py-2">Reasons</th>
                  <th className="px-4 py-2">Other Reason</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Delete</th>
                  <th className="px-4 py-2">Update</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {refunds.map((refund, index) => (
                  <tr key={refund._id}>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRefunds.includes(refund._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRefunds([
                              ...selectedRefunds,
                              refund._id,
                            ]);
                          } else {
                            setSelectedRefunds(
                              selectedRefunds.filter((id) => id !== refund._id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{refund.orderId}</td>
                    <td className="border px-4 py-2">
                      {refund.imageReason && refund.imageReason.url && (
                        <img
                          src={refund.imageReason.url}
                          alt="Image Reason"
                          className="max-w-screen-xl max-h-screen-xl mx-auto cursor-pointer"
                          onClick={() => openImageModal(refund.imageReason.url)}
                        />
                      )}
                    </td>
                    <td className="border px-4 py-2">{refund.reasons}</td>
                    <td className="border px-4 py-2">{refund.otherReason}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={`${
                          refund.status === "accepted"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {refund.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center items-center">
                        <img
                          src="/images/deleteHover.png"
                          alt="View product"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => deleteRefundHandler(refund._id)}
                        />
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col justify-center items-center">
                        <select
                          className="border border-[#000] py-2 my-1 px-4 bg-[#fff]"
                          name="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button
                          className="bg-[#2e69a8] rounded py-2 my-3 text-white px-6"
                          onClick={() => handleStatusUpdate(refund._id)}
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {enlargedImageUrl && (
        <ImageModal imageUrl={enlargedImageUrl} onClose={closeImageModal} />
      )}
    </>
  );
};

export default AllRefunds;
