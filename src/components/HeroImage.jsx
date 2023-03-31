import React from 'react';

const ExampleComponent = ({ text }) => {
  const containerClasses = `
    relative
    w-64
    h-64
    bg-gray-500
    border-4
    border-blue-500
    mb-4
  `;
  const borderClasses = `
    absolute
    inset-0
    border-4
    border-green-500
  `;
  const contentClasses = `
    absolute
    inset-0
    flex
    justify-center
    items-center
  `;

  return (
    <div className={containerClasses}>
      <div className={borderClasses} />
      <div className={contentClasses}>
        <p className="text-white">{text}</p>
      </div>
    </div>
  );
};

export default ExampleComponent;
