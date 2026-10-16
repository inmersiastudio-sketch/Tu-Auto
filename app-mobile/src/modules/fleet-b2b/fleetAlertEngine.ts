/**
 * Motor de Auditoría y Alertas para Dueños de Flotas B2B (Uber / Cabify / Remises)
 * Detecta desconexión del sensor (Tamper Alert), exceso de RPM y recalentamiento por choferes.
 * Ticket: TUA-026
 */

export interface FleetTelemetryInput {
  plate: string;
  driverName: string;
  isDongleConnected: boolean;
  minutesSinceLastPing: number;
  coolantTempC: number;
  rpm: number;
  voltageV: number;
  oilLifePercent: number;
}

export interface FleetOwnerAlert {
  plate: string;
  driverName: string;
  alertType: 'TAMPER_DISCONNECTED' | 'OVERHEATING' | 'HIGH_RPM_ABUSE' | 'ALTERNATOR_FAILURE' | 'OIL_OVERDUE';
  severity: 'ROJO' | 'AMARILLO';
  whatsappMessageToOwner: string;
}

export function evaluateFleetVehicleAbuse(input: FleetTelemetryInput): FleetOwnerAlert[] {
  const alerts: FleetOwnerAlert[] = [];

  if (!input.isDongleConnected && input.minutesSinceLastPing >= 5) {
    alerts.push({
      plate: input.plate,
      driverName: input.driverName,
      alertType: 'TAMPER_DISCONNECTED',
      severity: 'ROJO',
      whatsappMessageToOwner: `🚨 [FLOTA TU-AUTO] El chofer ${input.driverName} desenchufó el Kit OBD2 del vehículo ${input.plate} hace ${input.minutesSinceLastPing} min.`,
    });
  }

  if (input.coolantTempC >= 102) {
    alerts.push({
      plate: input.plate,
      driverName: input.driverName,
      alertType: 'OVERHEATING',
      severity: 'ROJO',
      whatsappMessageToOwner: `🔥 [PELIGRO MOTOR] El vehículo ${input.plate} (${input.driverName}) está recalentando agua a ${input.coolantTempC}°C. Llamar al chofer de inmediato.`,
    });
  }

  if (input.rpm >= 4600) {
    alerts.push({
      plate: input.plate,
      driverName: input.driverName,
      alertType: 'HIGH_RPM_ABUSE',
      severity: 'AMARILLO',
      whatsappMessageToOwner: `⚠️ [EXCESO DE RPM] El vehículo ${input.plate} (${input.driverName}) está siendo exigido a ${input.rpm} RPM.`,
    });
  }

  if (input.rpm > 600 && input.voltageV < 13.2) {
    alerts.push({
      plate: input.plate,
      driverName: input.driverName,
      alertType: 'ALTERNATOR_FAILURE',
      severity: 'ROJO',
      whatsappMessageToOwner: `⚡ [FALLA ELÉCTRICA] El alternador del auto ${input.plate} dejó de cargar (${input.voltageV}V). Riesgo de quedar detenido.`,
    });
  }

  if (input.oilLifePercent <= 10) {
    alerts.push({
      plate: input.plate,
      driverName: input.driverName,
      alertType: 'OIL_OVERDUE',
      severity: 'AMARILLO',
      whatsappMessageToOwner: `🛢️ [SERVICE VENCIDO] Al auto ${input.plate} le queda solo ${input.oilLifePercent}% de vida útil de aceite por uso intensivo en tráfico.`,
    });
  }

  return alerts;
}
