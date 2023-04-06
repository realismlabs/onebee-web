import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TwitterLogo, LinkedinLogo } from "@phosphor-icons/react";

function Footer() {
  const [currentYear, setCurrentYear] = useState(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="left-0 w-full bg-opacity-50 px-0 md:px-12 py-6 z-40 border-t border-[#FFFFFF10]">
      <nav className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 z-40">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0 text-sm text-slate-10">
            Realism Labs Inc., dba Dataland © {currentYear}
          </div>
          {/* <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {["Privacy Policy", "Terms of Service"].map((text, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-md font-sm rounded-md px-3 py-2 text-slate-10 transition-colors duration-300 ease-in-out hover:text-white"
                    >
                      {text}
                    </a>
                  ))}
                </div>
              </div> */}
          <div className="flex flex-row md:gap-4 gap-2">
            <Link
              href="https://twitter.com/datalandhq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterLogo
                color="#FFFFFF"
                weight={"fill"}
                className="w-5 h-5"
              />
            </Link>
            <Link
              href="https://linkedin.com/company/datalandhq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinLogo
                color="#FFFFFF"
                weight={"fill"}
                className="w-5 h-5"
              />
            </Link>
          </div>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
