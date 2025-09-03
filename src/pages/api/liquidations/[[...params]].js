const controller = require("../../../server/components/liquidations/controller");

export default async function handler(req, res) {
  try {
    console.log(`🔍 ${req.method} /api/liquidations - Iniciando...`);

    if (req.method === "GET") {
      // Si hay un ID en los parámetros, obtener por ID
      if (req.query.params && req.query.params[0]) {
        const id = req.query.params[0];
        console.log("🔍 Obteniendo liquidación por ID:", id);

        const result = await controller.getById(id);
        console.log("✅ Liquidación obtenida:", result);

        res.status(200).json(result);
      } else {
        // Listar todas las liquidaciones
        const { page = 1, limit = 30, status, company_id } = req.query;
        console.log("📊 Parámetros:", { page, limit, status, company_id });

        const result = await controller.list(page, limit, status, company_id);
        console.log("✅ Resultado obtenido:", result);

        res.status(200).json(result);
      }
    } else if (req.method === "POST") {
      console.log("📝 Creando nueva liquidación...");
      console.log("📦 Datos recibidos:", req.body);

      const result = await controller.create(req.body);
      console.log("✅ Liquidación creada:", result);

      res.status(201).json(result);
    } else if (
      req.method === "GET" &&
      req.query.params &&
      req.query.params[0] === "pdf"
    ) {
      // Generar PDF
      const id = req.query.params[1];
      const employeeId = req.query.employee_id;

      console.log("📄 Generando PDF para liquidación:", id);

      const result = await controller.generatePDF(id, employeeId);
      console.log("✅ PDF generado:", result);

      res.status(200).json(result);
    } else {
      res.status(405).json({ success: false, message: "Método no permitido" });
    }
  } catch (error) {
    console.log("❌ ERROR en /api/liquidations:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
}
