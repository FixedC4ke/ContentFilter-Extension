chrome.storage.local.set({serverUrl: "http://localhost:8080"});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "cf-error",
    title: "Отнести текст к другой категории",
    contexts: ["selection"],
  });

  chrome.storage.local.get('serverUrl', data=>{
    fetch(`${data.serverUrl}/api/categories`)
    .then((res) => res.json())
    .then((data) => {
      chrome.storage.local.set({categories: data});
      data.map((elem) => {
        chrome.contextMenus.create({
          id: elem,
          title: elem,
          parentId: "cf-error",
          contexts: ["selection"],
        });
      });
    });
  })

});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.storage.local.get('serverUrl', data=>{
    fetch(`${data.serverUrl}/api/adjust`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: info.selectionText
          .replace(/[^а-яё ]/gi, " ")
          .replace(/  +/g, " ")
          .trim(),
        category: info.menuItemId,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  })
  
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    chrome.storage.local.get(request.query, data=>{
      sendResponse(data);
    })
    return true
  }
)