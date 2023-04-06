import React from 'react';
import useScreenSize from './useScreenSize';


function InsetButton({ bgColor, text, href, target, highlightValue }) {
  const { isSm, isMd, isLg, screen } = useScreenSize();

  let innerStyleContainer = {}
  let outerStyleContainer = {}

  if (screen === 'xs') {
    innerStyleContainer = {
      background: `${bgColor}`,
      padding: '10px 16px',
      borderRadius: '100px',
      fontWeight: '500',
      color: '#fff',
      textDecoration: 'none',
      transition: 'filter 0.2s ease-in-out'
    }
    outerStyleContainer = {
      background: `linear-gradient(180deg, rgba(255, 255, 255, ${highlightValue}) 0%, ${bgColor}, ${bgColor})`,
      padding: '2px',
      borderRadius: '100px',
      height: '38px'
    }
  } else {
    innerStyleContainer = {
      background: `${bgColor}`,
      padding: '12px 16px',
      borderRadius: '100px',
      fontWeight: '500',
      color: '#fff',
      textDecoration: 'none',
      transition: 'filter 0.2s ease-in-out'
    }
    outerStyleContainer = {
      background: `linear-gradient(180deg, rgba(255, 255, 255, ${highlightValue}) 0%, ${bgColor}, ${bgColor})`,
      padding: '1px',
      borderRadius: '100px',
      height: '42px'
    }
  }


  return (
    <div
      style={outerStyleContainer}
      className="p-1 flex flex-col items-center justify-center"
    >
      <div>
        <a
          href={href}
          target={target}
          style={innerStyleContainer}
          className="text-sm md:text-md rounded-full font-medium"
          // Add hover style to darken the button with a 10% opacity black fill
          onMouseOver={(e) => e.target.style.filter = 'brightness(80%)'}
          onMouseOut={(e) => e.target.style.filter = 'brightness(100%)'}
        >
          {text}
        </a>
      </div>
    </div>
  )
};

export default InsetButton;
