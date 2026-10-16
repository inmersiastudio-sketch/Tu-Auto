# 🛡️ 10. Manual de Buenas Prácticas de Ingeniería, Seguridad y Estrategia de Testing

Este documento establece los estándares de calidad, seguridad y pruebas que rigen el desarrollo de **Tu-Auto**. Cada línea de código, esquema de base de datos o endpoint debe alinearse estrictamente a estos principios para asegurar un sistema robusto, escalable y sin fisuras.

---

## 1. Buenas Prácticas en Base de Datos y Persistencia (PostgreSQL / Supabase + SQLite)

### A. Integridad y Normalización
1. **Tipos de Datos Estrictos y Restricciones:**
   * Usar tipos nativos idóneos (`TIMESTAMPTZ` para marcas de tiempo, `UUIDv4` para claves primarias, `NUMERIC(p,s)` para valores monetarios y voltajes precisos, evitando flotantes imprecisos).
   * Restricciones `CHECK` explícitas para estados finitos (evitar cadenas libres en campos como `severity_level`, `plan_tier` o `alternator_status`).
2. **Políticas de Seguridad en Nivel de Fila (Row Level Security - RLS):**
   * **Ninguna tabla pública se expone sin RLS activo.**
   * Las consultas de lectura/escritura deben validar que `auth.uid() = owner_id` o que el usuario pertenezca a la flota correspondiente (`fleet_id`).
3. **Optimización e Indexación Inteligente:**
   * Índices B-Tree en llaves foráneas (`owner_id`, `vehicle_id`, `fleet_id`).
   * Índices compuestos sobre telemetría y logs temporales (`vehicle_id, recorded_at DESC`) para que las consultas de series de tiempo respondan en menos de 10ms.
4. **Resiliencia y Concurrencia:**
   * Operaciones críticas (como la asignación de leads a talleres o deducción de créditos) deben ejecutarse en transacciones ACID protegidas contra *race conditions*.

---

## 2. Seguridad Integral y Cumplimiento (SecOps)

1. **Principio de Mínimo Privilegio (Least Privilege):**
   * La aplicación móvil solo interactúa con la base de datos a través del cliente Supabase con token JWT de sesión autenticada.
   * La clave `service_role` (que elude RLS) **nunca** se incluye en el código cliente; solo se ejecuta en Edge Functions aisladas del backend.
2. **Manejo Seguro de Secretos y Variables de Entorno:**
   * Archivos `.env` ignorados en Git (`.gitignore`).
   * Validación de variables de entorno al arranque mediante esquemas `Zod` para que el sistema falle rápido si falta una clave requerida.
3. **Auditoría de Inyecciones y Sanitización:**
   * Consultas SQL parametrizadas siempre (prohibida la concatenación directa de cadenas).
   * Validación exhaustiva de entradas en APIs públicas y Edge Functions mediante librerías de parsing estricto (`Zod` / `Valibot`).

---

## 3. Pirámide y Estrategia de Testing (Testing Strategy)

```text
         ▲
        / \     E2E Tests (Flujo Completo con Simulador) [10%]
       /---\
      /     \    Integration Tests (Edge Functions + RLS DB) [30%]
     /-------\
    /         \  Unit Tests (Decodificadores OBD2, Fórmulas, Zod) [60%]
   /-----------\
```

### A. Pruebas Unitarias (Unit Tests - Cobertura Objetivo: >85%)
* **Motor OBD2:** Pruebas contra paquetes hexadecimales sintéticos y tramas reales capturadas. Verificación de fórmulas de conversión (temperatura, RPM, caída de tensión en arranque, degradación de aceite).
* **Traductor de Fallas:** Validación de que ningún código DTC devuelva `undefined` o texto sin sanitizar.

### B. Pruebas de Integración (Integration Tests)
* **Verificación de RLS en Base de Datos:** Tests automatizados que intentan acceder a registros de otros usuarios para garantizar que la base de datos bloquee accesos no autorizados.
* **Sincronización Offline-First:** Pruebas de persistencia en SQLite local simulando pérdida de red y posterior resolución de conflictos en Supabase.

### C. Pruebas E2E / Simulación en Vivo
* Verificación automatizada de los 6 escenarios del simulador (`MockOBD2Provider`), comprobando que las alertas visuales y sonoras se disparen en los umbrales configurados.

---

## 4. Pipeline de Calidad Automatizado (CI/CD Quality Gates)

Cada Pull Request o commit en ramas protegidas debe superar sin excepciones:
1. `npm run lint` (ESLint con reglas estrictas de TypeScript).
2. `npm run type-check` (`tsc --noEmit` sin errores de tipado).
3. `npm run test` (Suites de Jest / Vitest).
4. `npm run audit` (Auditoría de vulnerabilidades en dependencias `npm audit`).
