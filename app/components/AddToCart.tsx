"use client";
import React from "react";

export const AddToCart = () => {
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => console.log("clicked event")}
      >
        Add Product
      </button>
    </div>
  );
};
