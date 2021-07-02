const formFile = document.querySelector("#formFileLg");
const displayHtml = document.querySelector("#displayText");
const checkButton = document.querySelector("#checkButton");

formFile.addEventListener("change", function () {
  checkButton.style.visibility = "visible";
  let file = formFile.files[0];
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
      `https://api.textgears.com/spelling?text=${line}&language=en-US&whitelist=&dictionary_id=&key=z88J6TXRGQ8HDrxp`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.response.errors.forEach((error) => {
          console.log(error);
          let suggestion = "";
          error.better.forEach((element) => {
            suggestion += `<li id="${element}">${element}</li>`;
          });
          let suggestionHTML = `<ul>${suggestion}</ul>`;

          // let suggestions =
          displayHtml.innerHTML = displayHtml.innerHTML.replace(
            error.bad,
            `<span data-toggle="tooltip" data-placement="bottom" title="<h1>suggestionHTML</h1>" style="border-bottom:2px solid red;background-color:rgba(220, 20, 60, .1)">${error.bad}</span>`
          );
        });
      });
  });
});
