import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PaySlipGenerator = ({ liquidation, employee, onClose }) => {
  const paySlipRef = useRef(null);

  const generatePDF = async () => {
    try {
      const element = paySlipRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generar el PDF y abrirlo en nueva pestaña
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Abrir en nueva pestaña
      window.open(pdfUrl, '_blank');
      
      // Limpiar la URL después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
      
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calcular totales - usando datos de ejemplo por ahora
  const salary = 4000000;
  const transportAllowance = 100000;
  const overtime = 82965;
  const healthFund = 160000;
  const pensionFund = 160000;
  
  const totalIngresos = salary + transportAllowance + overtime;
  const totalDeducciones = healthFund + pensionFund;
  const netoPagar = totalIngresos - totalDeducciones;

  return (
    <div className="pay-slip-container">
      <div className="pay-slip-actions mb-3">
        <button 
          className="btn btn-primary me-2"
          onClick={generatePDF}
        >
          📄 Generar PDF
        </button>
        <button 
          className="btn btn-secondary"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>

      <div 
        ref={paySlipRef}
        className="pay-slip-document"
        style={{
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: 'white',
          padding: '0',
          fontFamily: 'Arial, sans-serif',
          fontSize: '11px',
          lineHeight: '1.3',
          color: '#333',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ 
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '20px',
          marginBottom: '0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start'
          }}>
            {/* Logo y datos empresa */}
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '8px' 
              }}>
                <div style={{
                  width: '35px',
                  height: '35px',
                  backgroundColor: '#3498db',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginRight: '12px'
                }}>
                  S
                </div>
                <span style={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: '18px' 
                }}>
                  proaseo
                </span>
              </div>
              <div style={{ color: '#bdc3c7', fontSize: '10px', marginBottom: '6px' }}>
                Innovación a tu servicio
              </div>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '13px', 
                textTransform: 'uppercase',
                marginBottom: '4px'
              }}>
                {liquidation.companyname || 'PROFESIONALES DE ASEO DE COLOMBIA SAS'}
              </div>
              <div style={{ fontSize: '11px', color: '#ecf0f1' }}>
                Nit {liquidation.company_nit || '901831125'}
              </div>
            </div>

            {/* Título y datos comprobante */}
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                margin: '0 0 8px 0',
                color: 'white'
              }}>
                COMPROBANTE DE NÓMINA
              </h1>
              <div style={{ marginBottom: '4px', fontSize: '11px' }}>
                <strong>Período:</strong> {liquidation.period}
              </div>
              <div style={{ marginBottom: '4px', fontSize: '11px' }}>
                <strong>Comprobante N°:</strong> {liquidation.id}
              </div>
              <div style={{ fontSize: '11px' }}>
                <strong>Estado:</strong> {liquidation.status === 'approved' ? 'Aprobada' : liquidation.status}
              </div>
            </div>
          </div>
        </div>

        {/* Información del empleado */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderLeft: '4px solid #3498db'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <div style={{ 
                marginBottom: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                <strong>Nombre:</strong> {employee.fullname}
              </div>
              <div style={{ 
                marginBottom: '6px',
                fontSize: '12px',
                color: '#34495e'
              }}>
                <strong>Identificación:</strong> {employee.documentnumber}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                marginBottom: '6px',
                fontSize: '12px',
                color: '#34495e'
              }}>
                <strong>Cargo:</strong> {employee.position || 'GERENTE OPERATIVO'}
              </div>
              <div style={{ 
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#27ae60'
              }}>
                <strong>Salario básico:</strong> {formatCurrency(salary)}
              </div>
            </div>
          </div>
        </div>

        {/* Tablas de Ingresos y Deducciones */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          padding: '20px',
          marginBottom: '0'
        }}>
          {/* Ingresos */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: '#34495e',
              color: 'white',
              padding: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '13px',
              borderRadius: '4px 4px 0 0'
            }}>
              INGRESOS
            </div>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              border: '1px solid #bdc3c7',
              borderRadius: '0 0 4px 4px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#ecf0f1' }}>
                  <th style={{ 
                    padding: '10px 8px', 
                    textAlign: 'left', 
                    border: '1px solid #bdc3c7',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Concepto
                  </th>
                  <th style={{ 
                    padding: '10px 8px', 
                    textAlign: 'right', 
                    border: '1px solid #bdc3c7',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Cantidad
                  </th>
                  <th style={{ 
                    padding: '10px 8px', 
                    textAlign: 'right', 
                    border: '1px solid #bdc3c7',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: 'white' }}>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Sueldo
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    15.00
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#27ae60'
                  }}>
                    {formatCurrency(salary)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Aux. de transporte
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    15.00
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#27ae60'
                  }}>
                    {formatCurrency(transportAllowance)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: 'white' }}>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Hora extra
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    7.66
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#27ae60'
                  }}>
                    {formatCurrency(overtime)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#34495e', fontWeight: 'bold' }}>
                  <td 
                    colSpan="2" 
                    style={{ 
                      padding: '12px 8px', 
                      border: '1px solid #bdc3c7',
                      backgroundColor: '#34495e',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  >
                    Total Ingresos
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    backgroundColor: '#34495e',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {formatCurrency(totalIngresos)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deducciones */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: '#34495e',
              color: 'white',
              padding: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '13px',
              borderRadius: '4px 4px 0 0'
            }}>
              DEDUCCIONES
            </div>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              border: '1px solid #bdc3c7',
              borderRadius: '0 0 4px 4px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#ecf0f1' }}>
                  <th style={{ 
                    padding: '10px 8px', 
                    textAlign: 'left', 
                    border: '1px solid #bdc3c7',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Concepto
                  </th>
                  <th style={{ 
                    padding: '10px 8px', 
                    textAlign: 'right', 
                    border: '1px solid #bdc3c7',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Cantidad
                  </th>
                  <th style={{ 
                    padding: '10px 8px', 
                    textAlign: 'right', 
                    border: '1px solid #bdc3c7',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: 'white' }}>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Fondo de salud
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    0
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#e74c3c'
                  }}>
                    {formatCurrency(healthFund)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    Fondo de pensión
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    color: '#2c3e50'
                  }}>
                    0
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#e74c3c'
                  }}>
                    {formatCurrency(pensionFund)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#34495e', fontWeight: 'bold' }}>
                  <td 
                    colSpan="2" 
                    style={{ 
                      padding: '12px 8px', 
                      border: '1px solid #bdc3c7',
                      backgroundColor: '#34495e',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  >
                    Total Deducciones
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    border: '1px solid #bdc3c7', 
                    textAlign: 'right',
                    backgroundColor: '#34495e',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {formatCurrency(totalDeducciones)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Neto a Pagar */}
        <div style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0'
        }}>
          <span>NETO A PAGAR</span>
          <span style={{ fontSize: '18px', color: '#27ae60' }}>
            {formatCurrency(netoPagar)}
          </span>
        </div>

        {/* Pie de página */}
        <div style={{ 
          padding: '15px 20px', 
          fontSize: '9px', 
          color: '#7f8c8d',
          textAlign: 'center',
          backgroundColor: '#ecf0f1'
        }}>
          Este comprobante de nómina fue elaborado y enviado a través de Integra. 
          Si desea esta funcionalidad contáctenos.
        </div>
      </div>
    </div>
  );
};

export default PaySlipGenerator;
