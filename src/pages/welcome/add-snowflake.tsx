import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { useUser } from "../../components/UserContext";
import useCopyToClipboard from "../../components/useCopyToClipboard";
import router from "next/router";
import Image from "next/image";
import {
  CaretLeft,
  CopySimple,
  Check,
  CircleNotch,
  CheckCircle,
  XCircle,
  X,
} from "@phosphor-icons/react";
import { Switch } from "@headlessui/react";
import DataTable, { createTheme } from "react-data-table-component";
import WordTooltipDemo from "../../components/WordTooltipDemo";
import * as Dialog from "@radix-ui/react-dialog";

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

type IPProps = {
  ip: string;
};

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

  // .slateDark {
  //   --slate1: hsl(200, 7.0%, 8.8%);
  //   --slate2: hsl(195, 7.1%, 11.0%);
  //   --slate3: hsl(197, 6.8%, 13.6%);
  //   --slate4: hsl(198, 6.6%, 15.8%);
  //   --slate5: hsl(199, 6.4%, 17.9%);
  //   --slate6: hsl(201, 6.2%, 20.5%);
  //   --slate7: hsl(203, 6.0%, 24.3%);
  //   --slate8: hsl(207, 5.6%, 31.6%);
  //   --slate9: hsl(206, 6.0%, 43.9%);
  //   --slate10: hsl(206, 5.2%, 49.5%);
  //   --slate11: hsl(206, 6.0%, 63.0%);
  //   --slate12: hsl(210, 6.0%, 93.0%);
  // }

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

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <div
          className="text-xs px-2 py-1 bg-green-900/20 hover:bg-green-900/40 w-28 rounded-md"
          tabIndex={-1}
        >
          See full table list
        </div>
      </Dialog.Trigger>
      <Dialog.Portal className="z-100">
        <Dialog.Overlay className="bg-slate-1 opacity-75 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] max-w-[90vw] w-[1000px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-2 border border-slate-3 text-white p-5 focus:outline-none overflow-hidden">
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
              <button className="px-4 py-3 bg-slate-3 rounded-md text-xs font-medium leading-none focus:outline-none hover:bg-slate-4">
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

const CopyableIP: FC<IPProps> = ({ ip }) => {
  const { isCopied, handleCopy } = useCopyToClipboard();

  return (
    <div
      className="flex flex-row gap-1 relative cursor-pointer"
      onClick={() => handleCopy(ip)}
    >
      <CopySimple size={16} weight="bold" className="text-slate-11" />
      <p>{ip}</p>
      {isCopied && (
        <div className="absolute top-6 px-2 py-1 text-white bg-black rounded flex flex-row items-center gap-1">
          <Check size={12} weight="bold" className="text-green-500" />
          Copied!
        </div>
      )}
    </div>
  );
};

export default function AddSnowflake() {
  const { user } = useUser();
  const email = user?.email ?? "placeholder@example.com";
  const [useCustomHost, setUseCustomHost] = useState(false);
  const [customHostAccountIdentifier, setCustomHostAccountIdentifier] =
    useState("");
  const [snowflakeAuthMethod, setSnowflakeAuthMethod] = useState("user_pass");

  // Snowflake vars
  const [accountIdentifier, setAccountIdentifier] = useState<string>("");
  const [customHost, setCustomHost] = useState<string>("");
  const [warehouse, setWarehouse] = useState<string>("");
  const [basicAuthUsername, setBasicAuthUsername] = useState<string>("");
  const [basicAuthPassword, setBasicAuthPassword] = useState<string>("");
  const [keyPairAuthPrivateKey, setKeyPairAuthPrivateKey] =
    useState<string>("");
  const [keyPairAuthPrivateKeyPassphrase, setKeyPairAuthPrivateKeyPassphrase] =
    useState<string>("");
  const [keyPairAuthUsername, setKeyPairAuthUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [connectionResult, setConnectionResult] = useState<any>({
    status: null,
    title: null,
    message: null,
    snowflake_error: null,
    listed_tables: null,
    listed_databases: null,
  });

  const [connectionTestInProgress, setConnectionTestInProgress] =
    useState<boolean>(false);
  const [showTestPanel, setShowTestPanel] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // get form data
    console.log("clicked");
  };

  const handleConnectionTest = async (e: any) => {
    e.preventDefault();

    // Reset connection result
    setShowTestPanel(true);
    setConnectionTestInProgress(true);
    setConnectionResult({
      status: null,
      title: null,
      message: null,
      snowflake_error: null,
      listed_tables: null,
      listed_databases: null,
    });

    const data = {
      accountIdentifier,
      warehouse,
      basicAuthUsername,
      basicAuthPassword,
      keyPairAuthUsername,
      keyPairAuthPrivateKey,
      keyPairAuthPrivateKeyPassphrase,
      role,
    };
    console.log("begin handleConnectionTest", data);

    const endpoint =
      "https://us-central1-dataland-demo-995df.cloudfunctions.net/dataland-1b-connection-testing/test-connection";

    interface SnowflakeData {
      user: string;
      password: string;
      account: string;
      warehouse: string;
      role: string | null;
    }

    const requestBody: SnowflakeData = {
      user: basicAuthUsername,
      password: basicAuthPassword,
      account: accountIdentifier,
      warehouse: warehouse,
      role: role,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("response:", JSON.stringify(response));
      const data = await response.json();

      console.log("data", data);
      let message = data.message;
      // if (message.includes("Contact your local security")) {
      //   message = message.replace(
      //     "Contact your local security administrator or please create a case with Snowflake Support or reach us on our support line: \n USA: +1 855 877 7505  \n Netherlands: +31 20 809 8018 \n Germany: +49 30 7675 8326 \n UK: +44 1207 710140 \n France: +33 18 652 9998 \n Australia: +61 1800 921 245 \n Japan: +81 50 1791 5447",
      //     ""
      //   );
      // }
      setConnectionTestInProgress(false);
      setConnectionResult({
        status: data.status,
        title:
          data.status === "success"
            ? "Success! You can continue to the next step."
            : "Connection failed",
        message: message,
        snowflake_error: data.snowflake_error ?? null,
        listed_tables: data.listed_tables ?? null,
        listed_databases: data.listed_databases ?? null,
      });
      if (data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("error!", error);
      console.log("error", error);
      console.log("error_string", JSON.stringify(error));

      setConnectionTestInProgress(false);
      setConnectionResult({
        status: "error",
        title: "Connection failed",
        message:
          JSON.stringify(error) === "{}"
            ? "Request timed out. Check if the account identifier is correct, and try again."
            : JSON.stringify(error),
      });
      return false;
    }

    //  call this endpoint
    // https://us-central1-dataland-demo-995df.cloudfunctions.net/dataland-1b-connection-testing
    // with the data above
    // and set the result to connectionResult
  };

  const handleContinue = async (e: any) => {
    e.preventDefault();
    console.log("clicked Continue button");
    if (connectionResult.status === "success") {
      router.push("/welcome/create-table");
    } else {
      // test connection
      const connectionTestResultSuccessful = await handleConnectionTest(e);
      if (connectionTestResultSuccessful === true) {
        console.log("success");
        setTimeout(() => {
          router.push("/welcome/create-table");
        }, 2000);
      } else {
        return;
      }
    }
  };

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col mx-auto w-[600px] text-white gap-2 mt-4">
        <Link href="/welcome/add-data-source">
          <div className="flex flex-row items-center gap-2 text-xs text-slate-11">
            <CaretLeft size={16} weight="bold" />
            <p>Back to sources</p>
          </div>
        </Link>
        <div className="flex flex-row items-center gap-4 mt-4">
          <Image
            src="../../images/logos/logo_snowflake.svg"
            width={24}
            height={24}
            alt="Snowflake logo"
            draggable={false}
          ></Image>
          <p className="flex-grow text-md">Set up Snowflake connection</p>
          <Link href="/" className="text-xs px-3 py-2 bg-slate-3 rounded-md">
            Snowflake docs
          </Link>
        </div>
        <div className="border-t border-slate-3 mt-2"></div>
        <form onSubmit={handleConnectionTest}>
          {useCustomHost === false ? (
            <>
              <div className="flex flex-row w-full items-center mt-4 gap-4">
                <label className="text-xs min-w-[120px]">
                  <WordTooltipDemo
                    display_text={"Account identifier"}
                    tooltip_content={
                      <div className="max-w-[240px] space-y-2">
                        <p>
                          This can be found in the Snowflake URL, ex:&nbsp;
                          <span className="bg-blue-900/40 px-1 py-0.5 rounded-md font-mono text-blue-400">
                            acct_id
                          </span>
                          .snowflakecomputing.com.
                        </p>
                      </div>
                    }
                  />
                </label>
                <div className="flex flex-row items-center flex-grow">
                  <input
                    className="rounded-l block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    value={accountIdentifier}
                    onChange={(e) => setAccountIdentifier(e.target.value)}
                    placeholder="account_identifier"
                  />
                  <div className="rounded-r block bg-slate-6 text-white border-t border-r border-b border-slate-6 text-xs py-2 px-2 ">
                    .snowflakecomputing.com
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <label className="text-xs w-20">Custom host?</label>
                  <Switch
                    checked={useCustomHost}
                    onChange={setUseCustomHost}
                    className={`${
                      useCustomHost ? "bg-blue-600" : "bg-slate-6"
                    } relative inline-flex h-6 w-11 items-center rounded-full overflow-hidden`}
                  >
                    <span
                      className={`${
                        useCustomHost ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-row w-full items-center mt-4 gap-4">
                <label className="text-xs w-[120px]">Custom host</label>
                <div className="flex flex-row items-center flex-grow">
                  <input
                    className="rounded-md block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    value={customHost}
                    onChange={(e) => setCustomHost(e.target.value)}
                    placeholder="Snowflake custom host"
                  />
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <label className="text-xs w-20">Custom host?</label>
                  <Switch
                    checked={useCustomHost}
                    onChange={setUseCustomHost}
                    className={`${
                      useCustomHost ? "bg-blue-600" : "bg-slate-6"
                    } relative inline-flex h-6 w-11 items-center rounded-full overflow-hidden`}
                  >
                    <span
                      className={`${
                        useCustomHost ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              </div>
              <div className="flex flex-row w-full items-center mt-4 gap-4">
                <label className="text-xs w-[120px]">
                  <WordTooltipDemo
                    display_text={"Account identifier"}
                    tooltip_content={
                      <div className="max-w-[240px] space-y-2">
                        <p>
                          The account identifier associated with your custom
                          host.
                        </p>
                      </div>
                    }
                  />
                </label>
                <div className="flex flex-row items-center flex-grow">
                  <input
                    className="rounded-md block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    value={customHostAccountIdentifier}
                    onChange={(e) =>
                      setCustomHostAccountIdentifier(e.target.value)
                    }
                    placeholder="account_identifier"
                  />
                </div>
              </div>
            </>
          )}
          <div className="flex flex-row items-center mt-4 gap-4">
            <label className="text-xs w-[120px]">
              <WordTooltipDemo
                display_text={"Warehouse"}
                tooltip_content={
                  <div className="max-w-[200px] space-y-2">
                    <p>
                      We recommend using at least a small size warehouse. Larger
                      sizes will speed up ingest time.
                    </p>
                  </div>
                }
              />
            </label>
            <div className="flex flex-row items-center flex-grow">
              <input
                className="rounded-md block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                required
                placeholder="i.e. SMALL_WH"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row items-center mt-4 gap-4">
            <label className="text-xs w-[120px]">Auth method</label>
            <select
              title="Auth method"
              className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600"
              onChange={(e) => setSnowflakeAuthMethod(e.target.value)}
            >
              <option value="user_pass">Username / password</option>
              <option value="key_value">Key pair</option>
            </select>
          </div>
          <div>
            {snowflakeAuthMethod === "user_pass" ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center mt-4 gap-4">
                  <label className="text-xs w-[120px]">Username</label>
                  <input
                    className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    placeholder=""
                    title="Username"
                    value={basicAuthUsername}
                    onChange={(e) => setBasicAuthUsername(e.target.value)}
                  />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <label className="text-xs w-[120px]">Password</label>
                  <input
                    className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    placeholder=""
                    title="Password"
                    value={basicAuthPassword}
                    onChange={(e) => setBasicAuthPassword(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center mt-4 gap-4">
                    <label className="text-xs w-[120px]">Username</label>
                    <input
                      className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                      required
                      placeholder=""
                      title="Key Pair Username"
                      value={keyPairAuthUsername}
                      onChange={(e) => setKeyPairAuthUsername(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-row items-start gap-4">
                    <label className="text-xs w-[120px] mt-2">
                      <WordTooltipDemo
                        display_text={"Private key"}
                        tooltip_content={
                          <div className="max-w-[210px] space-y-2">
                            <p>
                              The private key (in PEM format) for key pair
                              authentication. See Snowflake docs on{" "}
                              <Link
                                href="https://docs.snowflake.com/en/user-guide/key-pair-auth"
                                target="_blank"
                                className="text-blue-500"
                              >
                                key pair auth.
                              </Link>
                            </p>
                          </div>
                        }
                      />
                    </label>
                    <textarea
                      className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 h-20 min-h-[64px] border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                      required
                      placeholder={`-----BEGIN ENCRYPTED PRIVATE KEY-----
{{private_key_value}}
-----END ENCRYPTED PRIVATE KEY-----`}
                      title="Private key"
                      value={keyPairAuthPrivateKey}
                      onChange={(e) => setKeyPairAuthPrivateKey(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <label className="text-xs w-[120px]">
                      <WordTooltipDemo
                        display_text={
                          <>
                            <div className=" border-b border-slate-11 border-dotted">
                              Private key{" "}
                            </div>
                            <div>passphrase</div>
                          </>
                        }
                        tooltip_content={
                          <div className="max-w-[210px] space-y-2">
                            <p>
                              The passphrase to decrypt the private key, if the
                              key is encrypted. See Snowflake docs on{" "}
                              <Link
                                href="https://docs.snowflake.com/en/user-guide/key-pair-auth"
                                target="_blank"
                                className="text-blue-500"
                              >
                                key pair auth.
                              </Link>
                            </p>
                          </div>
                        }
                      />
                    </label>
                    <input
                      className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                      required
                      placeholder="•••••••••••"
                      title="Private key passphrase"
                      value={keyPairAuthPrivateKeyPassphrase}
                      onChange={(e) =>
                        setKeyPairAuthPrivateKeyPassphrase(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-row items-center mt-4 gap-4">
            <label className="text-xs w-[120px]">
              <WordTooltipDemo
                display_text={"Role (optional)"}
                tooltip_content={
                  <div className="max-w-[200px] space-y-2">
                    <p>Dataland only needs a read-only role to sync tables. </p>
                    <p>
                      You can create a read-only role in Snowflake, and grant it
                      your specified username/password. See{" "}
                      <Link
                        href="https://docs.snowflake.com/en/user-guide/security-access-control-configure#creating-custom-roles"
                        target="_blank"
                        className="text-blue-500"
                      >
                        Snowflake docs on roles.
                      </Link>
                    </p>
                    <p>
                      If no role is specified, the user&apos;s default role will
                      be used. You can see the default role used when clicking
                      `Test connection`.&nbsp;
                    </p>
                  </div>
                }
              />
            </label>
            <div className="flex flex-row items-center flex-grow">
              <input
                className="rounded-md block w-full bg-slate-3 text-white text-xs py-2 px-3 border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                placeholder="i.e. PUBLIC"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row mt-4 gap-4">
            <label className="text-xs w-[120px] pt-2">Whitelist IPs</label>
            <div className="flex flex-col gap-2 px-4 py-3 border border-slate-4 rounded-md flex-grow text-xs">
              <div className="flex flex-row flex-grow text-xs text-slate-11">
                <p>
                  Allow Dataland to connect to Snowflake via these IPs&nbsp;
                </p>
                <Link
                  href="https://docs.snowflake.com/en/user-guide/network-policies#creating-network-policies"
                  target="_blank"
                >
                  (<span className="underline">see docs</span>)
                </Link>
              </div>
              <div className="flex flex-row gap-4">
                <CopyableIP ip="000.000.00.00" />
                <CopyableIP ip="111.111.111.11" />
                <CopyableIP ip="222.222.22" />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end mt-8 gap-4 text-xs">
            <button
              className="text-xs px-3 py-2 bg-slate-3 rounded-md hover:bg-slate-4"
              type={"submit"}
            >
              Test connection
            </button>
            <button
              onClick={handleContinue}
              className={`text-xs px-3 py-2 bg-blue-600 rounded-md ${
                connectionResult.status !== "success" &&
                "opacity-50 pointer-events-none disabled"
              }`}
            >
              Continue
            </button>
          </div>
          {showTestPanel && (
            <>
              <div className="flex flex-row gap-4 mt-4">
                <label className="text-xs min-w-[120px]"></label>
                <div
                  className={` text-white p-4 mt-4 rounded-md flex-grow ${
                    connectionResult.status === "error"
                      ? "bg-red-900/10  border-red-900 border"
                      : ""
                  } ${
                    connectionResult.status === "success"
                      ? "bg-green-900/10 border-green-900 border"
                      : ""
                  }
                  ${
                    connectionResult.status !== "success" &&
                    connectionResult.status !== "error"
                      ? "bg-slate-3"
                      : ""
                  }`}
                >
                  {connectionTestInProgress && (
                    <div className="flex flex-row gap-2 items-center">
                      <div className="relative inline-block">
                        <CircleNotch
                          width={16}
                          height={16}
                          weight="bold"
                          className="animate-spin"
                        />
                      </div>
                      <p className="text-xs">In progress..</p>
                    </div>
                  )}
                  {connectionResult.message &&
                    connectionResult.title &&
                    connectionResult.status &&
                    connectionTestInProgress === false && (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                          {connectionResult.status === "error" ? (
                            <XCircle
                              width={16}
                              height={16}
                              className="text-red-500"
                            />
                          ) : connectionResult.status === "success" ? (
                            <CheckCircle
                              width={16}
                              height={16}
                              className="text-green-500"
                            />
                          ) : null}
                          <p className="text-xs">{connectionResult.title}</p>
                        </div>
                        {connectionResult.status === "success" && (
                          <>
                            <p className="text-xs">
                              This connection can access{" "}
                              {connectionResult.listed_tables.length} tables
                              from {connectionResult.listed_databases.length}{" "}
                              databases.
                            </p>
                            <PreviewTablesDialog
                              tables={connectionResult.listed_tables}
                            />
                          </>
                        )}
                        {connectionResult.status === "error" && (
                          <>
                            <p className="text-[11px]">
                              <pre className="px-3 py-2 bg-black/40 rounded-md  whitespace-pre-wrap break-words overflow-x-auto">
                                {connectionResult.snowflake_error}
                              </pre>
                            </p>
                            {/* Don't show if error message is generic */}
                            {connectionResult.message !==
                              "Connection failed" && (
                              <p className="text-xs">
                                {connectionResult.message}
                              </p>
                            )}
                          </>
                        )}
                        {connectionResult.snowflake_error?.includes("IP") && (
                          <div className="inline relative text-xs text-red-200">
                            <p className="inline">
                              Please allow Dataland to connect to Snowflake via
                              IPs: <br />
                              000.000.00.00, 111.111.111.11, and
                              222.222.22&nbsp;
                            </p>
                            <Link
                              href="https://docs.snowflake.com/en/user-guide/network-policies#creating-network-policies"
                              target="_blank"
                              className="inline underline"
                            >
                              (see docs)
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
