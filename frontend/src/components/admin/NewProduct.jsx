import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { newProduct, clearErrors } from "../../actions/productActions";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../actions/productActions";
import { Input, Select, Option, Textarea } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const NewProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const { categories } = useSelector((state) => state.categories);

  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.newProduct);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      navigate("/admin/products");
      toast.success("Product created successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, toast, error, success, history]);

  const isRequiredFieldEmpty =
    !name || !price || !description || !category || !stock || !seller;
  const submitHandler = (e) => {
    e.preventDefault();

    if (isRequiredFieldEmpty) {
      alert.error("Please fill in all required fields.");
      return;
    }

    if (!images || images.length === 0) {
      alert.error("Please select at least one image for the product.");
      return;
    }

    // Validate 'price' field
    const parsedPrice = parseFloat(price);
    if (
      isNaN(parsedPrice) ||
      !/^\d+(\.\d{1,2})?$/.test(price) ||
      parsedPrice <= 0
    ) {
      alert.error(
        "Please enter a valid positive numeric price for the product."
      );
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("stock", stock);
    formData.set("seller", seller);

    images.forEach((image) => {
      formData.append("images", image);
    });
    console.log("FormData:", formData);
    dispatch(newProduct(formData));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="container p-6">
          <form onSubmit={submitHandler} encType="multipart/form-data">
            <div className="flex flex-col  lg:flex-row  mx-auto lg:space-x-12 ">
              <section className=" flex flex-col w-full space-y-6">
                <Input
                  label="Product Name"
                  id="productName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="py-6"
                />
                <div className="flex gap-6">
                  <div className="flex flex-col w-9/12">
                    <Select
                      label="Select Category"
                      className="py-6"
                      onChange={(value) => setCategory(value)}
                    >
                      {categories.map((category) => (
                        <Option key={category.name} value={category.name}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex flex-col ">
                    <Input
                      label="Stock"
                      className="py-6 "
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                <Input
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="py-6"
                />

                <Input
                  label="Seller"
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
                  className="py-6"
                />

                <Textarea
                  label="Description"
                  id="description"
                  value={description}
                  className="h-72"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </section>
              <section className="lg:w-1/2 ">
                <div className="flex flex-col justify-between ">
                  <div className="flex   ">
                    <div className="flex flex-col ">
                      {imagesPreview.length > 0 &&
                        imagesPreview.map((img, index) => (
                          <img
                            src={img}
                            key={index}
                            alt="Images Preview"
                            className=" flex w-44 h-44  "
                          />
                        ))}
                    </div>

                    <div className="flex justify-center items-center text-center border-2 py-12 rounded border-dotted border-[#000]  w-44 h-44">
                      <label
                        htmlFor="fileInput"
                        className="cursor-pointer text-[#413f3f] text-sm font-thin"
                      >
                        Drop your image here, or select
                        <span className="text-[#0c2176] font-normal pl-1">
                          click to browse.
                        </span>
                      </label>
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept=".jpg, .jpeg, .png, .gif"
                        onChange={onChange}
                        multiple
                      />
                    </div>
                  </div>

                  <button
                    id="login_button"
                    type="submit"
                    className="bg-[#003171] w-full lg:w-1/3 py-3  text-white rounded my-6"
                    disabled={loading}
                  >
                    {loading ? "Adding Product..." : "Add Product"}
                  </button>
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default NewProduct;
