import React, { useEffect, useRef, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, CaretUp, DeviceMobile } from "@phosphor-icons/react";
import useMeasure from "react-use-measure";
import { useFloating, autoUpdate, offset } from "@floating-ui/react-dom";
import { enumColorMap } from "../colorMap";

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
  },
  {
    data_type: "number",
    display_type: "conditional_color_number",
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
      <p className="text-[13px] text-slate-11">
        Text is displayed just as plain text in cells.
      </p>
    </div>
  );
};

const JsonContent = (column: Column) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] text-slate-11">
        Strings with valid JSON format will be syntax highlighted. Users can
        double click a cell to see and copy full JSON.
      </p>
    </div>
  );
};

const ColorCodedTextContent = (column: Column) => {
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
  const [colorPickerPopoverOpen, setColorPickerPopoverOpen] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [filter, setFilter] = useState<string>("");

  const filteredMappings = column?.display_config?.color_mappings.filter(
    (mapping: any) => mapping.value.includes(filter)
  );

  const { refs, floatingStyles } = useFloating({
    elements: {
      reference: anchorEl,
    },
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",
  });

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        !!anchorEl && // anchorEl is not null
        !anchorEl?.contains(event.target) && // clicked outside of anchorEl
        !event.target.classList.contains("color-mapping") // clicked outside of color-mapping div, because there is another click handler for color-mapping div
      ) {
        setColorPickerPopoverOpen(false);
      }
    };

    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Escape") {
        setColorPickerPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [anchorEl]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] text-slate-11">
        Text is color-coded based on the value. Values are refreshed on every
        data source sync.
      </p>
      <div className="flex flex-row gap-2 items-center mt-2">
        <p className="text-slate-12 text-[13px]">Values</p>
        <p className="text-slate-12 text-[12px] font-medium bg-slate-5 px-1 py-0.5 rounded-md">
          {column?.display_config?.color_mappings?.length}
        </p>
      </div>
      {/* add a filter input */}
      <input
        type="text"
        placeholder="Filter values.."
        className="bg-slate-3 text-[13px] h-[32px] border border-slate-6 rounded-md"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="flex flex-col gap-1 max-h-[208px] min-h-[120px] overflow-y-auto bg-slate-2 rounded-md border border-slate-6 py-2">
        {filteredMappings.map((mapping: any, index: number) => (
          <div className="flex flex-row gap-1 items-center" key={index}>
            <div
              className={`hover:bg-slate-3 hover:border hover:border-slate-6 ml-2 w-[24px] h-[24px] rounded-md items-center justify-center flex flex-none`}
              onClick={(event) => {
                setSelectedMapping(mapping);
                setAnchorEl(event.currentTarget);
                setColorPickerPopoverOpen(true);
              }}
            >
              <div
                className="w-[16px] h-[16px] rounded-full flex-none items-center justify-center flex"
                style={{
                  backgroundColor: enumColorMap.find(
                    (item) => item.name === mapping.color
                  )?.backgroundColor1,
                  border: `1px solid ${
                    enumColorMap.find((item) => item.name === mapping.color)
                      ?.backgroundColor2
                  }`,
                }}
              >
                <div
                  className="h-[8px] w-[8px] rounded-full"
                  style={{
                    backgroundColor: enumColorMap.find(
                      (item) => item.name === mapping.color
                    )?.foregroundColor,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-slate-12 text-[13px] truncate">
              {mapping.value}
            </p>
          </div>
        ))}
        {/* if filteredMappings is 0 and filter is not "" */}
        {filteredMappings.length === 0 && filter !== "" && (
          <div className="flex flex-row gap-2 items-center w-full justify-center h-24">
            <p className="text-slate-11 text-[13px]">No values found</p>
          </div>
        )}
        {filteredMappings.length === 0 && filter == "" && (
          <div className="flex flex-row gap-2 items-center w-full justify-center h-24">
            <p className="text-slate-11 text-[13px]">
              This column doesn&apos;t have any values yet
            </p>
          </div>
        )}
      </div>
      {colorPickerPopoverOpen && (
        <div
          ref={refs.setFloating}
          className="absolute bg-black rounded-lg text-[13px] shadow-2xl p-3"
          style={floatingStyles}
        >
          <div className="grid grid-cols-6 gap-1">
            {enumColorMap.map((item) => (
              <div
                className="hover:bg-slate-3 px-1 py-1 rounded-md flex items-center justify-center"
                key={item.name}
                onClick={() => {
                  console.log("selectedMapping", selectedMapping);
                  console.log(
                    "selectedMapping update text",
                    selectedMapping?.value,
                    "from",
                    selectedMapping?.color,
                    "update color to",
                    item.name
                  );
                  setColorPickerPopoverOpen(false);
                }}
              >
                <div
                  style={{
                    backgroundColor: item.backgroundColor1,
                    border: `1px solid ${item.backgroundColor2}`,
                    color: item.foregroundColor,
                  }}
                  className="px-1.5 rounded-full color-mapping"
                >
                  Aa
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PlainNumberContent = (column: Column) => {
  return (
    <div className="flex flex-col">
      <p className="text-[13px] text-slate-11">
        Number is displayed just as a plain integer or decimal in cells. Numbers
        are right-aligned for easy scanning.
      </p>
    </div>
  );
};

const ConditionalColorNumberContent = (column: Column) => {
  const colorScales = [
    {
      name: "red-yellow-green",
      colorScale: [
        {
          stop: 1,
          backgroundColor: "#291415",
          textColor: "#FF6369",
        },
        {
          stop: 2,
          textColor: "#FF8B3E",
          backgroundColor: "#2B1400",
        },
        {
          stop: 3,
          backgroundColor: "#271700",
          textColor: "#F1A10D",
        },
        {
          stop: 4,
          backgroundColor: "#221A00",
          textColor: "#F0C000",
        },
        {
          stop: 5,
          backgroundColor: "#0C1F17",
          textColor: "#4CC38A",
        },
      ],
    },
    {
      name: "green-yellow-red",
      colorScale: [
        {
          stop: 5,
          backgroundColor: "#291415",
          textColor: "#FF6369",
        },
        {
          stop: 4,
          textColor: "#FF8B3E",
          backgroundColor: "#2B1400",
        },
        {
          stop: 3,
          backgroundColor: "#271700",
          textColor: "#F1A10D",
        },
        {
          stop: 2,
          backgroundColor: "#221A00",
          textColor: "#F0C000",
        },
        {
          stop: 1,
          backgroundColor: "#0C1F17",
          textColor: "#4CC38A",
        },
      ],
    },
    {
      name: "red-white-green",
      colorScale: [
        {
          stop: 1,
          backgroundColor: "#291415",
          textColor: "#FF6369",
        },
        {
          stop: 2,
          backgroundColor: "#231819",
          textColor: "#FFA1A5",
        },
        {
          stop: 3,
          backgroundColor: "#1A1D1E",
          textColor: "#FFFFFF",
        },
        {
          stop: 4,
          backgroundColor: "#121E1A",
          textColor: "#94DBB9",
        },
        {
          stop: 5,
          backgroundColor: "#0C1F17",
          textColor: "#4CC38A",
        },
      ],
    },
    {
      name: "green-white-red",
      colorScale: [
        {
          stop: 5,
          backgroundColor: "#291415",
          textColor: "#FF6369",
        },
        {
          stop: 4,
          backgroundColor: "#231819",
          textColor: "#FFA1A5",
        },
        {
          stop: 3,
          backgroundColor: "#1A1D1E",
          textColor: "#FFFFFF",
        },
        {
          stop: 2,
          backgroundColor: "#121E1A",
          textColor: "#94DBB9",
        },
        {
          stop: 1,
          backgroundColor: "#0C1F17",
          textColor: "#4CC38A",
        },
      ],
    },
    {
      name: "green-white",
      colorScale: [
        {
          stop: 1,
          backgroundColor: "#0C1F17",
          textColor: "#4CC38A",
        },
        {
          stop: 2,
          backgroundColor: "#0F1F18",
          textColor: "#70CFA1",
        },
        {
          stop: 3,
          backgroundColor: "#121E1A",
          textColor: "#94DBB9",
        },
        {
          stop: 4,
          backgroundColor: "#141E1B",
          textColor: "#B7E7D0",
        },
        {
          stop: 5,
          backgroundColor: "#1A1D1E",
          textColor: "#FFFFFF",
        },
      ],
    },
    {
      name: "white-green",
      colorScale: [
        {
          stop: 5,
          backgroundColor: "#0C1F17",
          textColor: "#4CC38A",
        },
        {
          stop: 4,
          backgroundColor: "#0F1F18",
          textColor: "#70CFA1",
        },
        {
          stop: 3,
          backgroundColor: "#121E1A",
          textColor: "#94DBB9",
        },
        {
          stop: 2,
          backgroundColor: "#141E1B",
          textColor: "#B7E7D0",
        },
        {
          stop: 1,
          backgroundColor: "#1A1D1E",
          textColor: "#FFFFFF",
        },
      ],
    },
    {
      name: "red-white",
      colorScale: [
        {
          stop: 1,
          backgroundColor: "#291415",
          textColor: "#FF6369",
        },
        {
          stop: 2,
          backgroundColor: "#261617",
          textColor: "#FF8287",
        },
        {
          stop: 3,
          backgroundColor: "#231819",
          textColor: "#FFA1A5",
        },
        {
          stop: 4,
          backgroundColor: "#20191A",
          textColor: "#FFC1C3",
        },
        {
          stop: 5,
          backgroundColor: "#1A1D1E",
          textColor: "#FFFFFF",
        },
      ],
    },
    {
      name: "white-red",
      colorScale: [
        {
          stop: 5,
          backgroundColor: "#291415",
          textColor: "#FF6369",
        },
        {
          stop: 4,
          backgroundColor: "#261617",
          textColor: "#FF8287",
        },
        {
          stop: 3,
          backgroundColor: "#231819",
          textColor: "#FFA1A5",
        },
        {
          stop: 2,
          backgroundColor: "#20191A",
          textColor: "#FFC1C3",
        },
        {
          stop: 1,
          backgroundColor: "#1A1D1E",
          textColor: "#FFFFFF",
        },
      ],
    },
  ];
  return (
    <div className="flex flex-col">
      <p className="text-[13px] text-slate-11">
        Numbers are colored depending on cell values.
      </p>
      <div className="flex flex-col gap-2 mt-2">
        <p className="text-white font-medium text-[13px]">Color values</p>
        {colorScales.map((colorScale) => (
          <div
            key={colorScale.name}
            className="flex flex-row gap-0 cursor-pointer overflow-hidden rounded-md w-full"
            onClick={() => {
              console.log("clicked on color scale", colorScale.name);
            }}
          >
            {colorScale.colorScale
              .sort((a, b) => a.stop - b.stop)
              .map((color) => (
                <div
                  key={color.stop}
                  className="flex flex-grow items-center justify-center py-1 tabular-nums text-[13px]"
                  style={{
                    backgroundColor: color.backgroundColor,
                    color: color.textColor,
                  }}
                >
                  {color.stop}
                </div>
              ))}
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
    <Popover className="flex flex-col">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
              ${open ? "" : "hover:bg-slate-5 active:bg-slate-6"}
              bg-slate-4 flex flex-col gap-4 rounded-lg cursor-default px-3 py-1.5 text-[13px]`}
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
            <Popover.Panel className="absolute z-10 mt-3 px-4 py-3 max-h-[80vh] top-0 rounded-md bg-slate-1 shadow-2xl border border-slate-4 flex flex-shrink w-[320px] flex-col gap-2 items-start justify-start cursor-default">
              <p className="text-[13px] font-medium">Edit display type</p>
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
                          <p className="text-[13px] mr-auto">{displayType}</p>
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
                          <ColorCodedTextContent {...column} />
                        )}
                        {displayType == "plain_number" && (
                          <PlainNumberContent {...column} />
                        )}
                        {displayType == "conditional_color_number" && (
                          <ConditionalColorNumberContent {...column} />
                        )}
                      </div>
                    )}
                    {/* Selection state (selecting other data type) */}
                    {isSelectingDisplayType == true && (
                      <div className="flex-col flex bg-slate-3 rounded-md border border-slate-6">
                        <div
                          className="flex flex-row items-center flex-grow bg-slate-3  hover:bg-slate-4 active:bg-slate-5 py-2 px-4 rounded-t-md border-b border-slate-6"
                          onClick={() => {
                            setIsSelectingDisplayType(false);
                          }}
                        >
                          <p className="text-[13px] text-slate-11 mr-auto">
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
                              <p className="text-[13px] mr-auto">
                                {displayType.display_type}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                    {/* Buttons */}
                    <div className="flex flex-row gap-2 mt-4">
                      <div
                        className="bg-slate-3 hover:bg-slate-4 px-3 py-1.5 text-[13px] rounded-md ml-auto"
                        onClick={() => {
                          close();
                        }}
                      >
                        Cancel
                      </div>
                      <div
                        className="bg-blue-600 hover:bg-blue-700  px-3 py-1.5 text-[13px] rounded-md "
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
  );
};

export default ColumnPopover;
