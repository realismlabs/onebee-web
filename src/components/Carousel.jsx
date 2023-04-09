import React, { useEffect, useState } from "react";
import { Lato } from "next/font/google";
import Image from "next/image";

const Carousel = () => {
  const [divOrder, setDivOrder] = useState([
    {
      "position": 1,
      "image_url": "/images/avatar01.png",
      "question_text": "What's the event timeline for this insurance claim?"
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
      "question_text": "Hello5"
    }])

  useEffect(() => {
    const interval = setInterval(() => {
      setDivOrder((prevState) => {
        const newOrder = prevState.slice(1).concat(prevState[0]);
        return newOrder;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-divs">
      {divOrder.map((obj, index) => (
        <div
          key={index}
          className={`animated-div position-${index} flex flex-row gap-4 p-4 bg-slate-1 text-white`}
        >
          <Image src={`${obj.image_url}`} alt="Picture of the author" width={64} height={64} />
          <h3>{obj.question_text}</h3>
        </div>
      )
      )};
    </div>
  );
};


const getColor = (index) => {
  switch (index) {
    case 0:
      return "red";
    case 1:
      return "orange";
    case 2:
      return "yellow";
    case 3:
      return "green";
    case 4:
      return "blue";
    default:
      return "";
  }
};

export default Carousel;
