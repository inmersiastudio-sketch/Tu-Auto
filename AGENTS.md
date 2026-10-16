# 🤖 AGENTS.md — Guía Maestra para Agentes de IA en `Tu-Auto`

Bienvenido al repositorio de **Tu-Auto** (Copiloto Vehicular Inteligente OBD2 & Predictor Financiero de Mantenimiento).
Cualquier Agente de IA (Antigravity, Subagentes de Desarrollo, Investigadores o Generadores de UI/Firmware) que se incorpore a este proyecto **DEBE leer y respetar esta guía** antes de escribir código o modificar la arquitectura.

---

## 1. Contexto y Misión del Sistema

**Tu-Auto** conecta el automóvil (mediante un dispositivo **OBD2 Bluetooth BLE** propio o compatible con ELM327) con una aplicación móvil (**React Native + Expo + TypeScript**) y un backend en la nube (**Supabase / PostgreSQL**).

### Regla de Oro del Producto ("Cero Jerga Mecánica"):
* **NUNCA** muestres en la interfaz de usuario final un código crudo como `P0302`, `PID 0105` o `Fuel Trim Bank 1` sin su traducción inmediata a **lenguaje coloquial latinoamericano/rioplatense** y su **impacto directo en la billetera** (cuánto cuesta arreglarlo hoy vs. cuánto cuesta si se ignora y rompe otra pieza).

---

## 2. Mapa de Documentación Obligatoria y Tablero de Control

Antes de tomar decisiones de diseño, base de datos o hardware, consultá estos documentos:

* 📋 **[`BACKLOG.md`](./BACKLOG.md): TABLERO KANBAN EN VIVO (Fuente Única de Verdad de Tareas `TUA-001` a `TUA-028`)**. Todo agente DEBE actualizar este archivo al iniciar y finalizar cada tarea.
* 📄 [`docs/01-estudio-mercado-referentes.md`](./docs/01-estudio-mercado-referentes.md): Análisis de FIXD, Carly, Bouncie, Zubie y Jooycar.
* 📄 [`docs/02-arquitectura-y-sistema.md`](./docs/02-arquitectura-y-sistema.md): Lógica de negocio para sistema eléctrico, agua (temperatura), aceite y fallas Modo 03/07.
* 📄 [`docs/03-modelo-negocio-y-mvp.md`](./docs/03-modelo-negocio-y-mvp.md): Vías de monetización (B2C Kit, Marketplace de Talleres, B2B Flotas/Uber) y pantallas del MVP.
* 📄 [`docs/04-kit-hardware-y-planos.md`](./docs/04-kit-hardware-y-planos.md): Especificaciones del Kit Económico OEM (`PIC18F25K80`) y planos del Hardware Propio (`ESP32-C3` + `SN65HVD230`).
* 📄 [`docs/05-auditoria-tecnica-y-arquitectura.md`](./docs/05-auditoria-tecnica-y-arquitectura.md): Stack tecnológico, plataformas, flujo de datos Offline-First y los 7 módulos funcionales.
* 📄 [`docs/06-base-de-datos-y-esquema.md`](./docs/06-base-de-datos-y-esquema.md): Diagrama ERD y esquema SQL completo para PostgreSQL/Supabase y SQLite local.
* 📄 [`docs/07-finanzas-y-plan-comercial.md`](./docs/07-finanzas-y-plan-comercial.md): Unit economics, costos de servidor y estrategia comercial.
* 📄 [`docs/08-especificacion-features-y-desarrollo.md`](./docs/08-especificacion-features-y-desarrollo.md): Contratos TypeScript (`IOBD2DataSource`), Historias de Usuario, Criterios de Aceptación y diseño de las 4 pestañas.
* 📄 [`docs/09-gestion-proyecto-y-roadmap-sprints.md`](./docs/09-gestion-proyecto-y-roadmap-sprints.md): Plataforma de gestión ágil (Linear / GitHub Projects + `BACKLOG.md`) y plan de 4 Sprints.

---

## 3. Skills Especializadas Disponibles en el Proyecto (`.agents/skills/`)

Este repositorio cuenta con **3 Skills locales** que los agentes deben activar según la tarea que estén ejecutando:

* 📋 **[`agile-backlog-manager`](./.agents/skills/agile-backlog-manager/SKILL.md)**
  * **Cuándo usarla:** **SIEMPRE** al comenzar y al terminar de programar cualquier feature o módulo, para marcar el avance en [`BACKLOG.md`](./BACKLOG.md) usando los códigos `TUA-XXX`.
* 🔌 **[`obd2-elm327-protocol`](./.agents/skills/obd2-elm327-protocol/SKILL.md)**
  * **Cuándo usarla:** Siempre que programes la comunicación Bluetooth BLE, el simulador de telemetría (`MockOBD2Provider`), el parser de respuestas hexadecimales del auto, el firmware del ESP32-C3 o las fórmulas de voltaje/agua/aceite.
* 🔧 **[`mecanica-y-costos-latam`](./.agents/skills/mecanica-y-costos-latam/SKILL.md)**
  * **Cuándo usarla:** Siempre que redactes textos de la interfaz, traduzcas códigos de falla (DTC), armes presupuestos de reparación ("Escudo Anti-Estafas") o diseñes alertas preventivas para conductores y dueños de flotas.

---

## 4. Estructura de Carpetas del Proyecto (Convención de Código)

A medida que se construya el código fuente, todos los agentes deben respetar esta estructura:

```text
c:\Proyectos\Tu-Auto\
├── AGENTS.md                        # Este archivo (Instrucciones para Agentes de IA)
├── BACKLOG.md                       # Tablero Kanban y Sprints en vivo (TUA-001 a TUA-028)
├── README.md                        # Portal principal del proyecto
├── .agents/
│   └── skills/                      # Skills técnicas, de negocio y gestión ágil
│       ├── agile-backlog-manager/
│       ├── obd2-elm327-protocol/
│       └── mecanica-y-costos-latam/
├── docs/                            # Documentación de producto, hardware, DB, features y finanzas
│   └── assets/                      # Imágenes y planos técnicos del kit y hardware
├── app-mobile/                      # Aplicación React Native (Expo + TypeScript)
│   ├── src/
│   │   ├── components/              # Componentes visuales (Semáforo, Relojes, Tarjetas de Costo)
│   │   ├── modules/
│   │   │   ├── obd2-engine/         # Conexión BLE real + Simulador Virtual en tiempo real
│   │   │   ├── electrical-guard/    # Algoritmo de Batería (Cranking) y Alternador
│   │   │   ├── thermal-shield/      # Vigía de temperatura de agua y pendiente térmica
│   │   │   ├── oil-tracker/         # Cálculo de desgaste de aceite por km + horas de tráfico
│   │   │   └── fault-translator/    # Traductor de DTCs y Escudo Anti-Estafas
│   │   ├── db-local/                # Esquema y caché SQLite Offline-First
│   │   └── screens/                 # Pantallas (Dashboard, Escáner, Billetera, Flotas B2B)
├── firmware-esp32/                  # Código C++ / Arduino para el Hardware Propio "Tu-Auto V1"
└── supabase/                        # Migraciones SQL y Edge Functions
```

---

## 5. Reglas de Ingeniería para Agentes Desarrolladores

1. **Control Estricto de Tareas (`BACKLOG.md`):**
   * Nunca escribas código sin asociarlo a un ticket `TUA-XXX` de [`BACKLOG.md`](./BACKLOG.md). Al terminar, marcá el ticket como `[x] Done`.
2. **Modo Dual Obligatorio (Real BLE + Simulador Interactivo):**
   * Toda pantalla o servicio que consuma datos del auto debe funcionar a través de una interfaz común `IOBD2DataSource`.
   * Siempre debe existir un **Modo Simulación (`MockOBD2DataSource`)** activable con un toque desde la app para que el fundador pueda demostrar en vivo cómo sube la temperatura del agua, cómo cae la batería en el arranque o cómo aparece una falla con su costo sin necesitar estar enchufado a un auto real.
3. **Arquitectura Offline-First:**
   * Las alertas críticas (Recalentamiento de agua $\ge 102^\circ\text{C}$ o Falla de alternador $< 13.0\text{V}$) **jamás** deben esperar una llamada HTTP al servidor. Se evalúan localmente en el dispositivo móvil en menos de `50 ms`.
4. **Diseño Visual (UI/UX):**
   * Tema oscuro automotriz moderno (`#0B0F19` fondo principal, `#111827` tarjetas, `#00E5FF` azul eléctrico de marca, `#10B981` verde seguro, `#F59E0B` amarillo preventivo, `#EF4444` rojo peligro inminente).
   * Tipografía grande y legible a un brazo de distancia (pensado para el soporte del celular en el torpedo del auto).
