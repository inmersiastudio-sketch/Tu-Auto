# 📊 BACKLOG MAESTRO & TABLERO KANBAN — `Tu-Auto`

> **Sistema de Control Ágil (Linear / GitHub Projects Compatible):**
> Este archivo es la **Fuente Única de Verdad** del estado de desarrollo del proyecto. Todo Agente de IA o desarrollador debe actualizar el estado de cada ticket (`[ ] Pendiente`, `[~] En Progreso`, `[x] Completado`) antes y después de programar cada feature.

---

## 📈 Resumen de Progreso Actual

* **Sprint Activo:** `SPRINT 5 — Telemetría Avanzada, Modo 02 Freeze Frames & Caja Negra (COMPLETADO 100%)`
* **Tareas Completadas:** `30 / 30` (`100%` de todas las Épicas completadas y verificadas con `22/22` tests unitarios e integración ✅)
* **Rediseño UI Oficial:** Implementado sistema de diseño **Kinetic Telematics** (Google Stitch), Daylight-First (`#F8FAFC`) + Sapphire Blue (`#2563EB`), modelo 3D interactivo Three.js, iconos vectoriales `lucide-react-native` y **CERO EMOJIS** en toda la aplicación.
* **Estado del Sistema:** Servidor Expo Web activo en `http://localhost:8081` con simulador interactivo para demostraciones en vivo. Listo para builds nativas y despliegue.

---

## ✅ FASE 0: Investigación, Planos de Hardware, Base de Datos y Auditoría (COMPLETADO)

| ID | Estado | Prioridad | Épica | Tarea / Entregable | Evidencia / Archivo |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TUA-001** | `[x]` Done | 🔥 Crítica | Negocio & Mercado | Investigación de referentes globales (FIXD, Carly, Bouncie, Jooycar) y modelo de monetización | [`docs/01-estudio-mercado-referentes.md`](./docs/01-estudio-mercado-referentes.md), [`docs/03-modelo-negocio-y-mvp.md`](./docs/03-modelo-negocio-y-mvp.md) |
| **TUA-002** | `[x]` Done | 🔥 Crítica | Hardware Kit | Diseño del Kit Económico OEM (`PIC18F25K80`) y planos del Hardware Propio (`ESP32-C3` + `SN65HVD230`) con imágenes y BOM | [`docs/04-kit-hardware-y-planos.md`](./docs/04-kit-hardware-y-planos.md), [`docs/assets/`](./docs/assets/) |
| **TUA-003** | `[x]` Done | 🔥 Crítica | Arquitectura & DB | Auditoría técnica de stack, plataformas cloud y esquema SQL completo de 11 tablas (PostgreSQL + SQLite) | [`docs/05-auditoria-tecnica-y-arquitectura.md`](./docs/05-auditoria-tecnica-y-arquitectura.md), [`docs/06-base-de-datos-y-esquema.md`](./docs/06-base-de-datos-y-esquema.md) |
| **TUA-004** | `[x]` Done | Alta | Finanzas | Unit Economics del Kit, costos de servidores (\$0 en inicio) y proyección de flujo de caja a 12 meses | [`docs/07-finanzas-y-plan-comercial.md`](./docs/07-finanzas-y-plan-comercial.md) |
| **TUA-005** | `[x]` Done | 🔥 Crítica | Agentes IA & Gestión | Configuración de `AGENTS.md`, Skills técnicas (`obd2-elm327-protocol`, `mecanica-y-costos-latam`, `agile-backlog-manager`) y especificación de features | [`AGENTS.md`](./AGENTS.md), [`docs/08-especificacion-features-y-desarrollo.md`](./docs/08-especificacion-features-y-desarrollo.md) |

---

## ✅ SPRINT 1: Aplicación MVP + Simulador de Auto en Tiempo Real (COMPLETADO 100%)

*Objetivo: Tener la app funcionando en vivo (Android/iOS/Web) con el simulador de 6 escenarios mecánicos para demostrar y vender.*

| ID | Estado | Prioridad | Épica | Descripción de la Feature / Tarea | Criterio de Aceptación |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TUA-006** | `[x]` Done | 🔥 Crítica | Core Mobile | Crear estructura base de la aplicación (`app-mobile`) con navegación de 4 pestañas y sistema de diseño Dark Automotriz | [`app-mobile/App.tsx`](./app-mobile/App.tsx), [`app-mobile/src/theme/colors.ts`](./app-mobile/src/theme/colors.ts) |
| **TUA-007** | `[x]` Done | 🔥 Crítica | `obd2-engine` | Programar contratos `IOBD2DataSource` y el **Motor Simulador en Tiempo Real (`MockOBD2Provider`)** con los 6 escenarios de prueba | [`app-mobile/src/modules/obd2-engine/MockOBD2Provider.ts`](./app-mobile/src/modules/obd2-engine/MockOBD2Provider.ts) |
| **TUA-008** | `[x]` Done | 🔥 Crítica | `electrical-guard` | Implementar algoritmo detector de **Batería en Arranque (Cranking Drop)** y estado del **Alternador** (`13.8V - 14.4V`) | [`app-mobile/src/modules/electrical-guard/electricalEngine.ts`](./app-mobile/src/modules/electrical-guard/electricalEngine.ts) |
| **TUA-009** | `[x]` Done | 🔥 Crítica | `thermal-shield` | Implementar **Vigía Térmico de Agua** con lectura grado a grado y detector de pendiente térmica (manguera rota/sin agua) | [`app-mobile/src/modules/thermal-shield/thermalEngine.ts`](./app-mobile/src/modules/thermal-shield/thermalEngine.ts) |
| **TUA-010** | `[x]` Done | Alta | `oil-tracker` | Programar calculador de **Vida Útil de Aceite y Agua** combinando kilómetros reales + penalización por horas de tráfico | [`app-mobile/src/modules/oil-tracker/oilEngine.ts`](./app-mobile/src/modules/oil-tracker/oilEngine.ts) |
| **TUA-011** | `[x]` Done | 🔥 Crítica | `fault-translator` | Cargar diccionario local con el **Top de roturas más comunes** traducidas al español local + matriz de costos ("Arreglar hoy vs. Ignorar") | [`app-mobile/src/modules/fault-translator/faultCatalog.ts`](./app-mobile/src/modules/fault-translator/faultCatalog.ts) |
| **TUA-012** | `[x]` Done | 🔥 Crítica | UI / Pantallas | Construir **Pantalla 1: Dashboard "Mi Auto"** y **Pantalla 2: Escáner Inteligente + Escudo Anti-Estafas** | [`DashboardScreen.tsx`](./app-mobile/src/screens/DashboardScreen.tsx), [`ScannerScreen.tsx`](./app-mobile/src/screens/ScannerScreen.tsx) |
| **TUA-013** | `[x]` Done | Alta | UI / Pantallas | Construir **Pantalla 3: Predictor de Billetera (6 meses)** y **Modo Inspector de Auto Usado** (Detector de fallas recién borradas) | [`WalletScreen.tsx`](./app-mobile/src/screens/WalletScreen.tsx), [`ScannerScreen.tsx`](./app-mobile/src/screens/ScannerScreen.tsx) |
| **TUA-014** | `[x]` Done | 🔥 Crítica | Demo Comercial | Crear barra flotante de **Simulación en Vivo (`DemoControlBar`)** para cambiar entre los 6 escenarios con 1 clic durante reuniones de venta | [`DemoControlBar.tsx`](./app-mobile/src/components/DemoControlBar.tsx) |

---

## ✅ SPRINT 2: Conexión Bluetooth BLE Real (ELM327) y Caché SQLite Offline (COMPLETADO 100%)

| ID | Estado | Prioridad | Épica | Descripción de la Feature / Tarea | Criterio de Aceptación |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TUA-015** | `[x]` Done | 🔥 Crítica | `obd2-engine` | Integrar adaptador Bluetooth Low Energy (`BleOBD2Provider`) para `PIC18F25K80` y `Tu-Auto ESP32` | [`BleOBD2Provider.ts`](./app-mobile/src/modules/obd2-engine/BleOBD2Provider.ts) |
| **TUA-016** | `[x]` Done | 🔥 Crítica | `obd2-engine` | Implementar secuencia de inicialización `AT Z`, `AT E0`, `AT SP 0` y cola de comandos asíncrona sin bloqueos | [`BleOBD2Provider.ts`](./app-mobile/src/modules/obd2-engine/BleOBD2Provider.ts) |
| **TUA-017** | `[x]` Done | 🔥 Crítica | `obd2-engine` | Programar parser hexadecimal completo para PIDs Modo `01` (`0105`, `010C`, `010D`, `0131`, `0142`) y decodificador binario de DTCs Modo `03` y `07` | [`hexParser.ts`](./app-mobile/src/modules/obd2-engine/hexParser.ts) + 16/16 Tests pasados en [`engines.test.ts`](./app-mobile/src/__tests__/engines.test.ts). |
| **TUA-018** | `[x]` Done | Alta | `db-local` | Configurar almacenamiento Offline-First de catálogo de fallas, historial de arranques y cola idempotente de sincronización | [`sqliteCache.ts`](./app-mobile/src/db-local/sqliteCache.ts) |
| **TUA-019** | `[x]` Done | Media | Kit Hardware | Pantalla de vinculación rápida leyendo el **Código QR** de la caja del Kit Económico `Tu-Auto` | [`FleetAndKitScreen.tsx`](./app-mobile/src/screens/FleetAndKitScreen.tsx) |

---

## ✅ SPRINT 3: Backend Supabase, Precios en Moneda Local y Marketplace de Talleres (COMPLETADO 100%)

| ID | Estado | Prioridad | Épica | Descripción de la Feature / Tarea | Criterio de Aceptación |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TUA-020** | `[x]` Done | Alta | Backend Cloud | Crear migración SQL endurecida en Supabase (`supabase/migrations/001_initial_schema.sql`), semillas (`seed.sql`) y Row Level Security (RLS) | [`001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql), [`seed.sql`](./supabase/seed.sql) |
| **TUA-021** | `[x]` Done | Alta | Backend Cloud | Crear servicio de sincronización automática de viajes y cotización dinámica USD $\rightarrow$ ARS / Moneda Local | [`supabaseSyncService.ts`](./app-mobile/src/modules/cloud-sync/supabaseSyncService.ts) |
| **TUA-022** | `[x]` Done | Alta | IA Predictiva | Crear Supabase Edge Function conectada a **Gemini Flash** para traducir códigos DTC raros o específicos de marca y guardarlos en caché | [`supabase/functions/translate-dtc-ai/index.ts`](./supabase/functions/translate-dtc-ai/index.ts) |
| **TUA-023** | `[x]` Done | 🔥 Crítica | Monetización | Implementar botón **"Pedir Turno en Taller / Lubricentro de Confianza"** con apertura de WhatsApp pre-armado con presupuesto cerrado | [`AntiScamFaultCard.tsx`](./app-mobile/src/components/AntiScamFaultCard.tsx), [`WalletScreen.tsx`](./app-mobile/src/screens/WalletScreen.tsx) |
| **TUA-024** | `[x]` Done | Media | Monetización | Integrar pasarela de suscripción mensual Plan Pro y Plan Flotas con **MercadoPago Suscripciones** | [`supabaseSyncService.ts`](./app-mobile/src/modules/cloud-sync/supabaseSyncService.ts) |

---

## ✅ SPRINT 4: Panel de Flotas B2B (Uber/Remises) y Firmware Hardware Propio ESP32 (COMPLETADO 100%)

| ID | Estado | Prioridad | Épica | Descripción de la Feature / Tarea | Criterio de Aceptación |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TUA-025** | `[x]` Done | 🔥 Crítica | `fleet-b2b` | Construir **Pantalla 4: Panel de Control de Flota B2B** para dueños de 2 a 20 autos (Uber / Cabify / Remises / Reparto) | [`FleetAndKitScreen.tsx`](./app-mobile/src/screens/FleetAndKitScreen.tsx) |
| **TUA-026** | `[x]` Done | Alta | `fleet-b2b` | Configurar alertas al dueño de la flota por recalentamiento, exceso de RPM o desconexión del dispositivo OBD2 | [`fleetAlertEngine.ts`](./app-mobile/src/modules/fleet-b2b/fleetAlertEngine.ts) |
| **TUA-027** | `[x]` Done | Media | `firmware-esp32` | Escribir el código fuente C++ / Arduino (`firmware-esp32/tu_auto_dongle_v1/tu_auto_dongle_v1.ino`) para nuestro hardware propio con `ESP32-C3` + `SN65HVD230` | [`tu_auto_dongle_v1.ino`](./firmware-esp32/tu_auto_dongle_v1/tu_auto_dongle_v1.ino) |
| **TUA-028** | `[x]` Done | Media | QA & Lanzamiento | Configurar script de compilación Expo EAS (`eas.json`) para generar instalador `.apk` de Android | [`app-mobile/eas.json`](./app-mobile/eas.json) |

---

## ✅ SPRINT 5: Telemetría Avanzada, Modo 02 Freeze Frames & Caja Negra (COMPLETADO 100%)

*Objetivo: Registrar el historial continuo de viajes y capturar la fotografía milimétrica de sensores (Modo 02) ante cualquier falla para empoderar al conductor frente al taller.*

| ID | Estado | Prioridad | Épica | Descripción de la Feature / Tarea | Criterio de Aceptación |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TUA-029** | `[x]` Done | 🔥 Crítica | `obd2-engine` | Implementar decodificador de **Modo 02 (Freeze Frame / Cuadro Congelado)** para PIDs `0202` (DTC), `0205` (Temp agua), `020C` (RPM), `020D` (Velocidad) y `0204` (Carga motor) con generador pericial en español | [`freezeFrameParser.ts`](./app-mobile/src/modules/obd2-engine/freezeFrameParser.ts) + Tests unitarios en [`engines.test.ts`](./app-mobile/src/__tests__/engines.test.ts) |
| **TUA-030** | `[x]` Done | 🔥 Crítica | UI / Telemetría | Crear **Pantalla de Caja Negra & Viajes (`TelemetryTripScreen.tsx`)** y componente de **Curvas SVG Interactivas (`TelemetryChart.tsx`)** con selector de viajes, métricas de agua/batería/velocidad y botón de compartir reporte pericial | [`TelemetryTripScreen.tsx`](./app-mobile/src/screens/TelemetryTripScreen.tsx), [`TelemetryChart.tsx`](./app-mobile/src/components/TelemetryChart.tsx), [`App.tsx`](./app-mobile/App.tsx) |

