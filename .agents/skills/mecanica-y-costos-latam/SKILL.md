---
name: mecanica-y-costos-latam
description: Reglas de traducción de diagnósticos mecánicos a lenguaje coloquial latinoamericano/rioplatense, clasificación de semáforo de gravedad y estimación de costos de reparación para el sistema Tu-Auto.
---

# 🔧 Skill: Traducción Mecánica a Lenguaje Humano y Billetera (Latam)

Esta skill define cómo cualquier Agente de IA o módulo del sistema **Tu-Auto** debe comunicarse con el usuario cuando se detecta una anomalía eléctrica, térmica, de mantenimiento o un código de falla (DTC).

---

## 1. Principios de Comunicación ("El Mecánico Amigo y Honesto")

El usuario de **Tu-Auto** no es mecánico y tiene miedo de dos cosas: **quedarse tirado en la calle** y **que lo estafen en el taller**. Por lo tanto, todo texto generado en la app o en la base de datos debe cumplir estas 4 reglas:

1. **Prohibido el lenguaje críptico:**
   * ❌ *Mal:* "Error P0115: Circuito del sensor ECT fuera de rango de voltaje alto".
   * ✅ *Bien:* "Falla en el bulbo/sensor de temperatura de agua. La computadora no sabe qué tan caliente está el motor".
2. **Respuesta inmediata a "¿Puedo seguir manejando?":**
   * Toda alerta debe empezar diciendo claramente si tiene que **frenar ya mismo**, si **puede llegar tranquilo a su casa**, o si **puede usarlo normal esta semana**.
3. **Doble Precio Obligatorio ("Arreglarlo Hoy" vs. "Riesgo si lo ignorás"):**
   * El usuario toma acción cuando ve la diferencia entre gastar \$40.000 hoy en una manguera/termostato vs. gastar \$1.200.000 la semana que viene por soplar la junta de tapa de cilindros.
4. **Vocabulario Local (Argentina / Cono Sur):**
   * Usar términos que la gente y los mecánicos locales usan en la vida real: *burro de arranque, alternador, bulbo de temperatura, electroventilador, bobina, bujías, cuerpo mariposa, sonda lambda, catalizador, correa de distribución, junta de tapa de cilindros, bidón recuperador de agua*.

---

## 2. Clasificación del Semáforo de Gravedad

| Color | Nivel | Cuándo se aplica | Acción recomendada al conductor |
| :---: | :--- | :--- | :--- |
| 🔴 **ROJO** | **Peligro Inminente** | Agua $\ge 103^\circ\text{C}$, Alternador $< 13.2\text{V}$ o $> 14.8\text{V}$, Baja presión de aceite, Falla grave de encendido con parpadeo de Check Engine. | **"Detené el auto en un lugar seguro ahora mismo y apagá el motor. Seguir andando unos kilómetros más puede fundir el motor."** |
| 🟡 **AMARILLO** | **Atención Preventiva** | Fallas en Modo 07 (pre-Check Engine), Batería cayendo a $< 9.6\text{V}$ en arranque, Sonda lambda, Catalizador, Bujía con falla leve, Aceite con $< 10\%$ de vida. | **"Podés seguir manejando tranquilo para volver a tu casa, pero no salgas a la ruta. Programá turno en el taller esta semana para que no rompa otra pieza más cara."** |
| 🟢 **VERDE** | **Todo en Orden / Programado** | Parámetros normales, recordatorios de mantenimiento a 15-30 días vista. | **"Tu auto está sano. Separando \$X este mes cubrís el próximo cambio de aceite sin sorpresas."** |

---

## 3. Plantilla Estándar de Tarjeta de Diagnóstico (JSON / UI Schema)

Cada vez que se agregue un nuevo diagnóstico al catálogo o se consulte al motor de IA, debe estructurarse exactamente así:

```json
{
  "code": "P0302",
  "system": "ELECTRICO_ENCENDIDO",
  "severity": "AMARILLO",
  "title": "Falla de chispa en el Cilindro 2 (Bujía o Bobina)",
  "plainExplanation": "Uno de los cilindros del motor no está quemando bien la nafta. Por eso sentís que el auto tironea, tiembla cuando estás frenado en un semáforo y gasta más combustible.",
  "canKeepDriving": true,
  "drivingInstruction": "Podés llegar a tu casa a baja velocidad sin pisar el acelerador a fondo. Evitá usar el auto muchos días así.",
  "fixTodayCostUSD": { "min": 45, "max": 85 },
  "fixTodayParts": "Juego de bujías nuevas o bobina de encendido + 40 min de mano de obra.",
  "ignoreConsequence": "La nafta cruda sin quemar pasa directo al caño de escape y derrite el Catalizador.",
  "ignoreDamageCostUSD": 550
}
```

---

## 4. Top 10 Roturas Clave que Siempre Deben Estar Precargadas en el MVP

1. **`P0115 / Recalentamiento`**: Bulbo de temperatura / Termostato trabado / Falta de agua en el circuito.
2. **`P0562 / Baja Tensión`**: Alternador no carga (carbón/regulador o correa poli-V cortada).
3. **`P0563 / Sobretensión`**: Regulador de voltaje en corto (peligro para batería y ECU).
4. **`P0300 - P0304`**: Falla de encendido en cilindros (Bujías, cables o bobina).
5. **`P0420`**: Eficiencia baja del catalizador o sonda lambda sucia.
6. **`P0171`**: Mezcla pobre de combustible (Chupada de aire en admisión, bomba de nafta débil o inyectores sucios).
7. **`P0128`**: Termostato trabado abierto (el motor trabaja frío, gasta más nafta y desgasta más el aceite).
8. **`P0335`**: Sensor de rotación (CKP / Avioncito) fallando (el auto gira pero le cuesta arrancar en caliente).
9. **`BATERIA_CRANK_LOW`**: Caída de voltaje en el arranque menor a `9.5V` (Batería agotada próxima a morir).
10. **`ACEITE_DEGRADADO`**: Vida útil de aceite $< 10\%$ por exceso de horas de tráfico urbano.
