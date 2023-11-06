import React, { useState } from "react";

const AgeVerification = ({ onVerification }) => {
  const [birthdate, setBirthdate] = useState("");

  const handleVerification = () => {
    const today = new Date();
    const userBirthdate = new Date(birthdate);
    const age = today.getFullYear() - userBirthdate.getFullYear();

    if (age >= 18) {
      onVerification(); // Call the onVerification function to allow access to the main routes.
    } else {
      alert("Sorry, you are not of legal age.");
    }
  };

  return (
    <div className="bg-[#121212]  h-screen py-6  mt-16">
      <div
        className=" bg-white-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg text-white  bg-opacity-70 border border-gray-100
        w-1/4 mx-auto space-y-6 p-6"
      >
        <img
          src="/images/Vside.jpg"
          alt="vside-img"
          className="w-1/2 h-32 mx-auto"
        />
        <h2>Age Verification</h2>

        <p className="text-sm">
          The products available on VapingSidewalk are age-restricted and
          intended for adults of legal smoking age only. All orders placed on
          the website will be verified by an industry leading Age Verification
          software for validation. By entering our website, you affirm that you
          are of legal smoking age and you agree to be Age Verified. Please
          enter your birthdate below:
        </p>
        <input
          type="date"
          className="w-full mx-auto p-3 border text-black border-[#000]"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
        <button
          onClick={handleVerification}
          className="bg-transparent border border-[#dbdbdb] w-24 py-2 mx-auto "
        >
          Submit
        </button>
        <p className="text-xs text-center">
          By entering this site you are agreeing to the Terms of Use and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
};

export default AgeVerification;
