var subject = document.documentElement;

function clasifyTextByWrapper(ele) {
  if (
    ele.nodeType === Node.TEXT_NODE &&
    ele.nodeValue.trim() &&
    ele.nodeValue.trim().replace(/[^а-яё]/gi, "") &&
    ele.parentNode.nodeName.toUpperCase() != "SCRIPT" &&
    ele.parentNode.nodeName.toUpperCase() != "STYLE" &&
    ele.parentNode.nodeName.toUpperCase() != "NOSCRIPT"
  ) {
    let text = ele.nodeValue.trim().replace(/[^а-яё ]/gi, " ");

    ele.parentNode.classList.add("cf-parent");
    fetch("http://localhost:8080/api/predict", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data["допустимые сообщения"] < 0.5) {
          if (ele.parentNode.getElementsByClassName("cf-banner").length === 0) {
            var banner = document.createElement("div");
            banner.classList.add("cf-banner");
            banner.innerText =
              Math.round((1 - data["допустимые сообщения"]) * 100) + "%";
            ele.parentNode.insertBefore(banner, ele);
          }
        }
        ele.parentNode.style.filter = "none";
      });
  }

  ele.childNodes.length &&
    ele.childNodes.forEach((e) => clasifyTextByWrapper(e));
}

clasifyTextByWrapper(subject);
