import React from 'react';

const GradientImage = ({ imageUrl }) => {
  return (
    <div
      className="relative z-20 m-auto w-[85%]"
      style={{
        backgroundImage: 'linear-gradient(to bottom, #000, #fff), url(' + imageUrl + ')',
        backgroundSize: 'cover',
        width: '100%',
        height: '100vh',
      }}
    >
      {/* Your content goes here */}
    </div>
  );
};

export default GradientImage;