import React, { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import router from "next/router";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { motion } from "framer-motion";
import { HandWaving } from "@phosphor-icons/react";
import { capitalizeString } from "@/utils/util";
import { AccountHeader } from "@/components/AccountHeader";
import { v4 as uuidv4 } from "uuid";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getInvitesForUserEmail,
  getWorkspaceDetails,
  getAllowedWorkspacesForUser,
} from "@/utils/api";
import { useAuth } from "@clerk/nextjs";
import Head from "next/head";

const handleSubmit = async (total_available_workspaces: number) => {
  console.log("clicked");
  // if there are any available invites / workspaces, redirect to join-workspace
  if (total_available_workspaces > 0) {
    router.push("/join-workspace");
  } else {
    router.push("/welcome/create-workspace");
  }
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
        <circle
          r="0.2"
          fill="#DBFFFF"
          className=""
          opacity={opacity}
          key={uuidv4()}
        >
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
            key={uuidv4()}
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
        key={uuidv4()}
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

function generateRowLines(
  start: any,
  end: number,
  interval: number,
  startX: any,
  endX: any,
  stroke: string | undefined,
  strokeWidth: string | number | undefined
) {
  const paths = [];
  for (let i = start; i >= end; i -= interval) {
    paths.push(
      <path
        key={uuidv4()}
        d={`M${startX},${i} ${endX},${i}`}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }
  return paths;
}

function circuitPath(path: string) {
  return (
    <path
      fill="none"
      stroke="var(--slate3)"
      strokeWidth={0.2}
      d={path}
      key={uuidv4()}
    >
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
  const circuitRoundness1 = 1; // Adjust this value to change the roundness of corners
  const circuitRoundness2 = 1.2; // Adjust this value to change the roundness of corners
  const circuitRoundness3 = 1.4; // Adjust this value to change the roundness of corners

  const pathl1 = `M20,${100 - circuitRoundness1}
    Q20,90 ${20 + circuitRoundness1},90
    L${90 - circuitRoundness1},90
    Q90,90 90,${90 - circuitRoundness1} L90,80`;

  const pathl2 = `M22,${100 - circuitRoundness2}
    Q22,92 ${22 + circuitRoundness2},92
    L${92 - circuitRoundness2},92
    Q92,92 92,${92 - circuitRoundness2} L92,80`;

  const pathl3 = `M24,${100 - circuitRoundness3}
    Q24,94 ${24 + circuitRoundness3},94
    L${94 - circuitRoundness3},94
    Q94,94 94,${94 - circuitRoundness3} L94,80`;

  const pathr1 = `M${180 - circuitRoundness1},100
    Q180,90 ${180 - circuitRoundness1},90
    L${110 + circuitRoundness1},90
    Q110,90 110,${90 - circuitRoundness1} L110,80`;

  const pathr2 = `M${178 - circuitRoundness2},100
    Q178,92 ${178 - circuitRoundness2},92
    L${108 + circuitRoundness2},92
    Q108,92 108,${92 - circuitRoundness2} L108,80`;

  const pathr3 = `M${176 - circuitRoundness3},100
    Q176,94 ${176 - circuitRoundness3},94
    L${106 + circuitRoundness3},94
    Q106,94 106,${94 - circuitRoundness3} L106,80`;

  // const screenborder = "M100,80 L180,80 L180,15 L20,15 L20,80 z";
  // const screenborderOpposite = "M100,80 L20,80 L20,15 L180,15 L180,80 z";
  const roundness = 2; // Adjust this value to change the roundness of corners

  const screenborder = `
  M${20 + roundness},80 
  A${roundness},${roundness} 0 0 1 ${20}, ${80 - roundness}
  L${20},${20 + roundness}
  A${roundness},${roundness} 0 0 1 ${20 + roundness}, 20
  L${180 - roundness},20
  A${roundness},${roundness} 0 0 1 180, ${20 + roundness}
  L180,${80 - roundness}
  A${roundness},${roundness} 0 0 1 ${180 - roundness}, 80
  Z`;

  const screenborderOpposite = `
  M${200 - (20 + roundness)},80 
  A${roundness},${roundness} 0 0 0 ${200 - 20}, ${80 - roundness}
  L${200 - 20},${20 + roundness}
  A${roundness},${roundness} 0 0 0 ${200 - (20 + roundness)}, 20
  L${200 - (180 - roundness)},20
  A${roundness},${roundness} 0 0 0 ${200 - 180}, ${20 + roundness}
  L${200 - 180},${80 - roundness}
  A${roundness},${roundness} 0 0 0 ${200 - (180 - roundness)}, 80
  Z`;

  // useMemo to memoize the SVG elements and avoid unnecessary re-renders.
  const generatedCircles = React.useMemo(
    () => generateCircles(10, screenborder, 2, 10, "indefinite"),
    [screenborder]
  );
  const generatedCircleShadows = React.useMemo(
    () => generateCircleShadows(3, screenborder, 2, 10, "indefinite"),
    [screenborder]
  );
  const generatedCirclesOpposite = React.useMemo(
    () => generateCircles(10, screenborderOpposite, 2, 10, "indefinite"),
    [screenborderOpposite]
  );
  const generatedCircleShadowsOpposite = React.useMemo(
    () => generateCircleShadows(3, screenborderOpposite, 2, 10, "indefinite"),
    [screenborderOpposite]
  );

  // Similarly memoize for other paths
  const circuitPathl1 = React.useMemo(() => circuitPath(pathl1), [pathl1]);
  const generatedCirclesl1 = React.useMemo(
    () => generateCircles(6, pathl1),
    [pathl1]
  );
  const generatedCircleShadowsl1 = React.useMemo(
    () => generateCircleShadows(3, pathl1),
    [pathl1]
  );

  const circuitPathl2 = React.useMemo(() => circuitPath(pathl2), [pathl2]);
  const generatedCirclesl2 = React.useMemo(
    () => generateCircles(6, pathl2),
    [pathl2]
  );
  const generatedCircleShadowsl2 = React.useMemo(
    () => generateCircleShadows(3, pathl2),
    [pathl2]
  );

  const circuitPathl3 = React.useMemo(() => circuitPath(pathl3), [pathl3]);
  const generatedCirclesl3 = React.useMemo(
    () => generateCircles(6, pathl3),
    [pathl3]
  );
  const generatedCircleShadowsl3 = React.useMemo(
    () => generateCircleShadows(3, pathl3),
    [pathl3]
  );

  const circuitPathr1 = React.useMemo(() => circuitPath(pathr1), [pathr1]);
  const generatedCirclesr1 = React.useMemo(
    () => generateCircles(6, pathr1),
    [pathr1]
  );
  const generatedCircleShadowsr1 = React.useMemo(
    () => generateCircleShadows(3, pathr1),
    [pathr1]
  );

  const circuitPathr2 = React.useMemo(() => circuitPath(pathr2), [pathr2]);
  const generatedCirclesr2 = React.useMemo(
    () => generateCircles(6, pathr2),
    [pathr2]
  );
  const generatedCircleShadowsr2 = React.useMemo(
    () => generateCircleShadows(3, pathr2),
    [pathr2]
  );

  const circuitPathr3 = React.useMemo(() => circuitPath(pathr3), [pathr3]);
  const generatedCirclesr3 = React.useMemo(
    () => generateCircles(6, pathr3),
    [pathr3]
  );
  const generatedCircleShadowsr3 = React.useMemo(
    () => generateCircleShadows(3, pathr3),
    [pathr3]
  );

  return (
    <div
      className="absolute inset-0 h-screen flex items-center justify-center overflow-hidden pointer-events-none"
      style={{
        background: "var(--slate-1)",
        zIndex: -1,
        transform: "rotate(180deg)",
      }}
    >
      <div className="min-w-[1400px] h-screen flex justify-end pointer-events-none">
        <svg
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g className="animate-pulse">
            <path
              d={screenborder}
              opacity="0"
              stroke="#DBFFFF"
              strokeWidth="0.2"
              style={{
                filter: "blur(0.2px)",
                mixBlendMode: "overlay",
              }}
            >
              <animate
                attributeName="opacity"
                values="0;1"
                dur="0.5s"
                begin="2.3s"
                fill="freeze"
              />
            </path>
            {/* Screen glow */}
            <path
              d={screenborder}
              stroke="#0085FF"
              opacity="0"
              strokeWidth="1.0"
              style={{
                filter: "blur(1px)",
                mixBlendMode: "overlay",
              }}
            >
              <animate
                attributeName="opacity"
                values="0;1"
                dur="0.5s"
                begin="2.3s"
                fill="freeze"
              />
            </path>
          </g>
          <g>
            {/* Screen */}
            <path
              d={screenborder}
              fill="var(--slate1)"
              // fill="#0A0B0C"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1"
                dur="0.5s"
                begin="2.3s"
                fill="freeze"
              />
            </path>
          </g>

          <g
            style={{
              // fade in after 2.3 seconds
              opacity: 0,
              animation: "fadeIn 0.5s 2.3s forwards",
            }}
          >
            <path d="M20,76 180,76" stroke="var(--slate4)" strokeWidth="0.1" />
            <path d="M160,76 160,20" stroke="var(--slate4)" strokeWidth="0.1" />
            <circle cx="178" cy="78" r="0.6" fill="var(--slate4)" />
            <circle cx="176" cy="78" r="0.6" fill="var(--slate4)" />
            <circle cx="174" cy="78" r="0.6" fill="var(--slate4)" />
            {/* table row lines */}
            {generateRowLines(73, 22, 2.5, 20, 160, "var(--slate4)", "0.1")}

            {/* table column lines */}
            <path d="M140,76 140,20" stroke="var(--slate4)" strokeWidth="0.1" />
            <path d="M120,76 120,20" stroke="var(--slate4)" strokeWidth="0.1" />
            <path d="M100,76 100,20" stroke="var(--slate4)" strokeWidth="0.1" />
            <path d="M80,76 80,20" stroke="var(--slate4)" strokeWidth="0.1" />
            <path d="M60,76 60,20" stroke="var(--slate4)" strokeWidth="0.1" />
            <path d="M40,76 40,20" stroke="var(--slate4)" strokeWidth="0.1" />
            <path d="M20,76 20,20" stroke="var(--slate4)" strokeWidth="0.1" />
          </g>
          {/* <path d={screenborder} fill="url(#image)" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.5s"
              begin="2.3s"
              fill="freeze"
            />
          </path>
          <defs>
            <pattern
              id="image"
              patternUnits="userSpaceOnUse"
              width="200"
              height="100"
            >
              <image
                href="/images/table-dark.png"
                x="0"
                y="0"
                width="200"
                height="100"
              />
            </pattern>
          </defs> */}

          <path
            fill="none"
            stroke="var(--slate3)"
            strokeWidth={0.2}
            d={screenborder}
          />

          {/* Rotating circles around the screen
          <g>
            {generatedCircles}
            {generatedCircleShadows}
            {generatedCirclesOpposite}
            {generatedCircleShadowsOpposite}
          </g> */}

          {/* Initial circuits */}
          <g>
            {circuitPathl1}
            {generatedCirclesl1}
            {generatedCircleShadowsl1}
            {circuitPathl2}
            {generatedCirclesl2}
            {generatedCircleShadowsl2}
            {circuitPathl3}
            {generatedCirclesl3}
            {generatedCircleShadowsl3}
            {circuitPathr1}
            {generatedCirclesr1}
            {generatedCircleShadowsr1}
            {circuitPathr2}
            {generatedCirclesr2}
            {generatedCircleShadowsr2}
            {circuitPathr3}
            {generatedCirclesr3}
            {generatedCircleShadowsr3}
          </g>

          {/* Glow when circuits hit screen */}
          <g>
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
                mixBlendMode: "overlay",
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
                mixBlendMode: "overlay",
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
          </g>
        </svg>
      </div>
    </div>
  );
};

export default function Welcome() {
  const { getToken } = useAuth();

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  const {
    data: invites,
    isLoading: isInvitesLoading,
    error: invitesError,
  } = useQuery({
    queryKey: ["invites", currentUser?.email],
    enabled: !!currentUser?.email,
    queryFn: async () => {
      const jwt = await getToken({ template: "test" });
      const result = await getInvitesForUserEmail(currentUser.email, jwt);
      return result;
    },
    staleTime: 1000, // 1 second
  });

  const workspaceIds = invites
    ? Array.from(new Set(invites.map((invite: any) => invite.workspaceId)))
    : [];

  // Fetch workspace details for each workspaceId
  const workspacesQuery = useQueries({
    queries: workspaceIds.map((id) => ({
      queryKey: ["workspace", id],
      queryFn: async () => {
        const response = await getWorkspaceDetails(id);
        return response;
      },
    })),
  });

  const {
    data: allowedWorkspacesForUser,
    isLoading: isAllowedWorkspacesForUserLoading,
    error: allowedWorkspacesForUserError,
  } = useQuery({
    queryKey: ["getAllowedWorkspacesForUser", currentUser?.id],
    queryFn: async () => {
      const jwt = await getToken({ template: "test" });
      const result = await getAllowedWorkspacesForUser(currentUser?.id, jwt);
      return result;
    },
    enabled: !!currentUser?.id,
  });

  if (isUserLoading || isInvitesLoading || isAllowedWorkspacesForUserLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError || invitesError || allowedWorkspacesForUserError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser?.email;

  const total_available_workspaces =
    (allowedWorkspacesForUser?.length ?? 0) + (invites?.length ?? 0);

  console.log("total_available_workspaces", total_available_workspaces);

  //  for animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 2.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>Dataland | Welcome</title>
      </Head>
      <div className="h-screen bg-slate-1 z-10 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="z-50"
        >
          <AccountHeader email={email ?? "placeholder@example.com"} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="z-0 pointer-events-none"
        >
          <CometAnimation />
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          transition={{ duration: 1, delay: 2.2 }}
        >
          <div className="absolute inset-0 flex flex-col justify-start items-center h-screen pointer-events-none">
            <div className="flex flex-col justify-center items-center mt-[30vh]">
              <motion.div
                className="bg-slate-2 border border-slate-4 p-4 rounded-lg"
                variants={item}
              >
                <HandWaving
                  size={48}
                  className="text-slate-12"
                  weight="duotone"
                />
              </motion.div>
              <motion.div
                className="text-slate-12 text-center text-[22px] mt-12 pb-4"
                variants={item}
              >
                Welcome to Dataland,{" "}
                {capitalizeString(email?.split("@")[0]) ?? "friend"}!
              </motion.div>
              <motion.div
                className="text-slate-11 max-w-md text-center text-lg pb-8"
                variants={item}
              >
                Dataland makes it easy for your whole team to browse data from
                your data warehouse.
              </motion.div>
              <motion.button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-slate-12 text-[16px] font-medium py-2 px-4 rounded-md pointer-events-auto"
                onClick={() => handleSubmit(total_available_workspaces)}
                variants={item}
              >
                Get started
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
