// IconPicker.jsx
import React, { useState, Fragment } from 'react';
import * as allIcons from '@phosphor-icons/react';
import { Popover, Transition } from '@headlessui/react'

const IconPickerPopoverInline = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
    // Perform any required actions with the selected icon
  };

  const iconNames = Object.keys(allIcons).filter(
    (iconName) => iconName !== 'PhosphorIcon' && iconName !== 'IconBase' && iconName !== 'IconContext',
  );

  const filteredIconNames = iconNames.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
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
                  className="border rounded w-full mb-[12px] py-[6px] px-[12px] bg-slate-3 border-slate-8 placeholder:text-slate-10 text-[13px] focus:ring-1"
                />
                <div className="flex flex-row gap-2 mb-[8px]">
                  <div className="bg-red-9 h-[20px] w-[20px] rounded-full"></div>
                  <div className="bg-amber-9 h-[20px] w-[20px] rounded-full"></div>
                  <div className="bg-green-9 h-[20px] w-[20px] rounded-full"></div>
                  <div className="bg-plum-9 h-[20px] w-[20px] rounded-full"></div>
                </div>
                {filteredIconNames.length > 0 && (
                  <div
                    className="grid gap-2 max-h-[420px] overflow-scroll w-[360px]"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(20px, 1fr))' }}
                  >
                    {filteredIconNames.map((iconName) => {
                      const IconComponent = allIcons[iconName];
                      return (
                        <div
                          key={iconName}
                          onClick={() => handleIconClick(iconName)}
                          className={`border flex items-center justify-center h-[20px] w-[20px] rounded ${selectedIcon === iconName ? 'border-blue-500' : 'border-none'
                            } cursor-pointer`}
                        >
                          {React.createElement(allIcons[`${iconName}`], { size: 20, className: 'text-blue-500', weight: 'fill' })}
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
