let allData = [];

async function loadData() {
    try {
        const res = await fetch("https://communityfw-api.onrender.com/quiz");
        const data = await res.json();

        allData = data;

        displayData(data);
        updateStats(data);

    } catch (err) {
        console.error(err);
    }
}

function displayData(data) {
    const table = document.querySelector("#quizTable tbody");
    table.innerHTML = "";

    data.forEach(user => {
        table.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.age}</td>
                <td>${user.score}</td>
            </tr>
        `;
    });
}

// Stats
function updateStats(data) {
    document.getElementById("totalUsers").innerText = data.length;

    let total = 0;
    data.forEach(u => total += parseFloat(u.score));

    let avg = (total / data.length || 0).toFixed(2);

    document.getElementById("avgScore").innerText = avg + "%";
}

// Search
function searchUser() {
    let value = document.getElementById("search").value.toLowerCase();

    let filtered = allData.filter(u => 
        u.name.toLowerCase().includes(value)
    );

    displayData(filtered);
}

loadData();
//Awareness Column 

data.forEach(user => {
    let color = "";

    if (user.awareness_level === "Low Awareness") color = "red";
    else if (user.awareness_level === "Moderate Awareness") color = "orange";
    else color = "green";

    html += `
        <tr>
            <td>${user.name}</td>
            <td>${user.age}</td>
            <td>${user.score}</td>
            <td style="color:${color}; font-weight:bold;">
                ${user.awareness_level}
            </td>
        </tr>
    `;
});
//Awareness Bar
let low = 0, moderate = 0, high = 0;

data.forEach(user => {
    if (user.awareness_level === "Low Awareness") low++;
    else if (user.awareness_level === "Moderate Awareness") moderate++;
    else high++;
});
