let allData = [];

async function loadData() {
    const res = await fetch("https://communityfw-api.onrender.com/quiz");
    const data = await res.json();

    allData = data;

    displayData(data);
    updateStats(data);
}

function displayData(data) {
    let html = "";

    data.forEach(user => {
        let color = "gray";

        if (user.awareness_level === "Low Awareness") color = "red";
        else if (user.awareness_level === "Moderate Awareness") color = "orange";
        else if (user.awareness_level === "High Awareness") color = "green";

        html += `
        <tr>
            <td>${user.name}</td>
            <td>${user.age}</td>
            <td>${user.score}</td>
            <td style="color:${color}; font-weight:bold;">
                ${user.awareness_level || "N/A"}
            </td>
        </tr>`;
    });

    document.querySelector("#quizTable tbody").innerHTML = html;
}

// STATS
function updateStats(data) {
    document.getElementById("totalUsers").innerText = data.length;

    let total = 0;
    let low = 0, moderate = 0, high = 0;

    data.forEach(u => {
        total += parseFloat(u.score);

        if (u.awareness_level === "Low Awareness") low++;
        else if (u.awareness_level === "Moderate Awareness") moderate++;
        else if (u.awareness_level === "High Awareness") high++;
    });

    let avg = (total / data.length || 0).toFixed(2);

    document.getElementById("avgScore").innerText = avg + "%";

    console.log(`Low: ${low} | Moderate: ${moderate} | High: ${high}`);
}

// SEARCH + FILTER + SORT
function applyFilters() {
    let search = document.getElementById("search").value.toLowerCase();
    let level = document.getElementById("filterLevel").value;
    let sortName = document.getElementById("sortName").value;
    let sortAge = document.getElementById("sortAge").value;

    let filtered = allData.filter(u => {
        return (
            u.name.toLowerCase().includes(search) &&
            (level === "" || u.awareness_level === level)
        );
    });

    if (sortName === "asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sortName === "desc") filtered.sort((a, b) => b.name.localeCompare(a.name));

    if (sortAge === "low") filtered.sort((a, b) => a.age - b.age);
    if (sortAge === "high") filtered.sort((a, b) => b.age - a.age);

    displayData(filtered);
}

document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("filterLevel").addEventListener("change", applyFilters);
document.getElementById("sortName").addEventListener("change", applyFilters);
document.getElementById("sortAge").addEventListener("change", applyFilters);

loadData();