var subject = document.documentElement;

chrome.runtime.sendMessage({query: 'categories'}, function(catResponse){
  chrome.runtime.sendMessage({query: 'serverUrl'}, function(response){
    var n, a=[], walk=document.createTreeWalker(subject,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    a
      .filter(x=>x.nodeValue.match(/[а-яё]/gi))
      .forEach(node=>{
        text=node.nodeValue.replace(/[^а-яё ]/gi, " ")
        .replace(/  +/g, " ")
        .trim();
        fetch(`${response.serverUrl}/api/predict`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: text
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data[0] < 50) {
                const hiddenText = document.createElement('span');
                const warning = document.createElement('span');
                const parentSpan = document.createElement('span');
                const newLine = document.createElement('br');
                hiddenText.classList.add('cf-hidden');
                warning.classList.add('cf-warning');
                parentSpan.classList.add('cf-parent');
                let percentageOfUnwanted = 100-data.shift();
                let unwantedCategoryPercentage = Math.max(...data);
                let unwantedCategoryId = data.indexOf(unwantedCategoryPercentage);
                warning.innerText = `Неприемлемый контент: ${percentageOfUnwanted}%. С вероятностью ${unwantedCategoryPercentage}% это "${catResponse.categories[unwantedCategoryId+1]}". Наведите, чтобы посмотреть скрытый текст`;
                node.after(parentSpan);
                hiddenText.appendChild(node);
                parentSpan.appendChild(warning);
                parentSpan.appendChild(newLine);
                parentSpan.appendChild(hiddenText);
              }
          });
      })
})

})
