import React from "react";
import { Popover, Transition } from "@headlessui/react";

interface Column {
  id: number;
  name: string;
  type: string;
  display_type: string;
  display_config: any;
}

const ColumnPopover = (column: Column) => {
  return (
    <Popover className="flex flex-col">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              ${open ? "bg-slate-4" : "hover:bg-slate-5 active:bg-slate-6"}
              flex flex-col gap-4 rounded-lg cursor-default px-3 py-1.5 text-[13px]`}
          >
            Edit column
          </Popover.Button>
          <Transition
            enter="transition ease-out duration-75"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 mt-3  max-h-[80vh] top-0 rounded-md bg-slate-2 shadow-2xl border border-slate-4 flex flex-shrink w-[260px] flex-col items-start justify-start">
              <p> Hello!</p>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default ColumnPopover;
