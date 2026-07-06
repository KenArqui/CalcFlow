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

function generarPDF() {

    const pdf = new window.jspdf.jsPDF();

    // DATOS
    const materia = document.getElementById("materia").value || 0;
    const mano = document.getElementById("mano").value || 0;
    const empaque = document.getElementById("empaque").value || 0;
    const transporte = document.getElementById("transporte").value || 0;
    const otros = document.getElementById("otros").value || 0;
    const ganancia = document.getElementById("ganancia").value || 0;
    const cantidad = document.getElementById("cantidad").value || 1;

    // ===== CÁLCULOS =====

    const costoTotal =
        Number(materia) +
        Number(mano) +
        Number(empaque) +
        Number(transporte) +
        Number(otros);

    const costoUnitario =
        costoTotal / Number(cantidad);

    const gananciaValor =
        costoUnitario * (Number(ganancia) / 100);

    const precioFinal =
        costoUnitario + gananciaValor;

    // ===== HEADER =====

    pdf.setFillColor(15, 23, 42);

    pdf.rect(0, 0, 210, 35, "F");

    pdf.setTextColor(255, 255, 255);

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(24);

    pdf.text("CalcFlow", 20, 22);

    // ===== RESET COLOR =====

    pdf.setTextColor(0, 0, 0);

    // ===== SUBTITLE =====

    pdf.setFontSize(14);

    pdf.text("Reporte de costos y precios", 20, 50);

    // ===== LINE =====

    pdf.line(20, 55, 190, 55);

    // ===== DATOS =====

    pdf.setFontSize(12);

    let y = 75;

    pdf.text(`Materia prima: $${materia}`, 20, y);
    y += 12;

    pdf.text(`Mano de obra: $${mano}`, 20, y);
    y += 12;

    pdf.text(`Empaque: $${empaque}`, 20, y);
    y += 12;

    pdf.text(`Transporte: $${transporte}`, 20, y);
    y += 12;

    pdf.text(`Otros gastos: $${otros}`, 20, y);
    y += 12;

    pdf.text(`Ganancia: ${ganancia}%`, 20, y);
    y += 12;

    pdf.text(`Cantidad: ${cantidad}`, 20, y);

    // ===== RESULTADOS =====

    y += 25;

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(15);

    pdf.text("Resultados", 20, y);

    y += 15;

    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(12);

    pdf.text(
        `Costo total: $${costoTotal.toFixed(2)}`,
        20,
        y
    );

    y += 12;

    pdf.text(
        `Costo por unidad: $${costoUnitario.toFixed(2)}`,
        20,
        y
    );

    y += 12;

    pdf.text(
        `Ganancia por unidad: $${gananciaValor.toFixed(2)}`,
        20,
        y
    );

    y += 12;

    pdf.text(
        `Precio final: $${precioFinal.toFixed(2)}`,
        20,
        y
    );

    // ===== FOOTER =====

    pdf.setFontSize(10);

    pdf.text(
        "Generado automaticamente por CalcFlow",
        20,
        285
    );

    // ===== DESCARGAR =====

    pdf.save("calcflow-reporte.pdf");
}