/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";

const Provider = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    user && isNewUser();
  }, [user]);

  const isNewUser = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        imageURL: user?.imageUrl,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Failed to sync user", result);
      return;
    }

    console.log("User", result.user);
  };

  return <div>{children}</div>;
};

export default Provider;
