import { describe, expect, it } from 'vitest';
import { evaluateElectricalSystem } from '../modules/electrical-guard/electricalEngine';
import { computeOverallHealthScore, translateVehicleFaults } from '../modules/fault-translator/faultCatalog';
import {
  decodeDTCResponseHex,
  parseAtRvVoltage,
  parseControlModuleVoltageHex,
  parseCoolantTempHex,
  parseDistanceSinceCodesClearedHex,
  parseRpmHex,
  parseSpeedHex,
} from '../modules/obd2-engine/hexParser';
import { MockOBD2Provider } from '../modules/obd2-engine/MockOBD2Provider';
import { evaluateOilAndFluids } from '../modules/oil-tracker/oilEngine';
import { evaluateThermalSystem } from '../modules/thermal-shield/thermalEngine';

describe('Tu-Auto Core Engineering & Security Test Suite', () => {
  describe('1. Decodificador Hexadecimal OBD2 (SAE J1979 / ELM327)', () => {
    it('decodifica temperatura de agua PID 0105 exactamente (A - 40)', () => {
      // 0x82 = 130 -> 130 - 40 = 90°C
      expect(parseCoolantTempHex('41 05 82')).toBe(90);
      // 0x92 = 146 -> 146 - 40 = 106°C (Recalentamiento)
      expect(parseCoolantTempHex('410592>')).toBe(106);
      expect(parseCoolantTempHex('NO DATA')).toBeNull();
    });

    it('decodifica RPM del motor PID 010C ((A*256 + B)/4)', () => {
      // 0x0C 0x80 = 3200 / 4 = 800 RPM
      expect(parseRpmHex('41 0C 0C 80')).toBe(800);
      // 0x1F 0x40 = 8000 / 4 = 2000 RPM
      expect(parseRpmHex('410C1F40')).toBe(2000);
    });

    it('decodifica velocidad PID 010D y voltaje ECU PID 0142 / AT RV', () => {
      expect(parseSpeedHex('41 0D 5A')).toBe(90); // 0x5A = 90 km/h
      expect(parseControlModuleVoltageHex('41 42 37 46')).toBe(14.15); // 14150 / 1000 = 14.15V
      expect(parseAtRvVoltage('14.2V >')).toBe(14.2);
    });

    it('decodifica distancia desde borrado de fallas PID 0131 (Detector Fraude Auto Usado)', () => {
      expect(parseDistanceSinceCodesClearedHex('41 31 00 09')).toBe(9); // 9 km!
      expect(parseDistanceSinceCodesClearedHex('41 31 12 D4')).toBe(4820); // 4820 km
    });

    it('decodifica códigos de falla DTC Modo 03 (43) y Modo 07 (47) sin errores', () => {
      // 43 02 03 02 04 20 -> 2 códigos: P0302 y P0420
      expect(decodeDTCResponseHex('43 02 03 02 04 20', '43')).toEqual(['P0302', 'P0420']);
      // Modo 07 preventivo: P0171
      expect(decodeDTCResponseHex('47 01 71 00 00', '47')).toEqual(['P0171']);
    });
  });

  describe('2. Vigía del Sistema Eléctrico (Batería Cranking & Alternador)', () => {
    const provider = new MockOBD2Provider();

    it('detecta batería saludable y alternador cargando en escenario NORMAL', () => {
      provider.triggerSimulatedScenario('NORMAL');
      const report = evaluateElectricalSystem(provider.computeNextFrame());
      expect(report.batteryStatus).toBe('VERDE');
      expect(report.alternatorStatus).toBe('OK');
      expect(report.batterySohPercent).toBeGreaterThanOrEqual(85);
    });

    it('dispara alerta roja cuando la batería cae a 9.05V en el arranque', () => {
      provider.triggerSimulatedScenario('DEAD_BATTERY_CRANK');
      const report = evaluateElectricalSystem(provider.computeNextFrame());
      expect(report.batteryStatus).toBe('ROJO');
      expect(report.estimatedDaysUntilFailure).toBeLessThanOrEqual(15);
    });

    it('dispara alerta crítica cuando el alternador deja de cargar (12.15V en marcha)', () => {
      provider.triggerSimulatedScenario('ALTERNATOR_FAIL');
      const report = evaluateElectricalSystem(provider.computeNextFrame());
      expect(report.alternatorStatus).toBe('BAJA_CARGA');
      expect(report.alternatorSeverity).toBe('ROJO');
    });
  });

  describe('3. Escudo Térmico de Agua y Pendiente de Calentamiento', () => {
    const provider = new MockOBD2Provider();

    it('activa sirena de emergencia y detecta falta de agua ante subida rápida (+9.4°C/min)', () => {
      provider.triggerSimulatedScenario('OVERHEATING_WATER');
      const report = evaluateThermalSystem(provider.computeNextFrame());
      expect(report.severity).toBe('ROJO');
      expect(report.shouldTriggerSiren).toBe(true);
      expect(report.suspectedWaterLoss).toBe(true);
      expect(report.potentialDamageIfIgnoredUsd).toBeGreaterThan(500);
    });
  });

  describe('4. Algoritmo de Desgaste Real de Aceite (Km + Horas de Tráfico)', () => {
    const provider = new MockOBD2Provider();

    it('penaliza las horas de embotellamiento correctamente (45 km por cada hora de tráfico)', () => {
      provider.triggerSimulatedScenario('NORMAL');
      const frame = provider.computeNextFrame();
      const oil = evaluateOilAndFluids(frame, 10000);
      // 84320 - 77500 = 6820 km reales + (48.5 hs * 45 = 2183 km tráfico) = 9003 km equivalentes
      expect(oil.realKmSinceChange).toBe(6820);
      expect(oil.trafficPenaltyKm).toBe(2183);
      expect(oil.equivalentWearKm).toBe(9003);
      expect(oil.oilLifeRemainingPercent).toBe(10);
      expect(oil.severity).toBe('ROJO');
    });
  });

  describe('5. Traductor Anti-Estafas y Cálculo de Salud General', () => {
    const provider = new MockOBD2Provider();

    it('traduce P0302 y P0420 en Modo 07 sin jerga mecánica y con doble precio', () => {
      provider.triggerSimulatedScenario('CYLINDER_MISFIRE_P0302');
      const faults = translateVehicleFaults(provider.computeNextFrame());
      expect(faults.length).toBe(2);
      expect(faults[0].code).toBe('P0302');
      expect(faults[0].detectionType).toBe('PREVENTIVA_SILENCIOSA');
      expect(faults[0].ignoreDamageCostUsd).toBeGreaterThan(faults[0].fixTodayCostUsd.max);
    });

    it('baja el puntaje general de salud a zona ROJA durante recalentamiento', () => {
      provider.triggerSimulatedScenario('OVERHEATING_WATER');
      const health = computeOverallHealthScore(provider.computeNextFrame());
      expect(health.statusColor).toBe('ROJO');
      expect(health.score).toBeLessThan(50);
    });
  });
});
