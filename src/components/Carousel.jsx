import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

const AnimatedDiv = ({ obj, position, animationControl, animationTransition }) => (
  <motion.div
    className={`animated-div flex flex-row gap-4 p-4 bg-slate-1 text-white`}
    style={{ zIndex: position.zIndex }}
    initial={{ y: position.y, rotate: position.rotate }}
    animate={animationControl}
    transition={animationTransition}
  >
    <Image src={`${obj.image_url}`} alt="Picture of the author" width={48} height={48} className="self-start" />
    <h3>{obj.question_text}</h3>
  </motion.div>
);

const Carousel = () => {
  const data = [
    {
      "position": 1,
      "image_url": "/images/avatar01.png",
      "question_text": "What's the event timeline for this insurance claim? When did X happen?"
    },
    {
      "position": 2,
      "image_url": "/images/avatar02.png",
      "question_text": "What's the delivery status for this shipment for this customer?"
    },
    {
      "position": 3,
      "image_url": "/images/avatar03.png",
      "question_text": "Can you lookup the transaction history and fees for this account?"
    },
    {
      "position": 4,
      "image_url": "/images/avatar04.png",
      "question_text": "What's the refund request and status for this customer with a purchase issue?"
    },
    {
      "position": 5,
      "image_url": "/images/avatar05.png",
      "question_text": "Lookup the financial history and credit score of this loan applicant."
    }]

  const positions = [
    { y: 0, rotate: 3, zIndex: 1, x: -20 },
    { y: 80, rotate: -3, zIndex: 2, x: 20 },
    { y: 160, rotate: 3, zIndex: 3, x: -20 },
    { y: 240, rotate: -3, zIndex: 2, x: 20 },
    { y: 320, rotate: 3, zIndex: 1, x: -20 },
  ];

  const animationControls = data.map(() => useAnimation());

  useEffect(() => {
    const animateDivs = async () => {
      const animations = animationControls.map((control, i) =>
        control.start({ y: positions[i].y, rotate: positions[i].rotate, zIndex: positions[i].zIndex, x: positions[i].x })
      );

      await Promise.all(animations);
    };

    const interval = setInterval(() => {
      animateDivs();
      positions.unshift(positions.pop());
    }, 4000);

    return () => clearInterval(interval);
  }, [animationControls, positions]);

  const animationTransition = {
    duration: 1,
    ease: "easeInOut",
  };

  return (
    <div className="animated-divs">
      {data.map((obj, index) => {
        const position = positions[index];

        return (
          <AnimatedDiv
            key={index}
            obj={obj}
            position={position}
            animationControl={animationControls[index]}
            animationTransition={animationTransition}
          />
        );
      })}
    </div>
  );
};

export default Carousel;
