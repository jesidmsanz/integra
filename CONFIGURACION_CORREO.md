# Configuración de Correo Electrónico para INTEGRA

## Variables de Entorno Requeridas

Para que funcione el envío masivo de volantes de pago, necesitas configurar las siguientes variables de entorno:

### 1. Configuración de Correo (Gmail recomendado)

```bash
# Usuario de correo
EMAIL_USER=tu-email@gmail.com

# Contraseña de aplicación (NO tu contraseña normal)
EMAIL_PASS=tu-password-de-aplicacion

# Correo remitente
EMAIL_FROM=noreply@integra.com
```

### 2. Configuración de la Empresa

```bash
# Nombre de la empresa
COMPANY_NAME=PROFESIONALES DE ASEO DE COLOMBIA SAS

# Correo de la empresa
COMPANY_EMAIL=noreply@integra.com

# Sitio web de la empresa
COMPANY_WEBSITE=https://integra.com
```

### 3. Configuración SMTP (opcional)

Si prefieres usar un servidor SMTP diferente a Gmail:

```bash
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@tu-dominio.com
SMTP_PASS=tu-password
```

## Configuración de Gmail

### Paso 1: Habilitar verificación en 2 pasos
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos
3. Actívala si no está activada

### Paso 2: Generar contraseña de aplicación
1. Ve a Seguridad → Contraseñas de aplicaciones
2. Selecciona "Correo" y "Otro (nombre personalizado)"
3. Escribe "INTEGRA" como nombre
4. Copia la contraseña generada (16 caracteres)
5. Usa esta contraseña en `EMAIL_PASS`

### Paso 3: Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=la-contraseña-de-16-caracteres
EMAIL_FROM=noreply@integra.com
COMPANY_NAME=PROFESIONALES DE ASEO DE COLOMBIA SAS
```

## Funcionalidades Implementadas

### ✅ Servicio de Correo Electrónico
- Envío individual de volantes de pago
- Envío masivo a múltiples empleados
- Plantillas HTML profesionales
- Adjuntos PDF automáticos

### ✅ Interfaz de Gestión Masiva
- Selección de liquidación
- Búsqueda de empleados por nombre/documento
- Selección múltiple de empleados
- Tres opciones: Descargar, Imprimir, Enviar por correo

### ✅ API de Envío Masivo
- Endpoint: `POST /api/liquidations/send-emails`
- Integración con servicio de correo
- Manejo de errores y resultados

## Uso

1. Ve a **Admin → Volantes de Pago**
2. Selecciona una liquidación
3. Busca y selecciona los empleados
4. Elige la acción: Descargar, Imprimir o Enviar por correo
5. Para envío por correo, se mostrarán los resultados

## Solución de Problemas

### Error: "Invalid login"
- Verifica que `EMAIL_USER` y `EMAIL_PASS` sean correctos
- Asegúrate de usar la contraseña de aplicación, no tu contraseña normal

### Error: "Connection timeout"
- Verifica tu conexión a internet
- Revisa la configuración SMTP si usas un servidor personalizado

### Los correos no llegan
- Revisa la carpeta de spam
- Verifica que las direcciones de correo de los empleados sean válidas
