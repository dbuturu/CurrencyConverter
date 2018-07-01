async function convertCurrency(amount, fromCurrency, toCurrency) {
  if(!amount) return 0
  if(fromCurrency === toCurrency) return amount

  fromCurrency = encodeURIComponent(fromCurrency)
  toCurrency = encodeURIComponent(toCurrency)
  var query = `${fromCurrency}_${toCurrency}`

  const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`

  rates = await fetch(url).then(response =>{
    return response.json()
  }).catch()
  for (const rate in rates) {
    return amount * rates[rate].val
  }
}

async function getCurrency() {
  const sorce = 'https://free.currencyconverterapi.com/api/v5/currencies'
  let response = await fetch(sorce).then(response =>{
    return response.json()
  }).catch()
  return response
}

async function setCurrency(fromCurrency,toCurrency){
  let results = await getCurrency()
  let currencies = await results.results
  for (const currency in currencies) {
    if (currencies.hasOwnProperty(currency)) {
      const element = currencies[currency]
    let option = document.createElement("option")
    let option2
    option.text = (element.currencySymbol)?
      `${element.currencyName} ${element.currencySymbol}`:`
      ${element.currencyName}`
    option.setAttribute('value',element.id)
    option2 = option.cloneNode(true)
    fromCurrency.add(option)
    toCurrency.add(option2)
    }
  }
}

function isInPage(node) {
    return (node === document.body) ? false : document.body.contains(node)
}

addEventListener('load',()=>{
  const amount = document.querySelector('#amount')
  const fromCurrency = document.querySelector('#firstCurrency')
  const toCurrency = document.querySelector('#secondCurrency')
  const submit = document.querySelector('#submit')
  setCurrency(fromCurrency,toCurrency)

  if(isInPage(submit)){
    submit.addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        document.getElementById("myBtn").click();
      }
    })
    submit.addEventListener('click', async ()=>{
      let ans = await convertCurrency(
        amount.value,
        fromCurrency.options[fromCurrency.selectedIndex].value,
        toCurrency.options[toCurrency.selectedIndex].value
      )
    })
  }
})