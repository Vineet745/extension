// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// // Add this line to let TypeScript know about the chrome global

// const Popup = () => {
//   const [products, setProducts] = useState([])
// // const handlePickColor = () => {
// //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// //     const tab = tabs[0];
// //     const url = tab?.url || '';

// //     if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
// //       alert('Cannot run color picker on this page. Open a normal website tab.');
// //       return;
// //     }

// //     chrome.scripting.executeScript(
// //       {
// //         target: { tabId: tab.id },
// //         files: ['copyText.js'],
// //       },
// //       () => {
// //         // Only close the popup after script is injected
// //         window.close();
// //       }
// //     );
// //   });
// // };

// useEffect(() => {
//   getProducts()
// }, [])

// const getProducts = async() => {
//   try {
//     const productData = await axios.get('https://fakestoreapi.com/products')
//     setProducts(productData.data)
//   } catch (error) {
//     console.log("Error",error)
//   }
// }

//   return (
//     <div style={{ padding: 10, width: 400,height:300 }}>
//       <h3>🎨 Color Picker</h3>
//       {products.map((item,index)=>{
//         return(
//           <>
//           <h4>{index + 1}. {item?.title}</h4>
//           <p>{item.description}</p>
//           </>
//         )
//       })}
//       {/* <button onClick={handlePickColor}>Pick a Color</button> */}
//     </div>
//   );
// };

// export default Popup;

import React, { useEffect, useState } from "react";
import { login } from "../service/api/authApi";
import MobileNumbers from "../components/mobileNumbers/MobileNumbers";
import SettingTab from "../components/settingTab/SettingTab";
import PublishOptions from "../components/publishOptions/PublishOptions";
import StatusUploader from "../components/StatusUploader/StatusUploader";

const Popup = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("groups");
  //   const handleSend = () => {
  //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //       const tab = tabs[0];
  //       if (!tab.url.includes("web.whatsapp.com")) {
  //         chrome.tabs.create({ url: "https://web.whatsapp.com" }, (newTab) => {
  //           waitForWhatsAppAndSend(newTab.id);
  //         });
  //       } else {
  //         waitForWhatsAppAndSend(tab.id);
  //       }
  //     });
  //   };

  //   const waitForWhatsAppAndSend = (tabId) => {
  //   chrome.scripting.executeScript({
  //     target: { tabId },
  //     func: (name, message) => {
  //       const normalized = (str) => str?.trim().toLowerCase();

  //       window.sendWhatsAppMessage = function (name, message) {
  //         const interval = setInterval(() => {
  //           // Try to find chat by aria-label first (more reliable)
  //           const allChats = document.querySelectorAll("div[aria-label]");
  //           const chat = Array.from(allChats).find(
  //             (el) => normalized(el.getAttribute("aria-label")) === normalized(name)
  //           );

  //           if (chat) {
  //             chat.click();

  //             setTimeout(() => {
  //               // Try to get the active input box
  //               const messageBox = document.querySelector("div[contenteditable='true'][data-tab]");
  //               if (messageBox) {
  //                 messageBox.focus();

  //                 // Insert message
  //                 document.execCommand("insertText", false, message);
  //                 messageBox.dispatchEvent(new Event("input", { bubbles: true }));

  //                 // Send message
  //                 setTimeout(() => {
  //                   const sendButton = document.querySelector("span[data-icon='send']");
  //                   if (sendButton) sendButton.click();
  //                 }, 500);
  //               }
  //             }, 1000);

  //             clearInterval(interval);
  //           }
  //         }, 1000);
  //       };

  //       window.sendWhatsAppMessage(name, message);
  //     },
  //     args: [name, message],
  //   });
  // };

  

  // Login

  useEffect(() => {}, []);

  // Getlogin Api

 

  return (
    //
    <div style={{width:600,maxHeight:400}} >
    {/* <MobileNumbers /> */}
    {/* <WhatsAppSender/> */}
    {/* <PublishOptions/> */}
    <StatusUploader/>
    </div>
  );
};

export default Popup;
