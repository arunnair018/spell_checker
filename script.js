const formFile = document.querySelector("#formFileLg");
const displayHtml = document.querySelector("#displayText");
const checkButton = document.querySelector("#checkButton");
const errorSelector = document.querySelector(".error");

// read the file and show content
formFile.addEventListener("change", function () {
  checkButton.style.visibility = "visible";
  let file = formFile.files[0];
  let reader = new FileReader();
  reader.addEventListener("load", function (e) {
    let text = e.target.result;
    displayHtml.innerHTML = text;
  });
  reader.readAsText(file);
  // reset the file form value to null
  errorSelector.style.display = "none";
});

// hit the API and mark bad words with suggestions
checkButton.addEventListener("click", function (event) {
  event.preventDefault();
  errorSelector.style.display = "none";
  if (formFile && formFile.files.length === 0) {
    errorSelector.style.display = "block";
    return;
  }
  checkButton.style.display = "none";
  formFile.value = null;
  let lines = displayHtml.innerHTML.split("\n");
  // hitting API for each line rather the whole text
  lines.forEach(async (line, index) => {
    return fetch(
      `https://api.textgears.com/spelling?text=${line}&language=en-GB&whitelist=&dictionary_id=&key=z88J6TXRGQ8HDrxp`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // process each error
        data.response.errors.forEach((error) => {
          // create suggestion list
          let suggestion = "";
          error.better.forEach((element, index) => {
            suggestion += `<li class="my-tooltip-options ${error.bad}-${index}" onclick="handleChange()">${element}</li>`;
          });

          // create new html and replace the word with highlighting and suggestion
          // to new html, add eventlistner to be invoked when clciked on suggestion
          let newHtml = `<div class="my-tooltip">${error.bad}<span class="my-tooltiptext"><ul>${suggestion}</ul></span></div>`;
          displayHtml.innerHTML = displayHtml.innerHTML.replaceAll(
            error.bad,
            newHtml
          );
        });
      });
  });
});

// function replace the bad word with suggestion
// invoked with suggestion event handler
const handleChange = function () {
  // get parent and replace it with suggestion
  let parent = this.event.target.closest(".my-tooltip");
  parent.replaceWith(this.event.target.innerHTML);
};
