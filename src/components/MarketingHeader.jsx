import React, { useState, useEffect } from 'react';
import InsetButton from "./InsetButton";
import Image from "next/image";
import Link from "next/link";
// get useAuthUser from context
import { useAuth } from "@clerk/nextjs";

function Header() {
  const [divHeight, setDivHeight] = useState(80);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const scaleFactor = 1 - scrollPosition / (windowHeight * 0.9);
      const newHeight = Math.max(60, Math.min(80, scaleFactor * windowHeight));
      setDivHeight(newHeight);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (

    <header
      className="fixed left-0 top-0 w-full bg-opacity-50 md:px-12 flex flex-row items-center z-40 border-b border-[#FFFFFF10]"
      style={{
        backgroundColor: "rgb(4, 10, 25, 1)",
        height: `${divHeight}px`
      }}
    >
      <nav className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 z-40 flex-grow">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-grow">
            <Link href="/">
              <Image
                width="112"
                height="29"
                src="/images/logo_darker_v2.svg"
                alt="Logo"
              />
            </Link>
          </div>
          <div className="hidden md:block flex-grow">
            <div className="ml-10 flex items-baseline space-x-4">
              {["Company", "Pricing", "Blog", "Use Cases"].map(
                (text, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-md font-sm rounded-md px-3 py-2 text-slate-10 transition-colors duration-300 ease-in-out hover:text-slate-12"
                  >
                    {text}
                  </a>
                )
              )}
            </div>
          </div>
          {isSignedIn ? (
            <InsetButton
              bgColor={`#4315F3`}
              href={`/dashboard`}
              text={`Dashboard →`}
              highlightValue={"0.4"}
              target={`_self`}
            />
          ) : (
            <div>
              <InsetButton
                bgColor={`var(--slate1)`}
                href={`/signup`}
                text={`Sign up`}
                highlightValue={"0.2"}
                target={`_self`}
              />
            </div>
          )}
        </div>
      </nav>
    </header>

  );
}

export default Header;
