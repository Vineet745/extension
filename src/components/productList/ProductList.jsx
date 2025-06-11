import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./productListStyle";
import { getGroups, getProductList, sendProduct } from "../../service/api/mobileApi";
import { handleUpload } from "../../utils/commonFunction";
import instance from "../../service/instance";

const ProductList = () => {
  const location = useLocation();
  const item = location.state?.item;
  const navigate = useNavigate();



  // State arrays to hold the whole item objects
  const [groupItems, setGroupItems] = useState([]);
  const [communityItems, setCommunityItems] = useState([]);
  const [statusItems, setStatusItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [productArray, setProductArray] = useState([])


  useEffect(() => {
    getProducts()
    getGroupsAndCommunity();
  }, []);

  

  // Get Group And community

  // const getGroupsAndCommunity = async () => {
  //   const requiredData = {
  //     mobile_number_id: 5,
  //   };
  //   try {
  //     const { data } = await getGroups(requiredData);
  //     const groupNamesArray = data?.whatsapp_type_names?.data?.map(
  //       (item) => item.name
  //     );
  //     setGroups(groupNamesArray);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };


  const getGroupsAndCommunity = async () => {
  const requiredData = {
    mobile_number_id: 5,
  };
  try {
    const { data } = await getGroups(requiredData);
    
    const groupWithTypesArray = data?.whatsapp_type_names?.data?.map(
      (item) => ({
        name: item.name.trim(),
        type: item.types, 
      })
    );

    setGroups(groupWithTypesArray); 
  } catch (error) {
    console.log("error", error);
  }
};



  const getProducts = async()=>{
    try {
      const {data} = await getProductList(item?.id)
      setProductArray(data?.data)
    } catch (error) {
      console.log("error",error )
    }
  }


  const handleToggle = (item, stateArray, setStateArray) => {
    const exists = stateArray.some((i) => i.id === item.id);
    if (exists) {
      setStateArray(stateArray.filter((i) => i.id !== item.id));
    } else {
      setStateArray([...stateArray, item]);
    }
  };

  // Send message Group and community

  // const handleSend = async() => {
  //   const groupsArray = groups
  //     .map((name) => name.trim())
  //     .filter((name) => name !== "");

  //   if (groupsArray.length === 0) {
  //     alert("⚠️ Please enter at least one group name.");
  //     return;
  //   }

  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     chrome.scripting.executeScript({
  //       target: { tabId: tabs[0].id },
  //       args: [groupsArray, productArray],
  //       func: async (groupList, products) => {
  //         const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  //         const waitForGroupAndClick = async (groupName, maxAttempts = 30) => {
  //           for (let i = 0; i < maxAttempts; i++) {
  //             const allSpans = [...document.querySelectorAll("span[title]")];
  //             const match = allSpans.find((el) => {
  //               const title = el.getAttribute("title")?.toLowerCase() || "";
  //               const text = el.textContent?.toLowerCase() || "";
  //               return (
  //                 title.includes(groupName.toLowerCase()) ||
  //                 text.includes(groupName.toLowerCase())
  //               );
  //             });

  //             if (match) {
  //               let clickable = match;
  //               for (let j = 0; j < 10 && clickable; j++) {
  //                 if (
  //                   clickable.getAttribute("role") === "listitem" ||
  //                   clickable.getAttribute("role") === "button" ||
  //                   clickable.tagName === "BUTTON" ||
  //                   clickable.tagName === "DIV"
  //                 )
  //                   break;
  //                 clickable = clickable.parentElement;
  //               }

  //               if (clickable) {
  //                 ["mousedown", "mouseup", "click"].forEach((type) =>
  //                   clickable.dispatchEvent(
  //                     new MouseEvent(type, {
  //                       bubbles: true,
  //                       cancelable: true,
  //                       view: window,
  //                     })
  //                   )
  //                 );
  //                 await sleep(2000);
  //                 return true;
  //               }
  //             }
  //             await sleep(800);
  //           }
  //           return false;
  //         };

  //         const waitForChatToOpen = async (callback, maxAttempts = 30) => {
  //           for (let i = 0; i < maxAttempts; i++) {
  //             const box = document.querySelector(
  //               "div[contenteditable='true'][data-tab='10']"
  //             );
  //             if (box && box.offsetParent !== null) {
  //               callback();
  //               return;
  //             }
  //             await sleep(1000);
  //           }
  //           alert("❌ Message box not available.");
  //         };

  //         const sendMessage = async (msg) => {
  //           return new Promise((resolve) => {
  //             waitForChatToOpen(() => {
  //               const messageBox = document.querySelector(
  //                 "div[contenteditable='true'][data-tab='10']"
  //               );
  //               if (!messageBox) {
  //                 resolve(false);
  //                 return;
  //               }

  //               messageBox.focus();

  //               navigator.clipboard
  //                 .writeText(msg)
  //                 .then(() => {
  //                   document.execCommand("paste");
  //                 })
  //                 .catch(() => {
  //                   document.execCommand("insertText", false, msg);
  //                 });

  //               setTimeout(() => {
  //                 const sendBtn = document.querySelector(
  //                   "span[data-icon='send']"
  //                 );
  //                 if (sendBtn) sendBtn.click();
  //                 resolve(true);
  //               }, 500);
  //             });
  //           });
  //         };

  //         for (const group of groupList) {
  //           const found = await waitForGroupAndClick(group);
  //           if (!found) {
  //             alert(`⚠️ Group "${group}" not found.`);
  //             continue;
  //           }

  //           for (const product of products) {
  //             const msg = `🛒 *${product.title}*\n💰 Price: $${
  //               product.price
  //             }\n🔗 ${product.amazon_product_url}\n\n${product.description || ""}\n Affilated Url : - ${product.product_affiliate_url}`;
  //             await sendMessage(msg);
  //             await sleep(1500);
  //           }

  //           await sleep(2000);
  //         }

  //         alert("✅ All products sent to all groups!");
  //       },
  //     });
  //   });

  //   await handleUpload()
  // };

// Separately send the message in the group and the community

// const handleSend = async () => {
//   const cleanedGroups = groups
//     .filter((g) => g?.name?.trim() !== "")
//     .map((g) => ({ name: g.name.trim(), type: g.type }));

//   if (cleanedGroups.length === 0) {
//     alert("⚠️ Please enter at least one group or community name.");
//     return;
//   }

//   // ✅ Now filter and map to names only
//   const groupList = cleanedGroups
//     .filter((g) => g.type === 1)
//     .map((g) => g.name);

//   const communityList = cleanedGroups
//     .filter((g) => g.type === 2)
//     .map((g) => g.name);

//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tabs[0].id },
//       args: [groupList, communityList, productArray],
//       func: async (groupList, communityList, products) => {
//         // inner script stays the same — operates on names only
//         const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
//         const waitForGroupAndClick = async (groupName, maxAttempts = 30) => {
//           for (let i = 0; i < maxAttempts; i++) {
//             const allSpans = [...document.querySelectorAll("span[title]")];
//             const match = allSpans.find((el) => {
//               const title = el.getAttribute("title")?.toLowerCase() || "";
//               const text = el.textContent?.toLowerCase() || "";
//               return (
//                 title.includes(groupName.toLowerCase()) ||
//                 text.includes(groupName.toLowerCase())
//               );
//             });

//             if (match) {
//               let clickable = match;
//               for (let j = 0; j < 10 && clickable; j++) {
//                 if (
//                   clickable.getAttribute("role") === "listitem" ||
//                   clickable.getAttribute("role") === "button" ||
//                   clickable.tagName === "BUTTON" ||
//                   clickable.tagName === "DIV"
//                 )
//                   break;
//                 clickable = clickable.parentElement;
//               }

//               if (clickable) {
//                 ["mousedown", "mouseup", "click"].forEach((type) =>
//                   clickable.dispatchEvent(
//                     new MouseEvent(type, {
//                       bubbles: true,
//                       cancelable: true,
//                       view: window,
//                     })
//                   )
//                 );
//                 await sleep(2000);
//                 return true;
//               }
//             }
//             await sleep(800);
//           }
//           return false;
//         };

//         const waitForChatToOpen = async (callback, maxAttempts = 30) => {
//           for (let i = 0; i < maxAttempts; i++) {
//             const box = document.querySelector(
//               "div[contenteditable='true'][data-tab='10']"
//             );
//             if (box && box.offsetParent !== null) {
//               callback();
//               return;
//             }
//             await sleep(1000);
//           }
//           alert("❌ Message box not available.");
//         };

//         const sendMessage = async (msg) => {
//           return new Promise((resolve) => {
//             waitForChatToOpen(() => {
//               const messageBox = document.querySelector(
//                 "div[contenteditable='true'][data-tab='10']"
//               );
//               if (!messageBox) {
//                 resolve(false);
//                 return;
//               }

//               messageBox.focus();

//               navigator.clipboard
//                 .writeText(msg)
//                 .then(() => {
//                   document.execCommand("paste");
//                 })
//                 .catch(() => {
//                   document.execCommand("insertText", false, msg);
//                 });

//               setTimeout(() => {
//                 const sendBtn = document.querySelector("span[data-icon='send']");
//                 if (sendBtn) sendBtn.click();
//                 resolve(true);
//               }, 500);
//             });
//           });
//         };

//         const sendToList = async (list, label) => {
//           for (const name of list) {
//             const found = await waitForGroupAndClick(name);
//             if (!found) {
//               alert(`⚠️ ${label} "${name}" not found.`);
//               continue;
//             }

//             for (const product of products) {
//               const msg = `🛒 *${product.title}*\n💰 Price: $${product.price}\n🔗 ${product.amazon_product_url}\n\n${product.description || ""}\nAffiliated Url: ${product.product_affiliate_url}`;
//               await sendMessage(msg);
//               await sleep(1500);
//             }

//             await sleep(2000);
//           }
//         };

//         await sendToList(groupList, "Group");
//         await sendToList(communityList, "Community");

//         alert("✅ All products sent to all groups and communities!");
//       },
//     });
//   });

//   // await handleUpload();
// };

// Handle Send message with the image

// const handleSend = async () => {
//   const cleanedGroups = groups
//     .filter((g) => g?.name?.trim() !== "")
//     .map((g) => ({ name: g.name.trim(), type: g.type }));

//   if (cleanedGroups.length === 0) {
//     alert("⚠️ Please enter at least one group or community name.");
//     return;
//   }

//   const groupList = cleanedGroups
//     .filter((g) => g.type === 1)
//     .map((g) => g.name);
//   const communityList = cleanedGroups
//     .filter((g) => g.type === 2)
//     .map((g) => g.name);

//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tabs[0].id },
//       args: [groupList, communityList, productArray],
//       func: async (groupList, communityList, products) => {
//         const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

//         const waitForGroupAndClick = async (groupName, maxAttempts = 30) => {
//           for (let i = 0; i < maxAttempts; i++) {
//             const allSpans = [...document.querySelectorAll("span[title]")];
//             const match = allSpans.find((el) => {
//               const title = el.getAttribute("title")?.toLowerCase() || "";
//               const text = el.textContent?.toLowerCase() || "";
//               return (
//                 title.includes(groupName.toLowerCase()) ||
//                 text.includes(groupName.toLowerCase())
//               );
//             });

//             if (match) {
//               let clickable = match;
//               for (let j = 0; j < 10 && clickable; j++) {
//                 if (
//                   clickable.getAttribute("role") === "listitem" ||
//                   clickable.getAttribute("role") === "button" ||
//                   clickable.tagName === "BUTTON" ||
//                   clickable.tagName === "DIV"
//                 )
//                   break;
//                 clickable = clickable.parentElement;
//               }

//               if (clickable) {
//                 ["mousedown", "mouseup", "click"].forEach((type) =>
//                   clickable.dispatchEvent(
//                     new MouseEvent(type, {
//                       bubbles: true,
//                       cancelable: true,
//                       view: window,
//                     })
//                   )
//                 );
//                 await sleep(2000);
//                 return true;
//               }
//             }
//             await sleep(800);
//           }
//           return false;
//         };

//         const waitForChatToOpen = async (callback, maxAttempts = 30) => {
//           for (let i = 0; i < maxAttempts; i++) {
//             const box = document.querySelector(
//               "div[contenteditable='true'][data-tab='10']"
//             );
//             if (box && box.offsetParent !== null) {
//               callback();
//               return;
//             }
//             await sleep(1000);
//           }
//           alert("❌ Message box not available.");
//         };

//         const fetchImageAsFile = async (url, fileName = "image.jpg") => {
//           const res = await fetch(url);
//           const blob = await res.blob();
//           return new File([blob], fileName, { type: blob.type });
//         };

//         const sendImage = async (imageUrl) => {
//           try {
//             const imageFile = await fetchImageAsFile(imageUrl);
//             const dataTransfer = new DataTransfer();
//             dataTransfer.items.add(imageFile);

//             const fileInput = document.createElement("input");
//             fileInput.type = "file";
//             fileInput.style.display = "none";
//             fileInput.accept = "image/*";
//             document.body.appendChild(fileInput);
//             fileInput.files = dataTransfer.files;

//             fileInput.dispatchEvent(new Event("change", { bubbles: true }));

//             const actualInput = document.querySelector("input[type='file']");
//             if (actualInput) {
//               actualInput.files = dataTransfer.files;
//               actualInput.dispatchEvent(new Event("change", { bubbles: true }));
//               await sleep(3000);
//             }

//             fileInput.remove();
//           } catch (err) {
//             console.error("⚠️ Error uploading image", err);
//           }
//         };

//         const sendMessage = async (msg, imageUrl) => {
//           return new Promise(async (resolve) => {
//             waitForChatToOpen(async () => {
//               if (imageUrl) {
//                 await sendImage(imageUrl);
//               }

//               const messageBox = document.querySelector(
//                 "div[contenteditable='true'][data-tab='10']"
//               );
//               if (!messageBox) {
//                 resolve(false);
//                 return;
//               }

//               messageBox.focus();
//               document.execCommand("insertText", false, msg);

//               setTimeout(() => {
//                 const sendBtn = document.querySelector(
//                   "span[data-icon='send']"
//                 );
//                 if (sendBtn) sendBtn.click();
//                 resolve(true);
//               }, 1000);
//             });
//           });
//         };

//         const sendToList = async (list, label) => {
//           for (const name of list) {
//             const found = await waitForGroupAndClick(name);
//             if (!found) {
//               alert(`⚠️ ${label} "${name}" not found.`);
//               continue;
//             }

//             for (const product of products) {
//               const msg = `🛒 *${product.title}*\n💰 Price: $${
//                 product.price
//               }\n🔗 ${product.amazon_product_url}\n\n${
//                 product.description || ""
//               }\nAffiliated Url: ${product.product_affiliate_url}`;
//               await sendMessage(msg, product.image); // ✅ image sent via <input type="file">
//               await sleep(1500);
//             }

//             await sleep(2000);
//           }
//         };

//         await sendToList(groupList, "Group");
//         // Sending the id in the group

//         await sendToList(communityList, "Community");

//         alert("✅ All products sent to all groups and communities!");
//       },
//     });
//   });
// };


const handleSend = async () => {
  const cleanedGroups = groups
    .filter((g) => g?.name?.trim() !== "")
    .map((g) => ({ name: g.name.trim(), type: g.type }));

  if (cleanedGroups.length === 0) {
    alert("⚠️ Please enter at least one group or community name.");
    return;
  }

  const groupList = cleanedGroups
    .filter((g) => g.type === 1)
    .map((g) => g.name);
  const communityList = cleanedGroups
    .filter((g) => g.type === 2)
    .map((g) => g.name);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      args: [groupList, communityList, productArray],
      func: async (groupList, communityList, products) => {
        const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

        const waitForGroupAndClick = async (groupName, maxAttempts = 30) => {
          for (let i = 0; i < maxAttempts; i++) {
            const allSpans = [...document.querySelectorAll("span[title]")];
            const match = allSpans.find((el) => {
              const title = el.getAttribute("title")?.toLowerCase() || "";
              const text = el.textContent?.toLowerCase() || "";
              return (
                title.includes(groupName.toLowerCase()) ||
                text.includes(groupName.toLowerCase())
              );
            });

            if (match) {
              let clickable = match;
              for (let j = 0; j < 10 && clickable; j++) {
                if (
                  clickable.getAttribute("role") === "listitem" ||
                  clickable.getAttribute("role") === "button" ||
                  clickable.tagName === "BUTTON" ||
                  clickable.tagName === "DIV"
                )
                  break;
                clickable = clickable.parentElement;
              }

              if (clickable) {
                clickable.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await sleep(500);
                
                ["mousedown", "mouseup", "click"].forEach((type) =>
                  clickable.dispatchEvent(
                    new MouseEvent(type, {
                      bubbles: true,
                      cancelable: true,
                      view: window,
                    })
                  )
                );
                await sleep(3000);
                return true;
              }
            }
            await sleep(800);
          }
          return false;
        };

        const waitForChatToOpen = async (maxAttempts = 30) => {
          for (let i = 0; i < maxAttempts; i++) {
            const selectors = [
              "div[contenteditable='true'][data-tab='10']",
              "div[contenteditable='true'][role='textbox']",
              "[data-testid='conversation-compose-box-input']",
              "div[contenteditable='true']"
            ];
            
            for (const selector of selectors) {
              const box = document.querySelector(selector);
              if (box && box.offsetParent !== null) {
                return box;
              }
            }
            await sleep(1000);
          }
          return null;
        };

        // NEW FUNCTION: Upload to WhatsApp Status
        const uploadToStatus = async (imageUrl, caption) => {
          try {
            console.log('Starting status upload...');
            
            // Look for status/my status button - multiple possible selectors
            const statusSelectors = [
              '[data-testid="status-v3-ring"]',
              '[title*="My status"]',
              '[aria-label*="My status"]',
              'span[data-icon="status-v3-ring"]',
              '[data-testid="my-status"]',
              'div[title="My status"]'
            ];

            let statusBtn = null;
            for (const selector of statusSelectors) {
              statusBtn = document.querySelector(selector);
              if (statusBtn) {
                console.log(`Found status button with selector: ${selector}`);
                break;
              }
            }

            if (!statusBtn) {
              // Try to find status by text content
              const statusElements = [...document.querySelectorAll('*')].filter(el => {
                const text = el.textContent?.toLowerCase() || '';
                return text.includes('my status') || text.includes('status');
              });
              
              if (statusElements.length > 0) {
                statusBtn = statusElements.find(el => 
                  el.getAttribute('role') === 'button' || 
                  el.tagName === 'BUTTON' ||
                  el.closest('[role="button"]')
                ) || statusElements[0];
              }
            }

            if (!statusBtn) {
              console.log('Status button not found, trying alternative approach...');
              // Alternative: click on profile/status area in sidebar
              const sidebarStatus = document.querySelector('#side div[role="button"]') ||
                                   document.querySelector('div[data-testid="chatlist-header"] ~ div[role="button"]');
              if (sidebarStatus) statusBtn = sidebarStatus;
            }

            if (statusBtn) {
              console.log('Clicking status button...');
              statusBtn.click();
              await sleep(2000);

              // Look for camera/add status button
              const addStatusSelectors = [
                '[data-testid="status-camera"]',
                'span[data-icon="camera"]',
                '[aria-label*="Camera"]',
                '[title*="Camera"]',
                'button[aria-label*="Add"]',
                '[data-testid="add-status"]'
              ];

              let addBtn = null;
              for (const selector of addStatusSelectors) {
                addBtn = document.querySelector(selector);
                if (addBtn) {
                  console.log(`Found add status button: ${selector}`);
                  break;
                }
              }

              if (addBtn) {
                addBtn.click();
                await sleep(1500);

                // Get image as blob and create file
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], 'status-image.jpg', { type: blob.type });

                // Look for file input or drag area
                const fileInput = document.querySelector('input[type="file"][accept*="image"]');
                
                if (fileInput) {
                  console.log('Using file input method...');
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  fileInput.files = dataTransfer.files;
                  fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                  await sleep(3000);
                } else {
                  console.log('Using drag and drop method...');
                  // Try drag and drop approach
                  const dropArea = document.querySelector('[data-testid="status-composer"]') ||
                                   document.querySelector('.status-composer') ||
                                   document.body;

                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);

                  const dropEvent = new DragEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer: dataTransfer
                  });

                  dropArea.dispatchEvent(new DragEvent('dragenter', {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer: dataTransfer
                  }));
                  
                  await sleep(300);
                  
                  dropArea.dispatchEvent(new DragEvent('dragover', {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer: dataTransfer
                  }));
                  
                  await sleep(300);
                  dropArea.dispatchEvent(dropEvent);
                  await sleep(3000);
                }

                // Add caption to status
                const captionSelectors = [
                  '[data-testid="status-text-input"]',
                  'div[contenteditable="true"][data-lexical-editor="true"]',
                  '[placeholder*="Type a caption"]',
                  'textarea[placeholder*="caption"]',
                  'div[contenteditable="true"]'
                ];

                let captionInput = null;
                for (const selector of captionSelectors) {
                  captionInput = document.querySelector(selector);
                  if (captionInput && captionInput.offsetParent !== null) {
                    console.log(`Found caption input: ${selector}`);
                    break;
                  }
                }

                if (captionInput) {
                  captionInput.focus();
                  await sleep(500);
                  captionInput.textContent = caption;
                  captionInput.dispatchEvent(new Event('input', { bubbles: true }));
                  await sleep(1000);
                }

                // Send/Post status
                const sendStatusSelectors = [
                  '[data-testid="send-status"]',
                  'span[data-icon="send"]',
                  'button[aria-label*="Send"]',
                  '[data-testid="status-send"]',
                  'button:has(span[data-icon="send"])'
                ];

                let sendStatusBtn = null;
                for (const selector of sendStatusSelectors) {
                  sendStatusBtn = document.querySelector(selector);
                  if (sendStatusBtn && !sendStatusBtn.disabled) {
                    console.log(`Found send status button: ${selector}`);
                    break;
                  }
                }

                if (sendStatusBtn) {
                  console.log('Posting status...');
                  sendStatusBtn.click();
                  await sleep(2000);
                  return true;
                } else {
                  console.log('Send status button not found');
                }
              } else {
                console.log('Add status button not found');
              }
            } else {
              console.log('Status button not found');
              return false;
            }

            return false;
          } catch (error) {
            console.error("Error uploading to status:", error);
            return false;
          }
        };

        const sendImageWithCaption = async (imageUrl, caption) => {
          try {
            // First, get the image as blob
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'product-image.jpg', { type: blob.type });

            // Method 1: Try the direct drag and drop approach
            const messageContainer = document.querySelector('#main') || 
                                   document.querySelector('[data-testid="conversation-panel-body"]') ||
                                   document.querySelector('.copyable-text');

            if (messageContainer) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);

              // Create and dispatch drag events
              const dragEnterEvent = new DragEvent('dragenter', {
                bubbles: true,
                cancelable: true,
                dataTransfer: dataTransfer
              });

              const dragOverEvent = new DragEvent('dragover', {
                bubbles: true,
                cancelable: true,
                dataTransfer: dataTransfer
              });

              const dropEvent = new DragEvent('drop', {
                bubbles: true,
                cancelable: true,
                dataTransfer: dataTransfer
              });

              messageContainer.dispatchEvent(dragEnterEvent);
              await sleep(500);
              messageContainer.dispatchEvent(dragOverEvent);
              await sleep(500);
              messageContainer.dispatchEvent(dropEvent);
              
              // Wait for image preview to appear
              await sleep(3000);

              // Look for caption input in the media preview
              const captionSelectors = [
                '[data-testid="media-caption-input"]',
                'div[contenteditable="true"][data-lexical-editor="true"]',
                '.lexical-rich-text-input',
                '[role="textbox"][contenteditable="true"]'
              ];

              let captionInput = null;
              for (const selector of captionSelectors) {
                captionInput = document.querySelector(selector);
                if (captionInput) break;
              }

              if (captionInput) {
                captionInput.focus();
                await sleep(500);
                captionInput.textContent = caption;
                captionInput.dispatchEvent(new Event('input', { bubbles: true }));
                await sleep(1000);

                // Find and click send button
                const sendSelectors = [
                  '[data-testid="send"]',
                  'span[data-icon="send"]',
                  'button[aria-label*="Send"]',
                  '[role="button"][data-testid="send"]'
                ];

                let sendBtn = null;
                for (const selector of sendSelectors) {
                  sendBtn = document.querySelector(selector);
                  if (sendBtn && !sendBtn.disabled) break;
                }

                if (sendBtn) {
                  sendBtn.click();
                  await sleep(2000);
                  return true;
                }
              }
            }

            // Method 2: Try using clipboard API
            try {
              const clipboardItem = new ClipboardItem({
                [blob.type]: blob
              });
              
              await navigator.clipboard.write([clipboardItem]);
              
              const messageBox = await waitForChatToOpen();
              if (messageBox) {
                messageBox.focus();
                await sleep(500);
                
                // Paste the image
                document.execCommand('paste');
                await sleep(3000);
                
                // Add caption
                const captionInput = document.querySelector('[data-testid="media-caption-input"]') ||
                                   document.querySelector('div[contenteditable="true"][data-lexical-editor="true"]');
                
                if (captionInput) {
                  captionInput.focus();
                  captionInput.textContent = caption;
                  captionInput.dispatchEvent(new Event('input', { bubbles: true }));
                  await sleep(1000);
                }
                
                // Send
                const sendBtn = document.querySelector('[data-testid="send"]') ||
                               document.querySelector('span[data-icon="send"]');
                if (sendBtn) {
                  sendBtn.click();
                  await sleep(2000);
                  return true;
                }
              }
            } catch (clipboardError) {
              console.log('Clipboard method failed:', clipboardError);
            }

            // Method 3: Try attachment menu approach
            const attachSelectors = [
              '[data-testid="clip"]',
              'span[data-icon="clip"]',
              '[title*="Attach"]',
              'button[aria-label*="Attach"]'
            ];

            let attachBtn = null;
            for (const selector of attachSelectors) {
              attachBtn = document.querySelector(selector);
              if (attachBtn) break;
            }

            if (attachBtn) {
              attachBtn.click();
              await sleep(1500);

              // Look for photo/image option
              const photoSelectors = [
                '[data-testid="attach-image"]',
                'span[data-icon="image"]',
                'input[accept*="image"]',
                '[title*="Photos"]'
              ];

              let photoBtn = null;
              for (const selector of photoSelectors) {
                photoBtn = document.querySelector(selector);
                if (photoBtn) break;
              }

              if (photoBtn) {
                if (photoBtn.tagName === 'INPUT') {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  photoBtn.files = dataTransfer.files;
                  photoBtn.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                  photoBtn.click();
                  await sleep(1000);
                  
                  const fileInput = document.querySelector('input[type="file"][accept*="image"]');
                  if (fileInput) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }

                await sleep(3000);
                
                // Add caption
                const captionInput = document.querySelector('[data-testid="media-caption-input"]');
                if (captionInput) {
                  captionInput.focus();
                  captionInput.textContent = caption;
                  captionInput.dispatchEvent(new Event('input', { bubbles: true }));
                  await sleep(1000);
                }

                // Send
                const sendBtn = document.querySelector('[data-testid="send"]') ||
                               document.querySelector('span[data-icon="send"]');
                if (sendBtn) {
                  sendBtn.click();
                  await sleep(2000);
                  return true;
                }
              }
            }

            return false;
          } catch (error) {
            console.error("Error sending image:", error);
            return false;
          }
        };

        const sendTextMessage = async (message) => {
          const messageBox = await waitForChatToOpen();
          if (!messageBox) return false;

          messageBox.focus();
          await sleep(500);
          
          // Clear and set message
          messageBox.textContent = '';
          await sleep(200);
          
          // Try multiple methods to set text
          messageBox.textContent = message;
          messageBox.dispatchEvent(new Event('input', { bubbles: true }));
          
          if (messageBox.textContent !== message) {
            document.execCommand("insertText", false, message);
          }
          
          if (messageBox.textContent !== message) {
            messageBox.innerHTML = message.replace(/\n/g, '<br>');
            messageBox.dispatchEvent(new Event('input', { bubbles: true }));
          }

          await sleep(1000);

          // Send message
          const sendSelectors = [
            '[data-testid="send"]',
            'span[data-icon="send"]',
            'button[aria-label*="Send"]'
          ];

          let sendBtn = null;
          for (const selector of sendSelectors) {
            sendBtn = document.querySelector(selector);
            if (sendBtn && !sendBtn.disabled) break;
          }

          if (sendBtn) {
            sendBtn.click();
            await sleep(1500);
            return true;
          }

          // Fallback: try Enter key
          messageBox.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true
          }));
          await sleep(1500);
          return true;
        };

        const sendToList = async (list, label) => {
          for (const name of list) {
            console.log(`Processing ${label}: ${name}`);
            const found = await waitForGroupAndClick(name);
            if (!found) {
              alert(`⚠️ ${label} "${name}" not found.`);
              continue;
            }

            // Wait for chat to fully load
            await sleep(2000);

            for (const product of products) {
              const message = `🛒 *${product.title}*\n💰 Price: $${product.price}\n🔗 ${product.amazon_product_url}\n\n${product.description || ""}\nAffiliated Url: ${product.product_affiliate_url}`;
              
              let success = false;
              
              // Try to send with image first
              if (product.image) {
                console.log(`Sending product with image: ${product.title}`);
                success = await sendImageWithCaption(product.image, message);
                
                if (!success) {
                  console.log('Image sending failed, falling back to text only');
                  success = await sendTextMessage(message);
                }
              } else {
                // Send text only
                success = await sendTextMessage(message);
              }

              if (!success) {
                console.warn(`Failed to send product: ${product.title} to ${name}`);
              }

              await sleep(3000); // Wait between products
            }

            await sleep(2000); // Wait between groups
          }
        };

        // NEW FUNCTION: Upload all products to status
        const uploadProductsToStatus = async () => {
          console.log('Starting status uploads for all products...');
          
          for (let i = 0; i < products.length; i++) {
            const product = products[i];
            console.log(`Uploading product ${i + 1}/${products.length} to status: ${product.title}`);
            
            if (product.image) {
              const statusMessage = `🛒 *${product.title}*\n💰 Price: $${product.price}\n🔗 ${product.amazon_product_url}\n\n${product.description || ""}\nAffiliated Url: ${product.product_affiliate_url}`;
              
              const success = await uploadToStatus(product.image, statusMessage);
              
              if (success) {
                console.log(`✅ Successfully uploaded ${product.title} to status`);
              } else {
                console.warn(`❌ Failed to upload ${product.title} to status`);
              }
              
              // Wait between status uploads to avoid rate limiting
              await sleep(5000);
            } else {
              console.log(`⚠️ Skipping ${product.title} - no image available for status`);
            }
          }
        };

        try {
          console.log('Starting the automation process...');
          
          // First, upload all products to status
          await uploadProductsToStatus();
          
          // Then send to groups and communities
          console.log('Starting to send to groups...');
          await sendToList(groupList, "Group");
          
          console.log('Starting to send to communities...');
          await sendToList(communityList, "Community");
          
          alert("✅ All products sent to status, groups, and communities!");
        } catch (error) {
          console.error("Error in sending process:", error);
          alert("❌ Error occurred while sending messages. Check console for details.");
        }
      },
    });
  });
};

// Main function to send messages and upload statuses
// const handleSend = async () => {
//   // Validate and clean groups
//   const cleanedGroups = groups
//     .filter((g) => g?.name?.trim() !== "")
//     .map((g) => ({ name: g.name.trim(), type: g.type }));

//   if (cleanedGroups.length === 0) {
//     alert("⚠️ Please enter at least one group or community name.");
//     return;
//   }

//   const groupList = cleanedGroups
//     .filter((g) => g.type === 1)
//     .map((g) => g.name);
//   const communityList = cleanedGroups
//     .filter((g) => g.type === 2)
//     .map((g) => g.name);

//   // Show progress indicator
//   console.log(`📤 Starting to send ${productArray.length} products to ${cleanedGroups.length} groups/communities`);

//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tabs[0].id },
//       args: [groupList, communityList, productArray],
//       func: async (groupList, communityList, products) => {
//         const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

//         // Enhanced group finding with better error handling
//         const waitForGroupAndClick = async (groupName, maxAttempts = 30) => {
//           console.log(`🔍 Searching for: ${groupName}`);
          
//           for (let i = 0; i < maxAttempts; i++) {
//             const allSpans = [...document.querySelectorAll("span[title], div[title]")];
//             const match = allSpans.find((el) => {
//               const title = el.getAttribute("title")?.toLowerCase() || "";
//               const text = el.textContent?.toLowerCase() || "";
//               const groupNameLower = groupName.toLowerCase();
              
//               return (
//                 title.includes(groupNameLower) ||
//                 text.includes(groupNameLower) ||
//                 title === groupNameLower ||
//                 text === groupNameLower
//               );
//             });

//             if (match) {
//               let clickable = match;
//               // Traverse up to find clickable parent
//               for (let j = 0; j < 10 && clickable; j++) {
//                 if (
//                   clickable.getAttribute("role") === "listitem" ||
//                   clickable.getAttribute("role") === "button" ||
//                   clickable.tagName === "BUTTON" ||
//                   clickable.tagName === "DIV" ||
//                   clickable.classList.contains("_ak72") // WhatsApp chat item class
//                 ) {
//                   break;
//                 }
//                 clickable = clickable.parentElement;
//               }

//               if (clickable) {
//                 console.log(`✅ Found and clicking: ${groupName}`);
//                 // Enhanced click simulation
//                 ["mousedown", "mouseup", "click"].forEach((type) =>
//                   clickable.dispatchEvent(
//                     new MouseEvent(type, {
//                       bubbles: true,
//                       cancelable: true,
//                       view: window,
//                     })
//                   )
//                 );
//                 await sleep(3000); // Increased wait time
//                 return true;
//               }
//             }
//             await sleep(1000); // Increased search interval
//           }
//           console.log(`❌ Could not find: ${groupName}`);
//           return false;
//         };

//         // Enhanced chat detection
//         const waitForChatToOpen = async (callback, maxAttempts = 30) => {
//           for (let i = 0; i < maxAttempts; i++) {
//             const selectors = [
//               "div[contenteditable='true'][data-tab='10']",
//               "div[contenteditable='true'][role='textbox']",
//               "div[contenteditable='true']",
//               "div[data-tab='10']"
//             ];
            
//             let box = null;
//             for (const selector of selectors) {
//               box = document.querySelector(selector);
//               if (box && box.offsetParent !== null) break;
//             }
            
//             if (box && box.offsetParent !== null) {
//               console.log("💬 Chat opened successfully");
//               callback();
//               return;
//             }
//             await sleep(1000);
//           }
//           console.error("❌ Message box not available after waiting");
//           alert("❌ Message box not available. Please ensure WhatsApp Web is loaded properly.");
//         };

//         // Improved image handling
//         const fetchImageAsFile = async (url, fileName = "image.jpg") => {
//           try {
//             console.log(`📷 Fetching image: ${url}`);
//             const res = await fetch(url);
//             if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
//             const blob = await res.blob();
//             const file = new File([blob], fileName, { 
//               type: blob.type || "image/jpeg",
//               lastModified: Date.now()
//             });
//             console.log(`✅ Image fetched successfully: ${file.size} bytes`);
//             return file;
//           } catch (error) {
//             console.error(`❌ Failed to fetch image: ${error.message}`);
//             return null;
//           }
//         };

//         // Enhanced image sending with better error handling
//         const sendImage = async (imageUrl) => {
//           if (!imageUrl) return false;
          
//           try {
//             const imageFile = await fetchImageAsFile(imageUrl);
//             if (!imageFile) return false;

//             const dataTransfer = new DataTransfer();
//             dataTransfer.items.add(imageFile);

//             // Try multiple approaches to trigger file input
//             let fileInput = document.querySelector("input[type='file']");
            
//             if (!fileInput) {
//               // Create temporary file input
//               fileInput = document.createElement("input");
//               fileInput.type = "file";
//               fileInput.style.display = "none";
//               fileInput.accept = "image/*";
//               document.body.appendChild(fileInput);
//             }

//             fileInput.files = dataTransfer.files;
            
//             // Trigger events
//             ["input", "change"].forEach((eventType) => {
//               fileInput.dispatchEvent(new Event(eventType, { 
//                 bubbles: true, 
//                 cancelable: true 
//               }));
//             });

//             await sleep(4000); // Wait for image to process
            
//             if (fileInput.parentNode) {
//               fileInput.remove();
//             }
            
//             return true;
//           } catch (err) {
//             console.error("⚠️ Error uploading image:", err);
//             return false;
//           }
//         };

//         // Enhanced message sending
//         const sendMessage = async (msg, imageUrl) => {
//           return new Promise(async (resolve) => {
//             waitForChatToOpen(async () => {
//               try {
//                 // Send image first if provided
//                 if (imageUrl) {
//                   const imageSuccess = await sendImage(imageUrl);
//                   if (!imageSuccess) {
//                     console.warn("⚠️ Image upload failed, sending text only");
//                   }
//                 }

//                 const messageBox = document.querySelector(
//                   "div[contenteditable='true'][data-tab='10']"
//                 ) || document.querySelector("div[contenteditable='true']");
                
//                 if (!messageBox) {
//                   console.error("❌ Message box not found");
//                   resolve(false);
//                   return;
//                 }

//                 // Focus and clear existing content
//                 messageBox.focus();
//                 await sleep(500);
                
//                 // Clear existing content
//                 messageBox.innerHTML = "";
                
//                 // Insert text
//                 document.execCommand("insertText", false, msg);
//                 await sleep(1000);

//                 // Find and click send button
//                 const sendSelectors = [
//                   "span[data-icon='send']",
//                   "button[aria-label*='Send']",
//                   "[data-testid='send']"
//                 ];
                
//                 let sendBtn = null;
//                 for (const selector of sendSelectors) {
//                   sendBtn = document.querySelector(selector);
//                   if (sendBtn && sendBtn.offsetParent !== null) break;
//                 }
                
//                 if (sendBtn) {
//                   sendBtn.click();
//                   console.log("✅ Message sent successfully");
//                   await sleep(2000);
//                   resolve(true);
//                 } else {
//                   console.error("❌ Send button not found");
//                   resolve(false);
//                 }
//               } catch (error) {
//                 console.error("❌ Error sending message:", error);
//                 resolve(false);
//               }
//             });
//           });
//         };

//         // Enhanced sending with progress tracking
//         const sendToList = async (list, label) => {
//           console.log(`📋 Processing ${list.length} ${label.toLowerCase()}s`);
          
//           for (let i = 0; i < list.length; i++) {
//             const name = list[i];
//             console.log(`📤 ${label} ${i + 1}/${list.length}: ${name}`);
            
//             const found = await waitForGroupAndClick(name);
//             if (!found) {
//               console.error(`❌ ${label} "${name}" not found`);
//               alert(`⚠️ ${label} "${name}" not found. Skipping...`);
//               continue;
//             }

//             // Send each product to this group/community
//             for (let j = 0; j < products.length; j++) {
//               const product = products[j];
//               console.log(`📦 Sending product ${j + 1}/${products.length}: ${product.title}`);
              
//               const msg = `🛒 *${product.title}*\n💰 Price: $${
//                 product.price
//               }\n🔗 ${product.amazon_product_url}\n\n${
//                 product.description || ""
//               }\n\n🔗 Affiliate Link: ${product.product_affiliate_url}`;
              
//               const success = await sendMessage(msg, product.image);
//               if (!success) {
//                 console.warn(`⚠️ Failed to send product ${j + 1} to ${name}`);
//               }
              
//               await sleep(2000); // Wait between products
//             }

//             await sleep(3000); // Wait between groups
//           }
//         };

//         try {
//           await sendToList(groupList, "Group");
//           await sendToList(communityList, "Community");
//           console.log("✅ All messages sent successfully");
//           alert("✅ All products sent to all groups and communities!");
//         } catch (error) {
//           console.error("❌ Error in sending process:", error);
//           alert(`❌ Error occurred: ${error.message}`);
//         }
//       },
//     });
//   });

//   // After messages sent, upload statuses with delay
//   setTimeout(async () => {
//     await handleAutoStatusUpload(productArray);
//   }, 5000);
// };

// const handleAutoStatusUpload = async (productArray) => {
//   console.log(`📱 Starting status upload for ${productArray.length} products`);
  
//   for (let i = 0; i < productArray.length; i++) {
//     const product = productArray[i];
//     console.log(`📱 Uploading status ${i + 1}/${productArray.length}: ${product.title}`);

//     await new Promise((resolve) => {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.scripting.executeScript({
//           target: { tabId: tabs[0].id },
//           args: [product, i + 1, productArray.length],
//           func: uploadProductToStatus,
//         });

//         setTimeout(resolve, 8000); // Increased wait time between uploads
//       });
//     });
//   }

//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tabs[0].id },
//       func: () => {
//         console.log("✅ All status uploads completed");
//         alert("✅ All product statuses uploaded successfully!");
//       },
//     });
//   });
// };

// function uploadProductToStatus(product, currentIndex, totalProducts) {
//   const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

//   const waitForElement = (selector, timeout = 20000) => {
//     return new Promise((resolve, reject) => {
//       const start = Date.now();
//       const interval = setInterval(() => {
//         const el = document.querySelector(selector);
//         if (el && el.offsetParent !== null) {
//           clearInterval(interval);
//           resolve(el);
//         } else if (Date.now() - start > timeout) {
//           clearInterval(interval);
//           reject(new Error(`Timeout waiting for ${selector}`));
//         }
//       }, 500);
//     });
//   };

//   const triggerFileInput = async (imageUrl, fileInput) => {
//     try {
//       console.log(`📷 Processing image for status ${currentIndex}: ${imageUrl}`);
      
//       const response = await fetch(imageUrl);
//       if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

//       const blob = await response.blob();
//       const file = new File([blob], `product-${currentIndex}.jpg`, { 
//         type: blob.type || "image/jpeg",
//         lastModified: Date.now()
//       });

//       const dataTransfer = new DataTransfer();
//       dataTransfer.items.add(file);

//       fileInput.files = dataTransfer.files;

//       // Trigger multiple events to ensure detection
//       ["input", "change", "click"].forEach((eventType) => {
//         fileInput.dispatchEvent(new Event(eventType, { 
//           bubbles: true, 
//           cancelable: true 
//         }));
//       });

//       await sleep(1000);
//       return true;
//     } catch (error) {
//       console.error("❌ Error in triggerFileInput:", error);
//       return false;
//     }
//   };

//   const uploadStatus = async () => {
//     try {
//       console.log(`📱 Starting status upload ${currentIndex}/${totalProducts}: ${product.title}`);

//       // Enhanced status button detection
//       const statusSelectors = [
//         '[aria-label="Status"]',
//         '[data-testid="status-v3"]',
//         'span[data-icon="status"]',
//         '[title*="Status"]',
//         'div[title="Status"]',
//         'div[data-tab="2"]' // Status tab
//       ];

//       let statusBtn = null;
//       for (const selector of statusSelectors) {
//         try {
//           statusBtn = await waitForElement(selector, 5000);
//           if (statusBtn) {
//             console.log(`✅ Found status button with selector: ${selector}`);
//             break;
//           }
//         } catch (e) {
//           console.log(`⚠️ Status button not found with: ${selector}`);
//         }
//       }

//       if (!statusBtn) {
//         throw new Error("Status button not found with any selector");
//       }

//       // Click status button
//       let clickable = statusBtn;
//       while (clickable && !clickable.getAttribute("role") && clickable.tagName !== "BUTTON") {
//         clickable = clickable.parentElement;
//       }
//       (clickable || statusBtn).click();
//       await sleep(3000);

//       // Enhanced add status button detection
//       const addStatusSelectors = [
//         'div[aria-label*="Add status"]',
//         'button[aria-label*="Add status"]',
//         'span[data-icon="plus"]',
//         'span[data-icon="add"]',
//         '[data-testid="status-add"]',
//         'div[role="button"]'
//       ];

//       let addBtn = null;
//       for (const selector of addStatusSelectors) {
//         try {
//           addBtn = await waitForElement(selector, 5000);
//           if (addBtn) {
//             console.log(`✅ Found add status button with: ${selector}`);
//             break;
//           }
//         } catch (e) {
//           console.log(`⚠️ Add status button not found with: ${selector}`);
//         }
//       }

//       // Fallback: search by content
//       if (!addBtn) {
//         const allBtns = document.querySelectorAll('[role="button"], button, div');
//         for (const el of allBtns) {
//           if (el.offsetParent !== null) {
//             const hasAddIcon = el.querySelector('span[data-icon="plus"]') || 
//                               el.querySelector('span[data-icon="add"]');
//             const hasAddText = el.textContent && 
//                               (el.textContent.toLowerCase().includes("add") ||
//                                el.textContent.toLowerCase().includes("status"));
            
//             if (hasAddIcon || hasAddText) {
//               addBtn = el;
//               console.log("✅ Found add button via fallback method");
//               break;
//             }
//           }
//         }
//       }

//       if (!addBtn) throw new Error("Add status button not found");

//       addBtn.click();
//       await sleep(3000);

//       // Enhanced file input detection
//       let fileInput = null;
//       let attempts = 0;
//       const maxAttempts = 8;

//       while (!fileInput && attempts < maxAttempts) {
//         attempts++;
//         console.log(`🔍 Looking for file input, attempt ${attempts}/${maxAttempts}`);

//         // Check for existing file inputs
//         const inputs = document.querySelectorAll('input[type="file"]');
//         for (const input of inputs) {
//           if (input.offsetParent !== null || input.style.display !== 'none') {
//             fileInput = input;
//             console.log("✅ Found existing file input");
//             break;
//           }
//         }

//         if (!fileInput) {
//           // Try clicking media buttons
//           const mediaSelectors = [
//             'span[data-icon="image"]',
//             'span[data-icon="camera"]',
//             'span[data-icon="photo"]',
//             'button[aria-label*="Photo"]',
//             'button[aria-label*="Image"]',
//             '[data-testid="media-photo"]'
//           ];

//           let mediaBtn = null;
//           for (const selector of mediaSelectors) {
//             const elements = document.querySelectorAll(selector);
//             for (const el of elements) {
//               if (el && el.offsetParent !== null) {
//                 mediaBtn = el;
//                 console.log(`✅ Found media button: ${selector}`);
//                 break;
//               }
//             }
//             if (mediaBtn) break;
//           }

//           if (mediaBtn) {
//             mediaBtn.click();
//             await sleep(2000);
//           }
//         }

//         if (!fileInput) await sleep(1500);
//       }

//       // Create file input if not found
//       if (!fileInput) {
//         console.log("📎 Creating custom file input");
//         fileInput = document.createElement("input");
//         fileInput.type = "file";
//         fileInput.accept = "image/*";
//         fileInput.style.position = "absolute";
//         fileInput.style.opacity = "0";
//         fileInput.style.pointerEvents = "none";
//         document.body.appendChild(fileInput);
//       }

//       // Upload image
//       const uploaded = await triggerFileInput(product.image || product.image_url, fileInput);
//       if (!uploaded) throw new Error("Failed to upload image");

//       await sleep(6000); // Wait for image processing

//       // Add caption with enhanced detection
//       const caption = `🛒 ${product.title}\n💰 $${product.price}\n🔗 ${product.amazon_product_url}`;
      
//       const captionSelectors = [
//         'div[contenteditable="true"]',
//         'div[data-tab="10"]',
//         'div[role="textbox"]',
//         'textarea',
//         'div[aria-label*="Type a status"]'
//       ];

//       let captionBox = null;
//       for (const selector of captionSelectors) {
//         try {
//           captionBox = await waitForElement(selector, 5000);
//           if (captionBox && captionBox.offsetParent !== null) {
//             console.log(`✅ Found caption box: ${selector}`);
//             break;
//           }
//         } catch (e) {
//           console.log(`⚠️ Caption box not found with: ${selector}`);
//         }
//       }

//       if (captionBox) {
//         captionBox.focus();
//         await sleep(500);
//         captionBox.textContent = "";
//         document.execCommand("insertText", false, caption);
//         await sleep(1500);
//         console.log("✅ Caption added successfully");
//       } else {
//         console.warn("⚠️ Caption box not found, proceeding without caption");
//       }

//       // Enhanced send button detection
//       const sendSelectors = [
//         'span[data-icon="send"]',
//         'button[aria-label*="Send"]',
//         '[data-testid="send"]',
//         'button[aria-label*="Post"]',
//         'div[role="button"]'
//       ];

//       let sendBtn = null;
//       for (const selector of sendSelectors) {
//         try {
//           sendBtn = await waitForElement(selector, 5000);
//           if (sendBtn) {
//             console.log(`✅ Found send button: ${selector}`);
//             break;
//           }
//         } catch (e) {
//           console.log(`⚠️ Send button not found with: ${selector}`);
//         }
//       }

//       if (sendBtn) {
//         sendBtn.click();
//         await sleep(3000);
//         console.log(`✅ Status ${currentIndex} uploaded successfully`);
//       } else {
//         throw new Error("Send button not found");
//       }

//     } catch (error) {
//       console.error(`❌ Error uploading status ${currentIndex}:`, error);
//       alert(`⚠️ Error uploading status for "${product.title}": ${error.message}`);
//     }
//   };

//   uploadStatus();
// }






























  return (
    <div style={{width: 600 ,backgroundColor:"#FDFBD4",padding:"20px",borderRadius:30}}>
      <h3 onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back
      </h3>
      <div
        style={{
          height: "70vh",
          overflowY: "auto",
          padding: 10,
        }}
      >
        <divm
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{ marginBlockEnd: 0, marginBlockStart: 4,fontWeight:"400" }}
          >
            Product List
          </h1>
          <button
            style={styles.addNumberButton}
            onClick={handleSend}
          >
            Start
          </button>
        </divm>
        {productArray.map((item, index) => (
          <div
            key={item?.id}
            style={{
              display: "flex",
              borderBottom: "1px solid grey",
              padding: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h4 style={{ fontFamily: "montserrat", fontWeight: 600 }}>
              {index + 1}.
            </h4>
            <img
              style={{ width: "8%", height: "8%" }}
              src={item?.image_url}
              alt=""
            />
            <div style={{ marginLeft: 10, width: "70%" }}>
              <h5
                style={{
                  marginBlockEnd: 0,
                  marginBlockStart: 0,
                  fontWeight: 500,
                }}
              >
                {item?.title}
              </h5>
              {/* <div style={{ display: "flex", marginTop: 10 }}>
                <Checkbox
                  label="Groups"
                  isChecked={groupItems.some((i) => i.id === item.id)}
                  onChange={() => handleToggle(item, groupItems, setGroupItems)}
                />
                <Checkbox
                  label="Community"
                  isChecked={communityItems.some((i) => i.id === item.id)}
                  onChange={() =>
                    handleToggle(item, communityItems, setCommunityItems)
                  }
                />
                <Checkbox
                  label="Status"
                  isChecked={statusItems.some((i) => i.id === item.id)}
                  onChange={() =>
                    handleToggle(item, statusItems, setStatusItems)
                  }
                />
              </div> */}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <button
          style={styles.addNumberButton}
          onClick={() => navigate("/published", { state: { item } })}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          See Permissions
        </button>
      </div>
    </div>
  );
};

// Custom Checkbox component
const Checkbox = ({ label, isChecked, onChange }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      style={{
        marginRight: 10,
        width: 12,
        height: 12,
        transform: "scale(1.5)",
        cursor: "pointer",
      }}
    />
    <p style={{ marginBlockEnd: 0, marginBlockStart: 0, marginRight: 10 }}>
      {label}
    </p>
  </div>
);

export default ProductList;





