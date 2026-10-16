# 📊 BACKLOG MAESTRO & TABLERO KANBAN — `Tu-Auto`

> **Sistema de Control Ágil (Linear / GitHub Projects Compatible):**
> Este archivo es la **Fuente Única de Verdad** del estado de desarrollo del proyecto. Todo Agente de IA o desarrollador debe actualizar el estado de cada ticket (`[ ] Pendiente`, `[~] En Progreso`, `[x] Completado`) antes y después de programar cada feature.

---

## 📈 Resumen de Progreso Actual

* **Sprint Activo:** `SPRINT 2 — Conexión Bluetooth BLE Física & Caché SQLite Offline`
* **Tareas Completadas:** `18 / 28` (`100%` de Fase 0, Base de Datos y Sprint 1 Mobile MVP completados ✅)
* **Próxima Tarea Lista para Ejecutar:** **`TUA-015`** (Integración con adaptador físico Bluetooth BLE en teléfono real) o **`TUA-027`** (Firmware C++ para el Hardware Propio `ESP32-C3`).

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

## 🔌 SPRINT 2: Conexión Bluetooth BLE Real (ELM327) y Caché SQLite Offline (Semana 2)

| ID | Estado | Prioridad | Épica | Descripción de la Feature / Tarea | Criterio de Aceptación |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TUA-015** | `[ ]` Todo | 🔥 Crítica | `obd2-engine` | Integrar librería `react-native-ble-plx` y escáner de dispositivos Bluetooth Low Energy cercanos | Detecta adaptadores ELM327 BLE (`PIC18F25K80`) y placa `Tu-Auto ESP32`. |
| **TUA-016** | `[ ]` Todo | 🔥 Crítica | `obd2-engine` | Implementar secuencia de inicialización `AT Z`, `AT E0`, `AT SP 0` y cola de comandos asíncrona sin bloqueos | Envía comandos y recibe respuestas hexadecimales estables a 5-10 Hz. |
| **TUA-017** | `[x]` Done | 🔥 Crítica | `obd2-engine` | Programar parser hexadecimal completo para PIDs Modo `01` (`0105`, `010C`, `010D`, `0131`, `0142`) y decodificador binario de DTCs Modo `03` y `07` | [`hexParser.ts`](./app-mobile/src/modules/obd2-engine/hexParser.ts) + 12/12 Tests pasados en [`engines.test.ts`](./app-mobile/src/__tests__/engines.test.ts). |
| **TUA-018** | `[ ]` Todo | Alta | `db-local` | Configurar `expo-sqlite` para almacenamiento Offline-First de catálogo de fallas e historial de arranques | Funciona 100% en modo avión en la ruta sin conexión a internet. |
| **TUA-019** | `[x]` Done | Media | Kit Hardware | Pantalla de vinculación rápida leyendo el **Código QR** de la caja del Kit Económico `Tu-Auto` | [`FleetAndKitScreen.tsx`](./app-mobile/src/screens/FleetAndKitScreen.tsx) |

---

## ☁️ SPRINT 3: Backend Supabase, Precios en Moneda Local y Marketplace de Talleres (Semana 3)

| ID | Estado | Prioridad | Épica | Descripción de la Feature / Tarea | Criterio de Aceptación |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TUA-020** | `[x]` Done | Alta | Backend Cloud | Crear migración SQL endurecida en Supabase (`supabase/migrations/001_initial_schema.sql`), semillas (`seed.sql`) y Row Level Security (RLS) | [`001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql), [`seed.sql`](./supabase/seed.sql) |
| **TUA-021** | `[ ]` Todo | Alta | Backend Cloud | Crear servicio de sincronización automática de viajes y cotización dinámica USD $\rightarrow$ ARS / Moneda Local | Los precios de repuestos y mano de obra se actualizan automáticamente según el tipo de cambio. |
| **TUA-022** | `[ ]` Todo | Alta | IA Predictiva | Crear Supabase Edge Function conectada a **Gemini Flash** para traducir códigos DTC raros o específicos de marca y guardarlos en caché | Si aparece un código no catalogado, genera la tarjeta en criollo y la persiste en `dtc_master_catalog`. |
| **TUA-023** | `[x]` Done | 🔥 Crítica | Monetización | Implementar botón **"Pedir Turno en Taller / Lubricentro de Confianza"** con apertura de WhatsApp pre-armado con presupuesto cerrado | [`AntiScamFaultCard.tsx`](./app-mobile/src/components/AntiScamFaultCard.tsx), [`WalletScreen.tsx`](./app-mobile/src/screens/WalletScreen.tsx) |
| **TUA-024** | `[ ]` Todo | Media | Monetización | Integrar pasarela de suscripción mensual Plan Pro y Plan Flotas con **MercadoPago Suscripciones** | Permite activar el Plan Pro desde la app. |

---

## 🚕 SPRINT 4: Panel de Flotas B2B (Uber/Remises) y Firmware Hardware Propio ESP32 (Semana 4)

| ID | Estado | Prioridad | Épica | Descripción de la Feature / Tarea | Criterio de Aceptación |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TUA-025** | `[x]` Done | 🔥 Crítica | `fleet-b2b` | Construir **Pantalla 4: Panel de Control de Flota B2B** para dueños de 2 a 20 autos (Uber / Cabify / Remises / Reparto) | [`FleetAndKitScreen.tsx`](./app-mobile/src/screens/FleetAndKitScreen.tsx) |
| **TUA-026** | `[ ]` Todo | Alta | `fleet-b2b` | Configurar alertas al dueño de la flota por recalentamiento, exceso de RPM o desconexión del dispositivo OBD2 | El dueño recibe aviso inmediato si un chofer maltrata el motor o desenchufa el kit. |
| **TUA-027** | `[ ]` Todo | Media | `firmware-esp32` | Escribir el código fuente C++ / Arduino (`firmware-esp32/tu_auto_dongle_v1.ino`) para nuestro hardware propio con `ESP32-C3` + `SN65HVD230` | Lee Bus CAN a 500kbps, mide el ADC de batería a 1kHz en el arranque, activa el Buzzer a los `103°C` y transmite por BLE 5.0. |
| **TUA-028** | `[ ]` Todo | Media | QA & Lanzamiento | Generar instalador `.apk` de Android con Expo EAS y guía de presentación comercial para los primeros 5 lubricentros y flotas | App lista para instalar en cualquier teléfono Android y salir a vender. |
