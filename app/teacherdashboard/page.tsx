"use client";

import React, { FC, useEffect } from "react";
import { useLogin } from "../use-login";

const page: FC = () => {
  const [loggedin, setLoggedin] = useLogin();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (loggedin.signedIn !== "teacher") {
      // redirect to login page
      window.location.href = "/";
      setLoading(false);
      return;
    } else {
      setLoading(false);
      return;
    }
  }, [loggedin]);
  return (
    <>
      {loading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-20 w-20 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="container  flex-col items-center justify-center">
          Hi {loggedin.name}
          Your Subject is {loggedin.subject}
          Subject Duration is {loggedin.duration}
        </div>
      )}
    </>
  );
};

export default page;
