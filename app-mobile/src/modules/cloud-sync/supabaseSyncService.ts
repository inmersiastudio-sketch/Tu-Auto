import { DEFAULT_EXCHANGE_RATE_ARS, formatARS } from '../../theme/colors';

/**
 * Servicio de Sincronización Cloud, Cotización Dinámica USD->ARS y Suscripciones MercadoPago
 * Tickets: TUA-021, TUA-024
 */

export interface SubscriptionPlanQuote {
  planId: 'pro_b2c' | 'fleet_b2b';
  name: string;
  monthlyUsd: number;
  monthlyArsFormatted: string;
  checkoutUrl: string;
  features: string[];
}

export class CloudAndBillingService {
  private currentExchangeRateArs: number = DEFAULT_EXCHANGE_RATE_ARS;

  public setExchangeRateArs(rate: number): void {
    if (rate > 100 && rate < 50000) {
      this.currentExchangeRateArs = rate;
    }
  }

  public getExchangeRateArs(): number {
    return this.currentExchangeRateArs;
  }

  public convertUsdRangeToArs(minUsd: number, maxUsd: number): {
    minFormatted: string;
    maxFormatted: string;
  } {
    return {
      minFormatted: formatARS(minUsd, this.currentExchangeRateArs),
      maxFormatted: formatARS(maxUsd, this.currentExchangeRateArs),
    };
  }

  public getSubscriptionPlans(): SubscriptionPlanQuote[] {
    return [
      {
        planId: 'pro_b2c',
        name: 'Plan Conductor Pro (Escudo Total)',
        monthlyUsd: 4.0,
        monthlyArsFormatted: formatARS(4.0, this.currentExchangeRateArs),
        checkoutUrl: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=tu-auto-pro-b2c',
        features: [
          'Detección temprana Modo 07 antes del Check Engine',
          'Alarma sonora de recalentamiento de agua en segundo plano',
          'Precios actualizados de repuestos y mano de obra local',
          '15% OFF en lubricentros y casas de baterías aliadas',
        ],
      },
      {
        planId: 'fleet_b2b',
        name: 'Plan Flotas / Uber / Remises (Por Auto)',
        monthlyUsd: 9.0,
        monthlyArsFormatted: formatARS(9.0, this.currentExchangeRateArs),
        checkoutUrl: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=tu-auto-fleet-b2b',
        features: [
          'Panel unificado de hasta 20 vehículos en vivo',
          'Alerta instantánea al dueño si el chofer desconecta el Kit OBD2',
          'Aviso de recalentamiento, exceso de RPM y aceite vencido por tráfico',
          'Historial clínico inalterable por patente y chofer',
        ],
      },
    ];
  }
}

export const sharedCloudBilling = new CloudAndBillingService();
