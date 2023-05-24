import React, { useState, useEffect, useRef, FC } from "react";
import ReactDOM from "react-dom";
import router from "next/router";
import Image from "next/image";
import Head from "next/head";
import { CaretRight, Table } from "@phosphor-icons/react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { abbreviateNumber, useLocalStorageState } from "@/utils/util";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { capitalizeString } from "@/utils/util";
import { createTable, createConnection } from "@/utils/api";
import MemoizedMockTable from "@/components/MemoizedMockTable";
import { IconList } from "@/components/IconList";
import { Transition } from "@headlessui/react";
import IconPickerPopoverCreateTable from "@/components/IconPickerPopoverCreateTable";
import { IconLoaderFromSvgString } from "@/components/IconLoaderFromSVGString";
import { AccountHeader } from "@/components/AccountHeader";
import { useAuth } from "@clerk/nextjs";

function getIconSvgStringFromName(iconName: string): string {
  const iconItem = IconList.find((icon) => icon.name === iconName);
  let iconSvgString =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0091FF" viewBox="0 0 256 256" class="min-w-[24px] transition-colors duration-300"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM40,160H80v32H40Zm176,32H96V160H216v32Z"></path></svg>';

  if (iconItem) {
    const iconDiv = document.getElementById(iconName);
    if (iconDiv) {
      iconSvgString = Array.from(iconDiv.children)
        .map((child) => child.outerHTML)
        .join("\n");
    } else {
      console.error(`Div with id "${iconName}" not found, using Table instead`);
    }
  }

  function updateSvgColor(htmlString: string, newColor: string) {
    const originalStyleAttribute = /style="color:\s*[^"]*"/;
    const newStyleAttribute = `style="color: ${newColor};"`;

    const updatedHtmlString = htmlString.replace(
      originalStyleAttribute,
      newStyleAttribute
    );

    return updatedHtmlString;
  }

  const colors = [
    "#0091FF", // blue
    // "#3E63DD", // indigo
    // "#7C66DC", // violet
    // "#9D5BD2", // purple
    "#AB4ABA", // plum
    "#E93D82", // pink
    // "#E5484D", // red
    "#F76808", // orange
    "#FFB224", // amber
    "#F5D90A", // yellow
    "#99D52A", // lime
    "#46A758", // green
  ];

  const random_color = colors[Math.floor(Math.random() * colors.length)];
  const updatedSvgString = updateSvgColor(iconSvgString, random_color);
  return updatedSvgString;
}

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
  selectedIconName: string;
  setSelectedIconName: React.Dispatch<React.SetStateAction<string>>;
  isIconSuggestionLoading: boolean;
  setIsIconSuggestionLoading: React.Dispatch<React.SetStateAction<boolean>>;
  iconSvgString: string;
  setIconSvgString: React.Dispatch<React.SetStateAction<string>>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  tableDisplayName: string;
  setTableDisplayName: React.Dispatch<React.SetStateAction<string>>;
  tableDisplayNameErrorMessage: string;
  setTableDisplayNameErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

// helper functions
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

const PreviewTableUI = ({
  tablesQueryData,
  handleSubmit,
  selectedTable,
  setSelectedTable,
  selectedTableRowCount,
  setSelectedTableRowCount,
  selectedIconName,
  setSelectedIconName,
  isIconSuggestionLoading,
  setIsIconSuggestionLoading,
  iconSvgString,
  setIconSvgString,
  selectedColor,
  setSelectedColor,
  tableDisplayName,
  setTableDisplayName,
  tableDisplayNameErrorMessage,
  setTableDisplayNameErrorMessage,
  isLoading,
}: {
  tablesQueryData: any;
  handleSubmit: any;
  selectedTable: string | null;
  setSelectedTable: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTableRowCount: number | null;
  setSelectedTableRowCount: React.Dispatch<React.SetStateAction<number | null>>;
  selectedIconName: string;
  setSelectedIconName: React.Dispatch<React.SetStateAction<string>>;
  isIconSuggestionLoading: boolean;
  setIsIconSuggestionLoading: React.Dispatch<React.SetStateAction<boolean>>;
  iconSvgString: string;
  setIconSvgString: React.Dispatch<React.SetStateAction<string>>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  tableDisplayName: string;
  setTableDisplayName: React.Dispatch<React.SetStateAction<string>>;
  tableDisplayNameErrorMessage: string;
  setTableDisplayNameErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}) => {
  let data = null;
  if (tablesQueryData == null) {
    data = [
      {
        database_name: "Loading..",
        database_schema: "",
        table_name: "",
      },
    ];
  } else {
    data = tablesQueryData.listed_tables;
  }

  // based on the selected table, get the tablename and path differently
  const tableName = selectedTable?.split(".")[2];
  const fullPathWithSlashes = selectedTable?.replaceAll(".", "/");

  return (
    <>
      <div className="flex flex-row gap-6 w-full px-12">
        <div>
          <p className="text-slate-12 text-[14px]">Choose a table</p>
          {isLoading === true ? (
            <div className="flex flex-col h-0 flex-shrink-0 flex-grow p-2 text-slate-11 overflow-y-auto bg-slate-2 border border-slate-4 rounded-lg w-[384px] mt-4">
              <div className="flex flex-row items-center justify-center w-full h-full text-slate-11 text-[12px]">
                Loading..
              </div>
            </div>
          ) : (
            <FileTree
              data={data}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              selectedTableRowCount={selectedTableRowCount}
              setSelectedTableRowCount={setSelectedTableRowCount}
              selectedIconName={selectedIconName}
              setSelectedIconName={setSelectedIconName}
              isIconSuggestionLoading={isIconSuggestionLoading}
              setIsIconSuggestionLoading={setIsIconSuggestionLoading}
              iconSvgString={iconSvgString}
              setIconSvgString={setIconSvgString}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              tableDisplayName={tableDisplayName}
              setTableDisplayName={setTableDisplayName}
              tableDisplayNameErrorMessage={tableDisplayNameErrorMessage}
              setTableDisplayNameErrorMessage={setTableDisplayNameErrorMessage}
              isLoading={isLoading}
            />
          )}
        </div>
        {/* render all icons but hide them, so that SVG contents can be found*/}
        <div className="hidden">
          {IconList.map((iconItem) => (
            <div id={iconItem.name} key={iconItem.name}>
              <iconItem.icon
                weight="fill"
                size={20}
                style={{
                  color: "#FFFFFF",
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex-grow flex-shrink-0 w-0">
          <p className="text-slate-12 text-[14px]">Preview</p>
          <div className="relative bg-slate-2 rounded-md mt-4 h-[80vh] border border-slate-4 flex flex-col">
            {isLoading === true && (
              <div className="pl-24 flex items-center justify-center text-slate-12 h-full flex-col gap-2">
                <p className="text-[13px] text-slate-11"> Loading..</p>
              </div>
            )}
            {isLoading === false && selectedTable == null && (
              <div className="pl-24 flex items-center justify-center text-slate-12 h-full flex-col gap-2">
                <p className="text-[14px]"> No table selected </p>
                <p className="text-[13px] text-slate-11">
                  {" "}
                  Please select a table to continue.
                </p>
              </div>
            )}
            {isLoading === false && selectedTable !== null && (
              <>
                <div className="flex flex-row gap-2 items-center px-[12px] py-2 border-b border-slate-4">
                  <div className="min-w-[31px] min-h-[31px] flex items-center justify-center ">
                    <Transition
                      show={!isIconSuggestionLoading}
                      enter="transition-all transform origin-center"
                      enterFrom="scale-0"
                      enterTo="scale-100"
                      leave="transition-all transform origin-center"
                      leaveFrom="scale-100"
                      leaveTo="scale-0"
                      className="flex-row flex"
                    >
                      <IconPickerPopoverCreateTable
                        iconSvgString={iconSvgString}
                        setIconSvgString={setIconSvgString}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                      />
                    </Transition>
                    {isIconSuggestionLoading && (
                      <div
                        id="loading-icon-suggestion"
                        className="absolute w-[31px] h-[31px] flex items-center justify-center"
                      >
                        <div
                          className="w-[15px] h-[15px] rounded-full animate-spin flex items-center justify-center"
                          style={{
                            background:
                              "conic-gradient(from 0deg, #0091FF, #3E63DD, #7C66DC, #9D5BD2, #AB4ABA, #E93D82, #E5484D, #F76808, #FFB224, #F5D90A, #99D52A, #46A758, #0091FF)",
                            // filter: "brightness(2)",
                            // background:
                            //   "conic-gradient(from 0deg, #BF7AF0, #52A9FF, #BF7AF0)",
                            transformOrigin: "center",
                          }}
                        >
                          <div className="absolute h-[12px] w-[12px] bg-slate-2 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    title="Display name"
                    value={tableDisplayName}
                    className="bg-slate-5 text-white text-[14px] px-[8px] py-[4px] border border-slate-6 rounded-sm w-[360px] focus:outline-none focus:ring-2 focus:ring-blue-600"
                    onChange={(e) => {
                      setTableDisplayNameErrorMessage("");
                      setTableDisplayName(e.target.value);
                    }}
                  />
                  {tableDisplayNameErrorMessage && (
                    <div className="text-red-500 text-[13px]">
                      {tableDisplayNameErrorMessage}
                    </div>
                  )}
                  <div className="ml-auto flex flex-row gap-2">
                    <pre className="px-2 py-1 bg-slate-4 rounded-sm text-slate-11 text-[12px]">
                      {fullPathWithSlashes}
                    </pre>
                    <pre className="px-2 py-1 bg-slate-4 rounded-sm text-slate-11 text-[12px]">
                      {abbreviateNumber(selectedTableRowCount) + " rows"}
                    </pre>
                  </div>
                </div>
                <div className="flex-grow-0 overflow-x-auto overflow-y-scroll">
                  <MemoizedMockTable />
                </div>
                <div className="rounded-md bg-gradient-to-t from-slate-1 via-slate-1 to-transparent absolute z-10 h-48 bottom-0 w-full text-slate-12 flex items-center justify-center">
                  <button
                    className={`text-[16px] px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md`}
                    type="button"
                    onClick={handleSubmit}
                  >
                    Import table
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const FileTree: React.FC<FileTreeProps> = ({
  data,
  selectedTable,
  setSelectedTable,
  selectedTableRowCount,
  setSelectedTableRowCount,
  selectedIconName,
  setSelectedIconName,
  isIconSuggestionLoading,
  setIsIconSuggestionLoading,
  iconSvgString,
  setIconSvgString,
  isLoading,
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
  // update when data itself updates
  useEffect(() => {
    setExpandedDbs(allDbNames);
    setExpandedSchemas(allSchemaNames);
    const first_table_id = createUniqueId(
      data[0].database_name,
      data[0].database_schema,
      data[0].table_name
    );
    const first_table_row_count = data[0].row_count;
    setSelectedTable(first_table_id);
    setSelectedTableRowCount(first_table_row_count);
  }, [data]);

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

  const toggleTable = async (
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
    setIsIconSuggestionLoading(true);

    let timeoutId = setTimeout(() => {
      setSelectedIconName("Table");
      setIsIconSuggestionLoading(false);
    }, 5000);

    try {
      const icon_suggestion = await fetch("/api/guess-icon/", {
        method: "POST",
        body: JSON.stringify({ tableName }),
        headers: { "Content-Type": "application/json" },
      });
      clearTimeout(timeoutId);
      const icon_suggestion_json = await icon_suggestion.json();
      const icon_suggestion_name = icon_suggestion_json.bestMatch;
      if (typeof icon_suggestion_name === "string") {
        const icon_suggestion_name_cleaned = icon_suggestion_name.replace(
          /[^a-zA-Z0-9]/g,
          ""
        );
        setSelectedIconName(icon_suggestion_name_cleaned);
        const iconSvgString = getIconSvgStringFromName(
          icon_suggestion_name_cleaned
        );
        setIconSvgString(iconSvgString);
      }
      setIsIconSuggestionLoading(false);
    } catch (error) {
      setIsIconSuggestionLoading(false);
      clearTimeout(timeoutId);
    }
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
                                    ? "bg-blue-900 text-slate-12"
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

export default function CreateTable() {
  const { getToken } = useAuth();
  const [useCustomHost, setUseCustomHost] = useLocalStorageState(
    "useCustomHost",
    false
  );
  const [customHostAccountIdentifier, setCustomHostAccountIdentifier] =
    useLocalStorageState("customHostAccountIdentifier", "");
  const [snowflakeAuthMethod, setSnowflakeAuthMethod] = useLocalStorageState(
    "snowflakeAuthMethod",
    "user_pass"
  );
  const [accountIdentifier, setAccountIdentifier] = useLocalStorageState(
    "accountIdentifier",
    ""
  );
  const [customHost, setCustomHost] = useLocalStorageState("customHost", "");
  const [warehouse, setWarehouse] = useLocalStorageState("warehouse", "");
  const [basicAuthUsername, setBasicAuthUsername] = useLocalStorageState(
    "basicAuthUsername",
    ""
  );
  const [basicAuthPassword, setBasicAuthPassword] = useLocalStorageState(
    "basicAuthPassword",
    ""
  );
  const [keyPairAuthPrivateKey, setKeyPairAuthPrivateKey] =
    useLocalStorageState("keyPairAuthPrivateKey", "");
  const [keyPairAuthPrivateKeyPassphrase, setKeyPairAuthPrivateKeyPassphrase] =
    useLocalStorageState("keyPairAuthPrivateKeyPassphrase", "");
  const [keyPairAuthUsername, setKeyPairAuthUsername] = useLocalStorageState(
    "keyPairAuthUsername",
    ""
  );
  const [role, setRole] = useLocalStorageState("role", "");
  const [connectionType, setConnectionType] = useLocalStorageState(
    "connectionType",
    "snowflake"
  );

  const connectionRequestBody = {
    accountIdentifier,
    warehouse,
    basicAuthUsername,
    basicAuthPassword,
    keyPairAuthUsername,
    keyPairAuthPrivateKey,
    keyPairAuthPrivateKeyPassphrase,
    role,
    connectionType,
  };

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedIconName, setSelectedIconName] = useState<string>("");
  const [selectedTableRowCount, setSelectedTableRowCount] = useState<
    number | null
  >(null);
  const [isIconSuggestionLoading, setIsIconSuggestionLoading] =
    useState<boolean>(false);
  const [iconSvgString, setIconSvgString] = useState<string>(
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0091FF" viewBox="0 0 256 256" class="min-w-[24px] transition-colors duration-300"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM40,160H80v32H40Zm176,32H96V160H216v32Z"></path></svg>'
  );
  const [selectedColor, setSelectedColor] = useState<string>("#0091FF");
  const [tableDisplayName, setTableDisplayName] = useState<string>("");
  const [tableDisplayNameErrorMessage, setTableDisplayNameErrorMessage] =
    useState<string>("");

  // whenever selectedTable changes, fetch the new tableDisplayName
  useEffect(() => {
    if (selectedTable) {
      const displayName = selectedTable?.split(".")[2];
      setTableDisplayName(displayName);
    }
  }, [selectedTable]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (tableDisplayName === "") {
      setTableDisplayNameErrorMessage("Table display name cannot be empty");
      return;
    }

    const createConnectionRequestBody = {
      ...connectionRequestBody,
      name:
        capitalizeString(connectionRequestBody.connectionType) +
        " " +
        connectionRequestBody.accountIdentifier,
      createdAt: new Date().toISOString(),
      workspaceId: currentWorkspace?.id,
    };
    console.log("createConnectionRequestBody", createConnectionRequestBody);

    const jwt = await getToken({ template: "test" });

    const create_connection_response = await createConnection(
      currentWorkspace?.id,
      createConnectionRequestBody,
      jwt
    );
    console.log("create_connection_response", create_connection_response);

    const displayName = selectedTable?.split(".")[2];
    const outerPath =
      selectedTable?.split(".").slice(0, 2).join(".").replace(".", "/") + "/";

    const createTableRequestBody = {
      workspaceId: currentWorkspace?.id,
      fullPath: selectedTable,
      name: tableDisplayName,
      outerPath,
      rowCount: selectedTableRowCount,
      connectionId: create_connection_response.id,
      iconSvgString: iconSvgString,
      iconColor: selectedColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const create_table_response = await createTable(
      createTableRequestBody,
      jwt
    );
    console.log("create_table_response", create_table_response);
    console.log("createTableRequestBody", createTableRequestBody);

    //  route to the table page
    router.push(
      `/workspace/${currentWorkspace.id}/table/${create_table_response.id}`
    );
  };

  const {
    data: tablesQueryData,
    isLoading: isTablesQueryLoading,
    error: tablesQueryError,
  } = useQuery({
    queryKey: ["connectionResult", connectionRequestBody],
    queryFn: async () => {
      console.log("test");
      const response = await fetch("/api/test-snowflake-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connectionRequestBody),
      });
      return await response.json();
    },
  });

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  const {
    data: currentWorkspace,
    isLoading: isWorkspaceLoading,
    error: workspaceError,
  } = useCurrentWorkspace();

  if (isUserLoading || isTablesQueryLoading) {
    return (
      <div className="h-screen bg-slate-1">
        <AccountHeader email={""} />
        <div className="flex flex-col justify-center items-center w-full">
          <div className="bg-slate-1 text-slate-12 text-center text-[22px] pb-4"></div>
          <PreviewTableUI
            tablesQueryData={tablesQueryData}
            handleSubmit={handleSubmit}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            selectedTableRowCount={selectedTableRowCount}
            setSelectedTableRowCount={setSelectedTableRowCount}
            selectedIconName={selectedIconName}
            setSelectedIconName={setSelectedIconName}
            isIconSuggestionLoading={isIconSuggestionLoading}
            setIsIconSuggestionLoading={setIsIconSuggestionLoading}
            iconSvgString={iconSvgString}
            setIconSvgString={setIconSvgString}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            tableDisplayName={tableDisplayName}
            setTableDisplayName={setTableDisplayName}
            tableDisplayNameErrorMessage={tableDisplayNameErrorMessage}
            setTableDisplayNameErrorMessage={setTableDisplayNameErrorMessage}
            isLoading={isUserLoading || isTablesQueryLoading}
          />
        </div>
      </div>
    );
  }

  if (userError || tablesQueryError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  console.log("first tablesQuery", tablesQueryData);

  return (
    <>
      <Head>
        <title>{currentWorkspace.name} › Import table</title>
      </Head>
      <div className="h-screen bg-slate-1">
        <AccountHeader email={email ?? "placeholder@example.com"} />
        <div className="flex flex-col justify-center items-center w-full">
          <div className="bg-slate-1 text-slate-12 text-center text-[22px] pb-4"></div>
          <PreviewTableUI
            tablesQueryData={tablesQueryData}
            handleSubmit={handleSubmit}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            selectedTableRowCount={selectedTableRowCount}
            setSelectedTableRowCount={setSelectedTableRowCount}
            selectedIconName={selectedIconName}
            setSelectedIconName={setSelectedIconName}
            isIconSuggestionLoading={isIconSuggestionLoading}
            setIsIconSuggestionLoading={setIsIconSuggestionLoading}
            iconSvgString={iconSvgString}
            setIconSvgString={setIconSvgString}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            tableDisplayName={tableDisplayName}
            setTableDisplayName={setTableDisplayName}
            tableDisplayNameErrorMessage={tableDisplayNameErrorMessage}
            setTableDisplayNameErrorMessage={setTableDisplayNameErrorMessage}
            isLoading={isUserLoading || isTablesQueryLoading}
          />
        </div>
      </div>
    </>
  );
}
