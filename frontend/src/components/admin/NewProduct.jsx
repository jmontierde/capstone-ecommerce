import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { newProduct, clearErrors } from "../../actions/productActions";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../actions/productActions";

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
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      navigate("/admin/products");
      alert.success("Product created successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, success, history]);

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
                    {imagesPreview.map((img, index) => (
                      <img
                        src={img}
                        key={index}
                        alt="Images Preview"
                        className="w-44 h-44 bg-[#FCFBFC]"
                      />
                    ))}

                    <div className="flex justify-center items-center text-center border-2 py-12 rounded border-dotted border-[#000] w-44">
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
                  </div>

                  <button
                    id="login_button"
                    type="submit"
                    className="bg-[#003171] w-1/4 py-3 text-white rounded my-6"
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
    </>
  );
};

export default NewProduct;
