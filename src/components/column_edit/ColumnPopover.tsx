import React from "react";

interface Column {
  id: number;
  name: string;
  type: string;
  display_type: string;
  display_config: any;
}

const ColumnPopover = (column: Column) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg">
      {/* <p>{column.id}</p> */}
      <div className="flex flex-row gap-3 py-2">
        <p className="text-[14px] text-slate-12 w-[240px]">{column.name}</p>
        <p className="text-[14px] text-slate-11 w-[240px]">{column.type}</p>
        <p className="text-[14px] text-slate-11 w-[240px]">
          {column.display_type}
        </p>
        <div className="flex-col gap-2 text-blue-9">Hello</div>
      </div>
      {/* <p>{JSON.stringify(column.display_config)}</p> */}
    </div>
  );
};

export default ColumnPopover;
