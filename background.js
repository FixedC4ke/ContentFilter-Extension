chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "cf-error",
    title: "Отнести текст к другой категории",
    contexts: ["selection"],
  });

  fetch("http://localhost:8080/api/classes")
    .then((res) => res.json())
    .then((data) => {
      data.classes.map((elem) => {
        chrome.contextMenus.create({
          id: elem,
          title: elem,
          parentId: "cf-error",
          contexts: ["selection"],
        });
      });
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  fetch("http://localhost:8080/api/adjust", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: info.selectionText.trim().replace(/[^а-яё ]/gi, " "),
      category: info.menuItemId,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
});
