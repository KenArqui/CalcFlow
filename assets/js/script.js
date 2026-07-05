let chart; // variable global

function calcularPrecio() {
    let materia = Number(document.getElementById("materia").value) || 0;
    let mano = Number(document.getElementById("mano").value) || 0;
    let empaque = Number(document.getElementById("empaque").value) || 0;
    let transporte = Number(document.getElementById("transporte").value) || 0;
    let otros = Number(document.getElementById("otros").value) || 0;
    let ganancia = Number(document.getElementById("ganancia").value) || 0;

    let costoTotal = materia + mano + empaque + transporte + otros;
    let gananciaValor = costoTotal * (ganancia / 100);
    let precioFinal = costoTotal + gananciaValor;

    document.getElementById("resultado").innerHTML = `
        <p>💰 <strong>Costo total:</strong> $${costoTotal.toFixed(2)}</p>
        <p>📈 <strong>Ganancia:</strong> $${gananciaValor.toFixed(2)}</p>
        <p>🚀 <strong>Precio recomendado:</strong> $${precioFinal.toFixed(2)}</p>
    `;

    // GRÁFICO
    const ctx = document.getElementById("grafico").getContext("2d");

    if (chart) {
        chart.destroy(); // evita duplicados
    }

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Costo", "Ganancia", "Precio final"],
            datasets: [{
                label: "USD",
                data: [costoTotal, gananciaValor, precioFinal],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(75, 192, 192, 0.6)"
                ]
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
