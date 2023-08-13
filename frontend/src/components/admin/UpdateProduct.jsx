import React, { useState, useEffect } from "react";

import Sidebar from "./Sidebar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProduct,
  getProductDetails,
  clearErrors,
} from "../../actions/productActions";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
  const { error, product } = useSelector((state) => state.productDetails);

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [seller, setSeller] = useState(product?.seller || "");
  const [images, setImages] = useState([]);

  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const { categories } = useSelector((state) => state.categories);

  console.log("NAME", name);

  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);

  const productId = id;
  useEffect(() => {
    dispatch(getProductDetails(productId));
  }, [dispatch, productId]);
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setSeller(product.seller);
      setStock(product.stock);
      setOldImages(product.images);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Product updated successfully");
      setTimeout(() => {
        dispatch({ type: UPDATE_PRODUCT_RESET });
      }, 2000);
    }
  }, [dispatch, error, isUpdated, updateError, product]);

  const submitHandler = (e) => {
    e.preventDefault();

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

    dispatch(updateProduct(product._id, formData));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImagesPreview([]);
    setImages([]);
    setOldImages([]);

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

  console.log("Name", name);
  return (
    <>
      <ToastContainer />
      <div className="flex container mx-auto px-12">
        <Sidebar />
        <div className="w-10/12 container p-6">
          <form onSubmit={submitHandler} encType="multipart/form-data">
            <div className="flex  space-x-12 ">
              <section className="w-1/2 flex flex-col ">
                <label htmlFor="productName">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-[#000] py-2 my-1 px-3"
                />
                <div className="flex gap-6 my-6">
                  <div className="flex flex-col w-9/12">
                    <label htmlFor="category">Category</label>
                    <br />
                    <select
                      className="border border-[#000] py-2 my-1 px-3 bg-[#fff]"
                      id="category_field"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col w-3/12">
                    <label htmlFor="stock">Stock</label>
                    <input
                      type="text"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="border border-[#000] py-2 my-1 px-3"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="price">Price</label>
                  <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border border-[#000] py-2 my-1 px-3"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="price">Seller</label>
                  <input
                    type="text"
                    id="price"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                    className="border border-[#000] py-2 my-1 px-3"
                  />
                </div>

                <div className="flex flex-col flex-wrap my-6">
                  <label htmlFor="description">Description</label>
                  <textarea
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    size={20}
                    className="border border-[#000]  py-2 px-3 text- my-1  h-48"
                  />
                </div>
              </section>
              <section className="w-1/2">
                <h4>Product Image</h4>

                <div className="flex flex-col my-6">
                  <div className="flex space-x-12   ">
                    {oldImages &&
                      oldImages.map((img) => (
                        <img
                          key={img}
                          src={img.url}
                          alt={img.url}
                          className="w-44 h-44 bg-[#FCFBFC]"
                        />
                      ))}

                    {imagesPreview.map((img, index) => (
                      <img
                        src={img}
                        key={index}
                        alt="Images Preview"
                        className="w-44 h-44 bg-[#FCFBFC]"
                      />
                    ))}

                    <div className="flex justify-center items-center text-center border-2 py-12 rounded border-dotted border-[#000] w-44">
                      <div>
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
                          onChange={onChange}
                          multiple
                        />
                      </div>
                      {/* {oldImages &&
                        oldImages.map((img) => (
                          <img
                            key={img}
                            src={img.url}
                            alt={img.url}
                            className="mt-3 mr-2"
                            width="55"
                            height="52"
                          />
                        ))} */}

                      {imagesPreview.map((img) => (
                        <img
                          src={img}
                          key={img}
                          alt="Images Preview"
                          className="mt-3 mr-2"
                          width="55"
                          height="52"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    id="login_button"
                    type="submit"
                    className="bg-[#003171] w-1/4 py-3 text-white rounded my-6"
                    disabled={loading ? true : false}
                  >
                    Update Product
                  </button>
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
