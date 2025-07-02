import React from "react";

import NewCustomers from "../components/dashboard/NewCustomers";
import DailyActivity from "../components/dashboard/DailyActivity";
import Link from "next/link";

const page = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 col-span-12">
          <NewCustomers />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <NewCustomers />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <NewCustomers />
        </div>
        <div className="lg:col-span-12 col-span-12">
          <DailyActivity />
        </div>

        <div className="col-span-12 text-center">
          <p className="text-base">
            Design and Developed by{" "}
            <Link
              href="https://adminmart.com/"
              target="_blank"
              className="pl-1 text-primary underline decoration-primary"
            >
              adminmart.com
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default page;
