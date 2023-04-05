import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import InsetButton from "../components/InsetButton";
import { Lightning } from "@phosphor-icons/react";
import IconEyebrow from "../components/IconEyebrow";
import React, { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LogoSvgAnimation from "../components/LogoSvgAnimation";

const inter = Inter({ subsets: ["latin"] });

type StatsProps = {
  value: string;
  subtitle: string;
};

function Stats({ value, subtitle }: StatsProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2 max-w-[240px] self-start">
      <h1 className="text-white text-3xl font-medium">{value}</h1>
      <p className="text-slate-11">{subtitle}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`gap-12 ${styles.main}`}>
        <Header />
        <h1
          className="font-regular md:text-[48px] sm:text-[32px] text-[32px] text-white pt-8 "
          style={{
            backgroundImage: 'url("images/hero_text_gradient_mask_v6.svg")',
            backgroundPosition: "bottom",
            WebkitBackgroundClip: "text",
            MozBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            animation: "fadeInFromBottom 0.4s ease-in-out",
            animationDelay: "0.3s",
            animationFillMode: "forwards",
            opacity: 0,
          }}
        >
          The ultimate data browser
        </h1>
        <div>
          <div className={`relative ${styles.perspectiveDiv} z-20`}>
            {/* Hero */}
            <div className={`px-2 py-2 ${styles.heroImageContainerOuter}`}>
              <div className={`px-2 py-2 ${styles.heroImageContainer}`}>
                <Image
                  className="relative z-20 m-auto pointer-events-none select-none"
                  src="/images/dataland_hero.svg"
                  alt="Hero Image"
                  draggable="false"
                  width="1053"
                  height="513"
                />
              </div>
              <div
                className={`absolute z-20 text-white ${styles.rayOfLightTop}`}
              ></div>
              <div
                className={`absolute z-20 text-white ${styles.rayOfLightBottom}`}
              ></div>
            </div>
          </div>
          <div
            className={`absolute pt-[600px] inset-0 z-30 m-auto w-full text-center text-white ${styles.heroTextContainer}`}
          >
            <h2>
              We loaded every HN post and comment,
              <span className="text-[#c07cff]">1.6 billion rows,</span> into
              this table.
            </h2>
            <h2>
              Try running search for &quot;rust&quot; or your HN username.
            </h2>

            <div className="mt-4">
              <div
                className="inline-block bg-[#4315F3] rounded-full"
                style={{
                  padding: "1px",
                  background: "linear-gradient(to right, #8160FF, #4315F3)",
                  animation: "rotate 3s linear infinite",
                  backgroundSize: "400% 400%",
                }}
              >
                <button
                  className={`bg-[#4315F3] py-2 px-6 w-auto rounded-full hover:bg-[#3A16C7] hover:transition-all`}
                >
                  Launch playground
                  {/* <div
                  className={`h-[40px] opacity-25 absolute w-12 ${styles.playgroundButtonShine}`}
                ></div> */}
                </button>
              </div>
            </div>
          </div>
          <div
            className={`absolute inset-0 pointer-events-none select-none pt-[640px] z-10 w-[2700px] bg-transparent`}
            style={{
              left: "50%",
              transform: "translate(-50%, -12%)",
              animation: "fadeIn 0.4s ease-in-out",
              animationDelay: "1.8s",
              animationFillMode: "forwards",
              opacity: 0,
            }}
          >
            <Image
              src="/images/gridlines_masked.svg"
              alt="Gridlines"
              draggable="false"
              width="3000"
              height="600"
            />
          </div>
        </div>
        <div
          className="max-w-lg text-white z-20 flex flex-col gap-4 py-12"
          style={{
            animation: "fadeInFromBottom 0.4s ease-in-out",
            animationDelay: "2.4s",
            animationFillMode: "forwards",
            opacity: 0,
          }}
        >
          <h2 className="text-xl">
            Dataland is a new kind of data browser that delivers a seamless user
            experience, regardless of data scale.{" "}
          </h2>
          <p className="text-slate-11">
            Dataland lets your internal teams access the data in your data
            warehouse using a familiar spreadsheet-like UI that works the same
            way across 10 rows or 10,000,000,000 rows.{" "}
          </p>
          <p className="text-slate-11">
            Billion row tables load instantly, straight from your web browser.
            Gone are the days of waiting for loading spinners, clicking through
            50 rows per page, and being limited by pre-defined query patterns.
          </p>
          <div className="flex flex-row gap-4 pt-4 items-center">
            <InsetButton
              bgColor={`#4315F3`}
              href={`https://google.com`}
              text={`Get started`}
              target={`_blank`}
              highlightValue={"0.4"}
            />
            <p className="text-white"> $5 per GB-month • Unlimited users</p>
          </div>
        </div>
        <div className="w-[1100px] space-y-36">
          <div className="text-white flex flex-row gap-12">
            <Image
              className="relative z-20 m-auto pointer-events-none select-none"
              src="/images/logos/logo_wyndly.svg"
              alt="Wyndly"
              draggable="false"
              width="120"
              height="120"
            />
            <Image
              className="relative z-20 m-auto pointer-events-none select-none"
              src="/images/logos/logo_gorgias.svg"
              alt="Gorgias"
              draggable="false"
              width="120"
              height="120"
            />
            <Image
              className="relative z-20 m-auto pointer-events-none select-none"
              src="/images/logos/logo_wyndly.svg"
              alt="Wyndly"
              draggable="false"
              width="120"
              height="120"
            />
            <Image
              className="relative z-20 m-auto pointer-events-none select-none"
              src="/images/logos/logo_gorgias.svg"
              alt="Gorgias"
              draggable="false"
              width="120"
              height="120"
            />
          </div>
          <div className=" text-white z-20 flex flex-row gap-16 items-center">
            <Image
              className="relative z-20 m-auto pointer-events-none select-none w-2/3"
              src="/images/performance_diagram.svg"
              alt="Hero Image"
              draggable="false"
              width="1053"
              height="513"
            />
            <div className="flex flex-col gap-4">
              <IconEyebrow
                icon={<Lightning color="#E5C3F0" />}
                text="Performance"
              />
              <h2 className="text-xl">
                Leveraging WebGL, WASM, and Rust for ultra-high performance
              </h2>
              <p className="text-slate-11">
                The data source API handles automatic caching from selected
                datasets in your data warehouse.
              </p>
              <p className="text-slate-11">
                The indexing and caching layer is optimized for data loading and
                full-text search.
              </p>
              <p className="text-slate-11">
                The UI works with the caching layer to seamlessly translate user
                action (scrolling, searching, etc.) to give instant results on
                the front-end.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-12 justify-evenly">
            <Stats value="<1s" subtitle="Load time for 1 billion rows" />
            <Stats value="0.1s" subtitle="table load times" />
            <Stats
              value="133x faster"
              subtitle="for searches compared to Retool querying directly from Snowflake"
            />
            <Stats
              value="98x cheaper"
              subtitle="for searches compared to querying directly from Snowflake"
            />
          </div>
          <div className="flex flex-col gap-12 py-16 border-t border-b border-[#FFFFFF10] items-center">
            <div className="flex flex-row text-white items-center gap-24">
              <h1 className="text-3xl w-[240px]">
                Full-text search that just works
              </h1>
              <p className="text-md max-w-xl text-slate-11">
                Just ⌘F to launch a case insensitive, substring search that
                returns results instantly. Instantly jump to the next search
                result a million rows away.
              </p>
            </div>
            <div>
              <Image
                className="relative pointer-events-none select-none"
                src="/images/product_search.svg"
                alt="Product Screenshot - Search"
                draggable="false"
                width="1000"
                height="378"
              />
            </div>
          </div>
          <div className="flex flex-col gap-12 items-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-3xl text-white">Rich cell types</h1>
              <div className="space-y-0 text-slate-11">
                <p className="text-md max-w-xl">
                  Rich cell types help users understand data, faster.
                </p>
                <p>
                  We auto-assign the right cell type based on column contents.
                </p>
              </div>
            </div>
            <div>
              <Image
                className="relative pointer-events-none select-none"
                src="/images/product_rich_cells.svg"
                alt="Product Screenshot - Rich Cell Types"
                draggable="false"
                width="1100"
                height="489"
              />
            </div>

            <Image
              className="absolute pointer-events-none select-none"
              src="/images/gradient_highlight.svg"
              alt="Gradient highlight"
              draggable="false"
              width="1555"
              height="600"
              style={{
                mixBlendMode: "overlay",
                transform: "translateY(-200px)",
              }}
            />

            <Image
              className="absolute pointer-events-none select-none"
              src="/images/gradient_highlight.svg"
              alt="Product Screenshot - Rich Cell Types"
              draggable="false"
              width="1555"
              height="600"
              style={{
                mixBlendMode: "normal",
                transform: "translateY(-200px)",
                opacity: 0.2,
              }}
            />
          </div>
          <div className="flex flex-row justify-evenly">
            <Image
              className="absolute pointer-events-none select-none z-10"
              src="/images/gradient_highlight.svg"
              alt="Product Screenshot - Rich Cell Types"
              draggable="false"
              width="1555"
              height="600"
              style={{
                mixBlendMode: "overlay",
                opacity: 1.0,
                transform: "translateY(-200px)",
              }}
            />
            <Image
              className="absolute pointer-events-none select-none z-10"
              src="/images/gradient_highlight.svg"
              alt="Product Screenshot - Rich Cell Types"
              draggable="false"
              width="1555"
              height="600"
              style={{
                mixBlendMode: "normal",
                opacity: 0.3,
                transform: "translateY(-200px)",
              }}
            />
            <div className="flex flex-col gap-12">
              <Image
                className="relative pointer-events-none select-none"
                src="/images/feature_sync_data.svg"
                alt="Product Screenshot - Sync Data"
                draggable="false"
                width="402"
                height="310"
              />
              <div className="flex flex-col gap-4 max-w-md">
                <h1 className="text-2xl text-white">
                  Syncs from your data warehouse
                </h1>
                <p className="space-y-1 text-slate-11">
                  Connect your Postgres, BigQuery, or Snowflake to Dataland. The
                  Dataland UI updates in realtime.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-12">
              <Image
                className="relative pointer-events-none select-none"
                src="/images/feature_security_compliance.svg"
                alt="Product Screenshot - Security and Compliance"
                draggable="false"
                width="402"
                height="310"
              />
              <div className="flex flex-col gap-4 max-w-md">
                <h1 className="text-2xl text-white">
                  Enterprise-grade security
                </h1>
                <p className="space-y-1 text-slate-11">
                  Dataland is SOC 2 Type 2 compliant, as well as HIPAA and GDPR
                  certified in partnership with Vanta.
                </p>
              </div>
            </div>
          </div>
          <div className="px-12 flex flex-row gap-4 py-24">
            <div className="flex flex-col gap-4 py-12">
              <IconEyebrow
                icon={<Lightning color="#E5C3F0" />}
                text="Productivity"
              />
              <h1 className="text-3xl text-white">Row navigation</h1>
              <div className="space-y-4 text-slate-11">
                <p className="text-md max-w-xl">
                  Dataland makes it easy to introspect rows in wide tables. Just
                  double-click on a row to summon an object view.
                </p>
                <p>Access other object views from other tables via the dock.</p>
              </div>
            </div>
            <Image
              src="/images/feature_object_views.png"
              alt="Feature - Object Views"
              draggable="false"
              width="690"
              height="528"
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="z-10 flex flex-col pb-96 items-center space-y-6">
              <h1 className="text-[48px] leading-tight text-white">
                The ultimate <br></br>data browser
              </h1>
              <div className="flex flex-row gap-4 items-center">
                <InsetButton
                  bgColor={`#4315F3`}
                  href={`https://google.com`}
                  text={`Get started`}
                  target={`_blank`}
                  highlightValue={"0.4"}
                />
              </div>
            </div>
            <LogoSvgAnimation />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
