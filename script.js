let userAnswers = [];
let current = 0;
let score = 0;

// QUESTIONS
const questions = [
{
q:"Do you use a password, PIN, or biometric lock on your device?",
options:["Always use strong lock","Sometimes use","Rarely use","Never use"],
answer:0
},
{
q:"Do you use the same password across multiple accounts?",
options:["Yes, always same","Sometimes reuse","Use different passwords","Don't use passwords"],
answer:2
},
{
q:"Do you use any password manager tools?",
options:["Yes regularly","Heard but not using","No never","Don’t know"],
answer:0
},
{
q:"Do you have 2FA enabled for important accounts?",
options:["Enabled everywhere","Enabled on some accounts","Not enabled","Don’t know"],
answer:0
},
{
q:"If hacked, do you know steps to secure your account?",
options:["Fully aware","Somewhat aware","Not sure","No idea"],
answer:0
},
{
q:"Do you regularly update your device?",
options:["Always update","Sometimes update","Rarely update","Never update"],
answer:0
},
{
q:"Do you check app permissions before allowing?",
options:["Always check","Sometimes check","Rarely check","Never check"],
answer:0
},
{
q:"Have you given unnecessary permissions?",
options:["Never","Sometimes","Often","Always"],
answer:0
},
{
q:"Do you accept terms without reading?",
options:["Always read","Sometimes read","Rarely read","Never read"],
answer:0
},
{
q:"Do you allow location access always?",
options:["Only when needed","Sometimes allow","Always allow","Don’t know"],
answer:0
},
{
q:"Have you clicked suspicious links?",
options:["Never","Once or twice","Sometimes","Often"],
answer:0
},
{
q:"Do you use apps without checking credibility?",
options:["Always verify","Sometimes verify","Rarely verify","Never verify"],
answer:0
},
{
q:"Are your social profiles private?",
options:["Fully private","Partially private","Public","Don’t know"],
answer:0
},
{
q:"Have you shared personal info with strangers?",
options:["Never","Once","Few times","Often"],
answer:0
},
{
q:"Have you ever reported cybercrime?",
options:["Yes reported","Thought but didn’t","No never","Don’t know how"],
answer:0
}
];

// START QUIZ
function startQuiz() {
    const name = document.getElementById("fullName").value.trim();
    const age = document.getElementById("age").value;

    const nameRegex = /^[A-Za-z ]+$/;

    if (name === "" || age === "") {
        showError("Enter all details");
        return;
    }

    if (!nameRegex.test(name)) {
        showError("Name should contain only alphabets");
        return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("age", age);

    document.getElementById("userForm").style.display = "none";
    document.getElementById("quizSection").style.display = "block";

    loadQuestion();
}

// LOAD QUESTION
function loadQuestion() {
    const q = questions[current];

    document.getElementById("question").innerText =
        `Q${current + 1}. ${q.q}`;

    let html = "";
    q.options.forEach((opt, i) => {
        html += `
        <label>
            <input type="radio" name="opt" value="${i}"> ${opt}
        </label><br>`;
    });

    document.getElementById("options").innerHTML = html;
}

// NEXT
function nextQuestion() {
    let selected = document.querySelector('input[name="opt"]:checked');

    if (!selected) {
        showError("Please answer this question");
        return;
    }

    if (parseInt(selected.value) === questions[current].answer) {
        score++;
    }

    userAnswers.push(parseInt(selected.value));
    current++;

    if (current < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

// RESULT
function showResult() {
    document.getElementById("quizSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";

    const name = localStorage.getItem("name");
    const age = localStorage.getItem("age");

    let percentage = (score / 15) * 100;

    let awareness = "";
    if (percentage < 40) awareness = "Low Awareness";
    else if (percentage <= 80) awareness = "Moderate Awareness";
    else awareness = "High Awareness";

    document.getElementById("resultText").innerHTML = `
        <h2>Hi, ${name}</h2>
        <h3>${awareness}</h3>
        <p>Score: ${percentage.toFixed(2)}%</p>
    `;

    submitQuiz(name, age, Math.round(percentage), awareness);

    animateCircle(percentage);
    showChart(score);
}

// CHART
function showChart(score) {
    const ctx = document.getElementById('resultChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Correct', 'Wrong'],
            datasets: [{
                data: [score, 15 - score]
            }]
        }
    });
}

// CIRCLE
function animateCircle(percent) {
    const circle = document.getElementById("circle");
    let progress = 0;

    let interval = setInterval(() => {
        progress++;
        circle.style.background =
            `conic-gradient(#38bdf8 ${progress * 3.6}deg, #1e293b 0deg)`;

        document.getElementById("percent").innerText = progress + "%";

        if (progress >= percent) clearInterval(interval);
    }, 20);
}

// API CALL
async function submitQuiz(name, age, score, awareness_level) {
    try {
        await fetch("https://communityfw-api.onrender.com/quiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                age,
                score,
                awareness_level
            })
        });
    } catch (error) {
        console.error(error);
    }
}

// ERROR UI
function showError(msg) {
    const errorBox = document.getElementById("nameError");
    errorBox.innerText = msg;
}