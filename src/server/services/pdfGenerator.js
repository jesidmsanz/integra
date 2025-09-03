const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Generador de PDFs para liquidaciones
 */
class PDFGenerator {
  constructor() {
    this.outputDir = path.join(process.cwd(), "public", "pdfs");
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Genera PDF completo de liquidación
   */
  async generateLiquidationPDF(liquidation) {
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `liquidacion_${liquidation.id}_${Date.now()}.pdf`;
    const filePath = path.join(this.outputDir, fileName);

    doc.pipe(fs.createWriteStream(filePath));

    // Encabezado
    this.addHeader(doc, liquidation);

    // Información general
    this.addGeneralInfo(doc, liquidation);

    // Tabla de empleados
    this.addEmployeesTable(doc, liquidation);

    // Resumen
    this.addSummary(doc, liquidation);

    // Pie de página
    this.addFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on("end", () => {
        resolve({
          fileName,
          filePath,
          downloadUrl: `/pdfs/${fileName}`,
        });
      });

      doc.on("error", reject);
    });
  }

  /**
   * Genera PDF individual de empleado
   */
  async generateEmployeePDF(liquidation, employeeDetail) {
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `liquidacion_${liquidation.id}_empleado_${
      employeeDetail.employee_id
    }_${Date.now()}.pdf`;
    const filePath = path.join(this.outputDir, fileName);

    doc.pipe(fs.createWriteStream(filePath));

    // Encabezado
    this.addHeader(doc, liquidation);

    // Información del empleado
    this.addEmployeeInfo(doc, liquidation, employeeDetail);

    // Detalle de novedades
    this.addEmployeeNews(doc, employeeDetail);

    // Resumen del empleado
    this.addEmployeeSummary(doc, employeeDetail);

    // Pie de página
    this.addFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on("end", () => {
        resolve({
          fileName,
          filePath,
          downloadUrl: `/pdfs/${fileName}`,
        });
      });

      doc.on("error", reject);
    });
  }

  addHeader(doc, liquidation) {
    // Logo o título de la empresa
    doc.fontSize(20).text("LIQUIDACIÓN DE NÓMINA", { align: "center" });

    doc.fontSize(12).text(`Empresa: ${liquidation.companyname || "N/A"}`, {
      align: "center",
    });

    doc.text(`Período: ${liquidation.period || "N/A"}`, {
      align: "center",
    });
    doc.text(`Frecuencia: Mensual`, {
      align: "center",
    });
    doc.text(`Estado: ${this.getStatusText(liquidation.status)}`, {
      align: "center",
    });

    doc.moveDown(2);
  }

  addGeneralInfo(doc, liquidation) {
    doc.fontSize(14).text("INFORMACIÓN GENERAL", { underline: true });

    doc
      .fontSize(10)
      .text(`ID Liquidación: ${liquidation.id}`)
      .text(`Total Empleados: ${liquidation.total_employees}`)
      .text(
        `Total Liquidación: ${this.formatCurrency(
          liquidation.total_net_amount
        )}`
      )
      .text(
        `Creado por: ${liquidation.user_first_name || ""} ${
          liquidation.user_last_name || ""
        }`
      )
      .text(
        `Fecha de Creación: ${this.formatDateTime(liquidation.created_at)}`
      );

    if (liquidation.approved_by) {
      doc.text(`Aprobado por: Usuario ${liquidation.approved_by}`);
    }

    doc.moveDown(2);
  }

  addEmployeesTable(doc, liquidation) {
    doc.fontSize(14).text("DETALLE POR EMPLEADO", { underline: true });

    doc.moveDown(1);

    // Encabezados de la tabla
    const tableTop = doc.y;
    const itemHeight = 20;
    const col1 = 50;
    const col2 = 150;
    const col3 = 250;
    const col4 = 350;
    const col5 = 450;

    // Encabezados
    doc
      .fontSize(10)
      .text("ID", col1, tableTop)
      .text("Empleado", col2, tableTop)
      .text("Salario", col3, tableTop)
      .text("Transporte", col4, tableTop)
      .text("Neto", col5, tableTop);

    // Línea separadora
    doc
      .moveTo(col1, tableTop + itemHeight)
      .lineTo(col5 + 100, tableTop + itemHeight)
      .stroke();

    // Datos de empleados
    let currentY = tableTop + itemHeight + 5;

    liquidation.liquidation_details?.forEach((detail, index) => {
      if (currentY > 700) {
        // Nueva página si es necesario
        doc.addPage();
        currentY = 50;
      }

      doc
        .text(detail.employee_id.toString(), col1, currentY)
        .text(detail.employee_name || "N/A", col2, currentY)
        .text(this.formatCurrency(detail.basic_salary), col3, currentY)
        .text(
          this.formatCurrency(detail.transportation_assistance),
          col4,
          currentY
        )
        .text(this.formatCurrency(detail.net_amount), col5, currentY);

      currentY += itemHeight;
    });
  }

  addEmployeeInfo(doc, liquidation, employeeDetail) {
    doc.fontSize(14).text("INFORMACIÓN DEL EMPLEADO", { underline: true });

    doc
      .fontSize(10)
      .text(`Nombre: ${employeeDetail.employee_name || "N/A"}`)
      .text(`Documento: ${employeeDetail.employee_document || "N/A"}`)
      .text(`Cargo: ${employeeDetail.employee_position || "N/A"}`)
      .text(`ID Empleado: ${employeeDetail.employee_id}`);

    doc.moveDown(2);
  }

  addEmployeeNews(doc, employeeDetail) {
    if (employeeDetail.news && employeeDetail.news.length > 0) {
      doc.fontSize(14).text("NOVEDADES APLICADAS", { underline: true });

      doc.moveDown(1);

      const tableTop = doc.y;
      const itemHeight = 20;
      const col1 = 50;
      const col2 = 200;
      const col3 = 300;
      const col4 = 400;

      // Encabezados
      doc
        .fontSize(10)
        .text("Tipo", col1, tableTop)
        .text("Horas", col2, tableTop)
        .text("Días", col3, tableTop)
        .text("Valor", col4, tableTop);

      // Línea separadora
      doc
        .moveTo(col1, tableTop + itemHeight)
        .lineTo(col4 + 100, tableTop + itemHeight)
        .stroke();

      // Datos
      let currentY = tableTop + itemHeight + 5;

      employeeDetail.news.forEach((news) => {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        doc
          .text(news.typeNews?.name || "N/A", col1, currentY)
          .text(news.hours.toString(), col2, currentY)
          .text(news.days.toString(), col3, currentY)
          .text(this.formatCurrency(news.amount), col4, currentY);

        currentY += itemHeight;
      });
    }
  }

  addEmployeeSummary(doc, employeeDetail) {
    doc.fontSize(14).text("RESUMEN DE LIQUIDACIÓN", { underline: true });

    doc
      .fontSize(10)
      .text(
        `Salario Básico: ${this.formatCurrency(employeeDetail.basic_salary)}`
      )
      .text(
        `Auxilio de Transporte: ${this.formatCurrency(
          employeeDetail.transportation_assistance
        )}`
      )
      .text(
        `Total Novedades: ${this.formatCurrency(
          employeeDetail.total_novedades
        )}`
      )
      .text(
        `Total Descuentos: ${this.formatCurrency(
          employeeDetail.total_discounts
        )}`
      )
      .text(
        `VALOR NETO A PAGAR: ${this.formatCurrency(employeeDetail.net_amount)}`,
        { underline: true }
      );
  }

  addSummary(doc, liquidation) {
    doc.fontSize(14).text("RESUMEN GENERAL", { underline: true });

    doc
      .fontSize(10)
      .text(`Total Empleados: ${liquidation.total_employees}`)
      .text(
        `TOTAL LIQUIDACIÓN: ${this.formatCurrency(
          liquidation.total_net_amount
        )}`,
        { underline: true }
      );
  }

  addFooter(doc) {
    const pageHeight = doc.page.height;
    const footerY = pageHeight - 50;

    doc
      .fontSize(8)
      .text(
        "Este documento fue generado automáticamente por el sistema de liquidaciones",
        50,
        footerY,
        { align: "center" }
      )
      .text(
        `Fecha de generación: ${this.formatDateTime(new Date())}`,
        50,
        footerY + 15,
        { align: "center" }
      );
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString("es-CO");
  }

  formatDateTime(date) {
    return new Date(date).toLocaleString("es-CO");
  }

  getStatusText(status) {
    const statusMap = {
      draft: "Borrador",
      approved: "Aprobada",
      paid: "Pagada",
      cancelled: "Cancelada",
    };
    return statusMap[status] || status;
  }
}

module.exports = new PDFGenerator();
