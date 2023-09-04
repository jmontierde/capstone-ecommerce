import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getTermsAndConditions } from "../../actions/termsActions";

import { getTerms } from "../../actions/termsActions";
const TermsAndConditions = () => {
  const { termsAndConditions, loading, error } = useSelector(
    (state) => state.terms
  );
  const [isChecked, setIsChecked] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTerms());
  }, [dispatch]);

  const handleRemoveTerms = () => {
    if (isChecked) {
      setShowTerms(true);
      localStorage.setItem("termsAccepted", "true");
    }
  };

  useEffect(() => {
    const termsAccepted = localStorage.getItem("termsAccepted");

    // Check if the user has already accepted the terms
    if (termsAccepted === "true") {
      setIsChecked(true);
      setShowTerms(false); // Hide the terms if accepted
    }
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#5d3f3f] w-screen container mx-auto">
      {!showTerms ? (
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <h1>Terms and Conditions</h1>

          {termsAndConditions.map((term, index) => (
            <div className="bg-green-300" key={index}>
              <h1>{term.title}</h1>
              <p>{term.content}</p>
            </div>
          ))}

          <>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <p>Terms and Conditions have been accepted.</p>
            <button onClick={handleRemoveTerms}>Continue</button>
          </>
        </div>
      ) : null}
    </div>
  );
};

export default TermsAndConditions;
