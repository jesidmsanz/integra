const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const emailConfig = require('../config/emailConfig');

/**
 * Servicio de correo electrónico para envío de volantes de pago
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Inicializa el transporter de nodemailer
   */
  initializeTransporter() {
    // Usar configuración de Gmail por defecto
    this.transporter = nodemailer.createTransporter(emailConfig.gmail);
  }

  /**
   * Envía un volante de pago individual por correo
   */
  async sendPayrollStub(employeeEmail, employeeName, liquidationData, pdfPath) {
    try {
      const mailOptions = {
        from: emailConfig.company.email,
        to: employeeEmail,
        subject: emailConfig.templates.payrollStub.subject.replace('{period}', liquidationData.period),
        html: this.generateEmailTemplate(employeeName, liquidationData),
        attachments: [
          {
            filename: `Comprobante_Nomina_${employeeName.replace(/\s+/g, '_')}.pdf`,
            path: pdfPath,
            contentType: 'application/pdf'
          }
        ]
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Correo enviado exitosamente:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envía volantes de pago de forma masiva
   */
  async sendBulkPayrollStubs(employeesData, liquidationData) {
    const results = [];
    
    for (const employee of employeesData) {
      try {
        // Generar PDF individual para el empleado
        const pdfPath = await this.generateEmployeePDF(liquidationData, employee);
        
        // Enviar correo
        const result = await this.sendPayrollStub(
          employee.email,
          employee.fullname,
          liquidationData,
          pdfPath
        );
        
        results.push({
          employeeId: employee.id,
          employeeName: employee.fullname,
          email: employee.email,
          success: result.success,
          error: result.error
        });
        
        // Pequeña pausa entre envíos para evitar spam
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error procesando empleado ${employee.fullname}:`, error);
        results.push({
          employeeId: employee.id,
          employeeName: employee.fullname,
          email: employee.email,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Genera plantilla HTML para el correo
   */
  generateEmailTemplate(employeeName, liquidationData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Comprobante de Nómina</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f8f9fa; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .highlight { background-color: #e8f4f8; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
                  <div class="header">
          <h1>Comprobante de Nómina</h1>
          <p>${emailConfig.company.name}</p>
        </div>
          
          <div class="content">
            <h2>Estimado/a ${employeeName},</h2>
            
            <p>Le informamos que su comprobante de nómina para el período <strong>${liquidationData.period}</strong> está listo.</p>
            
            <div class="highlight">
              <h3>📋 Información del Período</h3>
              <p><strong>Período:</strong> ${liquidationData.period}</p>
              <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-CO')}</p>
            </div>
            
            <p>Puede descargar su comprobante de nómina en formato PDF desde el archivo adjunto.</p>
            
            <p>Si tiene alguna consulta sobre su liquidación, no dude en contactar al departamento de recursos humanos.</p>
            
            <p>Saludos cordiales,<br>
            <strong>Departamento de Recursos Humanos</strong><br>
            ${emailConfig.company.name}</p>
          </div>
          
          <div class="footer">
            <p>Este correo fue generado automáticamente por el sistema INTEGRA.</p>
            <p>Por favor, no responda a este correo.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera PDF individual para un empleado (reutiliza la lógica existente)
   */
  async generateEmployeePDF(liquidationData, employee) {
    // Esta función debería integrarse con el PDFGenerator existente
    // Por ahora retorna una ruta temporal
    const fileName = `liquidacion_${liquidationData.id}_empleado_${employee.id}.pdf`;
    const filePath = path.join(process.cwd(), 'public', 'pdfs', fileName);
    
    // Aquí se integraría con el PDFGenerator existente
    // const pdfGenerator = require('./pdfGenerator');
    // return await pdfGenerator.generateEmployeePDF(liquidationData, employee);
    
    return filePath;
  }

  /**
   * Verifica la conexión del servicio de correo
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Servicio de correo configurado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en configuración de correo:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
