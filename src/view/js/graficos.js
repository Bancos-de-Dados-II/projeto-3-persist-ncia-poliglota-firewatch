document.addEventListener("DOMContentLoaded", () => {
    carregarGraficoIncendiosPorCidade();
    carregarGraficoIncendiosPorGravidade();
});

async function carregarGraficoIncendiosPorCidade() {
    const response = await fetch("http://localhost:3000/api/incendios/por-cidade");
    const data = await response.json();

    const labels = data.map(d => d._id);
    const valores = data.map(d => d.total);

    const ctx = document.getElementById("graficoIncendiosCidade").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Incêndios por Cidade",
                data: valores,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function carregarGraficoIncendiosPorGravidade() {
    const response = await fetch("http://localhost:3000/api/incendios/por-gravidade");
    const data = await response.json();

    const labels = data.map(d => d._id);
    const valores = data.map(d => d.total);

    const ctx = document.getElementById("graficoIncendiosGravidade").getContext("2d");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                label: "Incêndios por Gravidade",
                data: valores,
                backgroundColor: ["red", "orange", "yellow"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
