import React from 'react';
import Image from 'next/image';
import styles from "../styles/Home.module.css";

function HeroText(type) {

  console.log("this is the type", JSON.stringify(type));
  //  Header with headline + two sublines
  const hero_headline_subheader =
    <div
      id="header-text"
      className="flex flex-col items-center gap-4 z-30"
      style={{
        animation: "fadeInFromBottom 0.4s ease-in-out",
        animationDelay: "0.1s",
        animationFillMode: "forwards",
        opacity: 0,
      }}
    >
      <h1
        className={`font-regular md:text-[48px] sm:text-[32px] text-center leading-tight text-[32px] text-white pt-2 md:pt-8 ${styles.heroHeadlineMask}`}
      >
        Browse your data warehouse, fast
      </h1>
      <div className="max-w-3xl text-center md:text-lg md:mb-2 lg:mb-0 text-md text-[#958eb3] inline-block">
        Stop building one-off data UIs. Give your whole team a
        spreadsheet-like UI to explore your
        <div className="inline-block ml-2 lg:pr-2 lg:pl-2 lg:py-0.5 lg:bg-[#18113d] text-md text-[#aba4cc] rounded-md">
          <Image
            className="pointer-events-none select-none inline-block"
            src="/images/logos/logo_bigquery.svg"
            alt="BigQuery"
            draggable="false"
            width="20"
            height="20"
          />
          <p className="ml-1 lg:ml-2 inline-block">BigQuery</p>
        </div>
        <div className="inline-block ml-2 lg:pr-2 lg:pl-2 lg:py-0.5 lg:bg-[#18113d] text-md text-[#aba4cc] rounded-md">
          <Image
            className="pointer-events-none select-none inline-block"
            src="/images/logos/logo_postgres.svg"
            alt="Postgres"
            draggable="false"
            width="20"
            height="20"
          />
          <p className="ml-1 lg:ml-2 inline-block">Postgres</p>
        </div>
        &nbsp;and
        <div className="inline-block ml-2 lg:pr-2 lg:pl-2 lg:py-0.5 lg:bg-[#18113d] text-md text-[#aba4cc] rounded-md">
          <Image
            className="pointer-events-none select-none inline-block"
            src="/images/logos/logo_snowflake.svg"
            alt="Snowflake"
            draggable="false"
            width="20"
            height="20"
          />
          <p className="ml-1 lg:ml-2 inline-block">Snowflake</p>
        </div>
        &nbsp;at billion-row scale.
      </div>
    </div>


  //  Header with headline + two sublines
  const headline_logos = <div
    id="header-text"
    className="flex flex-col items-center gap-4 z-30"
    style={{
      animation: "fadeInFromBottom 0.4s ease-in-out",
      animationDelay: "0.1s",
      animationFillMode: "forwards",
      opacity: 0,
    }}
  >
    <h1
      className={`font-regular md:text-[48px] sm:text-[32px] text-center leading-tight text-[24px] text-white pt-2 md:pt-8 ${styles.heroHeadlineMask}`}
    >
      The ultimate data warehouse for
    </h1>
    <div className="max-w-3xl text-center text-2xl text-[#958eb3] inline-block">
      <div className="flex flex-row md:gap-3 gap-1">
        <div className="flex flex-row items-center ml-1 md:pr-4 md:pl-3 pr-2 pl-1.5 md:py-2 py-1 bg-[#18113d] text-[#c1bcda] rounded-md ">
          <Image
            className="pointer-events-none select-none inline-block"
            src="/images/logos/logo_bigquery.svg"
            alt="BigQuery"
            draggable="false"
            width="22"
            height="22"
          />
          <p className="ml-2 inline-block text-sm md:text-xl">BigQuery</p>
        </div>
        <div className="flex flex-row items-center ml-1 md:pr-4 md:pl-3 pr-2 pl-1.5 md:py-2 py-1 bg-[#18113d] text-[#c1bcda] rounded-md ">
          <Image
            className="pointer-events-none select-none inline-block"
            src="/images/logos/logo_postgres.svg"
            alt="Postgres"
            draggable="false"
            width="22"
            height="22"
          />
          <p className="ml-2 inline-block text-sm md:text-xl">Postgres</p>
        </div>
        <div className="flex flex-row items-center ml-1 md:pr-4 md:pl-3 pr-2 pl-1.5 md:py-2 py-1 bg-[#18113d] text-[#c1bcda] rounded-md ">
          <Image
            className="pointer-events-none select-none inline-block"
            src="/images/logos/logo_snowflake.svg"
            alt="Snowflake"
            draggable="false"
            width="22"
            height="22"
          />
          <p className="ml-2 inline-block text-sm md:text-xl">Snowflake</p>
        </div>
      </div>
    </div>
  </div>

  if (type.type == "headline_logos") {
    return (
      <>
        {headline_logos}
      </>
    )
  } else if (type.type == "hero_headline_subheader") {
    return (
      <>
        {hero_headline_subheader}
      </>
    )
  } else {
    return (
      <>
        <div>Placeholder</div>
      </>
    )
  }
}

export default HeroText;