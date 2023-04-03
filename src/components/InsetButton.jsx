import React from 'react';

const InsetButton = ({ bgColor, text, href, target, highlightValue }) => (
  <div
    style={{
      background: `linear-gradient(180deg, rgba(255, 255, 255, ${highlightValue}) 0%, ${bgColor}, ${bgColor})`,
      padding: '2px',
      borderRadius: '100px',
      height: '42px'
    }}
    className="p-1 flex flex-col items-center justify-center"
  >
    <div>
      <a
        href={href}
        target={target}
        style={{
          background: `${bgColor}`,
          padding: '10px 16px',
          borderRadius: '100px',
          fontSize: '1rem',
          fontWeight: '500',
          color: '#fff',
          textDecoration: 'none'
        }}
        className="text-md rounded-full font-medium"
      >
        {text}
      </a>
    </div>
  </div>
);

export default InsetButton;
