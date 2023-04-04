import React, { useState } from 'react';
import Image from 'next/image';

function RotatingImage() {
  const [angles, setAngles] = useState({ horizontal: 0, vertical: 0 });

  const handleMouseMove = (event) => {
    const container = event.currentTarget;
    const halfWidth = container.offsetWidth / 2;
    const halfHeight = container.offsetHeight / 2;
    const horizontalAngle = (event.clientX - halfWidth) / halfWidth;
    const verticalAngle = (event.clientY - halfHeight) / halfHeight;
    console.log({ horizontalAngle, verticalAngle })
    setAngles({ horizontal: horizontalAngle * 100, vertical: verticalAngle * 100 });
  };

  const handleMouseLeave = () => {
    console.log('mouse left')
    setAngles({ horizontal: 0, vertical: 0 });
  };

  return (
    <div className="container" style={{
      position: 'relative',
      perspective: '1000px',
    }}>
      <Image
        src="/images/footer_splash.svg"
        alt="Gridlines"
        draggable="false"
        width="1440"
        height="570"
        className="absolute select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translateY(-650px) perspective(1000px) rotateX(${angles.vertical}deg) rotateY(${angles.horizontal}deg)`,
          transition: 'transform 0.5s ease',
        }}
      />
    </div>
  );
}

export default RotatingImage;
