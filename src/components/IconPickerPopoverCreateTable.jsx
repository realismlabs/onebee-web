// IconPicker.jsx
import React, { useState, Fragment, useRef, lazy, Suspense } from 'react';
import { Popover, Transition } from '@headlessui/react'
import { IconLoaderFromSvgString } from '@/components/IconLoaderFromSVGString';

const LazyIconGrid = lazy(() => import('./IconGrid'));

function updateSvgColor(htmlString, newColor) {
  const originalStyleAttribute = /style="color:\s*[^"]*"/;
  const newStyleAttribute = `style="color: ${newColor};"`;

  const updatedHtmlString = htmlString.replace(
    originalStyleAttribute,
    newStyleAttribute
  );

  return updatedHtmlString;
}

const ColorPicker = ({ selectedColor, setSelectedColor }) => {
  const colors = [
    '#0091FF', // blue
    '#3E63DD', // indigo
    '#7C66DC', // violet
    '#9D5BD2', // purple
    '#AB4ABA', // plum
    '#E93D82', // pink
    '#E5484D', // red
    '#F76808', // orange
    '#FFB224', // amber
    '#F5D90A', // yellow
    '#99D52A', // lime
    '#46A758', // green
    '#9BA1A6', // slate
  ];

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  return (
    <div className="flex flex-row flex-grow justify-between w-[360px] gap-0 mb-[8px]">
      {colors.map((color) => (
        <div
          key={color}
          onClick={() => handleColorClick(color)}
          className={`flex items-center justify-center h-[24px] w-[24px] rounded`}
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

const IconPickerPopoverCreateTable = ({ iconSvgString, setIconSvgString, selectedColor, setSelectedColor }) => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleIconClick = async (iconName, selectedColor) => {
    setSelectedIcon(iconName);
    const iconDiv = document.getElementById(iconName);
    if (iconDiv) {
      const iconSvgString = Array.from(iconDiv.children).map((child) => child.outerHTML).join('\n');
      const iconSvgString_updated = updateSvgColor(iconSvgString, selectedColor);
      setIconSvgString(iconSvgString_updated);
    } else {
      console.error(`Div with id "${iconName}" not found.`);
    }
  };

  return (
    <Popover className="">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              ${open ? 'bg-slate-5' : ''}
              flex flex-row gap-3 items-center justify-center focus:outline-none py-[6px] rounded-[3px] w-[31px] h-[31px] bg-slate-4 border-slate-6 hover:bg-slate-5 hover:border-slate-8 active:bg-slate-6 border `}
          >
            <div>
              <div className="text-[13px] text-slate-12"><IconLoaderFromSvgString iconSvgString={iconSvgString} /></div>
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-75"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-20 text-white mt-[44px] max-h-[80vh] top-0 rounded-md bg-slate-2 shadow-2xl border border-slate-4 flex flex-col items-start justify-start">
              <div className="sticky top-0 p-2 min-h-[200px]">
                <input
                  type="text"
                  placeholder="Search icons.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded w-full mb-[12px] py-[3px] px-[8px] bg-slate-3 border-slate-6 placeholder:text-slate-10 text-[13px] focus:ring-1"
                />
                <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                <Suspense fallback={<div className="flex items-center justify-center w-[364px]">
                  <p className="text-slate-11 text-[13px] mt-[48px]">Loading..</p>
                </div>}>
                  <LazyIconGrid handleIconClick={handleIconClick} selectedColor={selectedColor} searchTerm={searchTerm} selectedIcon={selectedIcon} />
                </Suspense>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
};

export default IconPickerPopoverCreateTable;
