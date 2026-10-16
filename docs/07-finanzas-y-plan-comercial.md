# 📈 07. Auditoría Financiera, Costos, Precios y Plan Comercial

Este documento detalla los números reales del negocio **Tu-Auto**: cuánto cuesta producir o comprar el kit, cuánto dinero limpio deja cada cliente, cuánto cuestan las plataformas digitales y cómo llegar a los primeros **\$1.000 a \$3.000 USD mensuales netos** empezando prácticamente sin capital.

---

## 1. Unit Economics (La Economía de 1 Unidad)

> *Nota sobre moneda:* Expresamos los números base en **USD** para que no pierdan validez por inflación, con su equivalencia aproximada en **Pesos Argentinos (ARS)** a modo de referencia.

### A. Venta del "Kit Tu-Auto" (Ingreso Único de Entrada)
| Concepto | Costo / Valor (Lote Inicial 20 u.) | Costo / Valor (Lote Mayorista 100+ u.) |
| :--- | :---: | :---: |
| Conector OBD2 Bluetooth 4.0 BLE (PIC18F25K80) o PCB Propia | \$8.50 USD | \$4.20 USD |
| Caja personalizada + Sticker Resinado + Tarjeta QR | \$0.80 USD | \$0.40 USD |
| **Costo Total del Producto Físico (COGS)** | **\$9.30 USD** | **\$4.60 USD** |
| **Precio de Venta al Público (Kit + 1 Mes Pro Gratis)** | **\$28.00 USD** (~\$30.000 ARS) | **\$28.00 USD** (~\$30.000 ARS) |
| **💵 Ganancia Limpia Inmediata por cada Kit Vendido** | **+\$18.70 USD (Margen 66%)** | **+\$23.40 USD (Margen 83%)** |

> [!TIP]
> **Financiación con capital de los propios clientes:** Con la ganancia de vender tus primeros 10 kits, pagás la compra de los siguientes 30 kits sin poner plata de tu bolsillo.

---

### B. Ingresos Recurrentes Mensuales (Donde está el verdadero negocio)

Una vez que el conector ya está enchufado en el auto, tu costo de mantener a ese usuario en la base de datos es de **menos de \$0.02 USD por mes**. Todo lo que entra por suscripción y talleres es casi 100% ganancia neta:

| Fuente de Ingreso Recurrente | Precio Cobrado | Quién lo paga | Frecuencia |
| :--- | :---: | :--- | :--- |
| **1. Suscripción Conductor Particular (Plan Pro)** | **\$4.00 USD / mes** (~\$4.500 ARS) | Dueño de auto particular (alertas preventivas, agua/batería y costos de arreglos) | Todos los meses (Débito automático MercadoPago) |
| **2. Suscripción Flotas / Uber / Remises (Plan B2B)** | **\$9.00 USD / mes por auto** (~\$10.000 ARS) | Dueño de autos alquilados a choferes o flota de reparto | Todos los meses |
| **3. Comisión por Derivación a Lubricentro / Taller** | **\$6.00 a \$15.00 USD** por turno concretado | Lubricentro, casa de baterías o taller mecánico aliado (10% del trabajo) | Cada vez que el auto cambia aceite, batería o arregla una falla |
| **4. Pase "Escaneo Compra de Auto Usado" (24 hs)** | **\$10.00 USD** por reporte certificado | Persona que va a ver un auto usado y quiere saber si tiene fallas ocultas o borradas | Pago único por inspección |

---

## 2. Estructura de Costos Fijos de Plataformas (Tecnología)

El sistema fue diseñado en la [Auditoría Técnica](./05-auditoria-tecnica-y-arquitectura.md) para que **no tengas gastos fijos mensuales de servidores** hasta que ya estés ganando plata:

* **Etapa Lanzamiento (De 1 a 200 autos conectados):**
  * **Supabase (Base de datos + API):** \$0 USD / mes (Free Tier).
  * **Expo EAS (Generación de App):** \$0 USD / mes (Free Tier).
  * **Dominio Web + Hosting Landing Page (Vercel):** \$1 USD / mes (\$12 USD al año por el dominio).
  * **Google Play Store (Cuenta de desarrollador Android):** \$25 USD (Pago único de por vida).
  * **TOTAL GASTO FIJO MENSUAL ETAPA 1:** **~\$1 USD / mes**.

* **Etapa Crecimiento (De 200 a 2.000 autos conectados):**
  * **Supabase Pro:** \$25 USD / mes.
  * **Apple App Store (Cuando sumes iPhone oficial):** \$99 USD / año (~\$8.25 USD/mes).
  * **Gemini Flash API (IA para fallas nuevas):** ~\$5 USD / mes.
  * **TOTAL GASTO FIJO MENSUAL ETAPA 2:** **~\$38 USD / mes**.

---

## 3. Proyección de Ganancias a 12 Meses (3 Escenarios)

### Escenario 1: Arranque de Bolsillo (Mes 1 a 3)
* **Objetivo:** Validar en tu barrio/ciudad con dueños de autos de Uber y un lubricentro amigo.
* **Números:**
  * 25 Kits vendidos en el mes (\$18.70 USD ganancia c/u) = **\$467 USD**
  * 10 dueños con 3 autos en Uber c/u (30 autos B2B a \$9 USD/mes) = **\$270 USD/mes**
  * 30 conductores particulares en Plan Pro (\$4 USD/mes) = **\$120 USD/mes**
  * 15 cambios de aceite/batería derivados a talleres aliados (\$8 USD comisión prom.) = **\$120 USD/mes**
* **💰 Ingreso Neto Mensual (Mes 3):** **~\$977 USD / mes** (más de \$1.000.000 ARS/mes).

### Escenario 2: Tracción Local Consolidada (Mes 6)
* **Números acumulados:**
  * 60 Kits nuevos vendidos en el mes = **\$1.404 USD**
  * 120 autos de Flotas/Uber/Reparto monitoreados (\$9 USD/mes) = **\$1.080 USD/mes**
  * 200 conductores particulares en Plan Pro (\$4 USD/mes) = **\$800 USD/mes**
  * 50 derivaciones mensuales a talleres/lubricentros = **\$400 USD/mes**
  * Menos costos de servidores (-\$38 USD) y publicidad en Instagram/TikTok (-\$250 USD).
* **💰 Ingreso Neto Mensual (Mes 6):** **~\$3.396 USD / mes**.

### Escenario 3: Escalado Regional (Mes 12)
* **Números acumulados:**
  * 400 autos de flotas B2B + 1.000 usuarios Pro particulares + Red de 30 talleres aliados.
* **💰 Ingreso Recurrente Mensual (Mes 12):** **+\$8.500 USD / mes**.

---

## 4. Plan de Ataque Comercial: Cómo Conseguir los Primeros Clientes sin Plata

1. **Alianza "Caballo de Troya" con 2 Lubricentros y 1 Casa de Baterías de tu zona:**
   * Vas al dueño del lubricentro con la app funcionando en tu celular y le decís: *"¿Cuántos clientes perdés porque se olvidan de volver a los 10.000 km o se van a otro lado? Si ofrecemos este Kit en tu mostrador, mi app les avisa exactamente cuándo el aceite se degradó y les manda un botón directo a tu WhatsApp para pedir turno"*.
   * El lubricentro te sirve de **punto de venta físico gratis** y vos le asegurás que el cliente vuelva siempre a su local.
2. **Grupos de Dueños de Autos en Alquiler (Choferes Uber / Cabify / Remiserías):**
   * En Facebook y WhatsApp hay decenas de grupos de *"Dueños buscando chofer Uber"* o *"Alquiler de autos para trabajar"*.
   * Su mayor terror es que el chofer les recaliente el motor o les destruya el tren delantero/batería. Con mostrarles una captura de la alerta de temperatura y batería en tiempo real, cerrás ventas en el acto.
3. **Videos Cortos (Reels / TikTok) de "Lo que el mecánico no quiere que sepas":**
   * Mostrar en un video de 30 segundos cómo enchufás el aparatito a un auto, tocás un botón en **Tu-Auto** y la app te dice en español claro qué tiene roto y cuánto cuesta de verdad el repuesto. Esos videos se vuelven virales orgánicamente sin pagar publicidad.
