import Image from "next/image";
import React from "react";
import ErrorImg from "/public/images/backgrounds/Login-rafiki.svg";
import { Button } from "flowbite-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Error-403",
    description: "Access Forbidden",
};

const Forbidden = () => {
    return (
        <>
            <div className="h-screen flex items-center justify-center bg-white dark:bg-darkgray">
                <div className="text-center">
                    <Image src={ErrorImg} alt="error" className="mb-4" />
                    <h1 className="text-ld text-4xl mb-6">Access Denied!</h1>
                    <p>You don&apos;t have permission to access this page.</p>
                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            color={"primary"}
                            as={Link}
                            href="/"
                            className="w-fit"
                        >
                            Go Back to Home
                        </Button>
                        <Button
                            color={"light"}
                            as={Link}
                            href="/auth/login"
                            className="w-fit"
                        >
                            Login with Different Account
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Forbidden; 