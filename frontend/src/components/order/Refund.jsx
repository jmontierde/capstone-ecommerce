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
      console.log("ERROR Refund", error);
      alert.error(error);
      dispatch(clearErrors());
    }

    console.log("ERRRROR", error);

    if (success) {
      alert.success("Refund request successfully");
      navigate("/orders/me");
      dispatch({ type: REFUND_ORDER_RESET });
    }
  }, [dispatch, alert, error, success]);

  const isRequiredFieldEmpty = !orderId || selectedReasons.length === 0;

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

  const setOrderIdHandler = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, ""); // Remove non-numeric characters
    setOrderId(Number(numericInput));
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
                onChange={setOrderIdHandler}
                className="border border-[#000] w-96 rounded py-1"
              />

              <div className="relative space-y-3">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 cursor-pointer"
                  htmlFor="imageReason"
                >
                  Upload Avatar
                </label>
                <div class="flex items-center justify-center w-full">
                  <label
                    for="imageReason"
                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="imageReason"
                      name="imageReason"
                      onChange={onChange}
                      type="file"
                      class="hidden"
                    />
                  </label>
                </div>
                {imageReason && (
                  <img
                    src={imageReason}
                    className="rounded-circle w-32 h-32"
                    alt="Valid ID"
                  />
                )}
              </div>
              {/* <div className="flex flex-col">
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
              </div> */}

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
