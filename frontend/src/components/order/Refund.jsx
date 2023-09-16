import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRefund } from "../../actions/orderActions";
import { clearErrors } from "../../actions/orderActions";
import { REFUND_ORDER_RESET } from "../../constants/orderConstants";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";

const Refund = () => {
  const dispatch = useDispatch();

  const { refund, loading, success, error } = useSelector(
    (state) => state.createRefund
  );

  const [orderId, setOrderId] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [imageReason, setImageReason] = useState(null);

  const alert = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Refund request successfully");
      navigate("/orders/me");
      dispatch({ type: REFUND_ORDER_RESET });
    }
  }, [dispatch, alert, error, success]);

  const isRequiredFieldEmpty =
    !orderId || selectedReasons.length === 0 || !otherReason;

  const submitHandler = (e) => {
    e.preventDefault();

    if (isRequiredFieldEmpty) {
      alert.error("Please fill in all required fields.");
      return;
    }

    if (!imageReason || imageReason.length === 0) {
      alert.error("Please select one image for the imageReason.");
      return;
    }

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("imageReason", imageReason);
    formData.append("reasons", JSON.stringify(selectedReasons));
    formData.append("otherReason", otherReason);

    dispatch(createRefund(formData));
  };

  const onChange = (e) => {
    if (e.target.name === "imageReason") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImageReason(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const refundReasons = [
    "Incorrect Item Received",
    "Defective Product",
    "Not-working Product",
    "Item not as described",
    "Received damaged item",
  ];

  const handleReasonChange = (e, reason) => {
    const { checked } = e.target;

    if (checked) {
      setSelectedReasons([...selectedReasons, reason]);
    } else {
      setSelectedReasons(
        selectedReasons.filter((selected) => selected !== reason)
      );
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-center items-center flex-col py-6">
          <h1 className="font-bold text-xl">Refund</h1>
          <form onSubmit={submitHandler} encType="multipart/form-data">
            <div className="flex flex-col gap-2 px-16 py-6">
              <label htmlFor="orderId">OrderId</label>
              <input
                type="text"
                id="orderId"
                name="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="border border-[#000] w-96 rounded py-1"
              />

              <div className="flex flex-col">
                <div>
                  <label htmlFor="customFile">Browse File...</label>
                  <br />

                  {imageReason && (
                    <img
                      src={imageReason}
                      className="rounded-circle w-32 h-32"
                      alt="Valid ID"
                    />
                  )}
                  <div>
                    <input
                      type="file"
                      name="imageReason"
                      className="py-3"
                      id="customFile"
                      accept="images/*"
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>

              <label>Reasons for Refund:</label>

              <Card>
                <List>
                  {refundReasons.map((reasonOption) => (
                    <ListItem key={reasonOption} className="p-0">
                      <label
                        htmlFor={`vertical-list-${reasonOption}`}
                        className="flex w-full cursor-pointer items-center px-3 py-2"
                      >
                        <ListItemPrefix className="mr-3">
                          <Checkbox
                            id={`vertical-list-${reasonOption}`}
                            ripple={false}
                            value={reasonOption}
                            checked={selectedReasons.includes(reasonOption)}
                            onChange={(e) =>
                              handleReasonChange(e, reasonOption)
                            }
                          />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="font-medium">
                          {reasonOption}
                        </Typography>
                      </label>
                    </ListItem>
                  ))}
                </List>
              </Card>

              <label htmlFor="otherReason">Other Reason:</label>
              <textarea
                name="otherReason"
                id="otherReason"
                cols="30"
                rows="10"
                className="border border-black"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              ></textarea>

              <button
                className="bg-[#030105] border rounded py-2 my-3 text-[#fff] "
                type="submit"
                disabled={loading ? true : false}
              >
                Refund
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Refund;
