const hidden = document.querySelector(".hidden");
const sidebars = document.querySelector(".sidebar");
const sliderControls = document.querySelector(".slider-controls");

document.addEventListener("DOMContentLoaded", function () {
  const currentWords = document.getElementById("current-word");
  const buttonNext = document.getElementById("next");
  const buttonBack = document.getElementById("back");
  const buttonExam = document.getElementById("exam");
  const studyMode = document.getElementById("study-mode");
  const examMode = document.getElementById("exam-mode");
  const flipCards = document.querySelectorAll(".flip-card");
  const flipCardBacks = document.querySelectorAll(".flip-card-back");
  const flipCardFronts = document.querySelectorAll(".flip-card-front");
  const totalWords = document.querySelectorAll(".total-word");
  const studyCards = document.getElementById("study-cards");
  const examCards = document.getElementById("exam-cards");

  const words = [
    { foreignWord: "Apple", translation: "Яблоко", example: "Фрукт" },
    { foreignWord: "Home", translation: "Дом", example: "Место для жилья" },
    {
      foreignWord: "Street",
      translation: "Улица",
      example:
        "Мощёная дорога внутри населённого пункта имеющая индивидуальное название",
    },
    {
      foreignWord: "Popcorn",
      translation: "Попкорн",
      example: "Воздушная кукуруза",
    },
    { foreignWord: "Cat", translation: "Кот", example: "Домашнее животное" },
    {
      foreignWord: "Dog",
      translation: "Собака",
      example: "Домашнее животное которое гавкает",
    },
    { foreignWord: "Cow", translation: "Корова", example: "Самка крупного домашнего рогатого скота," },
    { foreignWord: "Spice", translation: "Прянность", example: "Специя" },
    {
      foreignWord: "Father",
      translation: "Отец",
      example: "Родитель мужкого пола",
    },
  ];

  let firstCard;
  let currentWordIndex = 0;
  const maxWordIndex = words.length - 1;

  var trainWords = [];

  function updateCurrentWord() {
    const currentWord = words[currentWordIndex];
    totalWords.forEach((wordElement) => {
      wordElement.textContent = currentWord.word;
    });
    flipCardFronts.forEach((frontElement) => {
      frontElement.textContent = `${currentWord.foreignWord}`;
    });
    flipCardBacks.forEach((backElement) => {
      backElement.textContent = `${currentWord.translation}: ${currentWord.example}`;
    });
    currentWords.textContent = currentWordIndex + 1;

    if (currentWordIndex === 0) {
      buttonBack.disabled = true;
    } else if (currentWordIndex === maxWordIndex) {
      buttonNext.disabled = true;
    } else {
      buttonBack.disabled = false;
      buttonNext.disabled = false;
    }
  }

  buttonBack.addEventListener("click", function () {
    if (currentWordIndex > 0) {
      currentWordIndex--;
      updateCurrentWord();
    }
  });

  buttonNext.addEventListener("click", function () {
    if (currentWordIndex < words.length - 1) {
      currentWordIndex++;
      updateCurrentWord();
    }
  });

  flipCards.forEach((flipCard) => {
    flipCard.addEventListener("click", function () {
      flipCard.classList.toggle("active");
    });
  });

  function createExamCard(name, index) {
    const examCard = document.createElement("div");
    examCard.classList.add("card");
    const contentNode = document.createTextNode(name);
    examCard.appendChild(contentNode);
    examCard.addEventListener("click", function () {
      check(examCard, index);
    });
    return examCard;
  }

  function check(clickedCard, index) {
    if (currentWordIndex != -1) {
      if (currentWordIndex == index) {
        clickedCard.classList.add("correct");
        const correctCards =
          clickedCard.parentElement.querySelectorAll(".correct");
        correctCards.forEach((card) => card.classList.add("fade-out"));
        currentWordIndex = -1;
        firstCard = null;
        const leftCards =
          clickedCard.parentElement.querySelectorAll(":not(.fade-out)");
        if (leftCards.length == 0) {
          setTimeout(() => {
            alert("Поздравляем! Вы успешно завершили проверку знаний.");
          }, 500);
        }
      } else {
        clickedCard.classList.add("wrong");
        setTimeout(() => {
          clickedCard.classList.remove("wrong");
          firstCard.classList.remove("correct");
          firstCard = null;
        }, 500);
        currentWordIndex = -1;
      }
    } else {
      firstCard = clickedCard;
      currentWordIndex = index;
      clickedCard.classList.add("correct");
    }
  }

  function generateRandomTrainCards(count) {
    var cards = [];
    const shuffled = words.sort(() => 0.5 - Math.random());
    trainWords = shuffled.slice(0, count);
    trainWords.forEach((word, index) => {
      cards.push(createExamCard(word.foreignWord, index));
      cards.push(createExamCard(word.translation, index));
    });
    return cards.sort(() => 0.5 - Math.random());
  }

  buttonExam.addEventListener("click", function () {
    studyCards.classList.add("hidden");
    examCards.classList.remove("hidden");
    studyMode.style.display = "none";
    examMode.style.display = "block";
    currentWordIndex = -1;
    const cards = generateRandomTrainCards(4);
    examCards.innerHTML = "";
    cards.forEach((element) => examCards.appendChild(element));
  });


  flipCardFronts.forEach((front) => {
    front.addEventListener("click", function () {
      if (!front.classList.contains("selected")) {
        front.classList.add("selected");
        checkPairs();
      }
    });
  });

  flipCardBacks.forEach((back) => {
    back.addEventListener("click", function () {
      if (!back.classList.contains("selected")) {
        back.classList.add("selected");
        checkPairs();
      }
    });
  });
  updateCurrentWord();
});
