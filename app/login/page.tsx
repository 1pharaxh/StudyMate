"use client";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLogin } from "../use-login";
import { useRouter } from "next/navigation";

const page: FC = () => {
  const [loggedin, setLoggedin] = useLogin();
  const router = useRouter();
  // Inside your component

  const [activeTab, setActiveTab] = React.useState("");
  useEffect(() => {
    console.log(loggedin);
    if (loggedin.signedIn === "student") {
      router.push("/mail");
    } else if (loggedin.signedIn === "teacher") {
      router.push("/teacherdashboard");
    }
  }, [loggedin]);
  return (
    <>
      <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Acme Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;It does not matter where you go and what you study, what
                matters most is what you share with yourself and the
                world.&rdquo;
              </p>
              <footer className="text-sm">Santosh Kalwars</footer>
            </blockquote>
          </div>
        </div>
        <div className="container relative flex items-center justify-center h-screen">
          <div className="mx-auto flex flex-col items-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                I am a ...
              </h1>
              <Tabs defaultValue="account" className="w-[600px]">
                <TabsList>
                  <TabsTrigger
                    onClick={() => setActiveTab("teacher")}
                    value="teacher"
                  >
                    Teacher
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("student")}
                    value="student"
                  >
                    Student
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="teacher"
                  className="items-center justify-center flex flex-col gap-2"
                >
                  <div className="max-w-44 items-start justify-center flex flex-col gap-1.5">
                    <Label htmlFor="email">Teacher Name</Label>
                    <Input type="text" id="teacher_name" placeholder="Name" />
                  </div>
                  <div className="max-w-44 items-start justify-center flex flex-col gap-1.5">
                    <Label htmlFor="email">Subject Name</Label>
                    <Input
                      type="text"
                      id="subject_name"
                      placeholder="Subject"
                    />
                  </div>
                  <div className="max-w-44 items-start justify-center flex flex-col gap-1.5">
                    <Label htmlFor="email">Duration</Label>
                    <Input
                      type="text"
                      id="duration_time"
                      placeholder="Duration"
                    />
                  </div>
                  your room code is: 123456
                </TabsContent>

                <TabsContent
                  value="student"
                  className="items-center justify-center flex flex-col gap-2"
                >
                  <div className="max-w-44 items-start justify-center flex flex-col gap-1.5">
                    <Label htmlFor="email">Student Name</Label>
                    <Input type="text" id="student_name" placeholder="Name" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <Button
              type="button"
              variant="default"
              size="default"
              onClick={() => {
                setLoggedin({
                  signedIn: "student",
                  name: (
                    document.getElementById("student_name") as HTMLInputElement
                  ).value,
                });

                if (activeTab === "student") {
                  setLoggedin({
                    signedIn: "student",
                    name: (
                      document.getElementById(
                        "student_name"
                      ) as HTMLInputElement
                    ).value,
                  });
                } else if (activeTab === "teacher") {
                  setLoggedin({
                    signedIn: "teacher",
                    name: (
                      document.getElementById(
                        "teacher_name"
                      ) as HTMLInputElement
                    ).value,
                    subject: (
                      document.getElementById(
                        "subject_name"
                      ) as HTMLInputElement
                    ).value,
                    duration: (
                      document.getElementById(
                        "duration_time"
                      ) as HTMLInputElement
                    ).value,
                  });
                }
              }}
            >
              Continue
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
