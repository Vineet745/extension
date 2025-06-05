export const handleUpload = async (products) => {
    for (const product of products) {
      try {
        const response = await fetch(product.image);
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
              resolve(); // Wait a bit before uploading the next one
            });
          };

          reader.readAsDataURL(blob);
        });

        // Optional: wait between uploads to let WhatsApp handle each
        await new Promise((r) => setTimeout(r, 3000)); // wait 3 seconds

      } catch (err) {
        console.error("Error preparing image:", err);
        alert("Failed to upload one of the statuses.");
      }
    }


  };



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

      const plusBtn = await waitForElement('button[aria-label="Add Status"], [data-testid="status-add"]');
      plusBtn.click();

      const mediaBtn = await waitForElement('li[role="button"] span[data-icon="media-multiple"]');
      mediaBtn.closest("li").click();

      const fileInput = await waitForElement('input[type="file"]');
      const blob = await (await fetch(imageData)).blob();

      const dt = new DataTransfer();
      dt.items.add(new File([blob], "status.jpg", { type: blob.type }));
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));

      const captionBox = await waitForElement('div[contenteditable="true"]');
      captionBox.focus();
      document.execCommand("insertText", false, caption);

      captionBox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      captionBox.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));

      console.log("Status uploaded:", caption);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Error: " + err);
    }
  };

  simulateUpload();
}