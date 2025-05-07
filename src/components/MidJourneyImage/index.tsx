"use client";

import React, {useEffect, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Image} from "primereact/image";
import {Button} from "primereact/button";

export const MidJourneyImages = ({
  image,
  promptId,
  handleDeleteImage,
  handleImageVariation,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [iconStyle, setIconStyle] = useState({
    fontSize: "1.5rem",
  });
  const [imageStyle, setImageStyle] = useState({
    width: "310px",
    height: "280px",
  });

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteModalVisible(true);
  };
  const handleVariationOfImages = (e) => {
    e.stopPropagation();
    handleImageVariation(image?.id);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();
    handleDeleteImage(image?.id, promptId);
    setDeleteModalVisible(false);
  };
  useEffect(() => {
    const updateStyles = () => {
      if (window.innerWidth < 640) {
        // Mobile
        setImageStyle({ width: "180px", height: "150px" });
        setIconStyle({ fontSize: "1.2rem" });
      } else if (window.innerWidth < 1024) {
        // Tablet
        setImageStyle({ width: "250px", height: "230px" });
        setIconStyle({ fontSize: "1.4rem" });
      } else {
        // Desktop
        setImageStyle({ width: "310px", height: "280px" });
        setIconStyle({ fontSize: "1.5rem" });
      }
    };

    updateStyles();
    window.addEventListener("resize", updateStyles);

    return () => window.removeEventListener("resize", updateStyles);
  }, []);
  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeleteModalVisible(false);
  };

  const customIcons = (
    <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4">
      <i className="pi pi-eye text-blue-500" style={iconStyle}></i>
      <i
        className="pi pi-trash text-red-500"
        style={iconStyle}
        onClick={handleDeleteClick}
      ></i>

      <i
          className="pi pi-images text-green-500"
          style={iconStyle}
          onClick={handleVariationOfImages}
      ></i>
    </span>
  );

  return (
    <div className="relative rounded-xl overflow-hidden cursor-pointer transition duration-300">
      {/* Image */}
      <Image
        src={image?.imageUrl}
        alt="MidJourney Image"
        indicatorIcon={customIcons}
        imageStyle={imageStyle}
        preview
      />
      {/* Delete confirmation modal */}
      <Dialog
        visible={deleteModalVisible}
        onHide={() => setDeleteModalVisible(false)}
        header="Confirm Delete"
        footer={
          <div className="flex align-items-center justify-content-center space-x-2">
            <Button
              label="No"
              icon="pi pi-times"
              onClick={cancelDelete}
              className="p-button-text"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={confirmDelete}
              className="p-button-danger"
              autoFocus
            />
          </div>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete this image?
        </p>
      </Dialog>
    </div>
  );
};
