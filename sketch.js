let radio; // 宣告 radio 物件
let submitButton; // 宣告按鈕
let resultText = ""; // 儲存結果文字
let questionData; // 儲存題目資料
let currentQuestion = {}; // 儲存當前題目
let currentIndex = 0; // 當前題目索引
let correctCount = 0; // 答對題數
let incorrectCount = 0; // 答錯題數
let isQuizFinished = false; // 測驗是否結束

function preload() {
  // 載入 CSV 檔案
  questionData = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  // 產生一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  background("#ffafcc");

  // 初始化第一題
  loadQuestion(currentIndex);

  // 建立按鈕
  submitButton = createButton('下一題');
  submitButton.style('font-size', '20px');
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 180); // 設定按鈕的位置
  submitButton.mousePressed(handleButtonClick); // 綁定按鈕點擊事件
}

function draw() {
  background("#ffafcc"); // 設定背景顏色

  // 設定填充顏色
  fill("#cdb4db");
  noStroke(); // 移除邊框

  // 計算矩形的位置與大小
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;

  // 繪製矩形
  rect(rectX, rectY, rectWidth, rectHeight);

  // 顯示題目或結果
  fill("#000"); // 設定文字顏色為黑色
  textSize(35); // 設定文字大小為 35px
  textAlign(CENTER, CENTER); // 文字置中
  if (isQuizFinished) {
    text(`測驗結束！`, windowWidth / 2, windowHeight / 2 - 100);
    text(`答對題數：${correctCount}`, windowWidth / 2, windowHeight / 2 - 50);
    text(`答錯題數：${incorrectCount}`, windowWidth / 2, windowHeight / 2);
  } else {
    text(currentQuestion.question, windowWidth / 2, windowHeight / 2 - 50); // 顯示題目
  }

  // 顯示結果文字
  textSize(25);
  fill("#000");
  text(resultText, windowWidth / 2, windowHeight / 2 + 240); // 顯示結果
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 60); // 更新選項的位置
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 180); // 更新按鈕的位置
}

function loadQuestion(index) {
  // 從 CSV 資料中載入題目與選項
  currentQuestion = {
    question: questionData.getString(index, 'question'),
    options: [
      questionData.getString(index, 'option1'),
      questionData.getString(index, 'option2'),
      questionData.getString(index, 'option3'),
      questionData.getString(index, 'option4'),
    ],
    answer: questionData.getString(index, 'answer'),
  };

  // 建立或更新 radio 選項
  if (!radio) {
    radio = createRadio();
    radio.style('font-size', '35px');
    radio.style('color', '#d4a373'); // 設定選項文字顏色
  }
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 60); // 設定選項的位置
  radio.html(''); // 清空舊選項
  currentQuestion.options.forEach((option, i) => {
    radio.option(option, option);
  });
}

function handleButtonClick() {
  if (isQuizFinished) {
    // 如果測驗結束，按下按鈕重新開始
    resetQuiz();
    return;
  }

  // 檢查答案
  checkAnswer();

  // 如果還有下一題，載入下一題
  if (currentIndex < questionData.getRowCount() - 1) {
    currentIndex++;
    loadQuestion(currentIndex);
    resultText = ""; // 清空結果文字
  } else {
    // 如果沒有下一題，結束測驗
    isQuizFinished = true;
    submitButton.html('再試一次'); // 按鈕文字改為「再試一次」
  }
}

function checkAnswer() {
  let selected = radio.value(); // 獲取選中的選項
  if (selected === currentQuestion.answer) {
    resultText = "答對了！";
    correctCount++;
  } else {
    resultText = "答錯了！";
    incorrectCount++;
  }
}

function resetQuiz() {
  // 重置測驗狀態
  currentIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  isQuizFinished = false;
  resultText = "";
  submitButton.html('下一題'); // 按鈕文字改回「下一題」
  loadQuestion(currentIndex); // 載入第一題
}

