import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({
  component: Component,
  isAdmin,
  isStaff,
  ...rest
}) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return null; // Display a loading spinner or component here
  }

  console.log("isAuthenticated", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (
    (isAdmin || isStaff) &&
    user?.role !== "admin" &&
    user?.role !== "staff"
  ) {
    return <Navigate to="/product" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;

// import React, { Fragment } from 'react'
// import { Route, Redirect } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import Redirect from 'react-router-dom/Redirect';

// const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {

//     const { isAuthenticated, loading, user } = useSelector(state => state.auth)

//     return (
//         <Fragment>
//             {loading === false && (
//                 <Route
//                     {...rest}
//                     render={props => {
//                         if (isAuthenticated === false) {
//                             return <Redirect to='/login' />
//                         }

//                         if (isAdmin === true && user.role !== 'admin') {
//                             return <Redirect to="/" />
//                         }

//                         return <Component {...props} />
//                     }}
//                 />
//             )}
//         </Fragment>
//     )
// }

// export default ProtectedRoute
