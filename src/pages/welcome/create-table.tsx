import React, { useState, useEffect, useRef, FC } from "react";
import Link from "next/link";
import { useUser } from "../../components/UserContext";
import router from "next/router";
import Image from "next/image";
import { CaretRight, Table } from "@phosphor-icons/react";
import { useQueryClient, QueryClient, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { abbreviateNumber } from "@/utils/util";

interface AccountHeaderProps {
  email: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ email }) => {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push("/login?lo=true");
  };

  return (
    <div className="w-full flex flex-row h-16 items-center p-12 bg-slate-1">
      <div className="flex flex-col grow items-start">
        <p className="text-xs text-slate-11 mb-1">Logged in as:</p>
        <p className="text-xs text-white font-medium">{email}</p>
      </div>
      <div className="flex flex-col grow items-end">
        <p
          className="text-xs text-white hover:text-slate-12 font-medium cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </div>
  );
};

interface FetchDatabasePreviewProps {
  queryClient: QueryClient;
}

interface DatabasePreviewResponse {
  listed_tables: databasePreviewTableItem[];
}

const FetchDatabasePreview: React.FC<FetchDatabasePreviewProps> = ({
  queryClient,
}) => {
  let cachedData = queryClient.getQueryData<DatabasePreviewResponse>([
    "databasePreview",
  ]);

  // fake data to make DX easier
  if (!cachedData) {
    cachedData = {
      listed_tables: [
        {
          database_name: "ARTHUR_TEST",
          database_schema: "DBT_AWU",
          row_count: 100,
          table_name: "DIM_CUSTOMERS",
        },
        {
          database_name: "ARTHUR_TEST",
          database_schema: "DBT_AWU",
          row_count: 120,
          table_name: "FCT_ORDERS",
        },
        {
          database_name: "ARTHUR_TEST",
          database_schema: "DBT_AWU",
          row_count: 2,
          table_name: "MY_FIRST_DBT_MODEL",
        },
        {
          database_name: "ARTHUR_TEST",
          database_schema: "DBT_SSOFTWARE",
          row_count: 2,
          table_name: "MY_FIRST_DBT_MODEL",
        },
        {
          database_name: "ARTHUR_TEST",
          database_schema: "PUBLIC",
          row_count: 150000000,
          table_name: "CUSTOMER_150M",
        },
        {
          database_name: "ARTHUR_TEST",
          database_schema: "PUBLIC",
          row_count: 1500000000,
          table_name: "ORDERS_1500M",
        },
        {
          database_name: "SNOWFLAKE_SAMPLE_DATA",
          database_schema: "TPCDS_SF100TCL",
          row_count: 60,
          table_name: "CALL_CENTER",
        },
        {
          database_name: "SNOWFLAKE_SAMPLE_DATA",
          database_schema: "TPCDS_SF100TCL",
          row_count: 50000,
          table_name: "CATALOG_PAGE",
        },
        {
          database_name: "SNOWFLAKE_SAMPLE_DATA",
          database_schema: "TPCDS_SF100TCL",
          row_count: 14405363575,
          table_name: "CATALOG_RETURNS",
        },
        {
          database_name: "SNOWFLAKE_SAMPLE_DATA",
          database_schema: "TPCDS_SF100TCL",
          row_count: 144006767158,
          table_name: "CATALOG_SALES",
        },
        {
          database_name: "SNOWFLAKE_SAMPLE_DATA",
          database_schema: "TPCDS_SF100TCL",
          row_count: 100000000,
          table_name: "CUSTOMER",
        },
        {
          database_name: "SNOWFLAKE_SAMPLE_DATA",
          database_schema: "TPCDS_SF100TCL",
          row_count: 50000000,
          table_name: "CUSTOMER_ADDRESS",
        },
        {
          database_name: "SNOWFLAKE_SAMPLE_DATA",
          database_schema: "TPCDS_SF100TCL",
          row_count: 1920800,
          table_name: "CUSTOMER_DEMOGRAPHICS",
        },
        {
          database_name: "SNOWFLAKE_SAMPLE_DATA",
          database_schema: "TPCDS_SF100TCL",
          row_count: 73049,
          table_name: "DATE_DIM",
        },
      ],
    };
  }

  // By default, choose the first table in the list

  const first_table_id = createUniqueId(
    cachedData?.listed_tables[0].database_name,
    cachedData?.listed_tables[0].database_schema,
    cachedData?.listed_tables[0].table_name
  );

  const [selectedTable, setSelectedTable] = useState<string | null>(
    first_table_id ?? null
  );
  const [selectedTableRowCount, setSelectedTableRowCount] = useState<
    number | null
  >(cachedData?.listed_tables[0].row_count ?? null);

  const { data, isLoading, isError, error } = useQuery<DatabasePreviewResponse>(
    ["databasePreview"],
    async () => {
      // Replace this URL with the actual API endpoint to fetch the data
      const response = await fetch(
        "https://your-api-endpoint.com/database-preview"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    { enabled: !cachedData } // Disable the query if cachedData exists
  );

  React.useEffect(() => {
    if (data) {
      console.log("Fetched data from databasePreview:", data);
    }
  }, [data]);

  if (cachedData) {
    console.log("Using cached data:", cachedData);
    return (
      <>
        <div className="flex flex-row gap-6 w-full px-12">
          <div>
            <p className="text-white text-[14px]">Choose a table</p>
            <FileTree
              data={cachedData.listed_tables}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              selectedTableRowCount={selectedTableRowCount}
              setSelectedTableRowCount={setSelectedTableRowCount}
            />
          </div>
          <div className="flex-grow">
            <p className="text-white text-[14px]">Preview</p>
            <div className="relative bg-slate-2 rounded-md mt-4 h-[80vh] border border-slate-4">
              {selectedTable ? (
                <>
                  <div className="flex flex-row gap-2 items-center px-4 py-2 border-b border-slate-4">
                    <p className="text-white text-[14px]">{selectedTable}</p>
                    <pre className="px-2 py-1.5 bg-slate-4 rounded-sm text-white text-[12px]">
                      {abbreviateNumber(selectedTableRowCount) + " rows"}
                    </pre>
                  </div>
                  <div className="w-full">
                    <Image
                      src="../images/data-example-preview.svg"
                      alt="preview"
                      width={1400}
                      height={700}
                      objectFit="contain"
                    />
                  </div>
                  <div className="rounded-md bg-gradient-to-t from-slate-1 via-slate-1 to-transparent absolute z-10 h-48 bottom-0 w-full text-white flex items-center justify-center">
                    <button
                      className={`text-md px-4 py-2 bg-blue-600 rounded-md`}
                    >
                      Create table
                    </button>
                  </div>
                </>
              ) : (
                <div className="pl-24 flex items-center justify-center text-white h-full flex-col gap-2">
                  <p className="text-[14px]"> No table selected </p>
                  <p className="text-[13px] text-slate-11">
                    {" "}
                    Please select a table to continue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error!!</div>;
  }

  if (data) {
    return (
      <div>
        <p>Database preview:</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  return null;
};

// helpers.ts
interface databasePreviewTableItem {
  database_name: string;
  database_schema: string;
  row_count: number;
  table_name: string;
}

interface NestedStructure {
  [dbName: string]: {
    [schema: string]: string[];
  };
}

interface FileTreeProps {
  data: databasePreviewTableItem[];
  selectedTable: string | null;
  setSelectedTable: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTableRowCount: number | null;
  setSelectedTableRowCount: React.Dispatch<React.SetStateAction<number | null>>;
}

function createUniqueId(
  dbName: string,
  schemaName: string,
  tableName?: string
): string {
  return tableName
    ? `${dbName}.${schemaName}.${tableName}`
    : `${dbName}.${schemaName}`;
}

function createNestedStructure(
  data: databasePreviewTableItem[]
): NestedStructure {
  const nestedStructure: NestedStructure = {};

  data.forEach((item) => {
    const { database_name, database_schema, table_name } = item;

    if (!nestedStructure[database_name]) {
      nestedStructure[database_name] = {};
    }

    if (!nestedStructure[database_name][database_schema]) {
      nestedStructure[database_name][database_schema] = [];
    }

    nestedStructure[database_name][database_schema].push(table_name);
  });

  return nestedStructure;
}

const FileTree: React.FC<FileTreeProps> = ({
  data,
  selectedTable,
  setSelectedTable,
  selectedTableRowCount,
  setSelectedTableRowCount,
}) => {
  const nestedData = createNestedStructure(data);

  const allDbNames = Object.keys(nestedData);
  const allSchemaNames = Object.values(nestedData).flatMap((schemas) =>
    Object.keys(schemas)
  );

  // Update selectedTable to use the unique table ID
  const [expandedDbs, setExpandedDbs] = useState<string[]>(allDbNames);
  const [expandedSchemas, setExpandedSchemas] =
    useState<string[]>(allSchemaNames);

  const toggleDb = (dbName: string) => {
    setExpandedDbs((prev) =>
      prev.includes(dbName)
        ? prev.filter((db) => db !== dbName)
        : [...prev, dbName]
    );
  };

  const toggleSchema = (schemaName: string) => {
    setExpandedSchemas((prev) =>
      prev.includes(schemaName)
        ? prev.filter((schema) => schema !== schemaName)
        : [...prev, schemaName]
    );
  };

  const toggleTable = (
    dbName: string,
    schemaName: string,
    tableName: string
  ) => {
    const uniqueId = createUniqueId(dbName, schemaName, tableName);
    setSelectedTable((prev) => (prev === uniqueId ? null : uniqueId));
    // find row count for table
    const table = data.find(
      (item) =>
        item.database_name === dbName &&
        item.database_schema === schemaName &&
        item.table_name === tableName
    );
    setSelectedTableRowCount(table?.row_count ?? null);
  };

  return (
    <div className="p-2 text-slate-11 h-[80vh] overflow-y-auto bg-slate-2 border border-slate-4 rounded-lg w-96 mt-4">
      {Object.entries(nestedData).map(([dbName, schemas]) => (
        <div key={dbName} className="">
          <div
            className="flex flex-row pr-[3px] items-center p-1.5 cursor-pointer hover:bg-slate-4 active:bg-slate-5 rounded-md"
            onClick={() => toggleDb(dbName)}
          >
            <CaretRight
              size={16}
              style={{
                transform: expandedDbs.includes(dbName)
                  ? "rotate(90deg)"
                  : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
            <p className="ml-[8px] text-[13px]">{dbName}</p>
          </div>
          <AnimatePresence>
            {expandedDbs.includes(dbName) && (
              <div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: expandedDbs.includes(dbName) ? "auto" : 0,
                  }}
                  exit={{ height: 0 }}
                  className="ml-[14px] overflow-hidden"
                >
                  {Object.entries(schemas).map(([schemaName, tables]) => (
                    <div key={schemaName} className="border-l border-slate-6">
                      <div className="pl-2">
                        <div
                          className="flex flex-row pr-[3px] items-center p-1.5 cursor-pointer hover:bg-slate-4 active:bg-slate-5 rounded-md"
                          onClick={() => toggleSchema(schemaName)}
                        >
                          <CaretRight
                            size={16}
                            style={{
                              transform: expandedSchemas.includes(schemaName)
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s",
                            }}
                          />
                          <p className="ml-[8px] text-[13px]">{schemaName}</p>
                        </div>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: expandedSchemas.includes(schemaName)
                              ? "auto"
                              : 0,
                          }}
                          className="overflow-hidden"
                        >
                          {tables.map((tableName) => (
                            <div
                              key={tableName}
                              className={`ml-[14px] border-l border-slate-6 flex flex-row items-center`}
                              onClick={() =>
                                toggleTable(dbName, schemaName, tableName)
                              }
                            >
                              <div
                                className={`flex flex-row ml-2 rounded-md px-2 py-1.5 flex-grow cursor-pointer ${
                                  selectedTable ===
                                  createUniqueId(dbName, schemaName, tableName)
                                    ? "bg-blue-900 text-white"
                                    : "hover:bg-slate-4 active:bg-slate-5"
                                }`}
                              >
                                <div className=" text-[13px]">
                                  <Table size={20} />
                                </div>
                                <p className="text-[13px] pl-2 rounded-md">
                                  {tableName}
                                </p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default function AddDataSource() {
  const { user } = useUser();
  const email = user?.email ?? "placeholder@example.com";

  const queryClient = useQueryClient();

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col justify-center items-center w-full">
        <div className="bg-slate-1 text-white text-center text-2xl pb-4"></div>
        <FetchDatabasePreview queryClient={queryClient} />
      </div>
    </div>
  );
}
