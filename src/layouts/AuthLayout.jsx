import React from "react";
// import authImage from '../assets/authImage.png';
import { Link, Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="w-10/12 mx-auto">
      <div className="flex items-center">
        <div className="flex-1">
          <Outlet></Outlet>
        </div>
        <div>{/* <img src={authImage} alt="" /> */}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
