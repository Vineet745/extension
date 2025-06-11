import React, { useEffect, useState } from "react";
import { getProductList } from "../../service/api/mobileApi";

export const handleUpload = async (productArray) => {
  for (const product of productArray) {
    try {
      const response = await fetch(product.image_url);
      const blob = await response.blob();
      const reader = new FileReader();

      await new Promise((resolve) => {
        reader.onloadend = () => {
          const imageData = reader.result;

          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: uploadStatusToWhatsApp,
              args: [imageData, product.description],
            });
            resolve();
          });
        };

        reader.readAsDataURL(blob);
      });

      // Wait between uploads
      await new Promise((r) => setTimeout(r, 5000)); // wait 5 seconds

    } catch (err) {
      console.error("Error preparing image:", err);
      alert("Failed to upload one of the statuses.");
    }
  }
};

const StatusUploader = () => {
  const [productArray, setProductArray] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const { data } = await getProductList(5);
      setProductArray(data?.data || []);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <h2>Upload Multiple WhatsApp Statuses</h2>
      <button onClick={() => handleUpload(productArray)}>Upload All</button>
    </div>
  );
};

function uploadStatusToWhatsApp(imageData, caption) {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const waitForElement = (selector, timeout = 15000) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el && el.offsetParent !== null) {
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
      const statusBtn = await waitForElement('[aria-label="Status"], [data-testid="status-v3"], span[data-icon="status"]');
      (statusBtn.closest("button") || statusBtn).click();
      await sleep(2000);

      const addBtn = await waitForElement('div[aria-label*="Add status"], button[aria-label*="Add status"], span[data-icon="plus"], [data-testid="status-add"]');
      addBtn.click();
      await sleep(2000);

      const fileInput = document.querySelector('input[type="file"]');
      if (!fileInput) throw new Error("File input not found");

      const base64Data = imageData.split(",")[1];
      const mimeMatch = imageData.match(/^data:(image\/[a-zA-Z]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: mimeType });

      const file = new File([blob], "status.jpg", { type: mimeType });
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;

      fileInput.dispatchEvent(new Event("input", { bubbles: true }));
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));

      await sleep(4000); // Let WhatsApp load preview

      const captionBox = await waitForElement('div[contenteditable="true"]');
      captionBox.focus();
      document.execCommand("insertText", false, caption);
      await sleep(1000);

      const sendBtn = document.querySelector('span[data-icon="send"]')?.closest("button");
      if (sendBtn) {
        sendBtn.click();
        console.log("✅ Status sent successfully:", caption);
      } else {
        console.error("❌ Send button not found");
      }

    } catch (err) {
      console.error("Upload failed:", err);
      alert("Error: " + err);
    }
  };

  simulateUpload();
}

export default StatusUploader;
