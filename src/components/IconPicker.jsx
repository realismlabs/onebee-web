import React, { useState } from 'react';
import availableIcons from './allIcons';

const IconPicker = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
    // Perform any required actions with the selected icon
  };

  return (
    <div className="p-4">
      <h2 className="text-lg mb-4">Icon Picker</h2>
      <div className="grid grid-cols-4 gap-4">
        {availableIcons.map((icon) => {
          const IconComponent = icon.component;
          return (
            <div
              key={icon.name}
              onClick={() => handleIconClick(icon)}
              className={`p-2 border rounded ${selectedIcon && selectedIcon.name === icon.name
                ? 'border-blue-500'
                : 'border-gray-300'
                } cursor-pointer`}
            >
              <IconComponent size={24} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconPicker;
