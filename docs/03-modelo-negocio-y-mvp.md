# 💰 03. Modelo de Negocio, Monetización y Plan de MVP

Las ideas por sí solas no dan plata; **la ejecución rápida y enfocada en quién tiene el dolor más urgente es lo que genera ingresos**. Acá definimos cómo gana plata **Tu-Auto** y cómo construir la primera versión sin capital inicial.

---

## 1. Las 3 Fuentes de Ingresos (Cómo entra la plata)

### Vía 1: Venta de "Tranquilidad" al Conductor Particular (B2C)
* **El Kit "Tu-Auto":** Comprás el escáner OBD2 Bluetooth (ELM327 BLE) por mayor (costo aprox. \$5 a \$8 USD) y lo entregás listo para usar con acceso a la App.
* **Modelo Freemium / Suscripción:**
  * **Gratis:** Lectura básica de temperatura, voltaje de batería y recordatorio manual de cambio de aceite.
  * **Plan Pro (\$3.000 a \$5.000 ARS / mes o ~\$4 USD/mes):** Monitoreo automático en segundo plano, alertas predictivas (Modo 07 antes del Check Engine), traductor de fallas con precios reales de reparación y presupuesto mensual de gastos.

### Vía 2: Comisión por Derivación a Talleres y Lubricentros (Marketplace)
* **Cómo funciona:** Cuando la app le avisa al usuario *"Te quedan 300 km para el cambio de aceite"* o *"Tu batería está por morir"*, debajo aparece el botón: **"Pedir turno con descuento en Lubricentros / Baterías cerca tuyo"**.
* **Quién paga:** El lubricentro, casa de baterías o taller mecánico te paga una comisión por cada auto que le mandás (del 10% al 15% del trabajo, o un abono fijo mensual por figurar como "Taller Recomendado en la zona").
* **Ventaja:** ¡El taller no tiene que gastar en publicidad y recibe al cliente con el diagnóstico ya hecho!

### Vía 3: Pequeñas Flotas, Alquileres de Uber/Cabify y Remiserías (B2B — ¡La plata más rápida!)
* **El cliente ideal:** Hay miles de pequeños inversores que tienen **entre 2 y 15 autos** alquilados a choferes de Uber/Cabify o en remiserías/reparto.
* **Su gran dolor:** El chofer no cuida el auto porque no es suyo. Le sigue dando arranque con la batería muerta, no mira si levanta temperatura, se pasa 5.000 km del cambio de aceite y le devuelve el auto fundido al dueño.
* **Tu oferta:** Un panel donde el dueño de los autos ve en su celular el estado de sus 5 autos, recibe una alerta si a alguno le subió la temperatura o le desconectaron el aparatito, y lleva el control exacto de aceite y sistema eléctrico.
* **Cuánto se cobra:** Una suscripción mensual por vehículo monitoreado (\$8 a \$12 USD por auto/mes). Con solo **10 dueños que tengan 5 autos cada uno (50 autos)**, ya tenés un ingreso recurrente todos los meses.

---

## 2. El Plan del MVP (Producto Mínimo Viable)

Para no tardar 6 meses programando antes de ver un peso, vamos a dividir el proyecto en **3 Fases**:

### 🥇 Fase 1: Prototipo Funcional + Simulador en Vivo (Semana 1-2)
Construimos la aplicación móvil/web interactiva con **4 pantallas clave** y un **"Modo Simulación de Auto"** (que simula en vivo cómo varía el voltaje, la temperatura del agua, el desgaste del aceite y dispara una falla eléctrica real con su costo en pesos/dólares).
* **¿Para qué sirve esta Fase 1?**
  * Para que tengas el producto vivo en tu teléfono hoy mismo.
  * Para salir a mostrárselo a 5 lubricentros, 5 mecánicos y 5 dueños de autos/Uber y cerrar tus primeros clientes o socios antes de comprar un solo cable.

### 🥈 Fase 2: Conexión Bluetooth OBD2 Real + Base de Costos Local (Semana 3-4)
* Integramos la librería de conexión Bluetooth con un adaptador ELM327 real (comprás uno solo en MercadoLibre para hacer las pruebas en tu propio auto o el de un amigo).
* Cargamos los 100 códigos de falla más comunes (el 80% de las roturas de calle) traducidos al español rioplatense/latino con sus precios estimados.

### 🥉 Fase 3: Lanzamiento Comercial y Red de Talleres (Mes 2)
* Alianzas con los primeros 3 lubricentros y casas de baterías de tu zona.
* Lanzamiento del Kit (Conector + App) para particulares y flotas chicas.

---

## 3. Pantallas que tendrá nuestro Prototipo Inicial

1. **Dashboard Principal ("Mi Auto Hoy"):**
   * Puntaje de Salud General (ej. `84/100 - Buen Estado`).
   * **Monitor Eléctrico en Vivo:** Voltaje de batería (`12.6V`) y estado del alternador (`Cargando OK - 14.1V`).
   * **Monitor Térmico ("Agua"):** Temperatura digital exacta (`91°C - Normal`) con barra de seguridad.
   * **Vida Útil del Aceite:** Barra de progreso inteligente (`Faltan 1.200 km o 18 días`).
2. **Detector de Roturas y Gravedad ("Escáner Inteligente"):**
   * Botón de escaneo rápido y vista de alertas activas/preventivas con el **Semáforo de Gravedad** (Verde / Amarillo / Rojo).
   * Desglose de *"Qué pasó"*, *"¿Puedo seguir manejando?"*, *"Cuánto sale arreglarlo hoy"* vs *"Cuánto sale si lo ignoro"*.
3. **Predictor de Gastos ("Cuidá tu Billetera"):**
   * Calendario de próximos mantenimientos obligatorios (Aceite, Agua/Refrigerante, Distribución, Frenos, VTV) con alerta de cuánto dinero ir separando para no tener sorpresas.
4. **Botón de Prueba / Simulador (Para Demos de Venta):**
   * Un panel oculto o de demostración que te permite tocar un botón y simular: *"Simular recalentamiento de agua"*, *"Simular falla de alternador"* o *"Simular cambio de aceite vencido"* para dejar con la boca abierta a cualquier cliente o inversor al que le muestres la app.
