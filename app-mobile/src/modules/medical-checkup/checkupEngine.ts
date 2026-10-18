/**
 * Motor del "Chequeo Médico" Vehicular (8 Componentes + Base de Modelos Argentina)
 * Calcula el porcentaje de vida útil consumida tomando el criterio más restrictivo
 * entre kilómetros recorridos y meses transcurridos desde el último cambio.
 * Distingue con transparencia entre dato 'medido' (OBD2) y 'estimado' (km/fecha/manual).
 */

export type EstadoComponente = 'bien' | 'pronto' | 'revisar' | 'sin_datos';
export type FuenteDato = 'medido' | 'estimado';

export type ComponenteId =
  | 'aceite_filtro'
  | 'correa_distribucion'
  | 'refrigerante'
  | 'bateria'
  | 'frenos'
  | 'neumaticos'
  | 'filtro_aire'
  | 'luces_testigos';

export interface ModeloAutoPreset {
  id: string;
  marca: string;
  modelo: string;
  motor: string;
  usaCadenaDistribucion: boolean; // true = oculta correa_distribucion y explica que lleva cadena
  intervalos: {
    aceiteKm: number;
    aceiteMeses: number;
    correaKm?: number;
    correaMeses?: number;
    refrigeranteKm: number;
    refrigeranteMeses: number;
    bateriaMeses: number;
    frenosKm: number;
    neumaticosRotacionKm: number;
    neumaticosCambioMeses: number;
    filtroAireKm: number;
    filtroAireMeses: number;
  };
  esGenerico?: boolean;
}

/**
 * Top modelos más comunes del parque automotor argentino con sus intervalos de manual
 */
export const CATALOGO_MODELOS_ARG: ModeloAutoPreset[] = [
  {
    id: 'vw_gol_trend',
    marca: 'Volkswagen',
    modelo: 'Gol Trend / Voyage',
    motor: '1.6 MSI 8v',
    usaCadenaDistribucion: false,
    intervalos: {
      aceiteKm: 10000,
      aceiteMeses: 12,
      correaKm: 60000,
      correaMeses: 48,
      refrigeranteKm: 40000,
      refrigeranteMeses: 24,
      bateriaMeses: 36,
      frenosKm: 35000,
      neumaticosRotacionKm: 10000,
      neumaticosCambioMeses: 60,
      filtroAireKm: 15000,
      filtroAireMeses: 12,
    },
  },
  {
    id: 'fiat_cronos',
    marca: 'Fiat',
    modelo: 'Cronos / Argo',
    motor: '1.3 Firefly',
    usaCadenaDistribucion: true, // Motor Firefly usa cadena metálica "for life"
    intervalos: {
      aceiteKm: 10000,
      aceiteMeses: 12,
      refrigeranteKm: 60000,
      refrigeranteMeses: 36,
      bateriaMeses: 36,
      frenosKm: 35000,
      neumaticosRotacionKm: 10000,
      neumaticosCambioMeses: 60,
      filtroAireKm: 15000,
      filtroAireMeses: 12,
    },
  },
  {
    id: 'toyota_etios',
    marca: 'Toyota',
    modelo: 'Etios / Yaris',
    motor: '1.5 Dual VVT-i',
    usaCadenaDistribucion: true, // Cadena de distribución
    intervalos: {
      aceiteKm: 10000,
      aceiteMeses: 12,
      refrigeranteKm: 80000,
      refrigeranteMeses: 48,
      bateriaMeses: 42,
      frenosKm: 40000,
      neumaticosRotacionKm: 10000,
      neumaticosCambioMeses: 60,
      filtroAireKm: 20000,
      filtroAireMeses: 24,
    },
  },
  {
    id: 'chevrolet_classic',
    marca: 'Chevrolet',
    modelo: 'Corsa / Classic / Onix 1.4',
    motor: '1.4 8v',
    usaCadenaDistribucion: false,
    intervalos: {
      aceiteKm: 10000,
      aceiteMeses: 12,
      correaKm: 50000,
      correaMeses: 48,
      refrigeranteKm: 40000,
      refrigeranteMeses: 24,
      bateriaMeses: 36,
      frenosKm: 30000,
      neumaticosRotacionKm: 10000,
      neumaticosCambioMeses: 60,
      filtroAireKm: 15000,
      filtroAireMeses: 12,
    },
  },
  {
    id: 'peugeot_208',
    marca: 'Peugeot',
    modelo: '208 / 207 Compact',
    motor: '1.6 VTi 16v (EC5)',
    usaCadenaDistribucion: false,
    intervalos: {
      aceiteKm: 10000,
      aceiteMeses: 12,
      correaKm: 70000,
      correaMeses: 60,
      refrigeranteKm: 40000,
      refrigeranteMeses: 24,
      bateriaMeses: 36,
      frenosKm: 32000,
      neumaticosRotacionKm: 10000,
      neumaticosCambioMeses: 60,
      filtroAireKm: 15000,
      filtroAireMeses: 12,
    },
  },
  {
    id: 'renault_sandero',
    marca: 'Renault',
    modelo: 'Sandero / Stepway / Kangoo',
    motor: '1.6 16v',
    usaCadenaDistribucion: false,
    intervalos: {
      aceiteKm: 10000,
      aceiteMeses: 12,
      correaKm: 60000,
      correaMeses: 48,
      refrigeranteKm: 40000,
      refrigeranteMeses: 24,
      bateriaMeses: 36,
      frenosKm: 35000,
      neumaticosRotacionKm: 10000,
      neumaticosCambioMeses: 60,
      filtroAireKm: 15000,
      filtroAireMeses: 12,
    },
  },
  {
    id: 'ford_ka_fiesta',
    marca: 'Ford',
    modelo: 'Ka / Fiesta Kinetic',
    motor: '1.6 Sigma 16v',
    usaCadenaDistribucion: false,
    intervalos: {
      aceiteKm: 15000,
      aceiteMeses: 12,
      correaKm: 120000,
      correaMeses: 72,
      refrigeranteKm: 60000,
      refrigeranteMeses: 36,
      bateriaMeses: 36,
      frenosKm: 38000,
      neumaticosRotacionKm: 10000,
      neumaticosCambioMeses: 60,
      filtroAireKm: 15000,
      filtroAireMeses: 12,
    },
  },
  {
    id: 'toyota_hilux',
    marca: 'Toyota',
    modelo: 'Hilux',
    motor: '2.8 TDI',
    usaCadenaDistribucion: true,
    intervalos: {
      aceiteKm: 10000,
      aceiteMeses: 12,
      refrigeranteKm: 80000,
      refrigeranteMeses: 48,
      bateriaMeses: 48,
      frenosKm: 45000,
      neumaticosRotacionKm: 10000,
      neumaticosCambioMeses: 60,
      filtroAireKm: 20000,
      filtroAireMeses: 12,
    },
  },
  {
    id: 'generico_otro',
    marca: 'Otro Vehículo',
    modelo: 'Estándar Referencia',
    motor: 'Nafta / Diésel',
    usaCadenaDistribucion: false,
    esGenerico: true,
    intervalos: {
      aceiteKm: 10000,
      aceiteMeses: 12,
      correaKm: 60000,
      correaMeses: 48,
      refrigeranteKm: 40000,
      refrigeranteMeses: 24,
      bateriaMeses: 36,
      frenosKm: 35000,
      neumaticosRotacionKm: 10000,
      neumaticosCambioMeses: 60,
      filtroAireKm: 15000,
      filtroAireMeses: 12,
    },
  },
];

export interface RegistroCambioComponente {
  ultimoCambioKm?: number;
  mesesDesdeUltimoCambio?: number;
  desconocidoPorCompraUsado?: boolean;
}

export interface PerfilVehiculoUsuario {
  modeloId: string;
  anio: number;
  kmActuales: number;
  dongleConectado: boolean;
  luzTestigoDeclaradaPorUsuario: boolean;
  historial: Partial<Record<ComponenteId, RegistroCambioComponente>>;
}

export interface LecturaVivoOBD2 {
  coolantTempC: number;
  voltageV: number;
  rpm: number;
  activeDTCs: string[];
  pendingDTCs: string[];
}

export interface ComponenteEvaluado {
  id: ComponenteId;
  nombre: string;
  estado: EstadoComponente;
  fuente: FuenteDato;
  fuenteDetalle: string;
  aplicaAlModelo: boolean;
  esCritico: boolean;
  vidaConsumidaPct: number | null; // null cuando está 'sin_datos'
  intervaloReferenciaTexto: string;
  fraseCriollo: string;
  cuandoToca: string;
  queDecirleAlTaller?: string;
  magnitudCosto: 'Bajo' | 'Moderado' | 'Importante';
}

export interface ResumenChequeoMedico {
  modelo: ModeloAutoPreset;
  kmActuales: number;
  dongleConectado: boolean;
  tituloResumen: string;
  subtituloResumen: string;
  estadoGlobal: 'bien' | 'pronto' | 'revisar';
  conteo: {
    bien: number;
    pronto: number;
    revisar: number;
    sinDatos: number;
  };
  componentes: ComponenteEvaluado[];
}

function evaluarDesgaste(
  kmActuales: number,
  intervaloKm: number | undefined,
  intervaloMeses: number | undefined,
  registro?: RegistroCambioComponente
): {
  estado: EstadoComponente;
  vidaConsumidaPct: number | null;
  kmRestantes: number | null;
  mesesRestantes: number | null;
} {
  if (!registro) {
    return {
      estado: 'sin_datos',
      vidaConsumidaPct: null,
      kmRestantes: null,
      mesesRestantes: null,
    };
  }

  // Si el usuario declaró "Lo compré usado y no tengo idea si se cambió"
  if (registro.desconocidoPorCompraUsado) {
    if (intervaloKm && kmActuales >= intervaloKm * 0.85) {
      return {
        estado: 'revisar',
        vidaConsumidaPct: 100,
        kmRestantes: 0,
        mesesRestantes: 0,
      };
    }
    return {
      estado: 'pronto',
      vidaConsumidaPct: 82,
      kmRestantes: intervaloKm ? Math.max(1000, intervaloKm - kmActuales) : null,
      mesesRestantes: 2,
    };
  }

  const tieneKm = typeof registro.ultimoCambioKm === 'number' && typeof intervaloKm === 'number';
  const tieneMeses =
    typeof registro.mesesDesdeUltimoCambio === 'number' && typeof intervaloMeses === 'number';

  if (!tieneKm && !tieneMeses) {
    return {
      estado: 'sin_datos',
      vidaConsumidaPct: null,
      kmRestantes: null,
      mesesRestantes: null,
    };
  }

  const ratioKm = tieneKm
    ? Math.max(0, (kmActuales - (registro.ultimoCambioKm ?? 0)) / (intervaloKm ?? 1))
    : 0;
  const ratioMeses = tieneMeses
    ? Math.max(0, (registro.mesesDesdeUltimoCambio ?? 0) / (intervaloMeses ?? 1))
    : 0;

  const maxRatio = Math.max(ratioKm, ratioMeses);
  const vidaConsumidaPct = Math.min(130, Math.round(maxRatio * 100));

  const kmRecorridos = tieneKm ? Math.max(0, kmActuales - (registro.ultimoCambioKm ?? 0)) : 0;
  const kmRestantes = tieneKm && intervaloKm ? Math.max(0, intervaloKm - kmRecorridos) : null;
  const mesesRestantes =
    tieneMeses && intervaloMeses
      ? Math.max(0, intervaloMeses - (registro.mesesDesdeUltimoCambio ?? 0))
      : null;

  let estado: EstadoComponente = 'bien';
  if (vidaConsumidaPct >= 100) {
    estado = 'revisar';
  } else if (vidaConsumidaPct >= 75) {
    estado = 'pronto';
  }

  return {
    estado,
    vidaConsumidaPct,
    kmRestantes,
    mesesRestantes,
  };
}

function formatearCuandoToca(
  estado: EstadoComponente,
  kmRestantes: number | null,
  mesesRestantes: number | null,
  desconocido?: boolean
): string {
  if (estado === 'sin_datos') {
    return 'Sin datos todavía · Tocá para cargar cuándo se hizo el último cambio';
  }
  if (desconocido) {
    return 'No tenés registro del dueño anterior · Conviene hacerlo revisar';
  }
  if (estado === 'revisar') {
    return 'Ya superaste el intervalo recomendado · Programalo esta semana';
  }
  if (kmRestantes !== null && mesesRestantes !== null) {
    if (kmRestantes <= 2500) {
      return `Te quedan unos ${kmRestantes.toLocaleString('es-AR')} km del intervalo recomendado`;
    }
    if (mesesRestantes <= 3) {
      return `Vence en unos ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}`;
    }
    return `Te quedan unos ${kmRestantes.toLocaleString('es-AR')} km o ${mesesRestantes} meses`;
  }
  if (kmRestantes !== null) {
    return `Te quedan unos ${kmRestantes.toLocaleString('es-AR')} km del intervalo recomendado`;
  }
  if (mesesRestantes !== null) {
    return `Te quedan unos ${mesesRestantes} meses de vida útil estimada`;
  }
  return 'Dentro del intervalo recomendado';
}

export function ejecutarChequeoMedico(
  perfil: PerfilVehiculoUsuario,
  obd2Vivo?: LecturaVivoOBD2
): ResumenChequeoMedico {
  const modelo =
    CATALOGO_MODELOS_ARG.find((m) => m.id === perfil.modeloId) ??
    CATALOGO_MODELOS_ARG[0];

  const { intervalos } = modelo;
  const km = perfil.kmActuales;
  const componentes: ComponenteEvaluado[] = [];

  // 1. CORREA DE DISTRIBUCIÓN (Destacado por impacto crítico en el motor)
  if (!modelo.usaCadenaDistribucion) {
    const regCorrea = perfil.historial.correa_distribucion;
    const evalCorrea = evaluarDesgaste(
      km,
      intervalos.correaKm,
      intervalos.correaMeses,
      regCorrea
    );
    componentes.push({
      id: 'correa_distribucion',
      nombre: 'Correa de distribución',
      estado: evalCorrea.estado,
      fuente: 'estimado',
      fuenteDetalle: 'Estimado por km y fecha',
      aplicaAlModelo: true,
      esCritico: true,
      vidaConsumidaPct: evalCorrea.vidaConsumidaPct,
      intervaloReferenciaTexto: `Cada ${(intervalos.correaKm ?? 60000).toLocaleString('es-AR')} km o ${Math.round((intervalos.correaMeses ?? 48) / 12)} años`,
      fraseCriollo:
        'Sincroniza el movimiento interno del motor. Si se corta en marcha, puede dañar las válvulas por completo.',
      cuandoToca: formatearCuandoToca(
        evalCorrea.estado,
        evalCorrea.kmRestantes,
        evalCorrea.mesesRestantes,
        regCorrea?.desconocidoPorCompraUsado
      ),
      queDecirleAlTaller:
        'Quiero cotizar el cambio del kit de distribución completo (correa y tensor) y que revisen si la bomba de agua tiene juego.',
      magnitudCosto: 'Importante',
    });
  } else {
    componentes.push({
      id: 'correa_distribucion',
      nombre: 'Correa de distribución',
      estado: 'bien',
      fuente: 'estimado',
      fuenteDetalle: 'Especificación de fábrica',
      aplicaAlModelo: false,
      esCritico: false,
      vidaConsumidaPct: 0,
      intervaloReferenciaTexto: 'Usa cadena metálica (sin cambio periódico)',
      fraseCriollo: `Tu ${modelo.marca} ${modelo.modelo} (${modelo.motor}) lleva cadena metálica bañada en aceite en lugar de correa de goma.`,
      cuandoToca: 'Dura toda la vida útil del motor manteniendo el aceite al día',
      magnitudCosto: 'Bajo',
    });
  }

  // 2. ACEITE Y FILTRO DE MOTOR
  const regAceite = perfil.historial.aceite_filtro;
  const evalAceite = evaluarDesgaste(
    km,
    intervalos.aceiteKm,
    intervalos.aceiteMeses,
    regAceite
  );
  componentes.push({
    id: 'aceite_filtro',
    nombre: 'Aceite y filtro',
    estado: evalAceite.estado,
    fuente: 'estimado',
    fuenteDetalle: 'Estimado por km y fecha',
    aplicaAlModelo: true,
    esCritico: false,
    vidaConsumidaPct: evalAceite.vidaConsumidaPct,
    intervaloReferenciaTexto: `Cada ${intervalos.aceiteKm.toLocaleString('es-AR')} km o 1 año`,
    fraseCriollo:
      'Lubrica, limpia y enfría las piezas móviles del motor para que no trabajen rozando en seco.',
    cuandoToca: formatearCuandoToca(
      evalAceite.estado,
      evalAceite.kmRestantes,
      evalAceite.mesesRestantes,
      regAceite?.desconocidoPorCompraUsado
    ),
    queDecirleAlTaller:
      'Vengo por el cambio de aceite y filtro de aceite según manual. No agreguen aditivos extra ni cambien bujías sin avisarme.',
    magnitudCosto: 'Moderado',
  });

  // 3. REFRIGERANTE (AGUA) — Mixto: Estimado + Medido si hay dongle
  const regRefrig = perfil.historial.refrigerante;
  const evalRefrig = evaluarDesgaste(
    km,
    intervalos.refrigeranteKm,
    intervalos.refrigeranteMeses,
    regRefrig
  );
  let estadoRefrig = evalRefrig.estado;
  let cuandoTocaRefrig = formatearCuandoToca(
    evalRefrig.estado,
    evalRefrig.kmRestantes,
    evalRefrig.mesesRestantes,
    regRefrig?.desconocidoPorCompraUsado
  );
  let fuenteRefrig: FuenteDato = 'estimado';
  let fuenteDetalleRefrig = 'Estimado por fecha';

  if (perfil.dongleConectado && obd2Vivo) {
    fuenteRefrig = 'medido';
    fuenteDetalleRefrig = `Medido (${Math.round(obd2Vivo.coolantTempC)}°C en vivo) + fecha`;
    if (obd2Vivo.coolantTempC >= 102) {
      estadoRefrig = 'revisar';
      cuandoTocaRefrig = `Temperatura crítica ahora (${Math.round(obd2Vivo.coolantTempC)}°C) · Detené el motor en un lugar seguro`;
    } else if (obd2Vivo.coolantTempC >= 98 && estadoRefrig === 'bien') {
      estadoRefrig = 'pronto';
      cuandoTocaRefrig = `Motor exigido (${Math.round(obd2Vivo.coolantTempC)}°C) · Vigilá que prenda el electroventilador`;
    } else if (estadoRefrig === 'sin_datos') {
      cuandoTocaRefrig = `Temperatura en vivo normal (${Math.round(obd2Vivo.coolantTempC)}°C) · Falta cargar fecha del último cambio de líquido`;
    }
  }

  componentes.push({
    id: 'refrigerante',
    nombre: 'Refrigerante (agua)',
    estado: estadoRefrig,
    fuente: fuenteRefrig,
    fuenteDetalle: fuenteDetalleRefrig,
    aplicaAlModelo: true,
    esCritico: estadoRefrig === 'revisar' && !!obd2Vivo && obd2Vivo.coolantTempC >= 102,
    vidaConsumidaPct: evalRefrig.vidaConsumidaPct,
    intervaloReferenciaTexto: `Cada ${Math.round(intervalos.refrigeranteMeses / 12)} años o ${intervalos.refrigeranteKm.toLocaleString('es-AR')} km`,
    fraseCriollo:
      'Mantiene el motor a 90°C y evita que el circuito interno se oxide o se congele en invierno.',
    cuandoToca: cuandoTocaRefrig,
    queDecirleAlTaller:
      'Quiero purgar el circuito y poner líquido refrigerante preparado de calidad. No le agreguen agua común de la canilla.',
    magnitudCosto: 'Bajo',
  });

  // 4. BATERÍA — Mixto: Estimado por antigüedad + Medido parcialmente si hay dongle
  const regBat = perfil.historial.bateria;
  const evalBat = evaluarDesgaste(
    km,
    undefined,
    intervalos.bateriaMeses,
    regBat
  );
  let estadoBat = evalBat.estado;
  let cuandoTocaBat = formatearCuandoToca(
    evalBat.estado,
    null,
    evalBat.mesesRestantes,
    regBat?.desconocidoPorCompraUsado
  );
  let fuenteBat: FuenteDato = 'estimado';
  let fuenteDetalleBat = 'Estimado por antigüedad';

  if (perfil.dongleConectado && obd2Vivo) {
    fuenteBat = 'medido';
    fuenteDetalleBat = `Voltaje medido (${obd2Vivo.voltageV.toFixed(1)}V) + antigüedad`;
    if (obd2Vivo.rpm > 500 && obd2Vivo.voltageV < 13.2) {
      estadoBat = 'revisar';
      cuandoTocaBat = `El alternador no está cargando bien (${obd2Vivo.voltageV.toFixed(1)}V con motor en marcha)`;
    } else if (estadoBat === 'sin_datos') {
      cuandoTocaBat = `Carga en vivo correcta (${obd2Vivo.voltageV.toFixed(1)}V) · Cargá el año de la batería para estimar su vida útil`;
    }
  }

  componentes.push({
    id: 'bateria',
    nombre: 'Batería',
    estado: estadoBat,
    fuente: fuenteBat,
    fuenteDetalle: fuenteDetalleBat,
    aplicaAlModelo: true,
    esCritico: false,
    vidaConsumidaPct: evalBat.vidaConsumidaPct,
    intervaloReferenciaTexto: 'Entre 3 y 4 años de vida útil promedio',
    fraseCriollo:
      'Le da la fuerza eléctrica inicial al burro de arranque. Suele avisar poco antes de agotarse en los primeros días fríos.',
    cuandoToca: cuandoTocaBat,
    queDecirleAlTaller:
      'Antes de cambiar la batería, ¿me medís con el tester si el alternador está cargando entre 13.8V y 14.4V?',
    magnitudCosto: 'Moderado',
  });

  // 5. FRENOS (PASTILLAS)
  const regFrenos = perfil.historial.frenos;
  const evalFrenos = evaluarDesgaste(
    km,
    intervalos.frenosKm,
    36,
    regFrenos
  );
  componentes.push({
    id: 'frenos',
    nombre: 'Frenos (pastillas)',
    estado: evalFrenos.estado,
    fuente: 'estimado',
    fuenteDetalle: 'Estimado por km recorridos',
    aplicaAlModelo: true,
    esCritico: true,
    vidaConsumidaPct: evalFrenos.vidaConsumidaPct,
    intervaloReferenciaTexto: `Cada ${intervalos.frenosKm.toLocaleString('es-AR')} a 50.000 km según manejo`,
    fraseCriollo:
      'Pressionan contra los discos para frenar el auto. Si se gastan del todo, rayan el disco y el arreglo sale mucho más caro.',
    cuandoToca: formatearCuandoToca(
      evalFrenos.estado,
      evalFrenos.kmRestantes,
      evalFrenos.mesesRestantes,
      regFrenos?.desconocidoPorCompraUsado
    ),
    queDecirleAlTaller:
      'Revisame el espesor de las pastillas delanteras. Si todavía tienen buen material, no hace falta rectificar ni cambiar discos.',
    magnitudCosto: 'Moderado',
  });

  // 6. NEUMÁTICOS (Rotación y estado)
  const regNeum = perfil.historial.neumaticos;
  const evalNeum = evaluarDesgaste(
    km,
    intervalos.neumaticosRotacionKm,
    intervalos.neumaticosCambioMeses,
    regNeum
  );
  componentes.push({
    id: 'neumaticos',
    nombre: 'Neumáticos (rotación)',
    estado: evalNeum.estado,
    fuente: 'estimado',
    fuenteDetalle: 'Estimado por km desde rotación',
    aplicaAlModelo: true,
    esCritico: false,
    vidaConsumidaPct: evalNeum.vidaConsumidaPct,
    intervaloReferenciaTexto: `Rotar cada ${intervalos.neumaticosRotacionKm.toLocaleString('es-AR')} km · Vida útil 5 años`,
    fraseCriollo:
      'Las ruedas de adelante se gastan más rápido por el peso del motor y la dirección. Rotarlas a tiempo estira su duración.',
    cuandoToca: formatearCuandoToca(
      evalNeum.estado,
      evalNeum.kmRestantes,
      evalNeum.mesesRestantes,
      regNeum?.desconocidoPorCompraUsado
    ),
    queDecirleAlTaller:
      'Quiero hacer rotación y balanceo de las 4 cubiertas. Avisame antes si realmente necesita alineación.',
    magnitudCosto: 'Bajo',
  });

  // 7. FILTRO DE AIRE
  const regFiltro = perfil.historial.filtro_aire;
  const evalFiltro = evaluarDesgaste(
    km,
    intervalos.filtroAireKm,
    intervalos.filtroAireMeses,
    regFiltro
  );
  componentes.push({
    id: 'filtro_aire',
    nombre: 'Filtro de aire',
    estado: evalFiltro.estado,
    fuente: 'estimado',
    fuenteDetalle: 'Estimado por km',
    aplicaAlModelo: true,
    esCritico: false,
    vidaConsumidaPct: evalFiltro.vidaConsumidaPct,
    intervaloReferenciaTexto: `Cada ${intervalos.filtroAireKm.toLocaleString('es-AR')} km o 1 año`,
    fraseCriollo:
      'Evita que entre polvo y tierra a los cilindros. Si está tapado, el motor se ahoga y gasta más nafta.',
    cuandoToca: formatearCuandoToca(
      evalFiltro.estado,
      evalFiltro.kmRestantes,
      evalFiltro.mesesRestantes,
      regFiltro?.desconocidoPorCompraUsado
    ),
    queDecirleAlTaller:
      'Cambialo solo si está sucio o cumplió los kilómetros. Es un repuesto económico y se cambia en 5 minutos.',
    magnitudCosto: 'Bajo',
  });

  // 8. LUCES Y TESTIGOS DEL TABLERO
  const dtcsActivos =
    perfil.dongleConectado && obd2Vivo
      ? [...obd2Vivo.activeDTCs, ...obd2Vivo.pendingDTCs]
      : [];
  const hayTestigo = dtcsActivos.length > 0 || perfil.luzTestigoDeclaradaPorUsuario;

  componentes.push({
    id: 'luces_testigos',
    nombre: 'Luces y testigos',
    estado: hayTestigo ? 'revisar' : 'bien',
    fuente: perfil.dongleConectado ? 'medido' : 'estimado',
    fuenteDetalle: perfil.dongleConectado
      ? 'Medido por escáner OBD2'
      : 'Declarado por vos',
    aplicaAlModelo: true,
    esCritico: hayTestigo,
    vidaConsumidaPct: hayTestigo ? 100 : 10,
    intervaloReferenciaTexto: 'Monitoreo continuo de alertas',
    fraseCriollo:
      'Las luces del tablero avisan si un sensor de inyección, encendido o emisiones salió de su rango normal.',
    cuandoToca: hayTestigo
      ? perfil.dongleConectado && dtcsActivos.includes('P0302')
        ? 'Alerta detectada: Falla de chispa en un cilindro (bujía o bobina)'
        : 'Hay un testigo encendido en el tablero · Conviene escanearlo antes de viajar'
      : 'Sin luces de alerta encendidas en el tablero',
    queDecirleAlTaller:
      'Se prendió el testigo de motor. Quiero que primero lo escaneen y me digan qué código arroja antes de desarmar o cambiar piezas.',
    magnitudCosto: 'Moderado',
  });

  // Filtrar los que aplican al modelo para el conteo principal
  const visibles = componentes.filter((c) => c.aplicaAlModelo);
  const conteo = {
    bien: visibles.filter((c) => c.estado === 'bien').length,
    pronto: visibles.filter((c) => c.estado === 'pronto').length,
    revisar: visibles.filter((c) => c.estado === 'revisar').length,
    sinDatos: visibles.filter((c) => c.estado === 'sin_datos').length,
  };

  let estadoGlobal: 'bien' | 'pronto' | 'revisar' = 'bien';
  let tituloResumen = 'Todo en orden para manejar tranquilo';

  if (conteo.revisar > 0) {
    estadoGlobal = 'revisar';
    tituloResumen =
      conteo.revisar === 1
        ? '1 componente necesita revisión'
        : `${conteo.revisar} componentes necesitan revisión`;
  } else if (conteo.pronto > 0) {
    estadoGlobal = 'pronto';
    tituloResumen =
      conteo.pronto === 1
        ? 'Todo en orden · 1 cosa para programar'
        : `Todo en orden · ${conteo.pronto} cosas para programar`;
  }

  const partesSub: string[] = [];
  if (conteo.bien > 0) partesSub.push(`${conteo.bien} al día`);
  if (conteo.pronto > 0) partesSub.push(`${conteo.pronto} pronto`);
  if (conteo.revisar > 0) partesSub.push(`${conteo.revisar} para revisar`);
  if (conteo.sinDatos > 0) partesSub.push(`${conteo.sinDatos} sin datos cargados`);

  return {
    modelo,
    kmActuales: km,
    dongleConectado: perfil.dongleConectado,
    tituloResumen,
    subtituloResumen: partesSub.join(' · '),
    estadoGlobal,
    conteo,
    componentes,
  };
}
