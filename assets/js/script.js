let chart;

/* =========================
   CALCULAR PRECIO
========================= */

function calcularPrecio() {

    const materia = Number(document.getElementById("materia").value) || 0;
    const mano = Number(document.getElementById("mano").value) || 0;
    const empaque = Number(document.getElementById("empaque").value) || 0;
    const transporte = Number(document.getElementById("transporte").value) || 0;
    const otros = Number(document.getElementById("otros").value) || 0;
    const gananciaPorc = Number(document.getElementById("ganancia").value) || 0;
    const cantidad = Number(document.getElementById("cantidad").value) || 1;

    if (gananciaPorc < 0) {
        mostrarError("El porcentaje de ganancia no puede ser negativo.");
        return;
    }

    if (cantidad <= 0) {
        mostrarError("La cantidad debe ser mayor a 0.");
        return;
    }

    // CÁLCULOS BASE
    const costoTotal = materia + mano + empaque + transporte + otros;
    const gananciaValor = costoTotal * (gananciaPorc / 100);
    const precioUnitario = costoTotal + gananciaValor;

    // DESCUENTOS POR VOLUMEN
    let descuento = 0;

    if (cantidad >= 50) {
        descuento = 0.20; // 20%
    } else if (cantidad >= 10) {
        descuento = 0.10; // 10%
    }

    const precioConDescuento = precioUnitario * (1 - descuento);
    const totalVenta = precioConDescuento * cantidad;

    // RESULTADO
    mostrarResultado(
        costoTotal,
        gananciaValor,
        precioUnitario,
        precioConDescuento,
        totalVenta,
        cantidad,
        descuento
    );

    // GRÁFICO
    crearGrafico(costoTotal, gananciaValor, precioUnitario);
}

/* =========================
   RESULTADO
========================= */

function mostrarResultado(costo, ganancia, precioUnitario, precioFinal, total, cantidad, descuento) {

    const ahorro = (precioUnitario - precioFinal) * cantidad;

    document.getElementById("resultado").innerHTML = `
        <div class="result-item">
            💰 Costo total: <strong>$${costo.toFixed(2)}</strong>
        </div>

        <div class="result-item">
            📈 Ganancia: <strong>$${ganancia.toFixed(2)}</strong>
        </div>

        <div class="result-item">
            🏷️ Precio unitario: <strong>$${precioUnitario.toFixed(2)}</strong>
        </div>

        <div class="result-item">
            📦 Descuento aplicado: <strong>${(descuento * 100).toFixed(0)}%</strong>
        </div>

        ${descuento > 0 ? `
        <div class="result-item">
            💡 Ahorro por volumen: <strong>$${ahorro.toFixed(2)}</strong>
        </div>
        ` : ""}

        <div class="result-item total-result">
            🚀 Precio final por unidad: <strong>$${precioFinal.toFixed(2)}</strong>
        </div>

        <div class="result-item total-result">
            💵 Total (${cantidad} unidades): <strong>$${total.toFixed(2)}</strong>
        </div>
    `;
}

/* =========================
   ERROR
========================= */

function mostrarError(msg) {
    document.getElementById("resultado").innerHTML = `
        <div class="error-box">⚠️ ${msg}</div>
    `;
}

/* =========================
   GRÁFICO
========================= */

function crearGrafico(costo, ganancia, precio) {

    const ctx = document.getElementById("grafico").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Costo", "Ganancia", "Precio unitario"],
            datasets: [{
                data: [costo, ganancia, precio],
                backgroundColor: [
                    "rgba(56, 189, 248, 0.85)",
                    "rgba(34, 197, 94, 0.85)",
                    "rgba(168, 85, 247, 0.85)"
                ]
            }]
        },
        options: {
            responsive: true,
            cutout: "68%",

            plugins: {
                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            return `${context.label}: $${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}