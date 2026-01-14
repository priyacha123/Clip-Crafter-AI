'use client'

import { useUser } from "@clerk/nextjs";
import Form from "./_components/form";
import Header from "app/dashboard/_components/Header";
import { BackgroundRippleEffect } from "components/ui/background-ripple-effect";

export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      <Header />
      <BackgroundRippleEffect />
    <div className="font-serif relative z-10 flex flex-col items-center justify-items-center pt-15 gap-10">
      {/* <UserButton /> */}
        <p className="text-3xl sm:text-5xl font-semiBold ">Hello {user?.firstName}, how was your experience! </p>
        <Form />
    </div>
    </>
  );
}
 