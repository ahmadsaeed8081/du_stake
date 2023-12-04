import React from "react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  return (
    <Link to={"/dashboard/profile"}>
      <img
        src="/images/user-img.png"
        className="h-12 w-12 rounded-full"
        alt="img"
      />
    </Link>
  );
};

export default UserProfile;
