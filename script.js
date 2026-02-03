let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
    const desc = document.getElementById("desc").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (desc === "" || amount <= 0) return;

    transactions.push({ id: Date.now(), desc, amount, type });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";

    renderTransactions();
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
}

function renderTransactions() {
    const list = document.getElementById("transactionList");
    const filter = document.getElementById("filter").value;
    list.innerHTML = "";

    let income = 0, expense = 0;

    transactions.forEach(t => {
        if (filter !== "all" && t.type !== filter) return;

        const li = document.createElement("li");
        li.className = t.type;

        li.innerHTML = `
            ${t.desc} - ₹${t.amount}
            <button class="delete" onclick="deleteTransaction(${t.id})">❌</button>
        `;

        list.appendChild(li);

        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    document.getElementById("income").innerText = income;
    document.getElementById("expense").innerText = expense;
    document.getElementById("balance").innerText = income - expense;

    drawChart(income, expense);
}

function drawChart(income, expense) {
    const canvas = document.getElementById("chart");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = income + expense;
    if (total === 0) return;

    const incomeAngle = (income / total) * 2 * Math.PI;

    // Income
    ctx.beginPath();
    ctx.moveTo(150,150);
    ctx.fillStyle = "#22c55e";
    ctx.arc(150,150,100,0,incomeAngle);
    ctx.fill();

    // Expense
    ctx.beginPath();
    ctx.moveTo(150,150);
    ctx.fillStyle = "#ef4444";
    ctx.arc(150,150,100,incomeAngle,2*Math.PI);
    ctx.fill();
}

renderTransactions();
