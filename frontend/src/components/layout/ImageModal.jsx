import React from "react";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content">
        <img src={imageUrl} alt="Enlarged Image" />
      </div>
    </div>
  );
};

export default ImageModal;
