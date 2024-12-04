"use client";
import Home from "@/components/Home";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-800 to-purple-500 h-screen">
      <div className="container mx-auto p-4 pt-6">
        {" "}
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
