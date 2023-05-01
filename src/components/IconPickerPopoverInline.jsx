// IconPicker.jsx
import React, { useState, Fragment, useRef } from 'react';
import * as allIcons from '@phosphor-icons/react';
import { Popover, Transition } from '@headlessui/react'
import { updateTable } from '../utils/api';
import { useQuery, useMutation } from '@tanstack/react-query';

const ColorPicker = ({ selectedColor, setSelectedColor }) => {
  const colors = [
    '#0091FF',
    '#3E63DD',
    '#6E56CF',
    '#8E4EC6',
    '#AB4ABA',
    '#E93D82',
    '#E5484D',
    '#F76808',
    '#FFB224',
    '#F5D90A',
    '#46A758',
    '#99D52A',
    '#9BA1A6',
  ];

  const handleColorClick = (color) => {
    console.log("awu selected color", color)
    setSelectedColor(color);
  };

  return (
    <div className="flex flex-row flex-grow justify-between mb-[8px]">
      {colors.map((color) => (
        <div
          key={color}
          onClick={() => handleColorClick(color)}
          className={`flex items-center justify-center h-[20px] w-[20px] rounded cursor-pointer`}
        >
          <div
            className={`h-[18px] w-[18px] rounded-full ${selectedColor === color ? 'ring-1 border-slate-3 border-2 ring-slate-8' : ''
              }`}
            style={{
              backgroundColor: color,
              '--tw-ring-color': color,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};


const IconPickerPopoverInline = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [iconElement, setIconElement] = useState(null);
  const [iconHTML, setIconHTML] = useState(null);


  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
    console.log("awu selected icon", iconName)

    const iconDiv = document.getElementById(iconName);

    if (iconDiv) {
      const childrenContents = Array.from(iconDiv.children).map((child) => child.outerHTML).join('\n');
      setIconHTML(childrenContents);
      console.log("awu Children contents:", childrenContents);
      // TODO: Call table update API
      // handleUpdateTable();

      // TODO: Close the popover
    } else {
      console.error(`awu Div with id "${iconName}" not found.`);
    }

  };

  const iconNames = Object.keys(allIcons).filter(
    (iconName) => iconName !== 'PhosphorIcon' && iconName !== 'IconBase' && iconName !== 'IconContext',
  );

  const filteredIconNames = iconNames.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [selectedColor, setSelectedColor] = useState("#0091FF");

  return (
    <Popover className="">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              ${open ? 'bg-slate-3' : 'hover:bg-slate-3 active:bg-slate-4'}
              flex flex-row gap-3 items-center mx-[10px] focus:outline-none pl-[8px] pr-[13px] py-[6px] rounded-md`}
          >
            <div>
              <div className="text-[13px] text-slate-12">Pick icon</div>
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-20 text-white mt-[44px] max-h-[80vh] ml-[13px] top-0 rounded-md bg-slate-2 shadow-2xl border border-slate-4 flex flex-col items-start justify-start">
              <div className="sticky top-0 p-2 min-h-[200px]">
                <input
                  type="text"
                  placeholder="Search icons.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded w-full mb-[12px] py-[4px] px-[10px] bg-slate-3 border-slate-6 placeholder:text-slate-10 text-[13px] focus:ring-1"
                />

                <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

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
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )
      }
    </Popover>
  )
};

export default IconPickerPopoverInline;
