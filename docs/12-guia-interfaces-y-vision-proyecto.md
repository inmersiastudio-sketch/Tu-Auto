# 🚗 Tu-Auto — Visión del Proyecto y Guía Maestra de Interfaces "Kinetic Telematics"

> **Copiloto Vehicular Inteligente OBD2 & Predictor Financiero de Mantenimiento**  
> *Versión Oficial del Sistema — Arquitectura Expo SDK 52 + Supabase + Kinetic Telematics*

---

## 1. ¿Qué Buscamos con el Proyecto? (Misión y Propuesta de Valor)

El 92% de los conductores latinoamericanos experimentan **ansiedad, incertidumbre o desconfianza** cuando se enciende una luz en el tablero de su auto o cuando tienen que llevar el vehículo al taller mecánico. 

Los problemas habituales son:
1. **Jerga incomprensible:** Códigos crudos como `P0302`, `Sensor MAF`, `Fuel Trim Bank 1` o agujas analógicas que ocultan lo que realmente pasa.
2. **Asimetría de información y "Efecto Estafa":** El taller puede cobrar \$500.000 por una reparación mayor cuando en realidad el problema era una bujía de \$45.000 o una manguera suelta.
3. **Mantenimiento reactivo:** La gente repara cuando el auto ya se rompió y los costos se multiplicaron por diez.

### La Misión de `Tu-Auto`:
> **Transformar las señales ocultas del auto en tranquilidad y previsibilidad financiera para la billetera del conductor.**

### Los 3 Pilares del Producto:
1. **Regla de Oro: "Cero Jerga Mecánica":**  
   Ningún usuario final ve un código alfanumérico sin su traducción directa a lenguaje cotidiano rioplatense/latinoamericano y su impacto monetario en pesos.
2. **El Escudo Anti-Estafas (Doble Precio):**  
   Cada diagnóstico muestra siempre dos columnas:
   * **Arreglarlo hoy:** Precio justo de repuesto + mano de obra típica.
   * **Si lo dejás pasar:** Consecuencia mecánica grave y cuánto costará la rotura posterior.
3. **Previsión Financiera ("Mi Bolsillo"):**  
   Un planificador inteligente que calcula cuánto dinero conviene separar por mes para que los services y mantenimientos nunca sean un imprevisto sorpresivo.

---

## 2. Filosofía Visual: ¿Por qué la Interfaz es "Amigable" y Sin Emojis?

Siguiendo el sistema de diseño **Kinetic Telematics** (diseñado y exportado desde Google Stitch):

* **Daylight-First (`#FCF8FF`):** A diferencia de las apps de escáner tradicionales (negras, intimidantes y llenas de gráficos de carreras ilegibles), Tu-Auto utiliza un fondo diurno, limpio, cálido y elegante, que transmite paz mental y transparencia.
* **Hero Card Índigo Eléctrico (`#6366F1` $\rightarrow$ `#372ABF`):** Una tarjeta protagónica con profundidad sutil que destaca la silueta del vehículo con iluminación de estudio y anillos concéntricos.
* **Prohibición Absoluta de Emojis:** Los emojis (`🚗`, `⚡`, `🌡️`, `🛢️`, `💰`) restan profesionalismo y generan ruido visual. Tu-Auto emplea exclusivamente **iconos vectoriales premium de Lucide** (`lucide-react-native`) y trazados `react-native-svg` con grosores balanceados (`strokeWidth={2}`).
* **Personalización del Auto:** El usuario puede seleccionar el color real de su vehículo (*Azul Índigo, Blanco Puro, Gris Platino, Rojo Tornado o Negro Ninja*) aumentando el sentido de pertenencia y familiaridad.

---

## 3. Desglose Pantalla por Pantalla

### 📱 Pantalla 1: Resumen de Tu Auto (`DashboardScreen`)
**Objetivo:** Brindar un vistazo rápido del estado general en menos de 3 segundos al subir al vehículo.

* **Top App Bar:**  
  * Saludo (`BUEN DÍA`) y título `Resumen`.  
  * Botón de notificaciones con punto de alerta dinámico y avatar de perfil.
* **Barra de Simulación OBD2 colapsable (`DemoControlBar`):**  
  * Permite demostrar o probar la app en vivo alternando entre 6 escenarios mecánicos reales con un toque (*Auto al 100%, Bujía gastada, Agua a 105°C, Alternador en falla, Batería débil o Fraude de auto usado*).
* **Escaparate del Auto (`Car3DShowcase`):**  
  * Píldora de conectividad en tiempo real: `VW Gol 2021 • Conectado` con punto de estado verde/ámbar/rojo.  
  * Selector de color del vehículo integrado con la ruedita de configuración.  
  * Silueta vectorial del auto con sombreado y faros LED.  
  * Barra inferior: Ubicación (`Palermo, Buenos Aires`), estado (`Estacionado` o `En marcha con RPM`) y tiempo de última sincronización.
* **Sección de Seguimiento (3 Tarjetas Limpias):**  
  1. *Kilómetros:* Odómetro real acumulado y kilómetros de la semana.
  2. *Motor / Agua:* Temperatura grado por grado (ej. `90°C`) y aviso de estabilidad.
  3. *Próximo Service:* Cuenta regresiva en km y porcentaje de vida útil del aceite.
* **Banner de Mantenimiento Preventivo:**  
  * Tarjeta ámbar suave que avisa con anticipación el próximo cambio de fluidos o el diagnóstico detectado, con acceso directo en 1 toque.
* **Tarjeta de Salud Eléctrica Rápida:**  
  * Monitor del alternador y voltaje instantáneo con badge verde de confirmación `OK`.

---

### 🩺 Pantalla 2: Salud del Auto & Diagnóstico Simple (`ScannerScreen`)
**Objetivo:** Traducir cualquier falla interna de la computadora del auto a una recomendación humana con cotización precisa para que el mecánico no pueda engañar al usuario.

* **Estado Normal (Motor al 100%):**  
  * Tarjeta blanca con escudo verde, felicitando al conductor porque no hay fallas activas ni preventivas silenciosas registradas.
* **Tarjeta de Diagnóstico Anti-Estafas (`AntiScamFaultCard`):**  
  * **Píldora de Severidad Amigable:** *Atención preventiva • Podés seguir manejando sin apuro* (Amarillo) o *Atención inmediata • Detené la marcha* (Rojo).
  * **Título Coloquial:** Ej. *"Falla de chispa en el Cilindro 2 (Bujía o Bobina)"* en vez de `P0302`.
  * **Caja de Tranquilidad:** *"No te vas a quedar tirado hoy. Podés volver a tu casa sin pisar a fondo."*
  * **Comparativa de Costos Reales (Dos Columnas):**  
    * *ARREGLARLO HOY:* `$75.000` (Juego de bujías nuevas + 45 min mano de obra).  
    * *SI LO DEJÁS PASAR:* `$650.000` (La nafta cruda derrite el catalizador en el caño de escape).  
  * **Píldora de Ahorro Destacado:** *"Ahorrás $575.000 arreglando a tiempo"*.
  * **Guía para el Taller ("Qué pedir"):** Explica qué repuestos son necesarios para evitar que cobren desarmes innecesarios.
  * **Acciones:** Botón para ver talleres recomendados con precio pre-aprobado y botón de recordatorio para el fin de semana.

---

### 💰 Pantalla 3: Mi Bolsillo & Previsión Financiera (`WalletScreen`)
**Objetivo:** Transformar el mantenimiento del automóvil en una cuota mensual previsible y evitar deudas por reparaciones de emergencia.

* **Hero Card de Ahorro Inteligente:**  
  * Plan Semestral: *"Para no tener sorpresas este semestre, separá $35.000 / mes"*.  
  * Barra de progreso con acumulado y botón interactivo para *"Simular aporte (+ $17.500)"*.
* **Calendario Inteligente:**  
  * Cronograma ordenado por prioridad:  
    1. *Cambio de aceite y filtros* (Prioridad Media — $65.000 est.).  
    2. *Líquido refrigerante y purga* (Preventivo — $38.000 est.).  
    3. *Rotación y alineación de neumáticos* (Planificado — $35.000 est.).
* **Efecto Prevención:**  
  * Comparación directa: `$138.000` (Suma de los 3 mantenimientos al día) vs `$890.000+` (Costo de una rotura grave como junta soplada).  
  * Nota de valor de reventa del vehículo al contar con historial digital certificado.

---

## 4. Stack Tecnológico de Alto Rendimiento

| Capa | Tecnología | Justificación Técnica |
| :--- | :--- | :--- |
| **Framework Mobile** | **React Native + Expo SDK 52** | Multiplataforma nativa (iOS/Android) y compilación web inmediata para demos de inversores. |
| **Lenguaje** | **TypeScript 5.x** | Tipado estricto de paquetes OBD2, PIDs hexadecimales y cálculos matemáticos sin errores en runtime. |
| **Gráficos & UI** | **`react-native-svg` + `lucide-react-native`** | Gráficos vectoriales escalables a 120 FPS sin pérdida de resolución ni emojis. |
| **Offline-First** | **SQLite local (`sqliteCache.ts`)** | Alertas críticas en menos de 50 ms sin depender de señal 4G en ruta o subsuelos de cocheras. |
| **Backend & Cloud** | **Supabase (PostgreSQL 15)** | Esquema con Row Level Security (RLS), cotización dinámica USD $\rightarrow$ ARS y base de talleres. |
| **Hardware Dongle** | **ELM327 BLE / ESP32-C3 Propio** | Lectura de telemetría CAN Bus estándar OBD2 (SAE J1979) con auto-standby de bajo consumo. |

---

## 5. Próximos Pasos Operativos

1. **Pruebas en Vivo:** Abrir [http://localhost:8081](http://localhost:8081) en cualquier dispositivo o navegador para probar la experiencia completa.
2. **Generación de APK Android:** Compilar con `npx eas-cli build -p android --profile preview` para instalar en teléfonos físicos de prueba.
3. **Prueba en Vehículo Real:** Vincular con un conector OBD2 Bluetooth físico y contrastar las lecturas en tiempo real con el simulador.
