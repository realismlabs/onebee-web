import React from "react";
import ColumnPopover from "./ColumnPopover";

interface Column {
  id: number;
  name: string;
  type: string;
  display_type: string;
  display_config: any;
}

const columns: Column[] = [
  {
    id: 2,
    name: "order_amount",
    type: "number",
    display_type: "plain_number",
    display_config: {},
  },
  {
    id: 3,
    name: "usage",
    type: "number",
    display_type: "conditional_color_number",
    display_config: {
      color_scale: "red_orange_amber_yellow_green",
    },
  },
  {
    id: 1,
    name: "order_id",
    type: "string",
    display_type: "plain_text",
    display_config: {},
  },
  {
    id: 4,
    name: "order_json",
    type: "string",
    display_type: "json",
    display_config: {},
  },
  {
    id: 5,
    name: "payment_status",
    type: "string",
    display_type: "color_coded_text",
    display_config: {
      color_mappings: [
        {
          id: 1,
          color: "tomato",
          value: "cillum",
        },
        {
          id: 2,
          color: "tomato",
          value: "cillum2",
        },
        {
          id: 3,
          color: "red",
          value: "cillum3",
        },
        {
          id: 4,
          color: "crimson",
          value: "aliqua",
        },
        {
          id: 5,
          color: "pink",
          value: "do",
        },
        {
          id: 6,
          color: "plum",
          value: "2fa45d5c-e41c-4c3b-9d76-8c0b58e3c4e6",
        },
        {
          id: 7,
          color: "purple",
          value: "slkdfjslkf",
        },
        {
          id: 8,
          color: "violet",
          value: "banana",
        },
        {
          id: 9,
          color: "indigo",
          value: "cotton",
        },
        {
          id: 10,
          color: "blue",
          value: "seersucker",
        },
        {
          id: 3,
          color: "cyan",
          value: "tweed",
        },
        {
          id: 3,
          color: "teal",
          value: "herringbone",
        },
        {
          id: 3,
          color: "green",
          value: "ripstop",
        },
        {
          id: 3,
          color: "grass",
          value: "denim",
        },
        {
          id: 3,
          color: "yellow",
          value: "leather",
        },
        {
          id: 3,
          color: "amber",
          value: "polyester",
        },
        {
          id: 3,
          color: "orange",
          value: "silk",
        },
      ],
    },
  },
  {
    id: 6,
    name: "link_to_stripe",
    type: "string",
    display_type: "url",
    display_config: {},
  },
  {
    id: 7,
    name: "created_at",
    type: "datetime",
    display_type: "utc_datetime",
    display_config: {},
  },
  {
    id: 8,
    name: "created_at_et",
    type: "datetime",
    display_type: "local_datetime",
    display_config: {},
  },
  {
    id: 9,
    name: "is_active",
    type: "boolean",
    display_type: "plain_boolean",
    display_config: {},
  },
  {
    id: 10,
    name: "is_fraudulent",
    type: "boolean",
    display_type: "checkbox",
    display_config: {},
  },
];

const ColumnPopoverTestGroup = () => {
  return (
    <div className="bg-slate-1">
      <p>Column popover testing</p>
      {/* set up grid for 3 columns */}
      <div className="flex flex-row gap-3 pb-4">
        <p className="text-[14px] text-slate-12 w-[240px]">Name</p>
        <p className="text-[14px] text-slate-12 w-[240px]">Data type</p>
        <p className="text-[14px] text-slate-12 w-[240px]">Display type</p>
        <div className="flex-col gap-2 text-blue-9">Click me!</div>
      </div>
      <div className="text-white flex flex-col divide-y divide-slate-5">
        {columns.map((column) => (
          <div className="flex flex-col gap-4 rounded-lg" key={column.id}>
            {/* <p>{column.id}</p> */}
            <div className="flex flex-row gap-3 py-2">
              <p className="text-[14px] text-slate-12 w-[240px]">
                {column.name}
              </p>
              <p className="text-[14px] text-slate-11 w-[240px]">
                {column.type}
              </p>
              <p className="text-[14px] text-slate-11 w-[240px]">
                {column.display_type}
              </p>
              <div className="flex-col gap-2 text-blue-9">
                <ColumnPopover {...column} />
              </div>
            </div>
            {/* <p>{JSON.stringify(column.display_config)}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnPopoverTestGroup;
