(function () {
  const selection = window.getSelection()?.toString().trim();

  if (!selection) {
    alert("Please select some text on the page to copy.");
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = selection;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      alert("Selected text copied to clipboard!");
    } else {
      alert("Failed to copy text.");
    }
  } catch (err) {
    alert("Copy failed: " + err);
  }

  document.body.removeChild(textArea);
})();
