"use client";

import React from "react";
import LeftSidebar from "../../componnets/shared/LeftSidebar";
import Navbar from "../../componnets/shared/Navbar";
import RightSidebar from "../../componnets/shared/RightSidebar";
import AddPickupLocationForm from "../../componnets/setup/AddPickUpLocation/AddPickupLocationForm";

const Page = () => {
  return (
    <div className="flex min-h-screen bg-[#F3F6F9]">
      <div className="w-[270px] min-h-screen border-r border-[#E5E5E5] bg-white">
        <LeftSidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar pageName={"Add Pickup Location"} />

        <div className="flex-1 p-8">
          <AddPickupLocationForm mode="add" />
        </div>
      </div>

      <div className="w-[340px] min-h-screen border-l border-[#E5E5E5] bg-white hidden xl:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Page;
