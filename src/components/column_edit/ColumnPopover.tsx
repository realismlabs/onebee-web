import React from "react";
import { Popover, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import useMeasure from "react-use-measure";
import { FloatingTree } from "@floating-ui/react";

interface Column {
  id: number;
  name: string;
  type: string;
  display_type: string;
  display_config: any;
}

const columnDisplayTypes = [
  {
    data_type: "number",
    display_type: "plain_number",
    content: "Plain number",
  },
  {
    data_type: "number",
    display_type: "conditional_color_number",
    content: <div className="hello">ok</div>,
  },
  {
    data_type: "string",
    display_type: "plain_text",
  },
  {
    data_type: "string",
    display_type: "json",
  },
  {
    data_type: "string",
    display_type: "color_coded_text",
  },
  {
    data_type: "string",
    display_type: "url",
  },
  {
    data_type: "datetime",
    display_type: "utc_datetime",
  },
  {
    data_type: "datetime",
    display_type: "local_datetime",
  },
  {
    data_type: "boolean",
    display_type: "plain_boolean",
  },
  {
    data_type: "boolean",
    display_type: "checkbox",
  },
];

const PlainTextContent = (column: Column) => {
  return (
    <div className="flex flex-col">
      <p className="text-[14px] text-slate-11">
        Text is displayed just as plain text in cells.
      </p>
    </div>
  );
};

const JsonContent = (column: Column) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[14px] text-slate-11">
        Strings with valid JSON format will be syntax highlighted. Users can
        double click a cell to see and copy full JSON.
      </p>
    </div>
  );
};

const ColorCodedText = (column: Column) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[14px] text-slate-11">
        Text is color-coded depending on cell values. Values are refreshed on
        data sync.
      </p>
      <div className="flex flex-row gap-2 items-center mt-2">
        <p className="text-slate-12 text-[14px]">Values</p>
        <p className="text-slate-12 text-[12px] font-medium bg-slate-5 px-1 py-0.5 rounded-md">
          {column?.display_config?.color_mappings?.length}
        </p>
      </div>
      <div className="flex flex-col gap-1 max-h-[312px] overflow-y-auto">
        {column?.display_config?.color_mappings?.map((mapping: any) => (
          <div
            className="flex flex-row py-1 px-1.5 gap-2 items-center"
            key={mapping.id}
          >
            <Popover className="flex flex-col">
              {({ open, close }) => (
                <>
                  <Popover.Button>
                    <div
                      className="w-3 h-3 rounded-md color-mapping"
                      style={{ backgroundColor: mapping.color }}
                    />
                  </Popover.Button>
                  <Transition
                    enter="transition ease-out duration-75"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 mt-3 px-4 py-3 max-h-[80vh] top-0 rounded-md bg-slate-2 shadow-2xl border border-slate-4 flex flex-shrink w-[320px] flex-col gap-2 items-start justify-start cursor-default">
                      <p className="text-[14px] font-medium">
                        Edit display type
                      </p>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <p className="text-slate-11 text-[14px] truncate">
              {mapping.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ColumnPopover = (column: Column) => {
  let [ref, bounds] = useMeasure();
  const [isSelectingDisplayType, setIsSelectingDisplayType] =
    React.useState(false);

  const [displayType, setDisplayType] = React.useState(column.display_type);

  return (
    <FloatingTree>
      <Popover className="flex flex-col">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
              ${open ? "" : "hover:bg-slate-5 active:bg-slate-6"}
              bg-slate-4 flex flex-col gap-4 rounded-lg cursor-default px-3 py-1.5 text-[14px]`}
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
              <Popover.Panel className="absolute z-10 mt-3 px-4 py-3 max-h-[80vh] top-0 rounded-md bg-slate-2 shadow-2xl border border-slate-4 flex flex-shrink w-[320px] flex-col gap-2 items-start justify-start cursor-default">
                <p className="text-[14px] font-medium">Edit display type</p>
                <motion.div
                  className="w-full mt-2"
                  animate={{ height: bounds.height }}
                  transition={{ duration: 0.2 }}
                >
                  <div ref={ref} className="flex flex-col">
                    <AnimatePresence mode="popLayout">
                      {/* Custom form depending on displayType */}
                      {isSelectingDisplayType == false && (
                        <div className="flex flex-col gap-4">
                          <div
                            className="flex flex-row items-center flex-grow bg-slate-3 hover:bg-slate-4 active:bg-slate-5 py-2 px-4 rounded-md border border-slate-6"
                            onClick={() => setIsSelectingDisplayType(true)}
                          >
                            <p className="text-[14px] mr-auto">{displayType}</p>
                            <CaretDown
                              size={12}
                              className="text-slate-12"
                              weight="bold"
                            />
                          </div>
                          {/* Form */}
                          {displayType == "plain_text" && (
                            <PlainTextContent {...column} />
                          )}
                          {displayType == "json" && <JsonContent {...column} />}
                          {displayType == "color_coded_text" && (
                            <ColorCodedText {...column} />
                          )}
                        </div>
                      )}
                      {/* Selection state (selecting other data type) */}
                      {isSelectingDisplayType == true && (
                        <div className="flex-col flex bg-slate-3 rounded-md border border-slate-6">
                          <div
                            className="flex flex-row items-center flex-grow bg-slate-3  hover:bg-slate-4 active:bg-slate-5 py-2 px-4 rounded-md"
                            onClick={() => {
                              setIsSelectingDisplayType(false);
                            }}
                          >
                            <p className="text-[14px] text-slate-11 mr-auto">
                              Choose a display type..
                            </p>
                            <CaretUp
                              size={12}
                              className="text-slate-12"
                              weight="bold"
                            />
                          </div>
                          {/* map columnDisplayTypes but only show the display_types where it shares the same data_type */}
                          {columnDisplayTypes
                            .filter(
                              (displayType) =>
                                displayType.data_type === column.type
                            )
                            .map((displayType) => (
                              <div
                                className="flex flex-row items-center flex-grow bg-slate-3 hover:bg-slate-4 active:bg-slate-5 py-2 px-4 rounded-md"
                                key={displayType.display_type}
                                onClick={() => {
                                  setDisplayType(displayType.display_type);
                                  setIsSelectingDisplayType(false);
                                }}
                              >
                                <p className="text-[14px] mr-auto">
                                  {displayType.display_type}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
                      {/* Buttons */}
                      <div className="flex flex-row gap-2 mt-8">
                        <div
                          className="bg-slate-3 hover:bg-slate-4 px-3 py-1.5 text-[14px] rounded-md ml-auto"
                          onClick={() => {
                            close();
                          }}
                        >
                          Cancel
                        </div>
                        <div
                          className="bg-blue-600 hover:bg-blue-700  px-3 py-1.5 text-[14px] rounded-md "
                          onClick={() => {
                            // run whatever validations here
                            close();
                          }}
                        >
                          Save
                        </div>
                      </div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </FloatingTree>
  );
};

export default ColumnPopover;
