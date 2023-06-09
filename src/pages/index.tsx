import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import InsetButton from "../components/InsetButton";
import { Lightning } from "@phosphor-icons/react";
import IconEyebrow from "../components/IconEyebrow";
import React, { useState } from "react";
import Link from "next/link";
import MarketingFooter from "../components/MarketingFooter";
import MarketingHeader from "../components/MarketingHeader";
import LogoSvgAnimation from "../components/LogoSvgAnimation";
import HeroText from "../components/HeroText";
import Carousel from "../components/Carousel";

type StatsProps = {
  value: string;
  subtitle: string;
};

function Stats({ value, subtitle }: StatsProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2 max-w-[240px] self-start">
      <h1 className="text-slate-12 text-2xl lg:text-3xl font-medium">
        {value}
      </h1>
      <p className="text-slate-11 md:text-md text-sm">{subtitle}</p>
    </div>
  );
}

export default function Home() {
  const [heroType, setHeroType] = useState("hero_4");

  return (
    <>
      <main
        className={`gap-6 md:gap-6 lg:gap-12 ${styles.main} sm:px-12 px-4 overflow-hidden`}
      >
        {/* Add an input that changes the value of heroType */}

        <MarketingHeader />
        {/* This option is the header + two-line subheader with DWH logos */}
        <div className="fixed z-50 sm:top-1 sm:right-1 bottom-0 bg-black sm:bg-transparent px-2 py-2 rounded-full sm:py-0 sm:px-0 sm:w-auto">
          <div className="flex flex-row items-center">
            <div className="bg-orange-900/30 text-orange-600 px-2 py-1 mr-2 rounded-full text-[10px]">
              Mockup
            </div>
            <select
              title="Hero Type"
              id="Hero Type"
              className="text-slate-12 border-none text-[10px] p-0 h-auto bg-transparent"
              onChange={(event) => {
                setHeroType(event.target.value);
              }}
            >
              <option value="">Select a hero type</option>
              {heroType === "headline_logos" ? (
                <option value="headline_logos" selected>
                  Hero 1
                </option>
              ) : (
                <option value="headline_logos">Hero 1</option>
              )}
              {heroType === "hero_headline_subheader" ? (
                <option value="hero_headline_subheader" selected>
                  Hero 2
                </option>
              ) : (
                <option value="hero_headline_subheader">Hero 2</option>
              )}
              {heroType === "hero_3" ? (
                <option value="hero_3" selected>
                  Hero 3
                </option>
              ) : (
                <option value="hero_3">Hero 3</option>
              )}
              {heroType === "hero_4" ? (
                <option value="hero_4" selected>
                  Hero 4
                </option>
              ) : (
                <option value="hero_4">Hero 4</option>
              )}
              {heroType === "hero_5" ? (
                <option value="hero_5" selected>
                  Hero 5
                </option>
              ) : (
                <option value="hero_5">Hero 5</option>
              )}
            </select>
          </div>
        </div>

        <HeroText type={heroType} />
        <div id="Hero Image Content">
          <div className={`relative ${styles.perspectiveDiv} z-20 lg:pb-20`}>
            <div className={`px-2 py-2 ${styles.heroImageContainerOuter}`}>
              <div className={`px-2 py-2 ${styles.heroImageContainer}`}>
                {/* <Image
                  className="relative z-20 m-auto pointer-events-none select-none"
                  src="/images/dataland_hero.svg"
                  alt="Hero Image"
                  draggable="false"
                  width="1053"
                  height="513"
                  priority={true}
                /> */}
                <div
                  className={`
                  absolute
                  z-60
                  inset-1.5
                  rounded-lg
                  `}
                  style={{
                    background:
                      "linear-gradient(to top, rgba(4,10,25,1.0), transparent)",
                  }}
                ></div>
                <div className="max-w-[1100px]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/images/hero_video_poster.svg"
                    src="videos/hero_video_2.mp4"
                  ></video>
                </div>
              </div>
              <div
                className={`
                  absolute 
                  z-20 
                  text-slate-12 
                  ${styles.rayOfLightTop}
                  `}
              ></div>
              <div
                className={`
                absolute 
                z-20 
                text-slate-12 
                ${styles.rayOfLightBottomLg}
                `}
              ></div>
              <div
                className={`
                  absolute
                  w-full
                  z-50 
                  text-center
                  lg:mt-[260px]
                  mt-[100px]
                  text-slate-12 ${styles.heroTextContainer}`}
              >
                <div
                  className="inline-block bg-[#4315F3] rounded-full z-50"
                  style={{
                    padding: "1px",
                    background: "linear-gradient(to right, #8160FF, #4315F3)",
                    animation: "rotate 3s linear infinite",
                    backgroundSize: "400% 400%",
                  }}
                >
                  <Link href="/sandbox">
                    <button
                      className={`bg-[#4315F3] py-2 px-6 w-auto rounded-full hover:bg-[#3A16C7] hover:transition-all`}
                    >
                      Launch playground
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="md:absolute md:inset-0 md:w-full md:h-auto h-0">
            <div
              className={`block pointer-events-none select-none lg:inset-0 lg:pt-[760px] z-10 lg:absolute lg:w-[2700px] bg-transparent`}
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
        </div>
        <div
          id="Sections"
          className="w-full px-2 lg:px-0 lg:w-[1100px] sm:space-y-36 space-y-16"
        >
          <div
            id="Logos"
            className="text-slate-12 flex sm:flex-row sm:gap-12 gap-4 opacity-40"
          >
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
              className="relative z-20 m-auto pointer-events-none select-none hidden sm:block"
              src="/images/logos/logo_wyndly.svg"
              alt="Wyndly"
              draggable="false"
              width="120"
              height="120"
            />
            <Image
              className="relative z-20 m-auto pointer-events-none select-none hidden sm:block"
              src="/images/logos/logo_gorgias.svg"
              alt="Gorgias"
              draggable="false"
              width="120"
              height="120"
            />
          </div>
          <div
            id="Question Carousel"
            className="flex sm:flex-row flex-col w-full gap-12 lg:px-24 items-center"
          >
            <div className="text-slate-12 sm:text-2xl text-xl flex flex-col gap-4 max-w-xs sm:max-w-full">
              <h1>Your team performs database lookups all the time.</h1>
              <h1 className="text-[#a474ff]">
                Why waste time building <br></br>slow, one-off tools for them?
              </h1>
            </div>
            <Carousel />
          </div>
          <div
            id="Rich cell types"
            className="flex flex-col gap-12 items-center"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-2xl lg:text-3xl text-slate-12">
                Rich cell types
              </h1>
              <div className="space-y-0 text-slate-11">
                <p className="text-md max-w-xl">
                  Rich cell types help users understand data, faster.{" "}
                  <br className="hidden lg:block"></br>We auto-assign the right
                  cell type based on column contents.
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
              className="absolute pointer-events-none select-none translate-y-6 lg:translate-y-[-200px]"
              src="/images/gradient_highlight.svg"
              alt="Product Screenshot - Rich Cell Types"
              draggable="false"
              width="1555"
              height="600"
              style={{
                mixBlendMode: "normal",
                opacity: 0.5,
              }}
            />
          </div>
          <div
            id="Search"
            className="flex flex-col gap-12 py-16 border-t border-b border-[#FFFFFF10] items-center"
          >
            <div className="flex flex-col text-center lg:text-start lg:flex-row text-slate-12 items-center gap-6 lg:gap-24">
              <h1 className="text-2xl lg:text-3xl lg:w-[240px]">
                Full-text search <br className="hidden lg:block "></br>
                that just works
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
          <div className="grid grid-cols-2 lg:flex lg:flex-row gap-12 justify-evenly pb-16 md:pb-0 border-b md:border-0  border-[#FFFFFF10]">
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
          <div
            id="Data sync and security"
            className="flex md:flex-row flex-col justify-evenly gap-24"
          >
            <Image
              className="hidden md:absolute pointer-events-none select-none z-10"
              src="/images/gradient_highlight.svg"
              alt="Product Screenshot - Rich Cell Types"
              draggable="false"
              width="1555"
              height="600"
              style={{
                mixBlendMode: "normal",
                opacity: 1.0,
                transform: "translateY(-200px)",
              }}
            />
            <Image
              className="hidden md:file:absolute pointer-events-none select-none z-10"
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
                className="relative pointer-events-none select-none w-72 md:w-auto order-2 md:order-1"
                src="/images/feature_sync_data.svg"
                alt="Product Screenshot - Sync Data"
                draggable="false"
                width="402"
                height="310"
              />
              <div className="flex flex-col gap-4 max-w-md order-1 md:order-2">
                <h1 className="text-xl lg:text-2xl text-slate-12">
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
                className="relative pointer-events-none select-none w-72 md:w-auto order-2 md:order-1"
                src="/images/feature_security_compliance.svg"
                alt="Product Screenshot - Security and Compliance"
                draggable="false"
                width="402"
                height="310"
              />
              <div className="flex flex-col gap-4 max-w-md order-1 md:order-2">
                <h1 className="text-xl lg:text-2xl text-slate-12">
                  Enterprise-grade security
                </h1>
                <p className="space-y-1 text-slate-11">
                  Dataland is SOC 2 Type 2 compliant, as well as HIPAA and GDPR
                  certified in partnership with Vanta.
                </p>
              </div>
            </div>
          </div>
          <div
            id="Object views"
            className="lg:px-12 flex flex-col md:flex-row gap-4 md:gap-16 py-12 md:py-24"
          >
            <div className="flex flex-col gap-4 w-full md:w-2/5 py-12">
              <IconEyebrow
                icon={<Lightning color="#E5C3F0" />}
                text="Productivity"
              />
              <h1 className="text-2xl lg:text-3xl text-slate-12">
                Row navigation
              </h1>
              <div className="space-y-4 text-slate-11">
                <p className="text-md max-w-xl">
                  Dataland makes it easy to introspect rows in wide tables. Just
                  double-click on a row to summon an object view.
                </p>
                <p>Access other object views from other tables via the dock.</p>
              </div>
            </div>
            <div className="w-full">
              <Image
                src="/images/feature_object_views.png"
                alt="Feature - Object Views"
                draggable="false"
                width="690"
                height="528"
              />
            </div>
          </div>
          <div
            id="Architecture Diagram"
            className=" text-slate-12 z-20 flex flex-col md:flex-row gap-16 items-center"
          >
            <Image
              className="relative z-20 m-auto pointer-events-none select-none md:w-2/3 order-2 md:order-1"
              src="/images/performance_diagram.svg"
              alt="Hero Image"
              draggable="false"
              width="1053"
              height="513"
            />
            <div className="flex flex-col gap-4 order-1 md:order-2">
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
          <div id="End of page CTA" className="flex flex-col items-center">
            <div className="z-10 flex flex-col pt-24 pb-48 md:pt-0 md:pb-96 items-center space-y-6">
              <h1 className="text-3xl md:text-[48px] leading-tight text-slate-12">
                The ultimate <br></br>data browser
              </h1>
              <div className="flex flex-row gap-4 items-center">
                <InsetButton
                  bgColor={`#4315F3`}
                  href={`/signup`}
                  text={`Get started`}
                  target={`_self`}
                  highlightValue={"0.4"}
                />
              </div>
            </div>
            <div className="max-w-[1100px] overflow-hidden">
              <div className="max-w-[1100px] flex justify-center items-center">
                <LogoSvgAnimation />
              </div>
            </div>
          </div>
        </div>
        <MarketingFooter />
      </main>
    </>
  );
}
