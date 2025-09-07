/**
 * Configuración de correo electrónico
 * Configura las variables de entorno necesarias para el envío de correos
 */

module.exports = {
  // Configuración de Gmail (recomendado para desarrollo)
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'tu-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'tu-password-de-aplicacion'
    }
  },

  // Configuración de SMTP personalizado
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
    }
  },

  // Configuración de la empresa
  company: {
    name: process.env.COMPANY_NAME || 'PROFESIONALES DE ASEO DE COLOMBIA SAS',
    email: process.env.COMPANY_EMAIL || 'noreply@integra.com',
    website: process.env.COMPANY_WEBSITE || 'https://integra.com'
  },

  // Configuración de plantillas
  templates: {
    payrollStub: {
      subject: 'Comprobante de Nómina - {period}',
      from: process.env.EMAIL_FROM || 'noreply@integra.com'
    }
  }
};
