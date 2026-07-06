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

    /* =========================
       VALIDACIONES
    ========================= */

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

    if (cantidad <= 0) {
        mostrarError("⚠️ La cantidad debe ser mayor a 0.");
        return;
    }

    /* =========================
       CÁLCULOS CORRECTOS
    ========================= */

    // COSTO TOTAL GENERAL
    const costoTotal = materia + mano + empaque + transporte + otros;

    // COSTO POR UNIDAD
    const costoUnitario = costoTotal / cantidad;

    // GANANCIA POR UNIDAD
    const gananciaValor = costoUnitario * (gananciaPorc / 100);

    // PRECIO DE VENTA POR UNIDAD
    const precioUnitario = costoUnitario + gananciaValor;

    /* =========================
       DESCUENTOS
    ========================= */

    let descuento = 0;

    if (cantidad >= 50) {
        descuento = 0.20;
    } else if (cantidad >= 10) {
        descuento = 0.10;
    }

    // PRECIO FINAL POR UNIDAD
    const precioConDescuento = precioUnitario * (1 - descuento);

    // TOTAL FINAL
    const totalVenta = precioConDescuento * cantidad;

    mostrarResultado(
        costoTotal,
        costoUnitario,
        gananciaValor,
        precioUnitario,
        precioConDescuento,
        totalVenta,
        cantidad,
        descuento
    );

    crearGrafico(costoUnitario, gananciaValor, precioUnitario);
}

/* =========================
   RESULTADO
========================= */

function mostrarResultado(
    costoTotal,
    costoUnitario,
    ganancia,
    precioUnitario,
    precioFinal,
    total,
    cantidad,
    descuento
) {

    const ahorro = (precioUnitario - precioFinal) * cantidad;

    document.getElementById("resultado").innerHTML = `

        <div class="result-item">
            💰 Costo total: <strong>$${costoTotal.toFixed(2)}</strong>
        </div>

        <div class="result-item">
            📦 Costo por unidad: <strong>$${costoUnitario.toFixed(2)}</strong>
        </div>

        <div class="result-item">
            📈 Ganancia (${descuento > 0 ? "con descuento" : "por unidad"}): 
            <strong>$${ganancia.toFixed(2)}</strong>
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
            labels: ["Costo por unidad", "Ganancia", "Precio final"],

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