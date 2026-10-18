# Tu-Auto — Visión del Proyecto y Guía Maestra de Interfaces (Enfoque "Chequeo Médico" Mobile)

> **Control de Salud Vehicular & Argumentos Preventivos para el Taller**  
> *Arquitectura Mobile-First (React Native + Expo SDK 52 + TypeScript + Kinetic Telematics)*

---

## 1. Qué Buscamos con el Proyecto (El Eje "Chequeo Médico")

La mayoría de los conductores jóvenes o no expertos quieren responder una sola pregunta cotidiana: **¿Cómo está mi auto hoy y qué le toca hacer pronto para que no se rompa nada grave?**

### Los 4 Principios del Enfoque Actualizado:
1. **Metáfora de Chequeo Médico (Retención Cotidiana):**  
   Dividimos la salud del auto en **Signos Vitales** (temperatura de motor, carga de batería y luces testigo) y **Estudios de Rutina** (los componentes que vencen por kilómetros o por tiempo).
2. **Funciona Sin Hardware Obligatorio (Cero Barrera de Entrada):**  
   El valor principal nace de cruzar el **modelo del auto**, los **kilómetros actuales** y **cuándo se hizo el último cambio** contra el manual del fabricante. El dongle OBD2 suma lecturas en vivo (`Medido`), pero la app es 100% útil desde el primer minuto sin enchufar nada (`Estimado`).
3. **Transparencia Total sobre la Fuente del Dato (`Medido` vs. `Estimado`):**  
   Nunca damos falsa tranquilidad:
   * Si un componente todavía no fue cargado por el usuario, figura como **`Sin datos`** (jamás mostramos un *"Bien"* mentiroso).
   * Cada tarjeta aclara si el dato fue **`Medido`** (por el dongle) o **`Estimado`** (por km y fecha).
4. **Cuidar el Bolsillo con Argumentos Reales (Sin Precios Frágiles):**  
   Un precio fijo en pesos pierde credibilidad por la inflación y la dispersión entre talleres. En su lugar, la app le da al conductor **la frase exacta para dialogar con el mecánico**: qué pedir que coticen y qué componentes todavía tienen vida útil para que no le cambien repuestos de más.

---

## 2. Los 8 Componentes del MVP

| # | Componente | Fuente | Qué necesita del usuario | Intervalo orientativo (según manual del modelo) |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Correa de distribución** *(Destacado)* | Estimado | Km/fecha del último cambio o si nunca se cambió | 60.000 a 100.000 km o 4-5 años *(Se oculta si el motor usa cadena)* |
| **2** | **Aceite y filtro** | Estimado | Fecha y km del último cambio | 10.000 km o 1 año |
| **3** | **Refrigerante (agua)** | Estimado + Medido con dongle | Fecha del último cambio | 2 a 4 años o 40.000-80.000 km |
| **4** | **Batería** | Estimado + Medido parcial con dongle | Antigüedad de instalación | 3 a 4 años |
| **5** | **Frenos (pastillas)** | Estimado | Km desde el último cambio | 30.000 a 45.000 km |
| **6** | **Neumáticos** | Estimado | Km desde la última rotación | Rotar cada 10.000 km · Vida útil 5 años |
| **7** | **Filtro de aire** | Estimado | Km desde el último cambio | 15.000 a 20.000 km o 1 año |
| **8** | **Luces y testigos** | Medido con dongle o declarado | Si hay alguna luz encendida en el tablero | Monitoreo de estado continuo |

### Regla de Cálculo de Estado:
Para cada componente se calcula el porcentaje de vida útil consumida tomando el más restrictivo entre kilómetros y tiempo:
$$\text{Vida Consumida} = \max\left(\frac{\text{kmRecorridos}}{\text{intervaloKm}}, \frac{\text{mesesTranscurridos}}{\text{intervaloMeses}}\right)$$

* **Bien** (`< 75%`): Dentro del margen seguro.
* **Pronto** (`75% a 100%`): *"Ya vas llegando, programalo"*.
* **Revisar** (`> 100%`): *"Se pasó el intervalo recomendado"*.
* **Sin datos**: Todavía no se cargó cuándo se hizo el último cambio.

---

## 3. Las Interfaces de la Aplicación Mobile (`app-mobile/`)

### A. Flujo de Carga Inicial en 3 Pasos (`OnboardingModal.tsx`)
Accesible desde el botón superior **"Mi auto / Km"** para no abrumar al usuario:
1. **¿Qué auto manejás?** Selección rápida de los modelos más comunes de Argentina (*VW Gol Trend, Fiat Cronos, Toyota Etios, Chevrolet Corsa/Classic, Peugeot 208, Renault Sandero, Ford Ka/Fiesta, Toyota Hilux* u *Otro modelo*). Detecta automáticamente si el motor lleva **correa** o **cadena metálica**.
2. **¿Cuántos kilómetros marca hoy el tablero?** Selección con un toque.
3. **¿Cuándo hiciste el último service de aceite y sabés si se cambió la correa?** Opciones humanas simples (*"Hace poco"*, *"Hace ~8 meses"*, *"Más de 1 año"*, *"No me acuerdo / Lo compré usado"*) + selector para probar el modo **Sin Dongle** vs. **Con Dongle OBD2**.

---

### B. Pestaña 1: Resumen (`DashboardScreen.tsx`)
Responde en 3 segundos *"¿Cómo está mi auto hoy?"*:
* **Selector de Modo en Vivo:** Permite alternar con un toque entre **Modo sin dongle** (100% autónomo por km/fecha) y **Con Dongle OBD2** (activa lecturas de temperatura y voltaje en vivo).
* **Escaparate del Vehículo (`Car3DShowcase.tsx`):** Silueta vectorial del auto con selector de color de pintura, modelo, motor y kilometraje actual.
* **Tarjeta de Resumen Único:** Título claro sin jerga (*"Todo en orden · 2 cosas para programar"*) y píldoras de conteo (`Bien`, `Pronto`, `Revisar`, `Sin datos`).
* **Signos Vitales:** Si el dongle está conectado, muestra temperatura de agua y voltaje con etiqueta `Medido`. Si no hay dongle, explica con transparencia cómo funciona el cálculo preventivo.
* **Atención Sugerida:** Muestra en primer plano los componentes en estado `Pronto` o `Revisar`, destacando siempre la **Correa de distribución** cuando aplica.

---

### C. Pestaña 2: Chequeo — Ficha Médica de los 8 Componentes (`ScannerScreen.tsx` + `CheckupComponentCard.tsx`)
* **Filtros Rápidos:** `Todos`, `Pronto / Revisar` y `Sin datos`.
* **Anatomía de cada Tarjeta (`CheckupComponentCard.tsx`):**
  1. **Nombre + Estado** (Icono vectorial Lucide + palabra `Bien` / `Pronto` / `Revisar` / `Sin datos`).
  2. **Etiqueta de Confianza:** `Medido` o `Estimado` + intervalo del manual del modelo.
  3. **Barra de Vida Útil:** Porcentaje consumido (o botón rápido para completar si está en `Sin datos`).
  4. **Frase en Criollo:** Qué hace ese componente y por qué es importante.
  5. **Cuándo Toca:** Ej. *"Te quedan unos 4.000 km del intervalo recomendado"*.
  6. **Qué decirle al taller** *(solo en `Pronto` o `Revisar`)*: Frase textual lista para usar con el mecánico.
* **Inteligencia de Cadena vs. Correa:** Si el usuario elige un *Toyota Etios* o *Fiat Cronos 1.3*, la correa de distribución se oculta automáticamente y una nota al pie le explica que su motor lleva cadena metálica.

---

### D. Pestaña 3: Guía para el Taller (`WalletScreen.tsx`)
Conecta el chequeo médico con el objetivo de **"que no me cobren de más"** sin prometer precios fijos irreales:
1. **Lo que sí conviene programar:** Lista de componentes en estado `Pronto` o `Revisar`, su magnitud relativa (*Bajo / Moderado / Importante*) y la frase exacta para pedir presupuesto.
2. **Lo que todavía tiene vida útil (Escudo Preventivo):** Lista de componentes que están en estado `Bien` con su porcentaje libre, para que el conductor sepa qué cosas **no** necesita cambiar todavía si se las ofrecen en el taller.
3. **Proporción de Prevención (`1x` vs. `8x a 12x`):** Explica de forma visual y honesta por qué hacer el mantenimiento a tiempo cuesta una fracción de lo que cuesta esperar a que se corte una correa o recaliente el motor.
