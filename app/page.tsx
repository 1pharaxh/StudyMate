"use client";
import Link from "next/link";

import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const page: FC = () => {
  return (
    <>
      <div className="w-screen min-h-screen bg-gradient-to-r from-blue-100 to-teal-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <h1 className="mr-3 text-5xl font-semibold">Study Mate 👀</h1>
              {/* <UserButton afterSignOutUrl="/" /> */}
            </div>

            <p className="max-w-xl mt-1 text-lg text-slate-600">
              An app to help take notes for students with ADHD and other
              learning disabilities
            </p>

            <div className="w-full mt-4">
              <Link href="/login">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
