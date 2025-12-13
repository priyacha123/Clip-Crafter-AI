import Image from "next/image";
import React from "react";
import logo from "../../../public/logo.jpg";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../../../components/ui/button";
import { ModeToggle } from "components/ui/mode-toggle";
const Header = () => {
  return (
    <div className="p-3 px-5 flex items-center justify-between shadow-md dark:bg-zinc-900 dark:shadow-gray-800 ">
      <div className="flex gap-3 items-center">
        <Image src={logo} alt="logo" width={50} height={50} />
        <h2 className="font-bold text-xl">Clip Crafter</h2>
      </div>
      <div className="flex gap-3 items-center">
        {/* <Button className="p-2 " size={10} variant="secondary">
          Dashboard
        </Button> */}
        <SignedOut>
          <SignInButton>
             <button className="relative flex items-center justify-center gap-4 dark:bg-secondary bg-primary text-white rounded-full font-medium text-sm sm:text-base h-10 px-4 cursor-pointer">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="relative flex items-center justify-center gap-4 dark:bg-secondary bg-primary text-white rounded-full font-medium text-sm sm:text-base h-10 px-4 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
