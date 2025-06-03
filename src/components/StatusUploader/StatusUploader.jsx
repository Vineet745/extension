import React from "react";

const StatusUploader = () => {
  // Predefined product to upload
  const product = {
    id: 155842,
    name: "URMYWO Busy Board - Montessori Toddler Activities",
    image: "https://m.media-amazon.com/images/I/51bAwOJOEtL._SL500_.jpg",
    caption:
      "Keep your little one entertained for hours with our innovative URMYWO Busy Board. Get it now: https://www.amazon.com/dp/B0DCBKL94N?tag=kesefdeals00-20",
  };

  const handleUpload = async () => {
    try {
      const response = await fetch(product.image);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageData = reader.result;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: uploadStatusToWhatsApp,
            args: [imageData, product.caption],
          });
        });
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Error preparing image:", err);
      alert("Failed to upload status.");
    }
  };

  return (
    <div>
      <h2>Upload Predefined WhatsApp Status</h2>
      <button onClick={handleUpload}>Upload to WhatsApp Status</button>
    </div>
  );
};

// Injected function into WhatsApp Web context
function uploadStatusToWhatsApp(imageData, caption) {
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

      const plusBtn = await waitForElement('button[aria-label="Add Status"]');
      plusBtn.click();

      const fileInput = await waitForElement('input[type="file"]');

      const blob = await (await fetch(imageData)).blob();
      const dt = new DataTransfer();
      dt.items.add(new File([blob], "status.jpg", { type: blob.type }));
      fileInput.files = dt.files;

      fileInput.dispatchEvent(new Event("change", { bubbles: true }));

      const captionBox = await waitForElement('div[contenteditable="true"]');
      captionBox.focus();
      document.execCommand("insertText", false, caption);

      captionBox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));
      captionBox.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));

      console.log("Status uploaded successfully.");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Error: " + err);
    }
  };

  simulateUpload();
}

export default StatusUploader;
