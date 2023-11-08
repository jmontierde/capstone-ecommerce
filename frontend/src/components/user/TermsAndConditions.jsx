import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getTermsAndConditions } from "../../actions/termsActions";

import { getTerms, getUserTerms } from "../../actions/termsActions";
const TermsAndConditions = () => {
  const { termsAndConditions } = useSelector((state) => state.terms);

  const [isChecked, setIsChecked] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserTerms());
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

  console.log("Terms", termsAndConditions);

  return (
    <div className="container mx-auto space-y-3 mt-24 py-12 ">
      <h1 className="text-2xl font-bold">Terms and Conditions</h1>

      {termsAndConditions.map((term, index) => (
        <div key={index}>
          <h2 className="font-semibold text-lg">
            {index + 1}
            {". "}
            {term.title}
          </h2>
          {term.content.map((item, itemIndex) => (
            <p key={itemIndex} className="text-base">
              {item}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default React.memo(TermsAndConditions);
