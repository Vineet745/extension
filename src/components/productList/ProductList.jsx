import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./productListStyle";
import { getGroups } from "../../service/api/mobileApi";

const ProductList = () => {
  const location = useLocation();
  const item = location.state?.item;
  const navigate = useNavigate();

  // State arrays to hold the whole item objects
  const [groupItems, setGroupItems] = useState([]);
  const [communityItems, setCommunityItems] = useState([]);
  const [statusItems, setStatusItems] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getGroupsAndCommunity();
  }, []);

  const productArray = [
    {
      id: 155842,
      name: "URMYWO Busy Board - Montessori Toddler Activities",
      image: "https://m.media-amazon.com/images/I/51bAwOJOEtL._SL500_.jpg",
      price: "9.99",
      mrp: "19.97",
      discount: "0.00",
      coupon: "AUYHZFJA",
      buttonText: "Get Deal",
      amazonUrl: "https://www.amazon.com/dp/B0DCBKL94N?m=A38SVRTBUT8LQY",
      affiliateUrl: "https://www.amazon.com/dp/B0DCBKL94N?tag=kesefdeals00-20",
      productType: "Toys And Games",
      asin: "B0DCBKL94N",
      description:
        "Keep your little one entertained for hours with our innovative URMYWO Busy Board.",
    },
    {
      id: 155843,
      name: "Educational Wooden Puzzle - Animal Shapes",
      image: "https://m.media-amazon.com/images/I/71AvQd3VzqL._SL1500_.jpg",
      price: "12.99",
      mrp: "22.99",
      discount: "0.00",
      coupon: "PUZZLEDEAL",
      buttonText: "Buy Now",
      amazonUrl: "https://www.amazon.com/dp/B0XXYZZ111?m=ABC123",
      affiliateUrl: "https://www.amazon.com/dp/B0XXYZZ111?tag=kesefdeals00-20",
      productType: "Toys And Games",
      asin: "B0XXYZZ111",
      description:
        "Help your kids learn animal names and shapes with this colorful wooden puzzle set.",
    },
    {
      id: 155844,
      name: "STEM Building Blocks Set - 150 Pieces",
      image: "https://m.media-amazon.com/images/I/81mC5xn8x4L._AC_SL1500_.jpg",
      price: "18.49",
      mrp: "29.99",
      discount: "0.00",
      coupon: "STEMBLOCKS",
      buttonText: "Claim Offer",
      amazonUrl: "https://www.amazon.com/dp/B0ABCXYZ123?m=XYZ987",
      affiliateUrl: "https://www.amazon.com/dp/B0ABCXYZ123?tag=kesefdeals00-20",
      productType: "Educational Toys",
      asin: "B0ABCXYZ123",
      description:
        "Encourage problem-solving and creativity with our 150-piece STEM building blocks set.",
    },
    {
      id: 155845,
      name: "Magnetic Drawing Board for Toddlers",
      image: "https://m.media-amazon.com/images/I/71X4kjy2-FL._AC_SL1500_.jpg",
      price: "10.99",
      mrp: "17.99",
      discount: "0.00",
      coupon: "DRAWFUN",
      buttonText: "Shop Now",
      amazonUrl: "https://www.amazon.com/dp/B0DRAW12345?m=DRAW321",
      affiliateUrl: "https://www.amazon.com/dp/B0DRAW12345?tag=kesefdeals00-20",
      productType: "Toys",
      asin: "B0DRAW12345",
      description:
        "Let your kids express creativity with this erasable and reusable magnetic drawing board.",
    },
  ];

  // Get Group And community

  const getGroupsAndCommunity = async () => {
    const requiredData = {
      mobile_number_id: 5,
    };
    try {
      const { data } = await getGroups(requiredData);
      const groupNamesArray = data?.whatsapp_type_names?.data?.map(
        (item) => item.name
      );
      setGroups(groupNamesArray);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleToggle = (item, stateArray, setStateArray) => {
    const exists = stateArray.some((i) => i.id === item.id);
    if (exists) {
      setStateArray(stateArray.filter((i) => i.id !== item.id));
    } else {
      setStateArray([...stateArray, item]);
    }
  };

  // Send message Group and community

  const handleSend = () => {
    const groupsArray = groups
      .map((name) => name.trim())
      .filter((name) => name !== "");

    if (groupsArray.length === 0) {
      alert("⚠️ Please enter at least one group name.");
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        args: [groupsArray, productArray],
        func: async (groupList, products) => {
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

          const waitForChatToOpen = async (callback, maxAttempts = 20) => {
            for (let i = 0; i < maxAttempts; i++) {
              const box = document.querySelector(
                "div[contenteditable='true'][data-tab='10']"
              );
              if (box && box.offsetParent !== null) {
                callback();
                return;
              }
              await sleep(1000);
            }
            alert("❌ Message box not available.");
          };

          const sendMessage = async (msg) => {
            return new Promise((resolve) => {
              waitForChatToOpen(() => {
                const messageBox = document.querySelector(
                  "div[contenteditable='true'][data-tab='10']"
                );
                if (!messageBox) {
                  resolve(false);
                  return;
                }

                messageBox.focus();

                navigator.clipboard
                  .writeText(msg)
                  .then(() => {
                    document.execCommand("paste");
                  })
                  .catch(() => {
                    document.execCommand("insertText", false, msg);
                  });

                setTimeout(() => {
                  const sendBtn = document.querySelector(
                    "span[data-icon='send']"
                  );
                  if (sendBtn) sendBtn.click();
                  resolve(true);
                }, 500);
              });
            });
          };

          for (const group of groupList) {
            const found = await waitForGroupAndClick(group);
            if (!found) {
              alert(`⚠️ Group "${group}" not found.`);
              continue;
            }

            for (const product of products) {
              const msg = `🛒 *${product.name}*\n💰 Price: $${
                product.price
              }\n🔗 ${product.affiliateUrl}\n\n${product.description || ""}`;
              await sendMessage(msg);
              await sleep(1500);
            }

            await sleep(2000);
          }

          alert("✅ All products sent to all groups!");
        },
      });
    });
  };



  return (
    <div style={{ width: 600, maxHeight: 400 }}>
      <h3 onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back
      </h3>
      <div
        style={{
          height: "80vh",
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
            style={{ marginLeft: 10, marginBlockEnd: 0, marginBlockStart: 4 }}
          >
            Product List
          </h1>
          <button
            style={styles.addNumberButton}
            onClick={handleSend}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Start
          </button>
        </divm>
        {productArray.map((item, index) => (
          <div
            key={item.id}
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
              style={{ width: "5%", height: "5%" }}
              src={item.image}
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
                {item.name}
              </h5>
              <div style={{ display: "flex", marginTop: 10 }}>
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
              </div>
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
