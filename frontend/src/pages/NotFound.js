// NotFound.js
import React from "react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600">Page Not Found</p>
        <p className="text-gray-500 mt-4">
          Sorry, the page you're looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
