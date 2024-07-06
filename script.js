const prizes = [//МАССИВ С ПРИЗАМИ
  {
    text: "500 ZWM",//ПОЛЕ ДЛЯ ВЫИГРЫША, МЕНЯТЬ ЕГО
    color: "hsl(200 92% 64%)",
  },
  {
    text: "Spin Again",//ПЕРВЫЙ СПИН ПРИЛЕТАЕТ СЮДА
    color: "hsl(317 88% 70%)",
  },
  {
    text: "50 ZWM",
    color: "hsl(179 75% 50%)",
  },
  {
    text: "3000 ZWM",
    color: "hsl(294 49% 71%)",
  },
  {
    text: "100 ZWM",
    color: "hsl(200 92% 64%)",
  },
  {
    text: "Spin Again",
    color: "hsl(317 88% 70%)",
  },
  {
    text: "1000 ZWM",
    color: "hsl(179 75% 50%)",
  },
  {
    text: "5000 ZWM",
    color: "hsl(294 49% 71%)",
  }
];
const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");

const prizeSlice = 360 / prizes.length;
const prizeOffset = Math.floor(180 / prizes.length);
const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);

let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;
let spinCount = 0;

const createPrizeNodes = () => {
  prizes.forEach(({ text, color }, i) => {
    const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" style="--rotate: ${rotation}deg">
        <span class="text">${text}</span>
      </li>`
    );
  });
};

const createConicGradient = () => {
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
      .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
      .reverse()
    }
    );`
  );
};

const setupWheel = () => {
  createConicGradient();
  createPrizeNodes();
  prizeNodes = wheel.querySelectorAll(".prize");
};

const runTickerAnimation = () => {
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += (2 * Math.PI);

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => ticker.style.animation = null, 10);
    currentSlice = slice;
  }
  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice) % prizes.length;
  prizeNodes[selected].classList.add(selectedClass);

  if (spinCount === 2) {//МОДАЛЬНОЕ ОКНО ПОСЛЕ ВЫИГРЫША,ТУТ МЕНЯТЬ ТЕКСТ
    Swal.fire({
      title: 'You won!',
      text: 'Congratulations! You WON 500 ZWM',
      icon: 'success',
      confirmButtonText: 'Collect',
      allowEscapeKey: false,//ПРОПИСАНО, ЧТО ПРИ НАЖАТИИ ESC, ОКНО НЕ ЗАКРОЕТСЯ
      allowOutsideClick: false//ТОЖЕ САМОЕ, НО НИЧЕГО НЕ ПРОИСХОДИТ ПРИ НАЖАТИИ ВНЕ ОКНА
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '#'; //ЗАМЕНА ССЫЛКИ
      }
    });
  }
};

trigger.addEventListener("click", () => {
  trigger.disabled = true;

  if (spinCount === 0) {
    rotation += 360 * 5 + (prizeSlice * 1) + prizeOffset; // Spin Again
  } else if (spinCount === 1) {
    rotation += 360 * 5 + (prizeSlice * 6) + prizeOffset + 5; // 500 ZWM
  } else {
    rotation += 360 * 5 + Math.floor(Math.random() * 360);
  }
  spinCount++;

  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation();
});

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame(tickerAnim);
  rotation %= 360;
  selectPrize();
  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  trigger.disabled = false;
});

setupWheel();