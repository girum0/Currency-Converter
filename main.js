const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");
for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
      // default setting of USD to ETB 
    let selected =
      i == 0
        ? currency_code == "USD"
          ? "selected"
          : ""
        : currency_code == "ETB"
        ? "selected"
        : "";
        //creating option tag, passing currency code as text and value
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    // inserting option tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target); // calling loadflag, passing target element as an argument
  });
}
function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) { // if currency code of country list is equal to option value
      let imgTag = element.parentElement.querySelector("img"); // selecting img of drop list 
      //passing country code of a selected currency code in img url
      imgTag.src = `https://www.countryflags.io/${country_list[code]}/flat/48.png`;
    }
  }
}
window.addEventListener("load", () => {
  getExchangeRate();
});
getButton.addEventListener("click", (e) => {
  e.preventDefault(); //preventing from submitting
  getExchangeRate();
});
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value; // temp currency code from drop list
  fromCurrency.value = toCurrency.value; // passing To currency code From code currency code
  toCurrency.value = tempCode; // passing temprary currency code to To currency code
  loadFlag(fromCurrency); // calling loadflag, passing select element (fromcurrency) of From
  loadFlag(toCurrency);
  getExchangeRate();
});
function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  // if user don't enter any value, default of value 1
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/31a87b7c39a1103450f81b93/latest/${fromCurrency.value}`;
  // feching API response and return the with parsing into js object and another method to receive that oject
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      console.log(totalExRate);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    })
    // if error happens while fetching the data 
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
    });
}
