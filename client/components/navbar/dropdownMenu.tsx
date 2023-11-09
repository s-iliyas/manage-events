"use client";

import Image from "next/image";
import { useState } from "react";
import { Auth } from "aws-amplify";

import { useAuth } from "@/hooks/useAuth";

const DropdownMenu = () => {
  const user = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      window.location.href = "/";
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  return user?.username ? (
    <div
      className="flex items-center relative flex-row gap-1 cursor-pointer"
      onClick={toggleDropdown}
    >
      <small>{user?.username?.split('@')[0]}</small>
      <Image src={"/down.png"} alt="down arrow" width={10} height={10} />
      {isDropdownOpen && (
        <div className="absolute min-w-[10rem] top-full left-0 bg-white border rounded-md border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className="bg-red-100 rounded-md w-full hover:bg-red-300 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <div></div>
  );
};

export default DropdownMenu;
