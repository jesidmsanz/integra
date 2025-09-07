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
    // Fondo del header
    const headerHeight = 60;
    doc.rect(0, 0, doc.page.width, headerHeight)
       .fill('#34495e');

    // Título principal
    doc.fillColor('white')
       .fontSize(20)
       .font('Helvetica-Bold')
       .text("COMPROBANTE DE NÓMINA", 0, 15, { align: "center" });

    // Información de la empresa (izquierda)
    doc.fillColor('white')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text("PROFESIONALES DE ASEO DE COLOMBIA SAS", 50, 35)
       .fontSize(9)
       .font('Helvetica')
       .text("Nit 901831125", 50, 48);

    // Información del período y empleado (derecha)
    const rightX = 400;
    doc.fillColor('white')
       .fontSize(9)
       .font('Helvetica')
       .text(`Período: ${liquidation.period || "N/A"}`, rightX, 15)
       .text(`Comprobante Número: ${liquidation.id}`, rightX, 28)
       .text(`Estado: ${this.getStatusText(liquidation.status)}`, rightX, 41);

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
    // Fondo gris para la información del empleado
    const infoY = doc.y;
    const infoHeight = 35;
    
    doc.rect(50, infoY, doc.page.width - 100, infoHeight)
       .fill('#f8f9fa');

    // Información del empleado
    doc.fillColor('black')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text(`Nombre: ${employeeDetail.employee_name || "N/A"}`, 60, infoY + 8)
       .fontSize(9)
       .font('Helvetica')
       .text(`Identificación: ${employeeDetail.employee_document || "N/A"}`, 60, infoY + 22)
       .text(`Cargo: ${employeeDetail.employee_position || "N/A"}`, 350, infoY + 8)
       .text(`Salario básico: ${this.formatCurrency(employeeDetail.basic_salary)}`, 350, infoY + 22);

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
    const startY = doc.y;
    const tableWidth = doc.page.width - 100;
    const leftTableX = 50;
    const rightTableX = leftTableX + (tableWidth / 2) + 10;
    const tableHeight = 120;

    // Tabla de INGRESOS (izquierda)
    doc.rect(leftTableX, startY, tableWidth / 2, tableHeight)
       .stroke();

    // Header INGRESOS
    doc.rect(leftTableX, startY, tableWidth / 2, 25)
       .fill('#e9ecef');
    
    doc.fillColor('black')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text("INGRESOS", leftTableX, startY + 8, { align: "center", width: tableWidth / 2 });

    // Subheader INGRESOS
    doc.rect(leftTableX, startY + 25, tableWidth / 2, 18)
       .fill('#f8f9fa');
    
    doc.fillColor('black')
       .fontSize(8)
       .font('Helvetica-Bold')
       .text("Concepto", leftTableX + 5, startY + 30)
       .text("Cantidad", leftTableX + 120, startY + 30)
       .text("Valor", leftTableX + 180, startY + 30);

    // Datos INGRESOS
    let currentY = startY + 43;
    const rowHeight = 18;

    // Sueldo
    this.addTableRow(doc, leftTableX, currentY, tableWidth / 2, rowHeight, 
      "Sueldo", "15.00", this.formatCurrency(employeeDetail.basic_salary));
    currentY += rowHeight;

    // Auxilio de transporte
    if (employeeDetail.transportation_assistance > 0) {
      this.addTableRow(doc, leftTableX, currentY, tableWidth / 2, rowHeight, 
        "Aux. de transporte", "15.00", this.formatCurrency(employeeDetail.transportation_assistance));
      currentY += rowHeight;
    }

    // Novedades
    if (employeeDetail.total_novedades > 0) {
      this.addTableRow(doc, leftTableX, currentY, tableWidth / 2, rowHeight, 
        "Novedades", "1.00", this.formatCurrency(employeeDetail.total_novedades));
      currentY += rowHeight;
    }

    // Total Ingresos
    const totalIngresos = employeeDetail.basic_salary + employeeDetail.transportation_assistance + employeeDetail.total_novedades;
    doc.rect(leftTableX, currentY, tableWidth / 2, rowHeight)
       .fill('#dee2e6');
    
    doc.fillColor('black')
       .fontSize(9)
       .font('Helvetica-Bold')
       .text("Total Ingresos", leftTableX + 5, currentY + 5)
       .text(this.formatCurrency(totalIngresos), leftTableX + 180, currentY + 5);

    // Tabla de DEDUCCIONES (derecha)
    doc.rect(rightTableX, startY, tableWidth / 2, tableHeight)
       .stroke();

    // Header DEDUCCIONES
    doc.rect(rightTableX, startY, tableWidth / 2, 25)
       .fill('#e9ecef');
    
    doc.fillColor('black')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text("DEDUCCIONES", rightTableX, startY + 8, { align: "center", width: tableWidth / 2 });

    // Subheader DEDUCCIONES
    doc.rect(rightTableX, startY + 25, tableWidth / 2, 18)
       .fill('#f8f9fa');
    
    doc.fillColor('black')
       .fontSize(8)
       .font('Helvetica-Bold')
       .text("Concepto", rightTableX + 5, startY + 30)
       .text("Cantidad", rightTableX + 120, startY + 30)
       .text("Valor", rightTableX + 180, startY + 30);

    // Datos DEDUCCIONES
    currentY = startY + 43;

    // Salud (4% del salario básico)
    const salud = employeeDetail.basic_salary * 0.04;
    this.addTableRow(doc, rightTableX, currentY, tableWidth / 2, rowHeight, 
      "Fondo de salud", "0", this.formatCurrency(salud));
    currentY += rowHeight;

    // Pensión (4% del salario básico)
    const pension = employeeDetail.basic_salary * 0.04;
    this.addTableRow(doc, rightTableX, currentY, tableWidth / 2, rowHeight, 
      "Fondo de pensión", "0", this.formatCurrency(pension));
    currentY += rowHeight;

    // Descuentos adicionales
    if (employeeDetail.total_discounts > 0) {
      this.addTableRow(doc, rightTableX, currentY, tableWidth / 2, rowHeight, 
        "Otros descuentos", "1.00", this.formatCurrency(employeeDetail.total_discounts));
      currentY += rowHeight;
    }

    // Total Deducciones
    const totalDeducciones = salud + pension + employeeDetail.total_discounts;
    doc.rect(rightTableX, currentY, tableWidth / 2, rowHeight)
       .fill('#dee2e6');
    
    doc.fillColor('black')
       .fontSize(9)
       .font('Helvetica-Bold')
       .text("Total Deducciones", rightTableX + 5, currentY + 5)
       .text(this.formatCurrency(totalDeducciones), rightTableX + 180, currentY + 5);

    // NETO A PAGAR
    const netoAPagar = totalIngresos - totalDeducciones;
    const netoY = startY + tableHeight + 15;
    
    doc.rect(leftTableX, netoY, tableWidth, 25)
       .fill('#6c757d');
    
    doc.fillColor('white')
       .fontSize(12)
       .font('Helvetica-Bold')
       .text("NETO A PAGAR", leftTableX + 10, netoY + 7)
       .fontSize(14)
       .text(this.formatCurrency(netoAPagar), rightTableX + 180, netoY + 5);

    doc.moveDown(2);
  }

  addTableRow(doc, x, y, width, height, concepto, cantidad, valor) {
    // Fondo de la fila
    doc.rect(x, y, width, height)
       .stroke();

    // Texto
    doc.fillColor('black')
       .fontSize(8)
       .font('Helvetica')
       .text(concepto, x + 5, y + 5)
       .text(cantidad, x + 120, y + 5)
       .text(valor, x + 180, y + 5);
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
    const footerY = pageHeight - 30;

    doc.fillColor('black')
       .fontSize(7)
       .font('Helvetica')
       .text(
         "Este comprobante de nómina fue elaborado y enviado a través de INTEGRA. Si desea esta funcionalidad contáctenos.",
         50,
         footerY,
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
