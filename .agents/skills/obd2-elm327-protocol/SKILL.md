---
name: obd2-elm327-protocol
description: Guía técnica del protocolo automotriz OBD2 (SAE J1979 / ELM327 / ESP32 CAN) para programar la lectura de sensores, decodificación hexadecimal y algoritmos predictivos de batería, agua y aceite en Tu-Auto.
---

# 🔌 Skill: Protocolo Automotriz OBD2, ELM327 y Algoritmos de Telemetría

Esta skill equipa al Agente de IA con las especificaciones exactas de bajo nivel para comunicarse con el vehículo (vía Bluetooth BLE con chip ELM327 `PIC18F25K80` o firmware propio `ESP32-C3`) y transformar tramas hexadecimales crudas en indicadores precisos para **Tu-Auto**.

---

## 1. Secuencia de Inicialización del Dispositivo (Handshake)

Al conectarse por Bluetooth Low Energy (UUIDs típicos de servicio ELM327 BLE: `FFF0` / característica `FFF1` notify y `FFF2` write), el motor de comunicación debe enviar esta secuencia exacta antes de pedir datos:

| Orden | Comando ASCII | Respuesta Esperada | Propósito |
| :---: | :--- | :--- | :--- |
| 1 | `AT Z\r` | `ELM327 v1.5 >` | Reinicia el chip a estado limpio. |
| 2 | `AT E0\r` | `OK >` | Desactiva el eco (ahorra 50% de tráfico Bluetooth). |
| 3 | `AT L0\r` | `OK >` | Desactiva saltos de línea innecesarios. |
| 4 | `AT S0\r` | `OK >` | Quita espacios en blanco entre bytes hexadecimales (más rápido de parsear). |
| 5 | `AT H0\r` | `OK >` | Oculta encabezados de red internos. |
| 6 | `AT SP 0\r` | `OK >` | Configura detección automática de protocolo (CAN 500k, ISO 9141-2, KWP2000). |

---

## 2. Tabla de Comandos y Fórmulas Matemáticas de Conversión (PIDs Modo 01)

Cuando enviamos un comando del Modo `01` (ej. `0105\r`), la computadora del auto responde con `41` + el código del PID + los bytes de datos en hexadecimal (`A`, `B`, `C`, `D`).

### A. Sistema Eléctrico (Batería y Alternador)
* **Comando Directo Analógico:** `AT RV\r`
  * **Respuesta:** Texto directo, ej. `14.1V` o `12.4V`.
* **Comando Digital ECU (Módulo de Control):** `0142\r`
  * **Respuesta:** `41 42 A B` (2 bytes hex).
  * **Fórmula en TypeScript:**
    ```typescript
    const voltage = ((A * 256) + B) / 1000; // Resultado en Voltios (ej: 14.15V)
    ```
* **Reglas de Diagnóstico Eléctrico:**
  * **Motor Apagado ($RPM = 0$):**
    * $\ge 12.5\text{V}$: Batería al 100%.
    * $12.1\text{V} - 12.4\text{V}$: Batería a media vida (60% - 75%).
    * $< 12.0\text{V}$: **Alerta Amarilla** (Batería descargada o con celda agotada).
  * **Caída en Arranque (Cranking Drop):**
    * Mínimo $> 10.0\text{V}$: Salud excelente.
    * Entre $9.5\text{V}$ y $9.9\text{V}$: **Aviso Preventivo** (Empezando a envejecer).
    * $< 9.5\text{V}$: **Alerta Roja/Amarilla** (*"Tu batería está al límite, te puede dejar a pata en los próximos 15 días"*).
  * **Motor en Marcha ($RPM > 600$ - Prueba de Alternador):**
    * Entre $13.8\text{V}$ y $14.4\text{V}$: Alternador y regulador perfectos.
    * $< 13.3\text{V}$: **Alerta Roja** (*"El alternador NO está cargando. Estás usando solo la batería"*).
    * $> 14.8\text{V}$: **Alerta Roja** (*"Sobrecarga del regulador de voltaje: peligro de quemar batería o electrónica"*).

---

### B. Sistema de Refrigeración ("El Agua")
* **Comando:** `0105\r` (Engine Coolant Temperature)
* **Respuesta:** `41 05 A` (1 byte hex).
* **Fórmula en TypeScript:**
  ```typescript
  const coolantTempCelsius = A - 40; // Rango: -40°C a +215°C
  ```
* **Algoritmo Detector de "Pérdida de Agua / Recalentamiento" (`ThermalShield`):**
  1. **Umbral Estático:**
     * $< 98^\circ\text{C}$: Normal (Verde).
     * $99^\circ\text{C} - 102^\circ\text{C}$: Precaución / Electroventilador al máximo (Amarillo).
     * $\ge 103^\circ\text{C}$: **Alarma Sonora Roja Inmediata** (*"Peligro de recalentamiento: detené el motor"*).
  2. **Umbral Dinámico por Pendiente ($\Delta T / \Delta t$):**
     * Si el motor ya superó los $85^\circ\text{C}$ y la temperatura sube a una velocidad $\ge 4^\circ\text{C}$ en 20 segundos sin bajar, disparar alerta preventiva de **posible falta de agua en el circuito o termostato trabado**.

---

### C. RPM, Velocidad y Algoritmo de Desgaste Real de Aceite
* **RPM del Motor (`010C\r`):** Respuesta `41 0C A B` $\rightarrow$ `const rpm = ((A * 256) + B) / 4;`
* **Velocidad (`010D\r`):** Respuesta `41 0D A` $\rightarrow$ `const speedKmh = A;`
* **Tiempo de motor encendido (`011F\r`):** Respuesta `41 1F A B` $\rightarrow$ `const secondsRun = (A * 256) + B;`
* **Fórmula Propietaria de "Kilómetros Equivalentes de Aceite" (`OilWearEngine`):**
  ```typescript
  // Cuando el auto está en marcha (rpm > 500) pero en tránsito pesado o detenido (speedKmh < 15):
  // Cada minuto de motor regulando equivale a 0.75 km de desgaste de aceite (45 km por hora de embotellamiento)
  const trafficPenaltyKm = idleMinutes * 0.75;
  const coldStartPenaltyKm = isColdStart (coolantTemp < 40) ? 3.5 : 0;
  const totalEquivalentWearKm = realDistanceKm + trafficPenaltyKm + coldStartPenaltyKm;
  ```

---

### D. Detector de "Auto Usado Adulterado / Fallas Recién Borradas"
* **Comando:** `0131\r` (Distance traveled since codes cleared)
* **Respuesta:** `41 31 A B` (2 bytes hex).
* **Fórmula:** `const kmSinceReset = (A * 256) + B;`
* **Regla de Negocio:** Si en una inspección de compra de auto usado `kmSinceReset < 150 km`, mostrar alerta destacada: *"⚠️ Atención: Alguien conectó un escáner y borró la memoria de fallas de este auto hace apenas X km"*.

---

## 3. Decodificación de Códigos de Rotura (DTCs: Modo `03` y Modo `07`)

* **Modo `03\r`:** Devuelve las fallas confirmadas que prendieron el *Check Engine*.
* **Modo `07\r`:** Devuelve las **fallas pendientes/preventivas** (ocurrieron en el último viaje pero todavía no prendieron la luz del tablero).
* **Cómo decodificar los 2 bytes (`B1`, `B2`) de cada DTC:**
  * Los 2 primeros bits de `B1` definen la letra del sistema:
    * `00` $\rightarrow$ **`P`** (Powertrain: Motor, Caja, Eléctrico, Agua).
    * `01` $\rightarrow$ **`C`** (Chassis: ABS, Suspensión).
    * `10` $\rightarrow$ **`B`** (Body: Airbag, Carrocería).
    * `11` $\rightarrow$ **`U`** (Network: Comunicación entre módulos).
  * Los siguientes 2 bits de `B1` son el segundo dígito (`0` a `3`).
  * Los últimos 4 bits de `B1` y los 8 bits de `B2` forman los 3 dígitos hexadecimales restantes (ej. `0302` $\rightarrow$ `P0302`).
