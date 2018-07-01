function registerServiceWorker() {
  if (!navigator.serviceWorker) return

  navigator.serviceWorker.register('sw.js',{scope:'src/'})
    .then(reg => {
      if (!navigator.serviceWorker.controller) return   

      if (reg.waiting) {
        updateReady(reg.waiting)
        return
      }

      if (reg.installing) {
        trackInstalling(reg.installing)
        return
      }

      reg.addEventListener('updatefound', function () {
        trackInstalling(reg.installing)
      })
    }).catch(function (error) {
      console.log('Service worker registration failed:', error);
    });

  let refreshing
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return
    window.location.reload()
    refreshing = true
  })
}
registerServiceWorker()

function trackInstalling(worker) {
  worker.addEventListener('statechange', function () {
    if (worker.state == 'installed') {
      updateReady(worker)
    }
  })
}

function updateReady(worker) {
  let toast = this._toastsView.show('New version available', {
      buttons: ['refresh', 'dismiss']
    })

  toast.answer.then(function (answer) {
    if (answer != 'refresh') return
    worker.postMessage({
      action: 'skipWaiting'
    })
  })
}

async function convertCurrency(amount, fromCurrency, toCurrency) {
  if(!amount) return 0
  if(fromCurrency === toCurrency) return amount

  fromCurrency = encodeURIComponent(fromCurrency)
  toCurrency = encodeURIComponent(toCurrency)
  let query = `${fromCurrency}_${toCurrency}`

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
      `${element.currencyName} ${element.currencySymbol}`:
      `${element.currencyName}`
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
  const result = document.querySelector('output#result')
  setCurrency(fromCurrency,toCurrency)

  if(isInPage(submit)){
    submit.addEventListener("keyup", event=>{
      event.preventDefault()
      if (event.keyCode === 13) {
        submit.click()
      }
    })
    submit.addEventListener('click', async ()=>{
      let ans = await convertCurrency(
        amount.value,
        fromCurrency.options[fromCurrency.selectedIndex].value,
        toCurrency.options[toCurrency.selectedIndex].value
      )
      result.innerHTML = ans
    })
  }
})