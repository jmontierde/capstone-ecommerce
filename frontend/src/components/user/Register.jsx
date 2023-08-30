import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearErrors } from "../../actions/userActions";
// import MetaData from './layout/MetaData'
import { useAlert } from "react-alert";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "images/default_avatar.png"
  );
  // const [hideProfile, setHideProfile] = useState(true);

  const alert = useAlert();
  const dispatch = useDispatch();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/product");
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, isAuthenticated, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("avatar", avatar);

    dispatch(register(formData));
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };
  // Need to add hide default image
  // const handleRemoveImage = () => {
  //     setAvatar(null);
  //     setAvatarPreview(null);
  //     setSelectedAvatar(false);
  //     setHideProfile(false);
  //   };

  return (
    <>
      <div className="container mx-auto ">
        <div
          className="flex justify-center items-center flex-col py-6  "
          style={{ height: "calc(100vh - 9.5rem)" }}
        >
          <h1 className="font-bold text-xl">Register</h1>
          <form onSubmit={submitHandler} encType="multipart/form-data">
            <div className="flex flex-col gap-2 px-16 py-6">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                className="border border-[#000] w-96 rounded py-1"
              />
              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="border border-[#000] w-96 rounded py-1"
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="border border-[#000] w-96 rounded py-1"
              />
              <div className="flex flex-col">
                <div>
                  <label htmlFor="customFile">Profile Picture</label>
                  <br />
                  <figure className="relative mt-3">
                    <img
                      src={avatarPreview}
                      className="rounded-circle w-32 h-32"
                      alt="Avatar Preview"
                    />
                    {/* <img src="images/close.png" className="absolute top-2 right-2/3 transform -translate-x-2/3 -translate-y-3/3 w-4 h-auto cursor-pointer" onClick={handleRemoveImage} /> */}
                  </figure>
                  <div>
                    <input
                      type="file"
                      name="avatar"
                      className="py-3"
                      id="customFile"
                      accept="images/*"
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>

              <button
                className="bg-[#6921EF] border rounded py-2 my-3 text-[#fff]"
                type="submit"
                disabled={loading ? true : false}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { register, clearErrors } from "../../actions/userActions";
// // import MetaData from './layout/MetaData'
// import { useAlert } from "react-alert";
// import { Link, useNavigate } from "react-router-dom";
// import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";

// const Register = () => {
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//   });

//   const { name, email, password, phoneNumber } = user;

//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(
//     "images/default_avatar.png"
//   );

//   // const [validId, setValidId] = useState(null);
//   // const [withBirthdayId, setWithBirthdayId] = useState(null);

//   // const [hideProfile, setHideProfile] = useState(true);

//   const alert = useAlert();
//   const dispatch = useDispatch();

//   const { isAuthenticated, error, loading } = useSelector(
//     (state) => state.auth
//   );
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/product");
//     }
//     if (error) {
//       alert.error(error);
//       dispatch(clearErrors());
//     }
//   }, [dispatch, alert, isAuthenticated, error]);

//   const submitHandler = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.set("name", name);
//     formData.set("email", email);
//     formData.set("password", password);
//     formData.set("phoneNumber", phoneNumber);
//     formData.set("avatar", avatar);
//     // formData.set("validId", validId);
//     // formData.set("withBirthdayId", withBirthdayId);

//     dispatch(register(formData));
//   };

//   const onChange = (e) => {
//     if (e.target.name === "avatar") {
//       const reader = new FileReader();

//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setAvatarPreview(reader.result);
//           setAvatar(reader.result);
//         }
//       };

//       reader.readAsDataURL(e.target.files[0]);
//     }
//     // else if (e.target.name === "validId") {
//     //   const reader = new FileReader();

//     //   reader.onload = () => {
//     //     if (reader.readyState === 2) {
//     //       setValidId(reader.result);
//     //     }
//     //   };

//     //   reader.readAsDataURL(e.target.files[0]);
//     // } else if (e.target.name === "withBirthdayId") {
//     //   const reader = new FileReader();

//     //   reader.onload = () => {
//     //     if (reader.readyState === 2) {
//     //       setWithBirthdayId(reader.result);
//     //     }
//     //   };

//     //   reader.readAsDataURL(e.target.files[0]);
//     // }
//     else {
//       setUser({ ...user, [e.target.name]: e.target.value });
//     }
//   };

//   console.log("PHONEN NUMBER", phoneNumber);

//   // Need to add hide default image
//   // const handleRemoveImage = () => {
//   //     setAvatar(null);
//   //     setAvatarPreview(null);
//   //     setSelectedAvatar(false);
//   //     setHideProfile(false);
//   //   };

//   return (
//     <>
//       <div className="container mx-auto ">
//         <div
//           className="flex justify-center items-center flex-col py-6  "
//           // style={{ height: "calc(100vh - 9.5rem)" }}
//         >
//           <h1 className="font-bold text-xl">Register</h1>
//           <form onSubmit={submitHandler} encType="multipart/form-data">
//             <div className="flex flex-col gap-2 px-16 py-6">
//               <label htmlFor="name">Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={name}
//                 onChange={onChange}
//                 className="border border-[#000] w-96 rounded py-1"
//               />
//               <label htmlFor="email">Email Address</label>
//               <input
//                 type="text"
//                 id="email"
//                 name="email"
//                 value={email}
//                 onChange={onChange}
//                 className="border border-[#000] w-96 rounded py-1"
//               />
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={onChange}
//                 className="border border-[#000] w-96 rounded py-1"
//               />
//               <label htmlFor="phoneNumber">Cellphone Number</label>
//               <PhoneInput
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 placeholder="Enter phone number"
//                 value={phoneNumber}
//                 onChange={(value) => setUser({ ...user, phoneNumber: value })}
//                 defaultCountry="PH"
//                 className="border border-[#000] w-96 rounded py-1"
//               />

//               <div className="flex flex-col">
//                 <div>
//                   <label htmlFor="customFile">Profile Picture</label>
//                   <br />
//                   <figure className="relative mt-3">
//                     <img
//                       src={avatarPreview}
//                       className="rounded-circle w-32 h-32"
//                       alt="Avatar Preview"
//                     />
//                     {/* <img src="images/close.png" className="absolute top-2 right-2/3 transform -translate-x-2/3 -translate-y-3/3 w-4 h-auto cursor-pointer" onClick={handleRemoveImage} /> */}
//                   </figure>
//                   <div>
//                     <input
//                       type="file"
//                       name="avatar"
//                       className="py-3"
//                       id="customFile"
//                       accept="images/*"
//                       onChange={onChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* ID */}
//               {/* <div className="flex flex-col space-y-6 my-6">
//                 <label>Submit (1) valid id (include birthdate)</label>

//                 <label
//                   htmlFor="validId"
//                   className="bg-[#a49c9c] p-3 rounded w-fit"
//                 >
//                   Choose a File:
//                 </label>

//                 <input
//                   type="file"
//                   id="validId"
//                   name="validId"
//                   onChange={onChange}
//                   accept="image/png, image/jpeg"
//                 />
//                 {validId && (
//                   <img
//                     src={validId}
//                     className="rounded-circle w-32 h-32"
//                     alt="Valid ID"
//                   />
//                 )}
//               </div> */}

//               {/* Valid ID */}
//               {/* <div className="flex flex-col space-y-6 my-6">
//                 <label>Upload Selfie with valid id</label>

//                 <label
//                   htmlFor="withBirthdayId"
//                   className="bg-[#a49c9c] p-3 rounded w-fit"
//                 >
//                   Choose a File:
//                 </label>
//                 <input
//                   type="file"
//                   id="withBirthdayId"
//                   name="withBirthdayId"
//                   onChange={onChange}
//                   accept="image/png, image/jpeg"
//                 />
//                 {withBirthdayId && (
//                   <img
//                     src={withBirthdayId}
//                     className="rounded-circle w-32 h-32"
//                     alt="With Birthday ID"
//                   />
//                 )}
//               </div> */}

//               <button
//                 className="bg-[#6921EF] border rounded py-2 my-3 text-[#fff]"
//                 type="submit"
//                 disabled={loading ? true : false}
//               >
//                 Register
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Register;
