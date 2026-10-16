---
name: agile-backlog-manager
description: Reglas y flujo de trabajo para que los Agentes de IA gestionen el progreso del desarrollo en BACKLOG.md, Linear o GitHub Projects usando identificadores de tareas (TUA-XXX) y criterios de aceptación.
---

# 📋 Skill: Gestión Ágil de Desarrollo y Control de Backlog (`agile-backlog-manager`)

Esta skill garantiza que el desarrollo de **Tu-Auto** se ejecute de forma ordenada, trazable y auditable, tanto en el archivo maestro local [`BACKLOG.md`](../../../BACKLOG.md) como en plataformas externas (**Linear** o **GitHub Projects V2**).

---

## 1. Flujo de Trabajo Obligatorio para Agentes de IA

Cada vez que el usuario pida programar una pantalla, un módulo o avanzar con el desarrollo del proyecto, el Agente de IA debe seguir este ciclo de 4 pasos:

1. **Identificar el Ticket en [`BACKLOG.md`](../../../BACKLOG.md):**
   * Buscar el ID de la tarea correspondiente (ej. `TUA-006`, `TUA-007`) y leer su **Criterio de Aceptación**.
2. **Marcar como "En Progreso" (`[~]`):**
   * Si es una tarea grande o un bloque de Sprint, actualizar su estado a `[~] In Progress`.
3. **Construir y Verificar:**
   * Escribir el código respetando las skills [`obd2-elm327-protocol`](../obd2-elm327-protocol/SKILL.md) y [`mecanica-y-costos-latam`](../mecanica-y-costos-latam/SKILL.md).
   * Ejecutar el compilador o servidor de pruebas para comprobar que no existan errores de sintaxis o de tipos en TypeScript.
4. **Marcar como "Completado" (`[x]`):**
   * Actualizar [`BACKLOG.md`](../../../BACKLOG.md) cambiando `[ ]` por `[x] Done` y actualizando el contador de progreso en la cabecera del archivo.

---

## 2. Convención de Commits y Sincronización con Linear / GitHub Projects

Para que **Linear (`linear.app`)** o **GitHub Projects** muevan automáticamente las tarjetas de columna cuando se sube código:
* Todo mensaje de commit o Pull Request debe comenzar con el ID del ticket:
  * Ejemplo: `feat(TUA-008): implementar detector de caida de tension en arranque y alternador`
  * Ejemplo: `feat(TUA-009): agregar vigia termico de agua con alerta por pendiente`
* Si se requieren nuevas subtareas descubiertas durante la programación, el agente debe agregarlas a [`BACKLOG.md`](../../../BACKLOG.md) con el siguiente número correlativo (`TUA-029`, `TUA-030`, etc.).
