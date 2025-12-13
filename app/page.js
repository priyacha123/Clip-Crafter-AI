import { BackgroundRippleEffect } from "components/ui/background-ripple-effect";
import { Button } from "components/ui/button";
import Link from "next/link";

export default function Home() {
  const ButtonOption = [
        {
            id:1,
            name:'Get Started',
            path:'/dashboard/create-new',
        },
        {
            id:2,
            name:'Contact Us',
            path:'/contact',
        },
      ]
  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
      <BackgroundRippleEffect />
      <div className="mt-60 w-full">
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
          Clip Crafter : AI Short Video Generator
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          From text tokens to cinematic frames, AI handles the entire generation
          stack. 
          <br />
          You just hit <strong> &apos;Create&apos; </strong>.
        </p>
        <div className="relative z-10 mt-8 flex items-center justify-center gap-4">
          {ButtonOption.map((item, index) => {
            return (
              <Link href={item.path} key={index}>
              <Button key={index} className="m-4" path={item.path}>
                {item.name}
              </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
