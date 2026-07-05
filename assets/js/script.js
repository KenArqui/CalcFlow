let chart;

/* =========================
   VALIDACIÓN SEGURA
========================= */

function validarNumero(valor) {
    const numero = parseFloat(valor);

    if (valor === "" || isNaN(numero) || numero < 0) {
        return null;
    }

    return numero;
}

/* =========================
   CALCULAR PRECIO
========================= */

function calcularPrecio() {

    const materia = validarNumero(document.getElementById("materia").value);
    const mano = validarNumero(document.getElementById("mano").value);
    const empaque = validarNumero(document.getElementById("empaque").value);
    const transporte = validarNumero(document.getElementById("transporte").value);
    const otros = validarNumero(document.getElementById("otros").value);
    const gananciaPorc = validarNumero(document.getElementById("ganancia").value);
    const cantidad = validarNumero(document.getElementById("cantidad").value);

    // VALIDACIÓN GENERAL
    if (
        materia === null ||
        mano === null ||
        empaque === null ||
        transporte === null ||
        otros === null ||
        gananciaPorc === null ||
        cantidad === null
    ) {
        mostrarError("⚠️ Completa todos los campos con valores válidos (0 o mayores).");
        return;
    }

    if (cantidad === 0) {
        mostrarError("⚠️ La cantidad debe ser mayor a 0.");
        return;
    }

    // CÁLCULOS BASE
    const costoTotal = materia + mano + empaque + transporte + otros;
    const gananciaValor = costoTotal * (gananciaPorc / 100);
    const precioUnitario = costoTotal + gananciaValor;

    // DESCUENTOS POR VOLUMEN
    let descuento = 0;

    if (cantidad >= 50) {
        descuento = 0.20;
    } else if (cantidad >= 10) {
        descuento = 0.10;
    }

    const precioConDescuento = precioUnitario * (1 - descuento);
    const totalVenta = precioConDescuento * cantidad;

    mostrarResultado(
        costoTotal,
        gananciaValor,
        precioUnitario,
        precioConDescuento,
        totalVenta,
        cantidad,
        descuento
    );

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