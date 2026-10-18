import { describe, expect, it } from 'vitest';
import { OfflineStorageEngine } from '../db-local/sqliteCache';
import { CloudAndBillingService } from '../modules/cloud-sync/supabaseSyncService';
import { evaluateElectricalSystem } from '../modules/electrical-guard/electricalEngine';
import { computeOverallHealthScore, translateVehicleFaults } from '../modules/fault-translator/faultCatalog';
import { evaluateFleetVehicleAbuse } from '../modules/fleet-b2b/fleetAlertEngine';
import { BleOBD2Provider, BleTransportAdapter, ELM327_INIT_SEQUENCE } from '../modules/obd2-engine/BleOBD2Provider';
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
import { ejecutarChequeoMedico } from '../modules/medical-checkup/checkupEngine';

describe('Tu-Auto End-to-End Engineering & Security Test Suite (Sprints 1 to 4)', () => {
  describe('1. Decodificador Hexadecimal OBD2 (SAE J1979 / ELM327)', () => {
    it('decodifica temperatura de agua PID 0105 exactamente (A - 40)', () => {
      expect(parseCoolantTempHex('41 05 82')).toBe(90);
      expect(parseCoolantTempHex('410592>')).toBe(106);
      expect(parseCoolantTempHex('NO DATA')).toBeNull();
    });

    it('decodifica RPM del motor PID 010C ((A*256 + B)/4)', () => {
      expect(parseRpmHex('41 0C 0C 80')).toBe(800);
      expect(parseRpmHex('410C1F40')).toBe(2000);
    });

    it('decodifica velocidad PID 010D y voltaje ECU PID 0142 / AT RV', () => {
      expect(parseSpeedHex('41 0D 5A')).toBe(90);
      expect(parseControlModuleVoltageHex('41 42 37 46')).toBe(14.15);
      expect(parseAtRvVoltage('14.2V >')).toBe(14.2);
    });

    it('decodifica distancia desde borrado de fallas PID 0131 (Detector Fraude Auto Usado)', () => {
      expect(parseDistanceSinceCodesClearedHex('41 31 00 09')).toBe(9);
      expect(parseDistanceSinceCodesClearedHex('41 31 12 D4')).toBe(4820);
    });

    it('decodifica códigos de falla DTC Modo 03 (43) y Modo 07 (47) sin errores', () => {
      expect(decodeDTCResponseHex('43 02 03 02 04 20', '43')).toEqual(['P0302', 'P0420']);
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

  describe('6. Conexión Bluetooth BLE Real y Cola Asíncrona (Sprint 2)', () => {
    it('ejecuta la secuencia completa AT Z..AT SP 0 y lee sensores en orden estricto', async () => {
      const sentCommands: string[] = [];
      const mockTransport: BleTransportAdapter = {
        connectToDevice: async () => true,
        disconnectDevice: async () => {},
        writeAndAwaitResponse: async (cmd) => {
          const cleanCmd = cmd.trim();
          sentCommands.push(cleanCmd);
          if (cleanCmd === 'AT RV') return '14.1V>';
          if (cleanCmd === '010C') return '410C0D48>'; // 850 RPM
          if (cleanCmd === '0105') return '410583>';   // 91°C
          if (cleanCmd === '010D') return '410D3C>';   // 60 km/h
          if (cleanCmd === '03') return '43010302>';   // P0302
          if (cleanCmd === '07') return '47010420>';   // P0420
          if (cleanCmd === '0131') return '4131000C>'; // 12 km
          return 'OK>';
        },
      };

      const bleProvider = new BleOBD2Provider(mockTransport);
      const connected = await bleProvider.connect('ESP32-TUAUTO-01');
      expect(connected).toBe(true);
      expect(sentCommands.slice(0, ELM327_INIT_SEQUENCE.length)).toEqual([...ELM327_INIT_SEQUENCE]);

      const frame = await bleProvider.pollSingleFrame();
      expect(frame.voltageInstantV).toBe(14.1);
      expect(frame.rpm).toBe(850);
      expect(frame.coolantTempC).toBe(91);
      expect(frame.speedKmh).toBe(60);

      const scan = await bleProvider.runFullDiagnosticScan();
      expect(scan.active).toEqual(['P0302']);
      expect(scan.pending).toEqual(['P0420']);
      expect(scan.kmSinceClear).toBe(12);
    });
  });

  describe('7. Persistencia Offline-First, Cotización Cloud y Alertas de Flota B2B (Sprints 2-4)', () => {
    it('encola eventos sin internet de forma idempotente (sin duplicados) y los sincroniza', async () => {
      const storage = new OfflineStorageEngine();
      storage.enqueueOfflineEvent('crank-001', 'electrical_cranking_logs', { minV: 9.1 });
      storage.enqueueOfflineEvent('crank-001', 'electrical_cranking_logs', { minV: 9.1 }); // Duplicado ignorado
      expect(storage.getPendingEvents().length).toBe(1);

      const flushed = await storage.flushPendingToCloud(async (events) =>
        events.map((e) => e.idempotencyKey)
      );
      expect(flushed).toBe(1);
      expect(storage.getPendingEvents().length).toBe(0);
    });

    it('actualiza cotización USD->ARS dinámicamente y devuelve planes de MercadoPago', () => {
      const billing = new CloudAndBillingService();
      billing.setExchangeRateArs(1200);
      expect(billing.getExchangeRateArs()).toBe(1200);
      const plans = billing.getSubscriptionPlans();
      expect(plans.length).toBe(2);
      expect(plans[0].planId).toBe('pro_b2c');
      expect(plans[1].planId).toBe('fleet_b2b');
    });

    it('detecta cuando un chofer de Uber desconecta el sensor OBD2 o recalienta el auto', () => {
      const alerts = evaluateFleetVehicleAbuse({
        plate: 'AE 492 KL',
        driverName: 'Carlos Gómez',
        isDongleConnected: false,
        minutesSinceLastPing: 12,
        coolantTempC: 105,
        rpm: 4900,
        voltageV: 12.1,
        oilLifePercent: 5,
      });
      expect(alerts.map((a) => a.alertType)).toEqual([
        'TAMPER_DISCONNECTED',
        'OVERHEATING',
        'HIGH_RPM_ABUSE',
        'ALTERNATOR_FAILURE',
        'OIL_OVERDUE',
      ]);
    });
  });

  describe('8. Motor de Chequeo Médico de 8 Componentes (Con y Sin Dongle)', () => {
    it('evalúa los 8 componentes tomando el criterio más restrictivo entre km y meses', () => {
      const resultado = ejecutarChequeoMedico({
        modeloId: 'vw_gol_trend',
        anio: 2021,
        kmActuales: 56000,
        dongleConectado: false,
        luzTestigoDeclaradaPorUsuario: false,
        historial: {
          correa_distribucion: { ultimoCambioKm: 0, mesesDesdeUltimoCambio: 40 },
          aceite_filtro: { ultimoCambioKm: 45000, mesesDesdeUltimoCambio: 13 },
          filtro_aire: { ultimoCambioKm: 52000, mesesDesdeUltimoCambio: 4 },
        },
      });

      expect(resultado.componentes.length).toBe(8);
      const correa = resultado.componentes.find((c) => c.id === 'correa_distribucion')!;
      expect(correa.aplicaAlModelo).toBe(true);
      expect(correa.estado).toBe('pronto'); // 56.000 / 60.000 = 93%
      expect(correa.fuente).toBe('estimado');

      const aceite = resultado.componentes.find((c) => c.id === 'aceite_filtro')!;
      expect(aceite.estado).toBe('revisar'); // >100% por km (11.000/10.000) y meses (13/12)

      const frenos = resultado.componentes.find((c) => c.id === 'frenos')!;
      expect(frenos.estado).toBe('sin_datos'); // No cargado -> nunca muestra un 'bien' falso
      expect(frenos.vidaConsumidaPct).toBeNull();
    });

    it('oculta la correa de distribución cuando el modelo usa cadena metálica (ej. Toyota Etios / Fiat Cronos)', () => {
      const resultadoEtios = ejecutarChequeoMedico({
        modeloId: 'toyota_etios',
        anio: 2022,
        kmActuales: 65000,
        dongleConectado: false,
        luzTestigoDeclaradaPorUsuario: false,
        historial: {},
      });

      const correa = resultadoEtios.componentes.find((c) => c.id === 'correa_distribucion')!;
      expect(correa.aplicaAlModelo).toBe(false);
    });
  });
});
