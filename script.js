let userAnswers = [];
let current = 0;
let score = 0;

//Review che Questions 15
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


// START Review Name Ani 
function startQuiz() {
    const name = document.getElementById("fullName").value.trim();
    const age = document.getElementById("age").value;

    const nameRegex = /^[A-Za-z ]+$/;

    if (name === "" || age === "") {
        alert("Enter all details");
        return;
    }

    if (!nameRegex.test(name)) {
        alert("Name should contain only alphabets");
        return;
    }

    localStorage.setItem("name", name);

    document.getElementById("userForm").style.display = "none";
    document.getElementById("quizSection").style.display = "block";

    loadQuestion();
}
// LOAD QUESTION
function loadQuestion() {
    const q = questions[current];

    document.getElementById("question").innerText = 
    `Q${current+1}. ${q.q}`;

    let html = "";
    q.options.forEach((opt, i) => {
        html += `
        <label>
            <input type="radio" name="opt" value="${i}"> ${opt}
        </label><br>`;
    });

    document.getElementById("options").innerHTML = html;
}

// NEXT question animation
function nextQuestion() {
    let selected = document.querySelector('input[name="opt"]:checked');

    if (!selected) {
        alert("Please answer this question");
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

// RESULT final
function showResult() {
    document.getElementById("quizSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";

    const name = localStorage.getItem("name");
const age = localStorage.getItem("age"); 

let percentage = (score / 15) * 100;

    let level = "";
    if (percentage < 40) level = "Low Awareness";
    else if (percentage <= 80) level = "Moderate Awareness";
    else level = "High Awareness";

    document.getElementById("resultText").innerHTML = `
        <h2>Hi, ${name} Your Result is Here!</h2>
        <h3>${level}</h3>
        <p>Your Score: ${percentage.toFixed(2)}%</p>
    `;

    // BACKEND CALL 
    submitQuiz(name, age, Math.round(percentage));

    animateCircle(percentage);
    showChart(score);
    submitQuiz(name, age, score,level);
}
function showChart(score) {
    const ctx = document.getElementById('resultChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Correct', 'Wrong'],
            datasets: [{
                label: 'Quiz Result',
                data: [score, 15 - score],
                backgroundColor: ['#38bdf8', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// PROGRESS Circle
function animateCircle(percent) {
    const circle = document.getElementById("circle");
    let progress = 0;

    let interval = setInterval(() => {
        progress++;
        circle.style.background = 
        `conic-gradient(#38bdf8 ${progress*3.6}deg, #1e293b 0deg)`;

        document.getElementById("percent").innerText = progress + "%";

        if (progress >= percent) clearInterval(interval);
    }, 20);
}
// Review varti Based Suggestions
function showTips() {

    document.getElementById("tipsSection").style.display = "block";

    let tips = "<h3>🔐 Cyber Safety Suggestions:</h3><ul>";

    // Q1 - device lock
    if (userAnswers[0] !== 0) {
        tips += "<li>Use strong password, PIN or biometric lock on your device.</li>";
    }

    // Q2 - password reuse
    if (userAnswers[1] !== 2) {
        tips += "<li>Avoid using same password. Use unique passwords for each account.</li>";
    }

    // Q3 - password manager
    if (userAnswers[2] !== 0) {
        tips += "<li>Use password manager tools to store secure passwords.</li>";
    }

    // Q4 - 2FA
    if (userAnswers[3] !== 0) {
        tips += "<li>Enable Two-Factor Authentication (2FA) for better security.</li>";
    }

    // Q6 - updates
    if (userAnswers[5] !== 0) {
        tips += "<li>Keep your apps and system updated regularly.</li>";
    }

    // Q7 - permissions
    if (userAnswers[6] !== 0) {
        tips += "<li>Always check app permissions before allowing access.</li>";
    }

    // Q11 - phishing
    if (userAnswers[10] !== 0) {
        tips += "<li>Avoid clicking on suspicious links or unknown messages.</li>";
    }

    // Q13 - privacy
    if (userAnswers[12] !== 0) {
        tips += "<li>Set your social media profiles to private.</li>";
    }

    // Q14 - personal info
    if (userAnswers[13] !== 0) {
        tips += "<li>Never share personal information with strangers online.</li>";
    }

    tips += "</ul>";

    document.getElementById("tipsSection").innerHTML = tips;
}






//Feedback - Rating page 
let rating = 0;

// auto-fill name
window.onload = function() {
    let name = localStorage.getItem("name");
    if(name) document.getElementById("fullName").value = name;
};

// rating function
function rate(r) {
    rating = r;
    document.getElementById("ratingText").innerText = "Rating: " + r + " ⭐";
}

// submit
function submitFeedback() {
    let msg = document.getElementById("message").value;

    if(rating === 0 || msg === "") {
        alert("Please complete all fields");
        return;
    }

    document.getElementById("msg").innerText = "Thank you for your feedback!";
}




async function submitQuiz(name, age, score, awareness_level) {
    try {
        const response = await fetch("https://communityfw-api.onrender.com/quiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                age: age,
                score: score,
                awareness_level: awareness_level
            })
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
}
//Error CONtainer
document.getElementById("fullName").addEventListener("input", function () {
    const name = this.value;
    const error = document.getElementById("nameError");
    const nameRegex = /^[A-Za-z ]*$/;

    if (!nameRegex.test(name)) {
        error.innerText = "Only alphabets allowed";
    } else {
        error.innerText = "";
    }
});