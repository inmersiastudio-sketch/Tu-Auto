/**
 * Motor del "Chequeo Médico" Vehicular (8 Componentes + Base de Modelos Argentina)
 * Textos breves, directos y sin jerga.
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
  usaCadenaDistribucion: boolean;
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

export const CATALOGO_MODELOS_ARG: ModeloAutoPreset[] = [
  {
    id: 'vw_gol_trend',
    marca: 'VW',
    modelo: 'Gol Trend',
    motor: '1.6 MSI',
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
    modelo: 'Cronos',
    motor: '1.3 Firefly',
    usaCadenaDistribucion: true,
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
    modelo: 'Etios',
    motor: '1.5 16v',
    usaCadenaDistribucion: true,
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
    modelo: 'Classic / Onix',
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
    modelo: '208',
    motor: '1.6 VTi',
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
    modelo: 'Sandero',
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
    modelo: 'Ka / Fiesta',
    motor: '1.6 Sigma',
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
    marca: 'Otro',
    modelo: 'Estándar',
    motor: 'General',
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
  vidaConsumidaPct: number | null;
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

  const tieneKm =
    typeof registro.ultimoCambioKm === 'number' &&
    typeof intervaloKm === 'number';
  const tieneMeses =
    typeof registro.mesesDesdeUltimoCambio === 'number' &&
    typeof intervaloMeses === 'number';

  if (!tieneKm && !tieneMeses) {
    return {
      estado: 'sin_datos',
      vidaConsumidaPct: null,
      kmRestantes: null,
      mesesRestantes: null,
    };
  }

  const ratioKm = tieneKm
    ? Math.max(
        0,
        (kmActuales - (registro.ultimoCambioKm ?? 0)) / (intervaloKm ?? 1)
      )
    : 0;
  const ratioMeses = tieneMeses
    ? Math.max(
        0,
        (registro.mesesDesdeUltimoCambio ?? 0) / (intervaloMeses ?? 1)
      )
    : 0;

  const maxRatio = Math.max(ratioKm, ratioMeses);
  const vidaConsumidaPct = Math.min(130, Math.round(maxRatio * 100));

  const kmRecorridos = tieneKm
    ? Math.max(0, kmActuales - (registro.ultimoCambioKm ?? 0))
    : 0;
  const kmRestantes =
    tieneKm && intervaloKm ? Math.max(0, intervaloKm - kmRecorridos) : null;
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
    return 'Tocá para cargar último cambio';
  }
  if (desconocido) {
    return 'Sin registro previo · Conviene revisar';
  }
  if (estado === 'revisar') {
    return 'Intervalo cumplido · Programar cambio';
  }
  if (kmRestantes !== null && kmRestantes <= 4000) {
    return `Te quedan ~${kmRestantes.toLocaleString('es-AR')} km`;
  }
  if (mesesRestantes !== null && mesesRestantes <= 4) {
    return `Vence en ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}`;
  }
  if (kmRestantes !== null) {
    return `Quedan ~${kmRestantes.toLocaleString('es-AR')} km`;
  }
  if (mesesRestantes !== null) {
    return `Quedan ~${mesesRestantes} meses`;
  }
  return 'Al día';
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

  // 1. CORREA DE DISTRIBUCIÓN
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
      fuenteDetalle: 'Estimado',
      aplicaAlModelo: true,
      esCritico: true,
      vidaConsumidaPct: evalCorrea.vidaConsumidaPct,
      intervaloReferenciaTexto: `Cada ${((intervalos.correaKm ?? 60000) / 1000).toFixed(0)}k km`,
      fraseCriollo: 'Sincroniza el motor. Si se corta, lo daña.',
      cuandoToca: formatearCuandoToca(
        evalCorrea.estado,
        evalCorrea.kmRestantes,
        evalCorrea.mesesRestantes,
        regCorrea?.desconocidoPorCompraUsado
      ),
      queDecirleAlTaller:
        'Quiero cotizar el cambio del kit de distribución completo (correa y tensor).',
      magnitudCosto: 'Importante',
    });
  } else {
    componentes.push({
      id: 'correa_distribucion',
      nombre: 'Correa de distribución',
      estado: 'bien',
      fuente: 'estimado',
      fuenteDetalle: 'Fábrica',
      aplicaAlModelo: false,
      esCritico: false,
      vidaConsumidaPct: 0,
      intervaloReferenciaTexto: 'Usa cadena metálica',
      fraseCriollo: 'Tu motor lleva cadena metálica: no requiere cambio periódico.',
      cuandoToca: 'Dura toda la vida del motor',
      magnitudCosto: 'Bajo',
    });
  }

  // 2. ACEITE Y FILTRO
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
    fuenteDetalle: 'Estimado',
    aplicaAlModelo: true,
    esCritico: false,
    vidaConsumidaPct: evalAceite.vidaConsumidaPct,
    intervaloReferenciaTexto: `Cada ${(intervalos.aceiteKm / 1000).toFixed(0)}k km o 1 año`,
    fraseCriollo: 'Lubrica y protege las piezas internas del motor.',
    cuandoToca: formatearCuandoToca(
      evalAceite.estado,
      evalAceite.kmRestantes,
      evalAceite.mesesRestantes,
      regAceite?.desconocidoPorCompraUsado
    ),
    queDecirleAlTaller:
      'Vengo por cambio de aceite y filtro según manual, sin aditivos extra.',
    magnitudCosto: 'Moderado',
  });

  // 3. REFRIGERANTE (AGUA)
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

  if (perfil.dongleConectado && obd2Vivo) {
    fuenteRefrig = 'medido';
    if (obd2Vivo.coolantTempC >= 102) {
      estadoRefrig = 'revisar';
      cuandoTocaRefrig = `Alerta: ${Math.round(obd2Vivo.coolantTempC)}°C · Frená el auto`;
    } else {
      cuandoTocaRefrig = `${Math.round(obd2Vivo.coolantTempC)}°C en vivo · ${cuandoTocaRefrig}`;
    }
  }

  componentes.push({
    id: 'refrigerante',
    nombre: 'Líquido refrigerante',
    estado: estadoRefrig,
    fuente: fuenteRefrig,
    fuenteDetalle: fuenteRefrig === 'medido' ? 'Medido' : 'Estimado',
    aplicaAlModelo: true,
    esCritico: estadoRefrig === 'revisar',
    vidaConsumidaPct: evalRefrig.vidaConsumidaPct,
    intervaloReferenciaTexto: `Cada ${Math.round(intervalos.refrigeranteMeses / 12)} años`,
    fraseCriollo: 'Mantiene el motor en 90°C y evita el óxido interno.',
    cuandoToca: cuandoTocaRefrig,
    queDecirleAlTaller:
      'Quiero purgar el circuito y poner refrigerante orgánico preparado.',
    magnitudCosto: 'Bajo',
  });

  // 4. BATERÍA
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

  if (perfil.dongleConectado && obd2Vivo) {
    fuenteBat = 'medido';
    if (obd2Vivo.rpm > 500 && obd2Vivo.voltageV < 13.2) {
      estadoBat = 'revisar';
      cuandoTocaBat = `Alternador bajo (${obd2Vivo.voltageV.toFixed(1)}V)`;
    } else {
      cuandoTocaBat = `${obd2Vivo.voltageV.toFixed(1)}V en vivo · ${cuandoTocaBat}`;
    }
  }

  componentes.push({
    id: 'bateria',
    nombre: 'Batería',
    estado: estadoBat,
    fuente: fuenteBat,
    fuenteDetalle: fuenteBat === 'medido' ? 'Medido' : 'Estimado',
    aplicaAlModelo: true,
    esCritico: false,
    vidaConsumidaPct: evalBat.vidaConsumidaPct,
    intervaloReferenciaTexto: '3 a 4 años',
    fraseCriollo: 'Energía para el arranque, sobre todo en invierno.',
    cuandoToca: cuandoTocaBat,
    queDecirleAlTaller:
      'Antes de cambiar la batería, medime si el alternador carga bien (14V).',
    magnitudCosto: 'Moderado',
  });

  // 5. FRENOS
  const regFrenos = perfil.historial.frenos;
  const evalFrenos = evaluarDesgaste(km, intervalos.frenosKm, 36, regFrenos);
  componentes.push({
    id: 'frenos',
    nombre: 'Frenos (pastillas)',
    estado: evalFrenos.estado,
    fuente: 'estimado',
    fuenteDetalle: 'Estimado',
    aplicaAlModelo: true,
    esCritico: true,
    vidaConsumidaPct: evalFrenos.vidaConsumidaPct,
    intervaloReferenciaTexto: `Cada ${(intervalos.frenosKm / 1000).toFixed(0)}k km`,
    fraseCriollo: 'Si se gastan del todo, rayan los discos de freno.',
    cuandoToca: formatearCuandoToca(
      evalFrenos.estado,
      evalFrenos.kmRestantes,
      evalFrenos.mesesRestantes,
      regFrenos?.desconocidoPorCompraUsado
    ),
    queDecirleAlTaller:
      'Revisame el espesor de pastillas delanteras antes de tocar los discos.',
    magnitudCosto: 'Moderado',
  });

  // 6. NEUMÁTICOS
  const regNeum = perfil.historial.neumaticos;
  const evalNeum = evaluarDesgaste(
    km,
    intervalos.neumaticosRotacionKm,
    intervalos.neumaticosCambioMeses,
    regNeum
  );
  componentes.push({
    id: 'neumaticos',
    nombre: 'Neumáticos',
    estado: evalNeum.estado,
    fuente: 'estimado',
    fuenteDetalle: 'Estimado',
    aplicaAlModelo: true,
    esCritico: false,
    vidaConsumidaPct: evalNeum.vidaConsumidaPct,
    intervaloReferenciaTexto: 'Rotar c/10k km',
    fraseCriollo: 'Rotar las ruedas a tiempo alarga su duración.',
    cuandoToca: formatearCuandoToca(
      evalNeum.estado,
      evalNeum.kmRestantes,
      evalNeum.mesesRestantes,
      regNeum?.desconocidoPorCompraUsado
    ),
    queDecirleAlTaller:
      'Quiero hacer rotación y balanceo. Avisame antes si requiere alineación.',
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
    fuenteDetalle: 'Estimado',
    aplicaAlModelo: true,
    esCritico: false,
    vidaConsumidaPct: evalFiltro.vidaConsumidaPct,
    intervaloReferenciaTexto: `Cada ${(intervalos.filtroAireKm / 1000).toFixed(0)}k km`,
    fraseCriollo: 'Limpia el aire que entra al motor y cuida el consumo.',
    cuandoToca: formatearCuandoToca(
      evalFiltro.estado,
      evalFiltro.kmRestantes,
      evalFiltro.mesesRestantes,
      regFiltro?.desconocidoPorCompraUsado
    ),
    queDecirleAlTaller: 'Cambialo solo si está sucio o cumplió los kilómetros.',
    magnitudCosto: 'Bajo',
  });

  // 8. LUCES Y TESTIGOS
  const dtcsActivos =
    perfil.dongleConectado && obd2Vivo
      ? [...obd2Vivo.activeDTCs, ...obd2Vivo.pendingDTCs]
      : [];
  const hayTestigo =
    dtcsActivos.length > 0 || perfil.luzTestigoDeclaradaPorUsuario;

  componentes.push({
    id: 'luces_testigos',
    nombre: 'Testigos del tablero',
    estado: hayTestigo ? 'revisar' : 'bien',
    fuente: perfil.dongleConectado ? 'medido' : 'estimado',
    fuenteDetalle: perfil.dongleConectado ? 'Medido' : 'Manual',
    aplicaAlModelo: true,
    esCritico: hayTestigo,
    vidaConsumidaPct: hayTestigo ? 100 : 0,
    intervaloReferenciaTexto: 'Estado actual',
    fraseCriollo: 'Luces de aviso de sensores en el tablero.',
    cuandoToca: hayTestigo
      ? 'Hay una luz encendida en el tablero'
      : 'Sin luces de alerta encendidas',
    queDecirleAlTaller:
      'Escaneá qué código marca la luz antes de cambiar ningún repuesto.',
    magnitudCosto: 'Moderado',
  });

  const visibles = componentes.filter((c) => c.aplicaAlModelo);
  const conteo = {
    bien: visibles.filter((c) => c.estado === 'bien').length,
    pronto: visibles.filter((c) => c.estado === 'pronto').length,
    revisar: visibles.filter((c) => c.estado === 'revisar').length,
    sinDatos: visibles.filter((c) => c.estado === 'sin_datos').length,
  };

  let estadoGlobal: 'bien' | 'pronto' | 'revisar' = 'bien';
  let tituloResumen = 'Todo en orden';

  if (conteo.revisar > 0) {
    estadoGlobal = 'revisar';
    tituloResumen =
      conteo.revisar === 1
        ? '1 ítem para revisar'
        : `${conteo.revisar} ítems para revisar`;
  } else if (conteo.pronto > 0) {
    estadoGlobal = 'pronto';
    tituloResumen =
      conteo.pronto === 1
        ? 'Todo en orden · 1 por programar'
        : `Todo en orden · ${conteo.pronto} por programar`;
  }

  return {
    modelo,
    kmActuales: km,
    dongleConectado: perfil.dongleConectado,
    tituloResumen,
    subtituloResumen: `${conteo.bien} bien · ${conteo.pronto} pronto · ${conteo.sinDatos} sin datos`,
    estadoGlobal,
    conteo,
    componentes,
  };
}
