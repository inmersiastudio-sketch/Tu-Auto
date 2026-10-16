# 🛠️ 08. Especificación Funcional de Features y Manual de Desarrollo

Este documento traduce la visión de negocio de **Tu-Auto** en **especificaciones de ingeniería de software listas para programar**. Cada módulo incluye sus **Historias de Usuario**, **Criterios de Aceptación Técnicos**, **Interfaces en TypeScript** y **Componentes de UI**.

---

## 1. Arquitectura de Módulos y Contratos TypeScript (`Core Contracts`)

Para cumplir la regla de oro de nuestro sistema (**Modo Dual: Bluetooth Real + Simulador en Tiempo Real para Demos**), todo el código de la aplicación se apoya en estas interfaces base ubicadas en `src/modules/obd2-engine/types.ts`:

```typescript
// Estado en vivo que emite el motor OBD2 (Real o Simulado) cada 500ms
export interface LiveTelemetryFrame {
  timestamp: number;
  connectionStatus: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED_REAL' | 'CONNECTED_SIMULATOR';
  rpm: number;                     // PID 010C (0 = Motor apagado en contacto)
  speedKmh: number;                // PID 010D
  coolantTempC: number;            // PID 0105 (Temperatura de "Agua")
  coolantSlopeCPerMin: number;     // Derivada térmica (Detecta manguera rota / sin agua)
  voltageInstantV: number;         // AT RV / PID 0142 (Voltaje actual)
  lastCrankingMinV: number | null; // Mínimo voltaje registrado en el último arranque
  distanceSinceResetKm: number;    // PID 0131 (Detector de fallas recién borradas)
  activeDTCs: string[];            // Modo 03 (Fallas con luz Check Engine)
  pendingDTCs: string[];           // Modo 07 (Fallas preventivas silenciosas)
}

// Interfaz única que implementan tanto BleOBD2Provider como MockOBD2Provider
export interface IOBD2DataSource {
  connect(deviceId?: string): Promise<boolean>;
  disconnect(): Promise<void>;
  runFullDiagnosticScan(): Promise<{ active: string[]; pending: string[]; kmSinceClear: number }>;
  subscribeTelemetry(callback: (frame: LiveTelemetryFrame) => void): () => void;
  // Exclusivo para Modo Simulación (Demos de Venta)
  triggerSimulatedScenario?(
    scenario: 'NORMAL' | 'OVERHEATING_WATER' | 'DEAD_BATTERY_CRANK' | 'ALTERNATOR_FAIL' | 'CYLINDER_MISFIRE_P0302' | 'USED_CAR_FRAUD'
  ): void;
}
```

---

## 2. Especificación Detallada de Features (Por Épicas)

### ⚡ ÉPICA 1: Motor de Conexión Dual y Simulador Comercial (`obd2-engine`)
* **Objetivo:** Permitir que la app se conecte en menos de 3 segundos al Kit OBD2 Bluetooth BLE o funcione en "Modo Demo Interactiva" para mostrarle el sistema a talleres, inversores y clientes.
* **Features incluidas:**
  * **F1.1 - Auto-Discovery y Vinculación por QR:** Escaneo de cámara del código QR en la caja del Kit `Tu-Auto` para guardar la dirección MAC del dispositivo y reconectar sola cuando el usuario sube al auto.
  * **F1.2 - Consola de Simulación en Tiempo Real (`DemoDrawer`):** Barra flotante con 6 botones de escenarios en vivo:
    1. 🟢 *Auto Sano (En marcha normal: 90°C, 14.1V, 850 RPM)*
    2. 🔴 *Recalentamiento de Agua (Sube de 92°C a 106°C en 15 segundos + Sirena)*
    3. 🟡 *Batería Agotada en Arranque (Simula caída a 9.1V al dar contacto)*
    4. 🔴 *Falla de Alternador en Ruta (Cae de 14.1V a 12.1V con motor andando)*
    5. 🟡 *Falla de Bobina/Bujía `P0302` (Dispara tarjeta de \$75.000 vs \$580.000)*
    6. 🕵️ *Auto Usado con Fallas Borradas (`PID 0131 = 8 km`)*
* **Criterio de Aceptación:** Cambiar de escenario en el simulador debe actualizar todos los relojes, el puntaje de salud del auto y las alertas en menos de `100 ms`.

---

### 🔋 ÉPICA 2: Vigía del Sistema Eléctrico (`electrical-guard`)
* **Objetivo:** Avisar con 15 días de anticipación antes de que la batería muera y detectar al instante si el alternador dejó de cargar.
* **Features incluidas:**
  * **F2.1 - Captura de Curva de Arranque (`CrankingDetector`):**
    * *Lógica:* Cuando `rpm === 0` y el voltaje cae bruscamente más de `1.5V` seguido de `rpm > 500`, el sistema registra el punto más bajo de tensión (`lastCrankingMinV`).
    * *Cálculo de Salud de Batería (SOH %):*
      $$\text{SOH} = \text{clamp}\left(\frac{V_{\text{crank}} - 8.5}{10.5 - 8.5} \times 100, 0, 100\right)$$
  * **F2.2 - Monitor de Alternador y Regulador:**
    * Si `rpm > 650` durante más de 10 segundos y `voltageInstantV < 13.3V` $\rightarrow$ Dispara **Alerta Roja: "Alternador no carga (Correa o Regulador)"**.
    * Si `voltageInstantV > 14.8V` $\rightarrow$ Dispara **Alerta Roja: "Peligro de Sobrecarga Eléctrica"**.

---

### 🌡️ ÉPICA 3: Escudo Térmico y Vigía de "Agua" (`thermal-shield`)
* **Objetivo:** Salvar la junta de tapa de cilindros avisando antes que el tablero del auto cuando hay pérdida de líquido refrigerante, falla del electroventilador o termostato trabado.
* **Features incluidas:**
  * **F3.1 - Termómetro Digital Preciso con Zonas de Color:**
    * Azul ($< 75^\circ\text{C}$: Motor frío, no acelerar fuerte).
    * Verde ($75^\circ\text{C} - 97^\circ\text{C}$: Temperatura óptima de trabajo).
    * Amarillo ($98^\circ\text{C} - 101^\circ\text{C}$: Zona de electroventilador activo).
    * Rojo ($\ge 102^\circ\text{C}$: Peligro de recalentamiento).
  * **F3.2 - Detector Predictivo de "Falta de Agua" por Pendiente Térmica:**
    * Guarda una ventana móvil de los últimos 30 segundos de temperatura. Si la pendiente supera `+8°C/minuto` estando arriba de `90°C`, alerta inmediatamente: *"⚠️ Subida brusca de temperatura: posible pérdida de agua o manguera rota"*.
  * **F3.3 - Alerta Sonora y Vibración Háptica:** Cuando entra en Zona Roja ($\ge 102^\circ\text{C}$), el teléfono vibra y emite sonido de alerta aunque la pantalla esté bloqueada.

---

### 🛢️ ÉPICA 4: Predictor Inteligente de Cambio de Aceite y Agua (`oil-tracker`)
* **Objetivo:** Medir la degradación real del aceite según el castigo del motor en ciudad y recordar cambios de refrigerante, filtros y correas.
* **Features incluidas:**
  * **F4.1 - Odómetro de "Desgaste Real Equivalente":**
    * Cruza kilómetros recorridos con minutos en ralentí/tránsito pesado (`speedKmh < 15` y `rpm > 500`).
    * Muestra al usuario una comparativa clara: *"Hiciste 6.800 km reales, pero por las 52 horas de embotellamiento tu aceite tiene un desgaste equivalente a **9.150 km** (Te queda 8% de vida útil)"*.
  * **F4.2 - Botón de "Reseteo con Sello Digital":** Al hacer el cambio de aceite, el usuario (o el lubricentro aliado) registra la fecha, marca del aceite (ej. *Sintético 5W40*) y kilometraje verificado por la ECU.

---

### 🔧 ÉPICA 5: Traductor de Roturas y "Escudo Anti-Estafas" (`fault-translator`)
* **Objetivo:** Eliminar el miedo al mecánico traduciendo códigos ocultos (Modo 07) y activos (Modo 03) a lenguaje coloquial y costos reales del mercado local.
* **Features incluidas:**
  * **F5.1 - Escáner de Un Toque ("Chequear mi Auto Ahora"):**
    * Animación de escaneo por subsistemas: *1. Sistema Eléctrico $\rightarrow$ 2. Agua y Temperatura $\rightarrow$ 3. Inyección y Motor $\rightarrow$ 4. Fallas Silenciosas (Modo 07)*.
  * **F5.2 - Tarjeta Interactiva de Costos ("Hoy vs. Si lo dejás pasar"):**
    * Muestra visualmente la barra comparativa:
      * 🟢 **Arreglarlo hoy:** `\$65.000 - \$90.000 ARS` (Cambiar bobina/bujías).
      * 🔴 **Si seguís andando así:** `\$580.000 ARS` (Se derrite el catalizador por nafta cruda).
  * **F5.3 - Derivador a Talleres de Confianza (Lead Generator):**
    * Botón directo a WhatsApp que arma el mensaje automático para el taller aliado: *"Hola! Mi app Tu-Auto detectó en mi VW Gol 1.6 una falla preventiva P0302 (Encendido Cilindro 2) y batería al 42%. Quiero turno con el presupuesto estimado de la app"*.

---

### 💸 ÉPICA 6: Billetera Predictiva y Modo "Compra de Auto Usado" (`wallet-and-inspector`)
* **Objetivo:** Que el usuario use la app todas las semanas para planificar su economía y ofrecer una herramienta viral para quienes buscan comprar un auto usado.
* **Features incluidas:**
  * **F6.1 - Radar de Gastos a 6 Meses ("Tu Alcancía Mecánica"):**
    * Línea de tiempo con los próximos vencimientos (Aceite, Refrigerante, Correa de Distribución, VTV, Batería) y el monto sugerido de ahorro mensual (ej. *"Separá \$32.000 por mes para no tener gastos sorpresa este semestre"*).
  * **F6.2 - Modo "Inspector de Auto Usado":**
    * Verifica en 10 segundos:
      1. ¿Le borraron las fallas hace pocos kilómetros para esconder un problema? (`PID 0131`).
      2. ¿Tiene fallas silenciosas en `Modo 07` que todavía no prendieron la luz del tablero?
      3. ¿Cómo están la batería y el alternador?
    * Genera un **"Certificado de Inspección Tu-Auto"** compartible por PDF/WhatsApp para negociar el precio del auto usado.

---

### 🚕 ÉPICA 7: Panel B2B para Dueños de Flotas / Uber (`fleet-b2b`)
* **Objetivo:** Darle control total al dueño de 2 a 20 autos manejados por choferes.
* **Features incluidas:**
  * **F7.1 - Grilla de Estado de Flota:** Lista compacta de todos los autos con patente, chofer asignado, estado de temperatura, salud de batería, días para cambio de aceite y alertas activas.
  * **F7.2 - Alerta de Desconexión ("Tamper Alert"):** Avisa si un chofer desenchufó el dispositivo del puerto OBD2.

---

## 3. Diseño de las 4 Pantallas Principales de la App (Navegación Inferior)

| Pestaña (Tab) | Nombre en Pantalla | Qué contiene |
| :---: | :--- | :--- |
| **Tab 1** | 🏠 **Mi Auto** (Dashboard) | Puntaje de Salud (`0-100%`), Reloj de **Sistema Eléctrico** (Batería + Alternador), Reloj de **Agua/Temperatura** en vivo, Barra de **Vida de Aceite** y Botón flotante de **Modo Simulación**. |
| **Tab 2** | 🔍 **Diagnóstico** (Escáner) | Botón de Escaneo Profundo, Semáforo de Gravedad (Verde/Amarillo/Rojo), Tarjetas de **Escudo Anti-Estafas** (Arreglar hoy vs. Ignorar) y Modo **Inspector de Auto Usado**. |
| **Tab 3** | 💸 **Mi Bolsillo** (Gastos) | Calendario predictivo de mantenimiento a 6 meses, cálculo de ahorro mensual sugerido y botón para pedir turno en Lubricentros/Talleres aliados. |
| **Tab 4** | 🚕 **Flota / Kit** (B2B & Config) | Vista rápida de múltiples vehículos (para dueños de Uber/Flotas) y vinculación del **Kit Económico Tu-Auto** por código QR o Bluetooth. |
