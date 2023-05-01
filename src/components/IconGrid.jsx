import * as allIcons from '@phosphor-icons/react';
import React from 'react'

const IconGrid = ({ handleIconClick, selectedColor, searchTerm, selectedIcon }) => {
  const iconNames = Object.keys(allIcons).filter(
    (iconName) => iconName !== 'PhosphorIcon' && iconName !== 'IconBase' && iconName !== 'IconContext',
  );

  const filteredIconNames = iconNames.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {filteredIconNames.length > 0 && (
        <div
          className="grid gap-[8px] max-h-[420px] overflow-scroll w-[360px]"
          style={{ gridTemplateColumns: 'repeat(13, minmax(20px, 1fr))' }}
        >
          {filteredIconNames.map((iconName) => {
            return (
              <div
                key={iconName}
                id={iconName}
                onClick={() => handleIconClick(iconName)}
                className={`flex items-center justify-center h-[20px] w-[20px] rounded ${selectedIcon === iconName ? 'bg-white/10 border border-white border-opacity-20' : 'border-none'
                  } cursor-pointer`}
              >
                {/* color transition desired */}
                {React.createElement(allIcons[`${iconName}`], { size: 18, weight: 'fill', color: selectedColor })}
              </div>
            );
          })}
        </div>)}
      {filteredIconNames.length === 0 && (
        <div className="flex items-center justify-center w-[360px]">
          <p className="text-slate-11 text-[13px] mt-[48px]">No results found</p>
        </div>)}
    </>
  )
}

export default IconGrid