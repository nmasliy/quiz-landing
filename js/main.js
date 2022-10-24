window.addEventListener('DOMContentLoaded', function () {
  const $screenHome = document.querySelector('.home')
  const $screenCheck = document.querySelector('.check')
  const $screenFinish = document.querySelector('.finish')
  const $screenCall = document.querySelector('.call')

  const $phone = document.querySelector('.phone-field__input')
  const $homeBtn = document.querySelector('.home__btn')

  const $checkNumber = document.querySelector('.check__number')
  const $checkBtn = document.querySelector('.check__btn span')
  const $checkItems = document.querySelectorAll('.check__item')

  const $finishNumber = document.querySelector('.finish__number')
  const $finishMoney = document.querySelector('.finish__money')
  const $finishBtn = document.querySelector('.finish__btn')

  let sum = 0
  const PHONE_LENGTH = 17 // Длина телефона с маской
  const AFTER_CHECK_DELAY = 300 // Задержка перед показом финального экрана
  const TRANSITION = 650 // Длительность переключения между экранами (В JS и CSS должны быть одинаковыми)

  $phone.addEventListener('click', () => {
    $phone.classList.add('is-active')
  })

  $phone.addEventListener('input', e => {
    $phone.classList.add('is-active')
    if (e.target.value.length < PHONE_LENGTH) {
      $homeBtn.classList.add('is-disabled')
    } else {
      $homeBtn.classList.remove('is-disabled')
    }
  })

  $homeBtn.addEventListener('click', async e => {
    e.preventDefault()

    if ($phone.value.length === PHONE_LENGTH) {
      $checkNumber.textContent = $phone.value
      await goToScreenFrom($screenHome, $screenCheck)
      await startCheckAnimation()
      await new Promise(resolve => setTimeout(resolve, AFTER_CHECK_DELAY))
      await goToScreenFrom($screenCheck, $screenFinish)
    }
  })

  $finishBtn.addEventListener('click', async () => {
    await goToScreenFrom($screenFinish, $screenCall)
  })

  async function goToScreenFrom($from, $to) {
    const promise = new Promise((resolve, reject) => {
      $from.classList.add('is-hide')
      $from.classList.remove('is-show')

      setTimeout(() => {
        $from.classList.remove('is-active')
        $to.classList.add('is-active')
        setTimeout(() => {
          $to.classList.remove('is-hide')
          $to.classList.add('is-show')

          resolve()
        }, 10)
      }, TRANSITION)
    })

    return promise
  }

  async function startCheckAnimation() {
    const MAX_PROGRESS = 100

    for (const $item of $checkItems) {
      await startCheckItem($item)
    }

    $finishNumber.textContent = $phone.value
    $finishMoney.textContent = sum + ' грн'

    async function startCheckItem($item) {
      const DELAY = $item.dataset.duration
      let progress = 0

      const $progressValue = $item.querySelector('.check__value')
      const $progressFill = $item.querySelector('.check__bar-fill')

      // Если это категория, за которую начисляются деньги
      if ($item.classList.contains('is-checked')) {
        animateMoneyEarn(+$item.dataset.money)
      }

      const promise = new Promise((resolve, reject) => {
        const checkInterval = setInterval(async () => {
          $item.classList.add('is-started')
          $progressValue.textContent = progress + '%'
          $progressFill.style.width = progress + '%'
          // Полоска заполнена
          if (progress++ == MAX_PROGRESS) {
            $item.classList.remove('is-started')
            $item.classList.add('is-finished')
            clearInterval(checkInterval)
            resolve()
          }
        }, DELAY)
      })

      return promise
    }

    function animateMoneyEarn(money = 0) {
      const MONEY_EARN_DELAY = 7 // Скорость анимации накопления денег, чем меньше - тем быстрее
      let currentMoney = sum
      sum += money

      const moneyInterval = setInterval(() => {
        $checkBtn.textContent = currentMoney + ' грн'
        if (currentMoney++ == sum) {
          clearInterval(moneyInterval)
        }
      }, MONEY_EARN_DELAY)
    }
  }

  function initPhoneMask() {
    const phoneMask = IMask($phone, {
      mask: '+{38\\0} 00 000 00 00', // 17 символов
    })
  }

  initPhoneMask()
})
