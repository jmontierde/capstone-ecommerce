import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (loading) {
    return null; // a loading spinner,
  }

  if (isAuthenticated === false) {
    navigate("/login");
    return null;
  }

  if (isAdmin === true && user.role !== "admin") {
    navigate("/product");
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
