---
name: kinetic-telematics-ui
description: Sistema de Diseño Oficial "Kinetic Telematics" para Tu-Auto. Define tokens de color, tipografía Outfit/Manrope, geometría de tarjetas, uso obligatorio de iconos vectoriales modernos (Lucide / Material Symbols SVG) y PROHIBICIÓN ESTRICTA de emojis en la interfaz.
---

# 🎨 Skill: Sistema de Diseño "Kinetic Telematics" (Cero Emojis + Iconos Vectoriales)

Esta skill es **obligatoria** para cualquier Agente de IA que cree o modifique componentes visuales, pantallas o estilos en `app-mobile/`. Está basada en la especificación oficial de Google Stitch (`Kinetic Telematics`).

---

## 1. Regla Inquebrantable: PROHIBIDO USAR EMOJIS EN LA INTERFAZ (`ZERO EMOJIS`)

* ❌ **PROHIBIDO:** Usar emojis de texto (`🚗`, `🔥`, `⚡`, `🛢️`, `🌡️`, `🔍`, `💸`, `✅`, `⚠️`, `⚙️`) en cualquier componente de React Native o Web. Los emojis rompen la estética profesional fintech/automotriz y se ven distintos en cada sistema operativo.
* ✅ **OBLIGATORIO:** Usar exclusivamente **iconos vectoriales SVG de trazo limpio** (`lucide-react-native` o componentes `Svg` de `react-native-svg` inspirados en *Material Symbols Outlined / Lucide* con `strokeWidth={2}`), alojados dentro de contenedores squircle (`borderRadius: 12` a `16`) o circulares con fondos pastel.

---

## 2. Filosofía Visual: "Modern Fintech meets Elevated Telematics"

El diseño posiciona el cuidado del auto como una experiencia tranquila, transparente y sin ansiedad:
* **Cero ruido visual:** Prohibido apilar textos largos o tablas técnicas. Cada pantalla tiene un único foco visual principal, espacio libre generoso y jerarquía tipográfica limpia.
* **Elevación suave:** Las tarjetas blancas (`#FFFFFF`) flotan sobre un lienzo lavanda-perla muy sutil (`#FCF8FF` / `#F6F2FF`) con sombras difusas tintadas en índigo (`rgba(24, 20, 69, 0.04)`), sin bordes oscuros ni recuadros pesados.

---

## 3. Paleta de Colores Oficial (`Kinetic Telematics Tokens`)

```typescript
export const KINETIC_TOKENS = {
  // Superficies y Fondos
  surface: '#FCF8FF',                 // Lienzo principal de la app
  surfaceContainerLowest: '#FFFFFF',  // Tarjetas blancas principales
  surfaceContainerLow: '#F6F2FF',     // Bloques secundarios suaves
  surfaceContainer: '#EFEBFF',        // Píldoras e indicadores neutros
  surfaceContainerHigh: '#E9E5FF',    // Tab activa y badges destacados
  surfaceContainerHighest: '#E3DFFF',

  // Textos y Contornos
  onSurface: '#181445',               // Azul noche profundo (reemplaza al negro puro)
  onSurfaceVariant: '#464554',        // Texto secundario y subtítulos
  outline: '#777586',
  outlineVariant: '#C7C4D7',

  // Acentos Primarios y Hero Stage
  primary: '#2A14B4',
  primaryContainer: '#4338CA',
  secondary: '#4648D4',
  secondaryContainer: '#6063EE',
  secondaryFixed: '#E1E0FF',
  heroGradient: ['#6366F1', '#5148D7', '#372ABF'],

  // Acentos Funcionales Pastel (Icon Vessels & Estados)
  mintBg: '#DCFCE7',
  mintIcon: '#15803D',
  mintDot: '#16A34A',
  emeraldAlive: '#34D399',

  skyBg: '#E0F2FE',
  skyIcon: '#0284C7',
  tertiaryFixed: '#ACEDFF',
  tertiaryFixedDim: '#4CD7F6',
  tertiary: '#00414D',

  amberSurface: '#FFFDF7',
  amberBg: '#FEF3C7',
  amberIcon: '#D97706',
  amberTextDark: '#B45309',

  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',
};
```

---

## 4. Tipografía y Jerarquía (`Outfit` + `Manrope`)

* **Títulos y Encabezados (`Outfit` / Geometric Sans):**
  * `headline-xl`: `32px`, `fontWeight: '700'`, `letterSpacing: -0.6` (Montos principales como `$75.000`).
  * `headline-lg`: `24px`, `fontWeight: '600'`, `letterSpacing: -0.4` (Títulos de sección como `Salud del Auto`, `Mi Bolsillo`).
  * `headline-md`: `20px`, `fontWeight: '600'` (Nombre del encabezado superior y títulos de tarjeta).
  * `headline-sm`: `16px`, `fontWeight: '600'` (Subtítulos de tarjetas y nombres de mantenimientos).
  * `label-caps`: `11px`, `fontWeight: '700'`, `letterSpacing: 0.9`, `uppercase` (Etiquetas de sección como `BUEN DÍA`, `SEGUIMIENTO`, `PRÓXIMO MANTENIMIENTO`, `CALENDARIO INTELIGENTE`).
* **Cuerpo y Números Tabulares (`Manrope`):**
  * `body-md`: `14px`, `fontWeight: '500'`, `lineHeight: 20`.
  * `body-sm`: `12px`, `fontWeight: '500'`, `lineHeight: 16`.
  * `label-md`: `13px`, `fontWeight: '600'`.

---

## 5. Estructura de las 3 Pantallas Oficiales

1. **Pantalla 1: `Resumen` (`DashboardScreen.tsx`)**
   * **Header Fijo Translúcido:** `BUEN DÍA` + `Resumen` a la izquierda; botón de campana vectorial con punto rojo de notificación + avatar circular primario con icono `User` a la derecha.
   * **Hero Vehicle Stage (`rounded-[28px]`):** Gradiente índigo (`#6366F1` $\rightarrow$ `#372ABF`), círculos concéntricos blancos translúcidos detrás del vehículo, píldora superior izquierda (`VW Gol 2021 • Conectado` + `ChevronRight`), botón circular superior derecho con icono `Settings` vectorial, título `Volkswagen Gol Trend` (`1.6 MSI • Azul Índigo`), **Ilustración Vectorial SVG del Auto** con sombra difusa inferior, y barra inferior dividida por línea sutil (`border-white/10`) con estado `Estacionado / En marcha` + icono `MapPin` (`Palermo, Buenos Aires`) y `Actualizado ahora`.
   * **Sección `SEGUIMIENTO` (Grilla de 3 Tarjetas Iguales):**
     1. Icono vectorial `Activity`/`Timeline` en contenedor verde menta (`#DCFCE7`) $\rightarrow$ `Kilómetros` / `Eléctrico` (`84.320 km` / `14.1 V`).
     2. Icono vectorial `Fuel`/`Thermometer` en contenedor celeste (`#E0F2FE`) $\rightarrow$ `Agua / Temp` (`90°C` • `Normal`).
     3. Icono vectorial `Wrench` en contenedor ámbar (`#FEF3C7`) $\rightarrow$ `Próx. service` (`En 18 días` • `Programar`).
   * **Banner de Próximo Mantenimiento (`#FFFDF7`):** Contenedor cuadrado redondeado ámbar (`#FEF3C7`) con icono `Clock`, etiqueta `PRÓXIMO MANTENIMIENTO`, título `Cambio de aceite y revisión`, subtítulo `En 18 días • Estimado $65.000` y botón circular blanco con `ChevronRight`.
   * **Barra Rápida Inferior (`#F6F2FF`):** Icono `Gauge`/`BatteryCharging` + estado rápido con badge `OK` en verde menta.

2. **Pantalla 2: `Salud` (`ScannerScreen.tsx`)**
   * Encabezado `Diagnóstico en tiempo real` + `Salud del Auto` + píldora `VW Gol 2021 • Conectado`.
   * Tarjeta principal blanca con badge preventivo, icono vectorial `Zap` en círculo ámbar, título claro (`Una bujía está empezando a fallar`), explicación breve y sub-bloque de tranquilidad con icono `CheckCircle2`.
   * **Comparativa de Costos Reales (2 Columnas):**
     * Columna izquierda (`#ECFDF5`): `ARREGLARLO HOY` $\rightarrow$ `$75.000` + icono `Clock` (`40 min en taller`).
     * Columna derecha (`#FFDAD6`): `SI LO DEJÁS PASAR` $\rightarrow$ `$650.000` + icono `AlertTriangle` (`Daña catalizador`).
   * Banner de ahorro con icono `PiggyBank` (`Ahorrás $575.000 arreglando a tiempo`).
   * Bloque educativo `¿Por qué pasa esto?` con icono `Lightbulb`.
   * Botón principal redondeado (`#4338CA`) con icono `Store` + `ArrowRight` (`Ver talleres recomendados cerca`) y acción secundaria con icono `Clock`/`Alarm` (`Recordármelo el fin de semana`).

3. **Pantalla 3: `Guía Taller` (`WalletScreen.tsx`)**
   * Resumen para el mecánico, lista de ítems a programar con magnitud relativa, escudo de componentes que todavía tienen vida útil y proporción `1x` vs `8x a 12x`.

---

## 6. Patrones Modernos de UX Mobile (iOS Floating Sheet + Duolingo + Mercado Pago)

1. **PROHIBIDO Agrandar Tarjetas Inline (`Zero Layout Shift`):**
   * Al tocar la tuerca de configuración del auto (`Settings`), el selector de modelo o el botón para registrar el cambio de un componente, **JAMÁS** se debe expandir un `div` dentro de la misma tarjeta deformando la pantalla.
2. **Burbujas Cuadradas Flotantes desde Abajo (`iOS Floating Bottom Sheet`):**
   * Toda configuración rápida (cambiar color de pintura del auto, cambiar modelo/km o registrar el último service de un componente) debe emerger desde abajo como una **burbuja cuadrada redondeada flotante** (`borderRadius: 32`, separada de los bordes con `marginHorizontal: 12`, `marginBottom: 14`).
   * **Fondo Oscurecido (`Backdrop Scrim`):** El fondo detrás de la burbuja debe oscurecerse suavemente (`rgba(15, 11, 46, 0.58)`) con cierre instantáneo al tocar afuera.
   * **Píldora Superior (`Drag Handle`):** Indicador horizontal centrado (`width: 42, height: 5, borderRadius: 999`) en la parte superior de la burbuja.
3. **Vista Previa en Vivo dentro de la Burbuja (`Interactive Garage Preview`):**
   * Cuando el usuario abre la tuerca del auto, la burbuja flotante muestra un mini-escenario con el auto 3D/SVG en vivo que cambia de pintura y de modelo instantáneamente al tocar cada color o marca.
4. **Botones y Tarjetas Táctiles (`Duolingo & Mercado Pago Tactile Feel`):**
   * Las opciones de selección usan tarjetas redondeadas con relieve táctil (`borderBottomWidth: 3` o `4`), iconos claros, micro-feedback inmediato y un único botón primario contundente al pie de la burbuja.

