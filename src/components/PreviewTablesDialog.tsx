import DataTable, { createTheme } from "react-data-table-component";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import React from "react";

const PreviewTablesDialog = ({ tables }: { tables: any[] }) => {
  const columns = [
    {
      name: "Database name",
      selector: (row: any) => row.database_name,
      sortable: true,
    },
    {
      name: "Schema name",
      selector: (row: any) => row.database_schema,
      sortable: true,
    },
    {
      name: "Table name",
      selector: (row: any) => row.table_name,
      sortable: true,
    },
    {
      name: "Row count",
      selector: (row: any) => row.row_count,
      sortable: true,
      right: true,
    },
  ];

  createTheme("dark", {
    background: {
      default: `var(--slate2)`,
    },
  });

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: `var(--slate3)`,
        borderBottomColor: `var(--slate6)`,
      },
    },
    rows: {
      style: {
        "&:not(:last-of-type)": {
          borderBottomColor: `var(--slate4)`,
        },
      },
    },
    cells: {
      style: {
        fontVariantNumeric: "tabular-nums",
      },
    },
  };

  const data = tables;

  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger tabIndex={-1}>
        <div
          className="text-[13px] px-2 py-1 bg-green-900/40 hover:bg-green-900/60 w-32 rounded-md"
          tabIndex={-1}
        >
          See full table list →
        </div>
      </Dialog.Trigger>
      <Dialog.Portal className="z-100">
        <Dialog.Overlay className="z-20 bg-slate-1 opacity-75 fixed inset-0" />
        <Dialog.Content className="z-30 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] max-w-[90vw] w-[1000px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-2 border border-slate-3 text-white p-5 focus:outline-none overflow-hidden">
          <Dialog.Title className="m-0 text-[14px] font-medium">
            Full table list
          </Dialog.Title>
          <div className="max-h-[85vh] overflow-scroll mt-4 rounded-sm">
            <DataTable
              dense
              columns={columns}
              data={data}
              fixedHeader
              fixedHeaderScrollHeight="600px"
              theme="dark"
              customStyles={customStyles}
              className="border border-slate-6"
            />
          </div>
          <div className="mt-5 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-3 bg-slate-3 rounded-md text-[13px] font-medium leading-none focus:outline-none hover:bg-slate-4">
                Close preview
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <X size={16} weight="bold" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default PreviewTablesDialog;
