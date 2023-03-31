
fetch(`https://v6.exchangerate-api.com/v6/9a3f26ddcc70164616bfde61/latest/USD`)
.then(res => res.json())
.then((data)=>{

    let firstSelect = document.querySelector(".first-select");
    let secSelect = document.querySelector(".sec-select");

    console.log(data);
    let countries = Object.keys(data.conversion_rates)
    // let currency = Object.values(data.conversion_rates)

    // console.log(countries);
    // console.log(currency);

    countries.forEach((country) => {
        // console.log(country);

        let myCountries = `
        <option></option> 
        <option value="${country}">${country}</option>
        `;
        // console.log(myCountries);

        firstSelect.innerHTML +=  myCountries;
        secSelect.innerHTML += myCountries;
    })

    document.querySelector("#convertInput").addEventListener("click",(z)=>{
        z.preventDefault();

        let amountInput = document.querySelector("#amountInput").value;
        let toSelect = secSelect.value;
       
        fetch(`https://v6.exchangerate-api.com/v6/9a3f26ddcc70164616bfde61/latest/${firstSelect.value}`)
        .then(res => res.json())
        .then((firstOpt) => {
            // console.log(firstOpt);
        let rate = firstOpt.conversion_rates[toSelect];
        result.innerHTML = `${amountInput} ${firstSelect.value} = ${rate} ${toSelect}`;
        })
    })
})


