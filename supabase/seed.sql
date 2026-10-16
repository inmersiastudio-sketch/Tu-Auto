-- ============================================================================
-- SEMILLA DE DATOS: TOP DTCs TRADUCIDOS Y MATRIZ DE PRECIOS LOCALES
-- Cero jerga mecánica + Doble cotización (Hoy vs Si lo ignorás)
-- ============================================================================

INSERT INTO public.dtc_master_catalog (code, system_category, severity_level, human_title, human_explanation, can_keep_driving, driving_advice, consequence_if_ignored)
VALUES
(
    'P0115', 
    'AGUA_REFRIGERACION', 
    'ROJO', 
    'Falla en el sensor/bulbo de temperatura del motor', 
    'La computadora del auto no sabe qué tan caliente está el agua del motor. El electroventilador puede no encender a tiempo.', 
    false, 
    'Detené el auto en un lugar seguro. No sigas viaje con riesgo de recalentamiento.', 
    'Recalentamiento severo del motor y deformación de la tapa de cilindros.'
),
(
    'P0562', 
    'ELECTRICO', 
    'ROJO', 
    'Alternador no está cargando la batería', 
    'El sistema eléctrico tiene un voltaje anormalmente bajo (<13.0V). El auto está funcionando únicamente con la energía de la batería.', 
    false, 
    'Buscá un taller inmediatamente. El auto se apagará por completo en pocos minutos.', 
    'Parada total del motor en plena marcha y descarga profunda irreversible de la batería.'
),
(
    'P0302', 
    'MOTOR_INYECCION', 
    'AMARILLO', 
    'Falla de encendido en el Cilindro 2 (Bujía o Bobina)', 
    'Uno de los cilindros no está quemando la nafta correctamente. Vas a sentir que el auto tironea y vibra en ralentí.', 
    true, 
    'Podés manejar hasta tu casa a baja velocidad. Evitá aceleradas bruscas.', 
    'La nafta cruda pasa al caño de escape y derrite el catalizador en pocos días.'
),
(
    'P0420', 
    'EMISIONES_ESCAPE', 
    'AMARILLO', 
    'Rendimiento bajo del Catalizador de escape', 
    'El catalizador no está filtrando los gases al 100% o la sonda de oxígeno trasera está descalibrada.', 
    true, 
    'Podés seguir usando el auto con normalidad esta semana. Programá revisión.', 
    'Aumento de consumo de combustible y rechazo garantizado en la verificación técnica (VTV).'
),
(
    'P0171', 
    'MOTOR_INYECCION', 
    'AMARILLO', 
    'Mezcla pobre de combustible (Entrada de aire en motor)', 
    'Al motor le entra más aire que nafta. Puede deberse a una manguera de admisión rota o inyectores tapados.', 
    true, 
    'Podés circular pero notarás pérdida de potencia al acelerar.', 
    'Mayor temperatura en la cámara de combustión y desgaste acelerado de válvulas.'
)
ON CONFLICT (code) DO NOTHING;

-- Matriz de costos estándar para segmento 'ECONOMICO' (VW Gol, Fiat Palio/Cronos, Chevrolet Corsa/Onix)
INSERT INTO public.repair_cost_matrix (dtc_code, vehicle_segment, part_name, part_cost_min_usd, part_cost_max_usd, labor_cost_usd, ignored_damage_cost_usd)
VALUES
('P0115', 'ECONOMICO', 'Bulbo sensor de temperatura + Purga de refrigerante', 25.00, 45.00, 30.00, 950.00),
('P0562', 'ECONOMICO', 'Reparación de alternador (Regulador/Carbones) o Correa Poli-V', 40.00, 90.00, 45.00, 350.00),
('P0302', 'ECONOMICO', 'Juego de bujías o bobina de encendido individual', 35.00, 75.00, 30.00, 580.00),
('P0420', 'ECONOMICO', 'Sonda Lambda trasera o reemplazo de catalizador', 60.00, 180.00, 50.00, 450.00),
('P0171', 'ECONOMICO', 'Manguera de admisión / Limpieza de inyectores', 20.00, 60.00, 40.00, 620.00)
ON CONFLICT (dtc_code, vehicle_segment) DO NOTHING;
