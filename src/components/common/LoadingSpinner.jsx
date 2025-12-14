import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <div className="flex flex-col items-center space-y-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-xl font-semibold text-gray-600">Loading AssetVerse...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;