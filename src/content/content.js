
// let groupIndex = 0;
// export function sendWhatsAppMessagesToGroupsAndCommunities(groups, products) {
// if (groupIndex >= groups.length) {
//     console.log("✅ All groups processed");
//     return;
//   }
//     const groupName = groups[groupIndex].name;
//     console.log(`🔍 Looking for group: ${groupName}`);

//     // After processing this group...
//     groupIndex++;
// }



// let groupIndex = 0;

// export function sendWhatsAppMessagesToGroupsAndCommunities(groups, products) {
//   const sendToNextGroup = () => {
//     if (groupIndex >= groups.length) {
//       console.log("✅ All groups processed");
//       return;
//     }

//     const groupName = groups[groupIndex].name;
//     console.log(`🔍 Looking for group: ${groupName}`);

//     // Find the chat in the WhatsApp UI
//     const allChats = Array.from(document.querySelectorAll("div[role='row'] [data-testid^='cell-frame-container']"));

//     const chat = allChats.find((el) => {
//       const nameEl = el.querySelector("span[title], span[dir='auto'] > span");
//       const label = nameEl?.textContent?.trim().toLowerCase();
//       const title = nameEl?.getAttribute('title')?.toLowerCase();
//       return (label && label.includes(groupName.toLowerCase())) || 
//              (title && title.includes(groupName.toLowerCase()));
//     });

//     if (!chat) {
//       console.warn(`❌ Group not found: ${groupName}`);
//       groupIndex++;
//       setTimeout(sendToNextGroup, 3000);
//       return;
//     }

//     const clickable = chat.closest("div[role='row']") || chat;
//     clickable.click();

//     // Wait for the chat to open
//     setTimeout(() => {
//       let productIndex = 0;

//       const sendNextProduct = () => {
//         if (productIndex >= products.length) {
//           console.log(`✅ Finished sending all products to ${groupName}`);
//           groupIndex++;
//           setTimeout(sendToNextGroup, 3000);
//           return;
//         }

//         const product = products[productIndex];
//         const message = `🛍️ ${product.title}`;
//         sendMessage(message, () => {
//           productIndex++;
//           setTimeout(sendNextProduct, 2000); // Wait before sending next product
//         });
//       };

//       sendNextProduct();
//     }, 2000);
//   };

//   const sendMessage = (message, callback) => {
//     const messageBox =
//       document.querySelector("div[contenteditable='true'][data-testid='conversation-compose-box-input']") ||
//       document.querySelector("div[contenteditable='true'][data-tab='10']");

//     if (!messageBox) {
//       console.warn("⚠️ Message box not found");
//       callback();
//       return;
//     }

//     messageBox.focus();
//     messageBox.textContent = '';

//     const focusEvent = new FocusEvent('focus', { bubbles: true });
//     messageBox.dispatchEvent(focusEvent);
//     document.execCommand('insertText', false, message);
//     const inputEvent = new InputEvent('input', { bubbles: true });
//     messageBox.dispatchEvent(inputEvent);

//     setTimeout(() => {
//       const sendButton = document.querySelector("button[data-testid='compose-btn-send']") ||
//                          document.querySelector("span[data-icon='send']");
//       if (sendButton) {
//         sendButton.click();
//         console.log(`✉️ Sent: ${message}`);
//       } else {
//         console.warn("⚠️ Send button not found");
//       }
//       callback();
//     }, 1000);
//   };

//   sendToNextGroup();
// }



// let groupIndex = 0;

// export function sendWhatsAppMessagesToGroupsAndCommunities(groups, message = "Hello") {
//   const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

//   const sendToNextGroup = async () => {
//     if (groupIndex >= groups.length) {
//       console.log("✅ All groups processed");
//       return;
//     }

//     const groupName = groups[groupIndex].name.trim();
//     console.log(`🔍 Searching for group: ${groupName}`);

//     const found = await waitForGroupAndClick(groupName);
//     if (!found) {
//       console.warn(`⚠️ Group not found: ${groupName}`);
//       groupIndex++;
//       setTimeout(sendToNextGroup, 3000);
//       return;
//     }

//     await sendMessageToChat(message);

//     groupIndex++;
//     setTimeout(sendToNextGroup, 3000);
//   };

//   const waitForGroupAndClick = async (groupName, maxAttempts = 30) => {
//     let lastVisibleName = "";
//     let attempts = 0;
//     const chatList = document.querySelector("[role='list']");

//     if (!chatList) {
//       console.warn("⚠️ Chat list not found");
//       return false;
//     }

//     chatList.scrollTop = 0;

//     while (attempts < maxAttempts) {
//       const chatItems = Array.from(
//         document.querySelectorAll("div[role='row'] [data-testid^='cell-frame-container']")
//       );

//       const match = chatItems.find((el) => {
//         const nameEl = el.querySelector("span[title], span[dir='auto'] > span");
//         const name = nameEl?.textContent?.toLowerCase().trim();
//         return name && name.includes(groupName.toLowerCase());
//       });

//       if (match) {
//         const clickable = match.closest("div[role='row']") || match;
//         clickable?.click();
//         await sleep(2000);
//         return true;
//       }

//       const lastChat = chatItems[chatItems.length - 1];
//       const nameEl = lastChat?.querySelector("span[title], span[dir='auto'] > span");
//       const currentLastName = nameEl?.textContent?.toLowerCase().trim() || "";

//       if (currentLastName === lastVisibleName) {
//         return false;
//       }

//       lastVisibleName = currentLastName;
//       chatList.scrollTop += 300;
//       await sleep(1000);
//       attempts++;
//     }

//     return false;
//   };

//   const sendMessageToChat = async (message) => {
//     const getMessageBox = () =>
//       document.querySelector("div[contenteditable='true'][data-testid='conversation-compose-box-input']") ||
//       document.querySelector("div[contenteditable='true'][data-tab='10']");

//     let box = null;
//     for (let i = 0; i < 20; i++) {
//       box = getMessageBox();
//       if (box && box.offsetParent !== null) break;
//       await sleep(500);
//     }

//     if (!box) {
//       console.warn("❌ Message box not available");
//       return;
//     }

//     box.focus();
//     box.textContent = "";

//     try {
//       await navigator.clipboard.writeText(message);
//       document.execCommand("paste");
//       console.log("✍️ Message pasted via clipboard");
//     } catch (err) {
//       document.execCommand("insertText", false, message);
//       console.log("✍️ Fallback: inserted using execCommand");
//     }

//     await sleep(500);

//     const sendBtn = document.querySelector("button[data-testid='compose-btn-send'], span[data-icon='send']");
//     if (sendBtn) {
//       sendBtn.click();
//       console.log("📤 Message sent!");
//     } else {
//       console.warn("❌ Send button not found.");
//     }
//   };

//   sendToNextGroup();
// }






