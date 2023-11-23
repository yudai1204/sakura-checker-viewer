const getHTML = (message, sender, sendResponse) => {
  const { url } = message;
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      console.log(html);
      sendResponse({ html });
    })
    .catch((error) => {
      console.log(error);
    });
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "get") {
    getHTML(message, sender, sendResponse);
  }
  return true;
});
