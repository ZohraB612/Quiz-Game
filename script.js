const quiz = document.getElementById("quiz");
const questionElement = document.getElementById("question");
const options = document.querySelectorAll(".option");
const scoreElement = document.getElementById("score");
const resultElement = document.getElementById("result");
const nextButton = document.getElementById("nextButton");
const newQuizButton = document.getElementById("newQuizButton");
const retryQuizButton = document.getElementById("retryQuizButton");

// Array containing different sets of quiz questions
const quizSets = [
    // Quiz Set 1
    [{
            question: "What is the capital of France?",
            options: ["Berlin", "Madrid", "Paris", "Rome"],
            correctAnswer: "Paris",
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Mars", "Venus", "Jupiter", "Saturn"],
            correctAnswer: "Mars",
        },
        {
            question: "What is the largest mammal in the world?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Kangaroo"],
            correctAnswer: "Blue Whale",
        },
        // Add more questions as needed
    ],

    // Quiz Set 2
    [{
            question: "What is the capital of Japan?",
            options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
            correctAnswer: "Tokyo",
        },
        {
            question: "Which element has the chemical symbol 'O'?",
            options: ["Oxygen", "Gold", "Silver", "Iron"],
            correctAnswer: "Oxygen",
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Southern Ocean", "Pacific Ocean"],
            correctAnswer: "Pacific Ocean",
        },
        // Add more questions as needed
    ],

    // Quiz Set 3
    [{
            question: "In which year did World War II end?",
            options: ["1943", "1945", "1950", "1939"],
            correctAnswer: "1945",
        },
        {
            question: "What is the currency of Brazil?",
            options: ["Peso", "Real", "Dollar", "Euro"],
            correctAnswer: "Real",
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correctAnswer: "William Shakespeare",
        },
        // Add more questions as needed
    ],

    // Quiz Set 4
    [{
            question: "Which planet is known as the 'Morning Star'?",
            options: ["Venus", "Mars", "Jupiter", "Mercury"],
            correctAnswer: "Venus",
        },
        {
            question: "What is the capital of Australia?",
            options: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
            correctAnswer: "Canberra",
        },
        {
            question: "What is the world's longest river?",
            options: ["Nile", "Amazon", "Yangtze", "Mississippi"],
            correctAnswer: "Amazon",
        },
        // Add more questions as needed
    ],

    // Quiz Set 5
    [{
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
            correctAnswer: "Leonardo da Vinci",
        },
        {
            question: "What is the largest desert in the world?",
            options: ["Gobi Desert", "Sahara Desert", "Antarctica", "Arabian Desert"],
            correctAnswer: "Antarctica",
        },
        {
            question: "Which gas do plants absorb from the atmosphere?",
            options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            correctAnswer: "Carbon Dioxide",
        },
        // Add more questions as needed
    ],
];

// Variables to keep track of the current quiz set and question index
let currentQuizSetIndex = -1;
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = "";

// Variables to keep track of quiz results
let quizResults = [];
let quizzesPlayed = 0;

// Global variable to store the chart instance
let myChart;

// Function to update the chart
function updateChart() {
    const successRate = (quizResults.filter(result => result === true).length / quizzesPlayed) * 100;

    if (!myChart) {
        // If the chart instance doesn't exist, create a new one
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Success Rate'],
                datasets: [{
                    label: 'Success Rate',
                    data: [successRate],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    } else {
        // If the chart instance exists, update its data
        myChart.data.datasets[0].data = [successRate];
        myChart.update();
    }
}

// Function to start a new quiz
function startNewQuiz() {
    let newQuizSetIndex;

    do {
        // Randomly select a quiz set
        newQuizSetIndex = Math.floor(Math.random() * quizSets.length);
    } while (newQuizSetIndex === currentQuizSetIndex);

    // Update the current quiz set index
    currentQuizSetIndex = newQuizSetIndex;

    // Reset quiz variables
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = "";

    // Load the first question of the selected quiz set
    loadQuestion();

    // Reset score and result messages
    scoreElement.textContent = "";
    resultElement.textContent = "";

    // Show the question and options
    questionElement.style.display = "block";
    options.forEach((option) => (option.style.display = "block"));

    // Hide the Next Button
    nextButton.style.display = "none";
    // Hide the New Quiz and Retry Quiz buttons during the quiz
    newQuizButton.style.display = "none";
    retryQuizButton.style.display = "none";

    // Increment the quizzesPlayed counter
    quizzesPlayed++;

    // Update the chart after every quiz
    updateChart();

    // // Update the chart after every 10 quizzes
    // if (quizzesPlayed % 2 === 0) {
    //     updateChart();
    // }
}

// Function to retry the current quiz
function retryQuiz() {
    // Reset quiz variables
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = "";

    // Show the question and options
    questionElement.style.display = "block";
    options.forEach((option) => (option.style.display = "block"));

    // Load the first question
    loadQuestion();

    // Reset score and result messages
    scoreElement.textContent = "";
    resultElement.textContent = "";

    // Hide the Next Button
    nextButton.style.display = "none";
    // Hide the New Quiz and Retry Quiz buttons during the quiz
    newQuizButton.style.display = "none";
    retryQuizButton.style.display = "none";
}

// Function to load and display a question
function loadQuestion() {
    // Check if a valid quiz set is selected
    if (currentQuizSetIndex >= 0 && currentQuizSetIndex < quizSets.length) {
        const currentQuestionSet = quizSets[currentQuizSetIndex];
        const currentQuestion = currentQuestionSet[currentQuestionIndex];

        questionElement.textContent = currentQuestion.question;

        // Apply style to center the question text
        questionElement.style.textAlign = "center";

        options.forEach((option, index) => {
            // Remove previous click event listener
            option.removeEventListener("click", optionClickHandler);
            // Add a new click event listener
            option.addEventListener("click", optionClickHandler);
            // Set the index as a data attribute
            option.dataset.index = index;
        });

        function optionClickHandler(event) {
            selectAnswer(event.target);
        }

        currentQuestion.options.forEach((option, index) => {
            options[index].textContent = option;
        });

        // Reset result message and hide Next Button
        resultElement.textContent = "";
        nextButton.style.display = "none";
        // Hide the New Quiz and Retry Quiz buttons during the quiz
        newQuizButton.style.display = "none";
        retryQuizButton.style.display = "none";
    } else {
        console.error("Invalid quiz set selected");
    }
}


// Function to select the chosen answer
function selectAnswer(answerElement) {
    selectedAnswer = answerElement.textContent;

    // Store the result of the current quiz
    quizResults.push(answerElement.dataset.index === quizSets[currentQuizSetIndex][currentQuestionIndex].correctIndex);

    // Display result message
    resultElement.textContent = answerElement.textContent === quizSets[currentQuizSetIndex][currentQuestionIndex].correctAnswer ?
        "Correct!" :
        "Incorrect!";

    // Show Next Button
    nextButton.style.display = "block";
    // Hide the New Quiz and Retry Quiz buttons during the quiz
    newQuizButton.style.display = "none";
    retryQuizButton.style.display = "none";
}

// Function to proceed to the next question
function nextQuestion() {
    // Check if the selected answer is correct and update the score
    if (selectedAnswer === quizSets[currentQuizSetIndex][currentQuestionIndex].correctAnswer) {
        score++;
    }

    // Move to the next question
    currentQuestionIndex++;

    // Check if there are more questions
    if (currentQuestionIndex < quizSets[currentQuizSetIndex].length) {
        // Load the next question
        loadQuestion();
    } else {
        // Display the final score when there are no more questions
        showScore();
    }
}

// Function to display the user's final score
function showScore() {
    // Display the final score
    scoreElement.textContent = `Your Score: ${score}/${quizSets[currentQuizSetIndex].length}`;
    // Hide the question and options
    questionElement.style.display = "none";
    options.forEach((option) => (option.style.display = "none"));
    // Display the final result message
    resultElement.textContent = `Quiz Completed!`;
    // Show the New Quiz and Retry Quiz buttons
    newQuizButton.style.display = "block";
    retryQuizButton.style.display = "block";
    // Hide the Next Button
    nextButton.style.display = "none";
}

// Initial loading of the first question
startNewQuiz();