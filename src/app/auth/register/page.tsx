"use client"
import FullLogo from "@/app/admin/layout/shared/logo/FullLogo";
import React from "react";
import Link from "next/link";
import AuthRegister from "../../../components/authforms/AuthRegister";

const gradientStyle = {
  background: "linear-gradient(45deg, rgb(238, 119, 82,0.2), rgb(231, 60, 126,0.2), rgb(35, 166, 213,0.2), rgb(35, 213, 171,0.2))",
  backgroundSize: "400% 400%",
  animation: "gradient 15s ease infinite",
  height: "100vh",
  overflow: "hidden",
};

const BoxedRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <AuthRegister />
      </div>
    </div>
  );
};

export default BoxedRegister;
