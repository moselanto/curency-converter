let source_currency = "";
let target_currency = "";
let curr_list = [];

const msg1 = document.getElementById("msg1");
const msg2 = document.getElementById("msg2");
const sliding = document.querySelector(".sliding");
const slider = document.querySelector(".slider");
const nxt_btn = document.getElementById("next");
const convert_btn = document.getElementById("convert");
const datalist = document.getElementById("currency");
const output = document.getElementById("output-text");
const ex_rate_box = document.getElementById("exchange-rate");
const target_currency_box = document.getElementById("target-currency-unit");
const source_currency_box = document.getElementById("source-currency-unit");
const source_amount_box = document.getElementById("original-currency-amount");

// Break the list adding code into a function for easier re-use
const addListEntry = (value, text) => {
  // Create a new option element.
  var optionNode = document.createElement("option");
  // Set the value
  optionNode.value = value;
  // create a text node and append it to the option element
  optionNode.appendChild(document.createTextNode(text));
  // Add the optionNode to the datalist
  datalist.appendChild(optionNode);
};

// this func will load all supported currencies into a datalist
// and in an array for some logical operation later
const loadSupporedCurrencies = async () => {
  //   reseting all the inputbox values
  ex_rate_box.value = "";
  source_amount_box.value = "";
  source_amount_box.value = "";
  target_currency_box.value = "";

  //   getting all the supported currencies from `exchangeratesapi`
  let response = await fetch("https://api.exchangeratesapi.io/latest");
  let data = await response.json();

  //   adding the base currency to the list
  addListEntry(data.base, data.base);
  curr_list.push(data.base);

  // Read currencies as key from the json obj and pushing into the list
  for (let key in data.rates) {
    addListEntry(key, key);
    curr_list.push(key);
  }
};

// gets exchange rate for specific currencies
const getExRate = async (frm, to) => {
  let req_url = `https://api.exchangeratesapi.io/latest?base=${frm}&symbols=${to}`;
  let res = await fetch(req_url);
  let data = await res.json();

  return data.rates[to];
};

// loading the rates in the inputbox
const loadExRate = async (frm, to) => {
  // let ex_rate = document.getElementById("exchange-rate")
  let rate = await getExRate(frm, to);

  ex_rate_box.value = rate;
  //   disabling the exchange rate inputbox as the value is
  // loaded beforehand
  ex_rate_box.disabled = "true";
};

// animating between two divs
// `true` for backward animation
// `false` for forward animation
const animateSlider = (isPositive) => {
  // dynamically getting the length to translate
  let to_translate = sliding.offsetWidth;

  if (isPositive) {
    slider.style.transform = `translate(0px)`;
  } else {
    slider.style.transform = `translate(${-to_translate}px)`;
  }
};

// it will handel all the logics related to gettng currencies
// and the exchange rate from the internet if exists
const fetchCurrency = async () => {
  source_currency = source_currency_box.value.toString();
  target_currency = target_currency_box.value.toString();

  //   basic validations
  if (source_currency === target_currency) {
    source_currency_box.focus();
    alert("source and target currency can't be same or empty !");
    return;
  } else if (source_currency === "") {
    source_currency_box.focus();
    alert("source currency can't be empty !");
    return;
  } else if (target_currency === "") {
    target_currency_box.focus();
    alert("target currency can't be empty !");
    return;
  } else {
    let s_found = curr_list.find((crr) => crr == source_currency);
    let t_found = curr_list.find((crr) => crr == target_currency);

    // if source currency is not supported
    if (s_found == undefined) {
      msg2.innerHTML = `target currency <b>not found</b> for Converting <b>${source_currency}</b> to <b>${target_currency}</b>.\n Enter Exchage rate yourself !`;
      animateSlider(false);
      // to get a smooth animation without jumping arround
      setTimeout(() => ex_rate_box.focus(), 300);
      // if target currency is not supported it does not loades the rate and does not
      // disable the exchange rate inputbox
    } else if (t_found == undefined) {
      msg2.innerHTML = `target currency <b>not found</b> for Converting <b>${source_currency}</b> to <b>${target_currency}</b>.\n Enter Exchage rate yourself !`;
      animateSlider(false);
      // to get a smooth animation without jumping arround
      setTimeout(() => ex_rate_box.focus(), 300);
      // if exchange rate is found for the source and target
    } else {
      msg2.innerHTML = `Exchange rate found for Converting <b>${source_currency}</b> to <b>${target_currency}</b> `;
      animateSlider(false);
      loadExRate(source_currency, target_currency);
      // to get a smooth animation without jumping arround
      setTimeout(() => source_amount_box.focus(), 300);
    }
  }
};

// button click event for getting the currencies and fetching the rate
nxt_btn.addEventListener("click", () => {
  console.log("Try Using `Enter` from your keyboard inside the inputbox");
  fetchCurrency();
});

// key press event for getting the currencies and fetching the rate
document.getElementById("get_curr").addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    fetchCurrency();
  }
});

// this function converts the source amount by the exchange rate
const getConverted = () => {
  // getting the amount and rate in float value
  let amt = parseFloat(source_amount_box.value);
  let r = parseFloat(ex_rate_box.value);

  // basic validations
  if (isNaN(amt) || amt <= 0) {
    alert("Source ammount need to be a positive number");
    source_amount_box.focus();
    return;
  } else if (isNaN(r) || r <= 0) {
    alert("Exchange rate need to be a positive number");
    ex_rate_box.disabled = false;
    ex_rate_box.focus();
    return;
  }
  // setting the output inside an html element
  let res = r * amt;
  // console.log(res)
  output.innerHTML = `Your <b>${amt.toFixed(
    2
  )} ${source_currency}</b> is converted to <b>${res.toFixed(
    2
  )} ${target_currency}</b> 🤑`;
};

// button click event for getting the converted currencies and printing the output
convert_btn.addEventListener("click", () => {
  console.log("Try Using `Enter` from your keyboard inside the inputbox");
  getConverted();
});

// key press event for getting the converted currencies and printing the output
document.getElementById("get_conv").addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    getConverted();
  }
});

// change button
document.querySelector(".change").addEventListener("click", () => {
  // animate to prev window
  animateSlider(true);
  // reset
  ex_rate_box.disabled = false;
  ex_rate_box.value = "";
  output.innerHTML = "Converted 💰 will appear here.";
});

// swaping source and target currency on button press
document.querySelector(".exchange_button").addEventListener("click", () => {
  let temp = source_currency_box.value;
  source_currency_box.value = target_currency_box.value;
  target_currency_box.value = temp;
});

// document.addEventListener("DOMContentLoaded", () =>)
// loading currency datalist and array on load
loadSupporedCurrencies();