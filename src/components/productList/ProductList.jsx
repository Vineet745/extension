import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./productListStyle";
import { getGroups, getProductList } from "../../service/api/mobileApi";
import { handleUpload } from "../../utils/commonFunction";

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

  console.log("groups",groups)


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

//   const groupList = cleanedGroups.filter((g) => g.type === 1).map((g) => g.name);
//   const communityList = cleanedGroups.filter((g) => g.type === 2).map((g) => g.name);

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
//                 ) break;
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
//                 const sendBtn = document.querySelector("span[data-icon='send']");
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
//               const msg = `🛒 *${product.title}*\n💰 Price: $${product.price}\n🔗 ${product.amazon_product_url}\n\n${product.description || ""}\nAffiliated Url: ${product.product_affiliate_url}`;
//               await sendMessage(msg, product.image); // ✅ image sent via <input type="file">
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
// };



const handleSend = async () => {
  const cleanedGroups = groups
    .filter((g) => g?.name?.trim() !== "")
    .map((g) => ({ name: g.name.trim(), type: g.type }));

  if (cleanedGroups.length === 0) {
    alert("⚠️ Please enter at least one group or community name.");
    return;
  }

  const groupList = cleanedGroups.filter((g) => g.type === 1).map((g) => g.name);
  const communityList = cleanedGroups.filter((g) => g.type === 2).map((g) => g.name);

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
                ) break;
                clickable = clickable.parentElement;
              }

              if (clickable) {
                ["mousedown", "mouseup", "click"].forEach((type) =>
                  clickable.dispatchEvent(
                    new MouseEvent(type, {
                      bubbles: true,
                      cancelable: true,
                      view: window,
                    })
                  )
                );
                await sleep(2000);
                return true;
              }
            }
            await sleep(800);
          }
          return false;
        };

        const waitForChatToOpen = async (callback, maxAttempts = 30) => {
          for (let i = 0; i < maxAttempts; i++) {
            const box = document.querySelector("div[contenteditable='true'][data-tab='10']");
            if (box && box.offsetParent !== null) {
              callback();
              return;
            }
            await sleep(1000);
          }
          alert("❌ Message box not available.");
        };

        const fetchImageAsFile = async (url, fileName = "image.jpg") => {
          const res = await fetch(url);
          const blob = await res.blob();
          return new File([blob], fileName, { type: blob.type });
        };

        const sendImage = async (imageUrl) => {
          try {
            const imageFile = await fetchImageAsFile(imageUrl);
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(imageFile);

            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.style.display = "none";
            fileInput.accept = "image/*";
            document.body.appendChild(fileInput);
            fileInput.files = dataTransfer.files;

            fileInput.dispatchEvent(new Event("change", { bubbles: true }));

            const actualInput = document.querySelector("input[type='file']");
            if (actualInput) {
              actualInput.files = dataTransfer.files;
              actualInput.dispatchEvent(new Event("change", { bubbles: true }));
              await sleep(3000);
            }

            fileInput.remove();
          } catch (err) {
            console.error("⚠️ Error uploading image", err);
          }
        };

        const sendMessage = async (msg, imageUrl) => {
          return new Promise(async (resolve) => {
            waitForChatToOpen(async () => {
              if (imageUrl) {
                await sendImage(imageUrl);
              }

              const messageBox = document.querySelector("div[contenteditable='true'][data-tab='10']");
              if (!messageBox) {
                resolve(false);
                return;
              }

              messageBox.focus();
              document.execCommand("insertText", false, msg);

              setTimeout(() => {
                const sendBtn = document.querySelector("span[data-icon='send']");
                if (sendBtn) sendBtn.click();
                resolve(true);
              }, 1000);
            });
          });
        };

        const uploadStatus = async (imageUrl, caption) => {
          try {
            const blob = await (await fetch(imageUrl)).blob();
            const reader = new FileReader();

            await new Promise((resolve) => {
              reader.onloadend = () => {
                const imageData = reader.result;

                const waitForElement = (selector, timeout = 10000) => {
                  return new Promise((resolve, reject) => {
                    const start = Date.now();
                    const interval = setInterval(() => {
                      const el = document.querySelector(selector);
                      if (el) {
                        clearInterval(interval);
                        resolve(el);
                      } else if (Date.now() - start > timeout) {
                        clearInterval(interval);
                        reject("Timeout waiting for " + selector);
                      }
                    }, 500);
                  });
                };

                const simulateUpload = async () => {
                  try {
                    const statusBtn = await waitForElement('[aria-label="Status"], [data-testid="status-v3"]');
                    statusBtn.click();

                    const plusBtn = await waitForElement('button[aria-label="Add Status"], [data-testid="status-add"]');
                    plusBtn.click();

                    const mediaBtn = await waitForElement('li[role="button"] span[data-icon="media-multiple"]');
                    mediaBtn.closest("li").click();

                    const fileInput = await waitForElement('input[type="file"]');
                    const dt = new DataTransfer();
                    dt.items.add(new File([blob], "status.jpg", { type: blob.type }));
                    fileInput.files = dt.files;
                    fileInput.dispatchEvent(new Event("change", { bubbles: true }));

                    const captionBox = await waitForElement('div[contenteditable="true"]');
                    captionBox.focus();
                    document.execCommand("insertText", false, caption);
                    captionBox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
                    captionBox.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));

                    console.log("✅ Status uploaded:", caption);
                  } catch (err) {
                    console.error("⚠️ Failed uploading status", err);
                  }
                };

                simulateUpload();
                resolve();
              };

              reader.readAsDataURL(blob);
            });
          } catch (err) {
            console.error("❌ Error in status upload", err);
          }
        };

        const sendToList = async (list, label) => {
          for (const name of list) {
            const found = await waitForGroupAndClick(name);
            if (!found) {
              alert(`⚠️ ${label} "${name}" not found.`);
              continue;
            }

            for (const product of products) {
              const msg = `🛒 *${product.title}*\n💰 Price: $${product.price}\n🔗 ${product.amazon_product_url}\n\n${product.description || ""}\nAffiliated Url: ${product.product_affiliate_url}`;
              await sendMessage(msg, product.image);
              await uploadStatus(product.image, product.description || product.title);
              await sleep(2000);
            }

            await sleep(2000);
          }
        };

        await sendToList(groupList, "Group");
        await sendToList(communityList, "Community");

        alert("✅ All products sent + statuses uploaded!");
      },
    });
  });
};





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





