"use client";

import { CircleUser, FileVideo, PanelsTopLeft, ShieldPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNav = () => {
  const path = usePathname();
  console.log(path);

  const MenuOption = [
    {
      id: 2,
      name: "Create New",
      path: "/dashboard/create-new",
      icon: FileVideo,
    },
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: PanelsTopLeft,
    },
    {
      id: 3,
      name: "Upgrade",
      path: "/dashboard/upgrade",
      icon: ShieldPlus,
    },
    {
      id: 4,
      name: "Contact Us",
      path: "/contact",
      icon: CircleUser,
    },
  ];
  return (
    <div className="w-60 h-screen dark:bg-black shadow-md p-5">
      <div className="grid gap-3">
        {MenuOption.map((item, index) => {
          return (
            <Link href={item.path} key={index}>
              <div
                className={`flex gap-3 p-3 items-center hover:bg-primary dark:hover:bg-secondary dark:text-white hover:text-white rounded-md cursor-pointer
                ${
                  path == item.path &&
                  "bg-primary text-white dark:bg-secondary dark:text-white"
                }`}
              >
                <item.icon />
                <h2>{item.name}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideNav;
