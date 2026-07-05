let chart;

/* =========================
   CALCULAR PRECIO
========================= */

function calcularPrecio() {

    // INPUTS
    const materia =
        Number(document.getElementById("materia").value) || 0;

    const mano =
        Number(document.getElementById("mano").value) || 0;

    const empaque =
        Number(document.getElementById("empaque").value) || 0;

    const transporte =
        Number(document.getElementById("transporte").value) || 0;

    const otros =
        Number(document.getElementById("otros").value) || 0;

    const ganancia =
        Number(document.getElementById("ganancia").value) || 0;

    // VALIDACIÓN
    if (ganancia < 0) {

        mostrarError("El porcentaje de ganancia no puede ser negativo.");

        return;
    }

    // CÁLCULOS
    const costoTotal =
        materia + mano + empaque + transporte + otros;

    const gananciaValor =
        costoTotal * (ganancia / 100);

    const precioFinal =
        costoTotal + gananciaValor;

    // RESULTADO
    mostrarResultado(
        costoTotal,
        gananciaValor,
        precioFinal
    );

    // GRÁFICO
    crearGrafico(
        costoTotal,
        gananciaValor,
        precioFinal
    );
}

/* =========================
   MOSTRAR RESULTADO
========================= */

function mostrarResultado(costo, ganancia, precio) {

    const resultado =
        document.getElementById("resultado");

    resultado.innerHTML = `
    
        <div class="result-item">
            <span>💰 Costo total</span>
            <strong>$${costo.toFixed(2)}</strong>
        </div>

        <div class="result-item">
            <span>📈 Ganancia</span>
            <strong>$${ganancia.toFixed(2)}</strong>
        </div>

        <div class="result-item total-result">
            <span>🚀 Precio recomendado</span>
            <strong>$${precio.toFixed(2)}</strong>
        </div>

    `;
}

/* =========================
   MOSTRAR ERROR
========================= */

function mostrarError(mensaje) {

    const resultado =
        document.getElementById("resultado");

    resultado.innerHTML = `
    
        <div class="error-box">
            ⚠️ ${mensaje}
        </div>

    `;
}

/* =========================
   CREAR GRÁFICO
========================= */

function crearGrafico(costo, ganancia, precio) {

    const ctx =
        document.getElementById("grafico")
        .getContext("2d");

    // ELIMINA EL ANTERIOR
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Costo",
                "Ganancia",
                "Precio final"
            ],

            datasets: [{

                data: [
                    costo,
                    ganancia,
                    precio
                ],

                backgroundColor: [
                    "rgba(56, 189, 248, 0.85)",
                    "rgba(34, 197, 94, 0.85)",
                    "rgba(168, 85, 247, 0.85)"
                ],

                borderWidth: 0,
                borderRadius: 8

            }]
        },

        options: {

            responsive: true,

            cutout: "68%",

            plugins: {

                legend: {

                    labels: {
                        color: "#ffffff",
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}