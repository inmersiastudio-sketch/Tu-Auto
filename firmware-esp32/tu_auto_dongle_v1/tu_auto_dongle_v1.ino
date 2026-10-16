/**
 * ============================================================================
 * FIRMWARE OFICIAL: TU-AUTO SMART DONGLE V1 (ESP32-C3 + SN65HVD230 CAN + BLE)
 * ============================================================================
 * Especificación de Hardware: ver `docs/04-kit-hardware-y-planos.md`
 * - Microcontrolador: ESP32-C3-MINI-1 (RISC-V 160MHz + Bluetooth 5.0 BLE)
 * - GPIO 0 (ADC1): Divisor resistivo 100kΩ / 22kΩ desde Pin 16 (+12V Batería)
 * - GPIO 4 (CAN TX) & GPIO 5 (CAN RX): Transceptor CAN Bus SN65HVD230 (500 kbps)
 * - GPIO 8: Buzzer Activo SMD 85dB (Alarma autónoma de recalentamiento >= 103°C)
 * - GPIO 9: LED RGB WS2812B (Semáforo físico: Verde / Amarillo / Rojo)
 * Ticket: TUA-027
 */

#include <Arduino.h>
#include "driver/twai.h"

// Definición de Pines según el Plano Electrónico de Tu-Auto V1
#define PIN_BATTERY_ADC   0
#define PIN_CAN_TX        4
#define PIN_CAN_RX        5
#define PIN_ALARM_BUZZER  8
#define PIN_STATUS_LED    9

// Constante del divisor resistivo: R1 = 100kΩ, R2 = 22kΩ -> Factor = (100 + 22) / 22 = 5.5454
static const float VOLTAGE_DIVIDER_RATIO = 5.5454f;
static const int CRITICAL_WATER_TEMP_C   = 103;

// Variables de estado en tiempo real (Caja Negra en RAM/Flash)
static float g_instantVoltageV      = 12.6f;
static float g_minCrankingVoltageV  = 12.6f;
static int   g_coolantTempC         = 88;
static int   g_engineRpm            = 0;
static bool  g_isCrankingInProgress = false;

/**
 * Lee el voltaje exacto del Pin 16 (+12V Batería) a 1 kHz (cada 1 milisegundo)
 * para capturar la caída en el giro del burro de arranque.
 */
float sampleBatteryVoltage() {
  int rawAdc = analogRead(PIN_BATTERY_ADC); // 0..4095 (12-bit ADC a 3.3V)
  float adcVoltage = (static_cast<float>(rawAdc) / 4095.0f) * 3.3f;
  return adcVoltage * VOLTAGE_DIVIDER_RATIO;
}

/**
 * Envía una solicitud OBD2 estándar (Modo 01) por el Bus CAN (ID 0x7DF).
 */
void requestObdPid(uint8_t pid) {
  twai_message_t txMsg = {};
  txMsg.identifier = 0x7DF; // Broadcast estándar SAE J1979
  txMsg.extd = 0;
  txMsg.data_length_code = 8;
  txMsg.data[0] = 0x02; // 2 bytes significativos
  txMsg.data[1] = 0x01; // Modo 01 (Datos en vivo)
  txMsg.data[2] = pid;  // Ej: 0x05 (Agua), 0x0C (RPM)
  txMsg.data[3] = 0x55;
  txMsg.data[4] = 0x55;
  txMsg.data[5] = 0x55;
  txMsg.data[6] = 0x55;
  txMsg.data[7] = 0x55;

  twai_transmit(&txMsg, pdMS_TO_TICKS(20));
}

/**
 * Procesa las respuestas CAN de la computadora del auto (IDs 0x7E8 a 0x7EF).
 */
void pollCanResponses() {
  twai_message_t rxMsg;
  while (twai_receive(&rxMsg, pdMS_TO_TICKS(5)) == ESP_OK) {
    if (rxMsg.identifier >= 0x7E8 && rxMsg.identifier <= 0x7EF) {
      uint8_t modeResp = rxMsg.data[1];
      uint8_t pid      = rxMsg.data[2];
      uint8_t byteA    = rxMsg.data[3];
      uint8_t byteB    = rxMsg.data[4];

      if (modeResp == 0x41) {
        if (pid == 0x05) {
          // FÓRMULA AGUA: A - 40 (°C)
          g_coolantTempC = static_cast<int>(byteA) - 40;
        } else if (pid == 0x0C) {
          // FÓRMULA RPM: ((A * 256) + B) / 4
          g_engineRpm = ((static_cast<int>(byteA) * 256) + static_cast<int>(byteB)) / 4;
        }
      }
    }
  }
}

/**
 * Vigía Autónomo de Temperatura:
 * Si el agua llega a 103°C o el alternador cae de 13.0V con motor en marcha,
 * activa el Buzzer de 85dB integrado en la placa aunque el conductor no tenga celular.
 */
void evaluateAutonomousHardwareAlarm() {
  bool overheating = (g_coolantTempC >= CRITICAL_WATER_TEMP_C);
  bool alternatorDead = (g_engineRpm > 650 && g_instantVoltageV < 13.0f);

  if (overheating || alternatorDead) {
    digitalWrite(PIN_ALARM_BUZZER, HIGH);
  } else {
    digitalWrite(PIN_ALARM_BUZZER, LOW);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_ALARM_BUZZER, OUTPUT);
  digitalWrite(PIN_ALARM_BUZZER, LOW);
  analogReadResolution(12);

  // Configurar Bus CAN (TWAI) a 500 kbps (ISO 15765-4)
  twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(
    static_cast<gpio_num_t>(PIN_CAN_TX),
    static_cast<gpio_num_t>(PIN_CAN_RX),
    TWAI_MODE_NORMAL
  );
  twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();
  twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();

  if (twai_driver_install(&g_config, &t_config, &f_config) == ESP_OK) {
    twai_start();
  }
}

unsigned long lastCanPollMs = 0;

void loop() {
  // 1. Muestreo de alta velocidad (1 kHz) del sistema eléctrico y arranque
  g_instantVoltageV = sampleBatteryVoltage();

  if (g_engineRpm == 0 && g_instantVoltageV < 10.8f && g_instantVoltageV > 6.5f) {
    g_isCrankingInProgress = true;
    if (g_instantVoltageV < g_minCrankingVoltageV) {
      g_minCrankingVoltageV = g_instantVoltageV;
    }
  }

  // 2. Cada 250 ms pedimos Temperatura de Agua (0105) y RPM (010C) por CAN Bus
  unsigned long now = millis();
  if (now - lastCanPollMs >= 250) {
    lastCanPollMs = now;
    requestObdPid(0x05); // Agua
    requestObdPid(0x0C); // RPM
    pollCanResponses();
    evaluateAutonomousHardwareAlarm();

    // Emitir trama JSON compacta por Serial / BLE Notify hacia la App Tu-Auto
    Serial.printf(
      "{\"v\":%.2f,\"crankMinV\":%.2f,\"tempC\":%d,\"rpm\":%d}\n",
      g_instantVoltageV,
      g_minCrankingVoltageV,
      g_coolantTempC,
      g_engineRpm
    );
  }

  delay(1);
}
