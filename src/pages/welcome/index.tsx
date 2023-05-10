import React, { useEffect, useRef } from "react";
import Link from "next/link";
import router from "next/router";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { motion } from "framer-motion";

interface AccountHeaderProps {
  email: string;
}

const handleSubmit = async () => {
  console.log("clicked");
  router.push("/welcome/create-workspace");
};

const AccountHeader: React.FC<AccountHeaderProps> = ({ email }) => {
  const handleLogout = () => {
    router.push("/login?lo=true");
  };

  return (
    <div className="w-full flex flex-row h-16 items-center p-12 z-10">
      <div className="flex flex-col grow items-start">
        <p className="text-[13px] text-slate-11 mb-1">Logged in as:</p>
        <p className="text-[13px] text-slate-12 font-medium">{email}</p>
      </div>
      <div className="flex flex-col grow items-end">
        <p
          className="text-[13px] text-slate-12 hover:text-slate-12 font-medium cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </div>
  );
};

function generateCircles(
  count: number,
  path: string,
  delay_offset?: number,
  duration?: number,
  repeatCount?: string
) {
  if (!delay_offset) {
    delay_offset = 0;
  }
  if (!duration) {
    duration = 2;
  }
  if (!repeatCount) {
    repeatCount = "none";
  }

  let circles = [];
  for (let i = 0; i < count; i++) {
    let opacity = 1 - i / (count - 1); // Decreasing opacity
    let delay = i * 0.007; // Increasing delay

    if (i === 0) {
      circles.push(
        <circle r="0.2" fill="#DBFFFF" className="" opacity={opacity}>
          <animateMotion
            dur={`${duration}s`}
            begin={`${delay_offset + delay}s`}
            repeatCount={repeatCount}
            path={path}
          />
        </circle>
      );
    } else {
      circles.push(
        <circle r="0.15" fill="#DBFFFF" className="" opacity={opacity}>
          <animateMotion
            dur={`${duration}s`}
            begin={`${delay_offset + delay}s`}
            repeatCount={repeatCount}
            path={path}
          />
        </circle>
      );
    }
  }
  return circles;
}

function generateCircleShadows(
  count: number,
  path: string,
  delay_offset?: number,
  duration?: number,
  repeatCount?: string
) {
  if (!delay_offset) {
    delay_offset = 0;
  }

  if (!duration) {
    duration = 2;
  }

  if (!repeatCount) {
    repeatCount = "none";
  }

  let circles = [];
  for (let i = 0; i < count; i++) {
    let opacity = 1 - i / (count - 1); // Decreasing opacity
    let delay = i * 0.05; // Increasing delay

    circles.push(
      <circle
        r="1.0"
        fill="#0085FF"
        className=""
        opacity={opacity}
        style={{
          mixBlendMode: "overlay",
          filter: "blur(1px)",
        }}
      >
        <animateMotion
          dur={`${duration}s`}
          begin={`${delay_offset + delay}s`}
          repeatCount={repeatCount}
          path={path}
          keyTimes="0;1"
          // keySplines="0.25 0.1 0.25 1" // ease-in-out
          keySplines="0 0 0.9 1" // ease-out
        />
      </circle>
    );
  }
  return circles;
}

function circuitPath(path: string) {
  return (
    <path fill="none" stroke="var(--slate3)" strokeWidth={0.2} d={path}>
      <animate
        attributeName="opacity"
        from="1"
        to="0"
        dur="1.0s"
        fill="freeze"
        begin="2s"
      />
    </path>
  );
}
const CometAnimation: React.FC = () => {
  const pathl1 = "M20,100 L20,90 L90,90 L90,80";
  const pathl2 = "M22,100 L22,92 L92,92 L92,80";
  const pathl3 = "M24,100 L24,94 L94,94 L94,80";
  //  construct opposite paths
  const pathr1 = "M180,100 L180,90 L110,90 L110,80";
  const pathr2 = "M178,100 L178,92 L108,92 L108,80";
  const pathr3 = "M176,100 L176,94 L106,94 L106,80";

  const screenborder = "M100,80 L180,80 L180,15 L20,15 L20,80 z";
  const screenborderOpposite = "M100,80 L20,80 L20,15 L180,15 L180,80 z";

  return (
    <div
      className="absolute inset-0 h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "var(--slate-1)",
        zIndex: -1,
        transform: "rotate(180deg)",
      }}
    >
      <div className="min-w-[1400px] h-screen flex justify-end">
        <svg
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="none"
            stroke="var(--slate3)"
            strokeWidth={0.2}
            d={screenborder}
          />
          {generateCircles(12, screenborder, 2, 10, "indefinite")}
          {generateCircleShadows(3, screenborder, 2, 10, "indefinite")}
          {generateCircles(12, screenborderOpposite, 2, 10, "indefinite")}
          {generateCircleShadows(3, screenborderOpposite, 2, 10, "indefinite")}
          {circuitPath(pathl1)}
          {generateCircles(6, pathl1)}
          {generateCircleShadows(3, pathl1)}
          {circuitPath(pathl2)}
          {generateCircles(6, pathl2)}
          {generateCircleShadows(3, pathl2)}
          {circuitPath(pathl3)}
          {generateCircles(6, pathl3)}
          {generateCircleShadows(3, pathl3)}
          {circuitPath(pathr1)}
          {generateCircles(6, pathr1)}
          {generateCircleShadows(3, pathr1)}
          {circuitPath(pathr2)}
          {generateCircles(6, pathr2)}
          {generateCircleShadows(3, pathr2)}
          {circuitPath(pathr3)}
          {generateCircles(6, pathr3)}
          {generateCircleShadows(3, pathr3)}
          <ellipse
            cx="100"
            cy="80"
            rx="75"
            ry="1"
            opacity="0"
            fill="#0085FF"
            style={{
              mixBlendMode: "overlay",
              filter: "blur(4px)",
            }}
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.0s"
              begin="2s"
            />
          </ellipse>
          <ellipse
            cx="100"
            cy="80"
            rx="75"
            ry="0.05"
            opacity="0"
            fill="#DBFFFF"
            style={{
              mixBlendMode: "normal",
            }}
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.0s"
              begin="2s"
            />
          </ellipse>
          {/* const screenborder = "M100,80 L180,80 L180,15 L20,15 L20,80 z"; */}
          <path
            d="M20,80 Q100,70, 180,80 L180,80 L70,80 Z"
            fill="#0085FF"
            opacity="0"
            style={{
              mixBlendMode: "overlay",
              filter: "blur(10px)",
            }}
          >
            <animate
              attributeName="opacity"
              values="0;0.5;0"
              dur="1.0s"
              begin="2s"
            />
          </path>
          <path
            d="M60,80 Q100,70, 140,80 L140,80 L70,80 Z"
            fill="#DBFFFF"
            opacity="0"
            style={{
              mixBlendMode: "overlay",
              filter: "blur(10px)",
            }}
          >
            <animate
              attributeName="opacity"
              values="0;0.5;0"
              dur="1.0s"
              begin="2s"
            />
          </path>
        </svg>
      </div>
    </div>
  );
};

export default function Welcome() {
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  if (isUserLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  return (
    <div className="h-screen bg-slate-1 z-10 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CometAnimation />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
      >
        <AccountHeader email={email ?? "placeholder@example.com"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <div className="text-slate-12 text-center text-[22px] pb-4">
              Welcome to Dataland, Arthur.
            </div>
            <div className="text-slate-11 max-w-md text-center text-lg pb-8">
              Dataland makes it easy for your whole team to browse data from
              your data warehouse.
            </div>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-2 px-4 rounded-md"
              onClick={handleSubmit}
            >
              Get started
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
