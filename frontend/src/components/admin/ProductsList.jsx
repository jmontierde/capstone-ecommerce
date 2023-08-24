import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAdminProducts,
  deleteProduct,
  clearErrors,
} from "../../actions/productActions";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
const ProductsList = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getAdminProducts());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Product deleted successfully");
      navigate("/admin/products");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
  }, [dispatch, toast, error, deleteError, isDeleted]);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);

  const deleteSelectedOrders = () => {
    if (selectedProducts.length > 0) {
      selectedProducts.forEach((productId) => {
        deleteProductHandler(productId);
      });
      setSelectedProducts([]);
    } else {
      toast("Please select orders to delete.");
    }
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="flex container mx-auto px-12">
          <Sidebar />
          <div className="flex flex-col h-full w-10/12 justify-center ">
            <div className="flex justify-start mt-4">
              <button
                className="bg-red-500 text-white px-3 py-2"
                onClick={deleteSelectedOrders}
              >
                Delete Selected Products
              </button>
            </div>
            <table className="table w-full h-32">
              <thead className="bg-[#ECEFF1]">
                <tr>
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={masterCheckboxChecked}
                      onChange={() => {
                        if (masterCheckboxChecked) {
                          setSelectedProducts([]);
                        } else {
                          setSelectedProducts(
                            products.map((product) => product._id)
                          );
                        }
                        setMasterCheckboxChecked(!masterCheckboxChecked);
                      }}
                    />
                  </th>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Product ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={
                          masterCheckboxChecked ||
                          selectedProducts.includes(product._id)
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([
                              ...selectedProducts,
                              product._id,
                            ]);
                          } else {
                            setSelectedProducts(
                              selectedProducts.filter(
                                (id) => id !== product._id
                              )
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{product._id}</td>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.price}</td>
                    <td className="border px-4 py-2">{product.stock}</td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center items-center space-x-3">
                        <Link to={`/admin/product/${product._id}`}>
                          <img
                            src="/images/edit.svg"
                            alt="Edit product"
                            className="w-6 h-6 cursor-pointer"
                          />
                        </Link>
                        <img
                          src="/images/deleteHover.png"
                          alt="View product"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => deleteProductHandler(product._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsList;
