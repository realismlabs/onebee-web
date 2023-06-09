import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const AnimatedDiv = ({ obj, position }) => (
  <motion.div
    className={`animated-div flex flex-row gap-4 p-4 bg-[#0F172C] text-slate-12 rounded-md`}
    style={{
      zIndex: position.zIndex,
      backgroundColor: position.backgroundColor,
    }}
    animate={{ y: position.y, rotate: position.rotate, x: position.x }}
    transition={{ duration: 1, ease: "easeInOut" }}
  >
    <motion.div className="flex flex-row gap-4" animate={{ opacity: position.opacity }}>
      <Image src={`${obj.image_url}`} alt="Picture of the author" width={48} height={48} className="self-start rounded-md" />
      <h3 className="text-sm lg:text-md">{obj.question_text}</h3>
    </motion.div>
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

  const initialPositions = [
    { y: 0, rotate: 3, zIndex: 1, x: -20, opacity: 0.2, backgroundColor: "#070D1E" },
    { y: 30, rotate: -3, zIndex: 2, x: 20, opacity: 0.2, backgroundColor: "#091123" },
    { y: 90, rotate: 0, zIndex: 3, x: -20, opacity: 1.0, backgroundColor: "#111A31" },
    { y: 150, rotate: 3, zIndex: 2, x: 20, opacity: 0.2, backgroundColor: "#091123" },
    { y: 180, rotate: -3, zIndex: 1, x: -20, opacity: 0.2, backgroundColor: "#070D1E" }
  ];

  const [positions, setPositions] = useState(initialPositions);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prevPositions => {
        const newPositions = [...prevPositions];
        newPositions.unshift(newPositions.pop());
        return newPositions;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-divs w-full">
      {data.map((obj, index) => {
        const position = positions[index];

        return (
          <AnimatedDiv
            key={index}
            obj={obj}
            position={position}
          />
        );
      })}
    </div>
  );
};

export default Carousel;
