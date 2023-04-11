// import { useState, createContext, useContext, useRef } from "react";
// import "../App.css";
// import { AnimatePresence, motion, MotionConfig } from "framer-motion";
// import useMeasure from "react-use-measure";
// import { InformationCircleIcon } from "@heroicons/react/24/solid";
// import PostgresImg from "../assets/Logo Postgres.svg";
// import BigQueryImg from "../assets/Logo Bigquery.svg";
// import SnowflakeImg from "../assets/Logo Snowflake.svg";
// import { Switch } from "@headlessui/react";

// export default function Onboarding() {
//   let [connection_choice, setConnectionChoice] = useState(null);

//   const connectionOptions = {
//     snowflake: {
//       name: "Snowflake",
//       icon: SnowflakeImg,
//     },
//     postgres: {
//       name: "Postgres",
//       icon: PostgresImg,
//     },
//     bigquery: {
//       name: "BigQuery",
//       icon: BigQueryImg,
//     },
//   };

//   return (
//     <div className="w-full bg-gray-900 text-white">
//       <div className="z-10 w-full"></div>
//       <MotionConfig>
//         <div className="flex w-full flex-col items-start mt-6 overflow-scroll">
//           <div className="mx-auto w-full max-w-lg">
//             <div className="mb-6">
//               <motion.div
//                 className="mb-6"
//                 initial={{
//                   opacity: 0,
//                   y: 20,
//                 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{
//                   delay: 0.2,
//                 }}
//               >
//                 <p className="text-md text-white mb-1">Add new data source</p>
//                 <p className="text-xs text-gray-400">
//                   Follow the steps below to set up a new data source
//                 </p>
//               </motion.div>
//               <motion.div
//                 initial={{
//                   opacity: 0,
//                   y: 20,
//                 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{
//                   delay: 0.3,
//                 }}
//               >
//                 <Form>
//                   <fieldset>
//                     <label className="text-white text-xs font-medium">
//                       Connection type
//                     </label>
//                     <div className="mb-4 flex flex-row gap-4">
//                       {/* Cool Pen https://codepen.io/dromo77/pen/ZEQWyaZ */}
//                       {/*  for each connectionOption, render the card */}
//                       {Object.entries(connectionOptions).map(
//                         ([key, { name, icon }]) => (
//                           <motion.label
//                             // {/* if input is checked, then apply border-blue-500 to parent label*/}
//                             className={`flex flex-col w-24 h-24 items-center justify-center rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 focus:border-blue-500 cursor-pointer`}
//                             animate={
//                               connection_choice === key
//                                 ? "checked"
//                                 : "unchecked"
//                             }
//                             variants={{
//                               checked: {
//                                 borderColor: "var(--blue-500)",
//                                 backgroundColor: "var(--blue-900)",
//                               },
//                               unchecked: {
//                                 borderColor: "var(--gray-700)",
//                                 backgroundColor: "var(--gray-900)",
//                               },
//                             }}
//                             whileHover={{
//                               borderColor:
//                                 connection_choice === key
//                                   ? "var(--blue-500)"
//                                   : "var(--gray-600)",
//                             }}
//                             key={key}
//                             transition={{
//                               duration: 0.2,
//                             }}
//                           >
//                             <input
//                               className="radio opacity-0 h-0"
//                               type="radio"
//                               name="connection_type"
//                               value={key}
//                               required
//                               checked={connection_choice === key}
//                               onChange={(e) =>
//                                 setConnectionChoice(e.target.value)
//                               }
//                             />
//                             <div className="flex flex-col items-center gap-4">
//                               <img src={icon} className="w-8 h-8" />
//                               <span className="font-medium">{name}</span>
//                             </div>
//                           </motion.label>
//                         )
//                       )}
//                     </div>
//                   </fieldset>
//                 </Form>
//               </motion.div>
//             </div>
//             <motion.div
//               initial={{
//                 opacity: 0,
//                 y: 20,
//               }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 delay: 0.4,
//               }}
//             >
//               <AnimatePresence mode="popLayout">
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.2 }}
//                   exit={{ opacity: 0 }}
//                   key={connection_choice}
//                   className="relative"
//                 >
//                   {connectionContent(connection_choice)}
//                 </motion.div>
//               </AnimatePresence>
//             </motion.div>
//           </div>
//         </div>
//       </MotionConfig>
//     </div>
//   );
// }

// function connectionContent(connection_choice) {
//   let [snowflake_custom_host, setSnowflakeCustomHost] = useState(false);
//   let [snowflake_auth_method, setSnowflakeAuthMethod] = useState("user_pass");
//   console.log("snowflake_custom_host", snowflake_custom_host);
//   let [snowflakeHostRef, snowflakeHostBounds] = useMeasure();
//   let [snowflakeAuthRef, snowflakeAuthBounds] = useMeasure();
//   let transition = { type: "ease", ease: "easeInOut", duration: 0.4 };

//   console.log(
//     "snowflakeHostBounds",
//     snowflakeHostBounds,
//     "snowflakeAuthBounds",
//     snowflakeAuthBounds
//   );

//   switch (connection_choice) {
//     case "snowflake":
//       return (
//         <div className="flex flex-col gap-4 text-white">
//           <p className="text-md text-white">Snowflake credentials</p>
//           <div className="flex flex-row items-center">
//             <div className="flex flex-col grow">
//               <p className="text-white font-medium text-xs">Use custom host</p>
//               <p className="text-gray-400 text-xs mt-1">
//                 If you access Snowflake through a proxy server
//               </p>
//             </div>
//             <div>
//               <Switch
//                 checked={snowflake_custom_host}
//                 onChange={setSnowflakeCustomHost}
//                 className={`${
//                   snowflake_custom_host ? "bg-blue-600" : "bg-gray-700"
//                 } relative inline-flex h-6 w-11 items-center rounded-full overflow-hidden`}
//               >
//                 <span
//                   className={`${
//                     snowflake_custom_host ? "translate-x-6" : "translate-x-1"
//                   } inline-block h-4 w-4 transform rounded-full bg-white transition`}
//                 />
//               </Switch>
//             </div>
//           </div>
//           <motion.div
//             animate={{
//               height:
//                 snowflakeHostBounds.height > 0
//                   ? snowflakeHostBounds.height
//                   : null,
//             }}
//             transition={{
//               type: "spring",
//               bounce: 0.2,
//               duration: transition.duration,
//             }}
//           >
//             <div ref={snowflakeHostRef}>
//               <AnimatePresence mode="popLayout">
//                 {snowflake_custom_host ? (
//                   <motion.div
//                     exit={{ opacity: 0 }}
//                     transition={{
//                       ...transition,
//                       duration: transition.duration / 2,
//                     }}
//                     key="custom_host_form"
//                     className="flex flex-col gap-4"
//                   >
//                     <div>
//                       <label className="text-white text-xs font-medium">
//                         Custom host
//                       </label>
//                       <input
//                         className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//                         required
//                         placeholder="Snowflake custom host"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-white text-xs font-medium">
//                         Snowflake account
//                       </label>
//                       <input
//                         className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//                         required
//                         placeholder="Snowflake account"
//                       />
//                     </div>
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     exit={{ opacity: 0 }}
//                     transition={{
//                       ...transition,
//                       duration: transition.duration / 2,
//                     }}
//                     key="custom_host_form"
//                   >
//                     <label className="text-white text-xs font-medium">
//                       Account
//                     </label>
//                     <div className="flex flex-row">
//                       <input
//                         className="rounded-l block w-full bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//                         required
//                         placeholder="account_name"
//                       />
//                       <div className="rounded-r block bg-gray-800 text-white text-xs py-2 px-3 mt-2 border border-l-gray-800 border-t-gray-700 border-b-gray-700 border-r-gray-700">
//                         .snowflakecomputing.com
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//           <WhitelistIPs />
//           <div>
//             <label className="text-white text-xs font-medium">Warehouse</label>
//             <input
//               className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//               required
//               placeholder="Snowflake warehouse"
//             />
//           </div>
//           <div>
//             <label className="text-white text-xs font-medium">
//               Auth method
//             </label>

//             <select
//               className="mt-2 block text-xs bg-gray-900 w-full rounded-md border-gray-700 py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//               onChange={(e) => setSnowflakeAuthMethod(e.target.value)}
//             >
//               <option value="user_pass">Username / password</option>
//               <option value="key_value">Key / value pair</option>
//             </select>
//           </div>
//           <motion.div
//             animate={{
//               height:
//                 snowflakeAuthBounds.height > 0
//                   ? snowflakeAuthBounds.height
//                   : null,
//             }}
//             transition={{
//               type: "spring",
//               bounce: 0.2,
//               duration: transition.duration,
//             }}
//           >
//             <div ref={snowflakeAuthRef}>
//               <AnimatePresence mode="popLayout">
//                 {snowflake_auth_method === "user_pass" ? (
//                   <motion.div
//                     exit={{ opacity: 0 }}
//                     transition={{
//                       ...transition,
//                       duration: transition.duration / 2,
//                     }}
//                     key="snowflake_auth_form"
//                     className="flex flex-col gap-4"
//                   >
//                     <div>
//                       <label className="text-white text-xs font-medium">
//                         Username
//                       </label>
//                       <input
//                         className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="text-white text-xs font-medium">
//                         Password
//                       </label>
//                       <input
//                         className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//                         required
//                       />
//                     </div>
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     exit={{ opacity: 0 }}
//                     transition={{
//                       ...transition,
//                       duration: transition.duration / 2,
//                     }}
//                     key="snowflake_auth_form"
//                   >
//                     <div className="mb-4">
//                       <label className="text-white text-xs font-medium">
//                         Key
//                       </label>
//                       <input
//                         className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="text-white text-xs font-medium">
//                         Value
//                       </label>
//                       <input
//                         className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//                         required
//                       />
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//           <div>
//             <label className="text-white text-xs font-medium">Role</label>
//             <input
//               className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//               required
//             />
//           </div>
//           <ConnectionFooter />
//         </div>
//       );
//     case "postgres":
//       return (
//         <div className="flex flex-col gap-4">
//           <p className="text-md text-white">Postgres credentials</p>
//           <div>
//             <label className="text-white text-xs font-medium">Host</label>
//             <input
//               className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="text-white text-xs font-medium">Port</label>
//             <input
//               className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//               required
//               placeholder="5432"
//             />
//           </div>
//           <WhitelistIPs />
//           <div>
//             <label className="text-white text-xs font-medium">Database</label>
//             <input
//               className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//               required
//               placeholder="postgres"
//             />
//           </div>
//           <div>
//             <label className="text-white text-xs font-medium">Username</label>
//             <input
//               className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//               required
//               placeholder="postgres"
//             />
//           </div>
//           <div>
//             <label className="text-white text-xs font-medium">Password</label>
//             <input
//               className="block w-full rounded bg-gray-900 text-white text-xs py-2 px-3 mt-2 border border-gray-700 hover:border-gray-600 focus:border-blue-500"
//               required
//             />
//           </div>
//           <ConnectionFooter />
//         </div>
//       );
//     case "bigquery":
//       return (
//         <div className="flex flex-col gap-4">
//           <p className="text-md text-white">BigQuery credentials</p>
//           <div className="flex flex-col gap-1">
//             <label className="text-white text-xs font-medium">
//               Service account JSON
//             </label>
//             <label className="text-gray-400 text-xs">
//               See how to get this file here. Roles must be BigQuery Data Viewer
//               and BigQuery User.
//             </label>
//             <DragDropFile />
//           </div>
//           <WhitelistIPs />
//           <ConnectionFooter />
//         </div>
//       );
//   }
// }

// function DragDropFile() {
//   // drag state
//   const [dragActive, setDragActive] = useState(false);
//   // ref
//   const inputRef = useRef(null);

//   // handle drag events
//   const handleDrag = function (e) {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   // triggers when file is dropped
//   const handleDrop = function (e) {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       // handleFiles(e.dataTransfer.files);
//     }
//   };

//   // triggers when file is selected with click
//   const handleChange = function (e) {
//     e.preventDefault();
//     if (e.target.files && e.target.files[0]) {
//       // handleFiles(e.target.files);
//     }
//   };

//   // triggers the input when the button is clicked
//   const onButtonClick = () => {
//     inputRef.current.click();
//   };

//   return (
//     <form
//       id="form-file-upload"
//       onDragEnter={handleDrag}
//       onSubmit={(e) => e.preventDefault()}
//     >
//       <input
//         ref={inputRef}
//         type="file"
//         id="input-file-upload"
//         multiple={true}
//         onChange={handleChange}
//       />
//       <label
//         id="label-file-upload"
//         htmlFor="input-file-upload"
//         className={`${dragActive ? "bg-blue-900/50 border-blue-500" : ""}
//           block w-full h-32 flex items-center justify-center rounded bg-gray-900 text-white py-2 px-3 mt-2 border-2 border-dashed border-gray-700 hover:border-gray-600 hover:bg-gray-800/30 focus:border-blue-500 cursor-pointer`}
//       >
//         <div className="text-xs flex flex-col gap-1">
//           <button
//             className="upload-button text-blue-500 font-medium"
//             onClick={onButtonClick}
//           >
//             Upload your service account JSON file
//           </button>
//           <p className="text-gray-400 font-medium">or drag and drop</p>
//         </div>
//       </label>
//       {dragActive && (
//         <div
//           id="drag-file-element"
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         ></div>
//       )}
//     </form>
//   );
// }

// let formContext = createContext();

// function Form({ onSubmit, afterSave, children, ...props }) {
//   let [status, setStatus] = useState("idle");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setStatus("saving");
//     await onSubmit();
//     setStatus("success");
//     await delay(1250);
//     afterSave();
//   }

//   return (
//     <formContext.Provider value={{ status }}>
//       <form onSubmit={handleSubmit} {...props}>
//         <fieldset disabled={status !== "idle"}>{children}</fieldset>
//       </form>
//     </formContext.Provider>
//   );
// }

// function WhitelistIPs() {
//   return (
//     <div className="flex flex-row grow bg-gray-800 py-4 px-6 gap-4 text-xs font-medium rounded">
//       <InformationCircleIcon className="h-8 w-8 text-gray-500" />
//       Dataland will connect from 00.000.000.00, 000.000.000.00,
//       000.0000.0000.00, and 00.000.00.000
//     </div>
//   );
// }
// function ConnectionFooter() {
//   return (
//     <div className="mt-2">
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center" aria-hidden="true">
//           <div className="w-full border-t border-gray-700" />
//         </div>
//         <div className="relative flex justify-center"></div>
//       </div>
//       <button
//         type="button"
//         className="my-6 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-300"
//       >
//         Test connection
//       </button>
//     </div>
//   );
// }

// // drag drop file component
