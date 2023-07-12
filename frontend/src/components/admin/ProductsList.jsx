import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader";
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
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Product deleted successfully");
      navigate("/admin/products");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, deleteError, isDeleted]);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex container mx-auto px-12">
          <Sidebar />
          <div className="flex w-10/12 justify-center ">
            <table className="table-fixed w-full h-32">
              <thead className="bg-[#ECEFF1]">
                <tr>
                  <th className="px-4 py-2">Product ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {products.map((product) => (
                  <tr key={product._id}>
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
