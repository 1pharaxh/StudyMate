import Link from "next/link"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
 
import React, { FC } from 'react'

const page:FC = () => {
    return (
        <>
          <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* <Link
              href="/examples/authentication"
              className={""}
            >
              Login
            </Link> */}
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
                    &ldquo;It does not matter where you go and what you study, what matters most is what you share with yourself and the world.&rdquo;
                  </p>
                  <footer className="text-sm">Santosh Kalwars</footer>
                </blockquote>
              </div>
            </div>
            <div className="container relative flex items-center justify-center h-screen">
        <div className="mx-auto flex flex-col items-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">I am a ...</h1>
            <Tabs defaultValue="account" className="w-[600px]">
                <TabsList>
                <TabsTrigger value="teacher">
                  Teacher
                </TabsTrigger>
                <TabsTrigger value="student" >
                  Student
                </TabsTrigger>
                </TabsList>
                <TabsContent value="teacher">Your classroom ID is: 12334.</TabsContent>
            </Tabs>
            </div>
            <button type="button" className="text-white bg-zinc-900 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                <Link href="/" >
                    Continue
                </Link>{" "}
            </button>
            <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
            </Link>
            .
            </p>
        </div>
</div>

          </div>
        </>
      )
}

export default page
