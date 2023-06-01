import React from "react";

interface Column {
  id: number;
  name: string;
  type: string;
  display_type: string;
  display_config: any;
}

const ColumnPopover = (column: Column) => {
  return <div className="flex flex-col gap-4 rounded-lg">hi</div>;
};

export default ColumnPopover;
