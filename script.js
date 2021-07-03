const formFile = document.querySelector("#formFileLg");
const displayHtml = document.querySelector("#displayText");
const checkButton = document.querySelector("#checkButton");
const errorHtml = document.querySelector(".error");
console.log;
formFile.addEventListener("change", function () {
  checkButton.style.visibility = "visible";
  let file = formFile.files[0];
  console.log(file);
  let reader = new FileReader();
  reader.addEventListener("load", function (e) {
    let text = e.target.result;
    displayHtml.innerHTML = text;
  });
  reader.readAsText(file);
  formFile.value = "";
});

checkButton.addEventListener("click", function (event) {
  event.preventDefault();
  checkButton.style.visibility = "hidden";
  let lines = displayHtml.innerHTML.split("\n");
  lines.forEach(async (line, index) => {
    return fetch(
      `https://api.textgears.com/spelling?text=${line}&language=en-GB&whitelist=&dictionary_id=&key=z88J6TXRGQ8HDrxp`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.response.errors.forEach((error) => {
          console.log(error.bad);
          let suggestion = "";
          error.better.forEach((element) => {
            suggestion += `<li class="my-tooltip-options">${element}</li>`;
          });
          let newHtml = `<div class="my-tooltip">${error.bad}<span class="my-tooltiptext"><ul>${suggestion}</ul></span></div>`;
          displayHtml.innerHTML = displayHtml.innerHTML.replace(
            error.bad,
            newHtml
          );
        });
      });
  });
});
