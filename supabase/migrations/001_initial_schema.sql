-- ============================================================================
-- MIGRACIÓN MAESTRA DE BASE DE DATOS: TU-AUTO
-- PostgreSQL 15+ / Supabase
-- Estándares: ACID, RLS Activo, Tipado Estricto, Auditoría e Índices
-- ============================================================================

-- Habilitar extensión pgcrypto para generación de UUIDs si no está activa
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TIPOS ENUMERADOS (Evita redundancias y valores inválidos)
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE user_plan_tier AS ENUM ('free', 'pro', 'fleet_b2b');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE hardware_device_type AS ENUM ('OEM_BLE_4.0', 'ESP32_CUSTOM_V1');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alternator_health_status AS ENUM ('OK', 'BAJA_CARGA', 'SOBRECARGA_PELIGROSA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE system_category_type AS ENUM (
        'ELECTRICO', 'AGUA_REFRIGERACION', 'MOTOR_INYECCION', 
        'ACEITE_LUBRICACION', 'EMISIONES_ESCAPE', 'TRANSMISION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_level_type AS ENUM ('VERDE', 'AMARILLO', 'ROJO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_segment_type AS ENUM ('ECONOMICO', 'MEDIANO', 'PICKUP_SUV', 'PREMIUM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE obd_detection_mode AS ENUM ('MODE_03_CONFIRMED', 'MODE_07_PENDING_PREDICTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE maintenance_item_type AS ENUM (
        'ACEITE_Y_FILTROS', 'LIQUIDO_REFRIGERANTE_AGUA', 
        'CORREA_DISTRIBUCION', 'BATERIA', 'PASTILLAS_FRENO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE workshop_specialty_type AS ENUM (
        'LUBRICENTRO', 'ELECTRICIDAD_BATERIAS', 'MECANICA_GENERAL', 'INYECCION_ELECTRONICA'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_status_type AS ENUM ('SENT', 'CONTACTED', 'COMPLETED_PAID', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. TABLAS PRINCIPALES
-- ============================================================================

-- A. Perfiles de usuario (Vinculados a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_whatsapp TEXT,
    country_code VARCHAR(3) DEFAULT 'AR',
    currency_code VARCHAR(3) DEFAULT 'ARS',
    plan_tier user_plan_tier DEFAULT 'free',
    subscription_status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. Flotas B2B (Para dueños de autos en Uber / Remises)
CREATE TABLE IF NOT EXISTS public.fleets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    fleet_name TEXT NOT NULL,
    alert_whatsapp_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. Vehículos
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    fleet_id UUID REFERENCES public.fleets(id) ON DELETE SET NULL,
    license_plate VARCHAR(12),
    brand VARCHAR(60) NOT NULL,
    model VARCHAR(80) NOT NULL,
    year SMALLINT NOT NULL CHECK (year BETWEEN 1990 AND 2030),
    vehicle_segment vehicle_segment_type DEFAULT 'ECONOMICO',
    current_odometer_km INT NOT NULL DEFAULT 0 CHECK (current_odometer_km >= 0),
    total_engine_hours NUMERIC(10,2) DEFAULT 0 CHECK (total_engine_hours >= 0),
    normal_operating_temp_c SMALLINT DEFAULT 90,
    health_score SMALLINT DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. Dispositivos de Hardware OBD2
CREATE TABLE IF NOT EXISTS public.obd_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_qr_code VARCHAR(50) UNIQUE NOT NULL,
    ble_mac_address VARCHAR(20),
    hardware_type hardware_device_type DEFAULT 'OEM_BLE_4.0',
    assigned_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    activated_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E. Auditoría Eléctrica (Batería y Alternador en arranque)
CREATE TABLE IF NOT EXISTS public.electrical_cranking_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    resting_voltage_v NUMERIC(4,2) NOT NULL,
    min_cranking_voltage_v NUMERIC(4,2) NOT NULL,
    alternator_voltage_v NUMERIC(4,2) NOT NULL,
    ambient_temp_c SMALLINT,
    battery_soh_percent SMALLINT NOT NULL CHECK (battery_soh_percent BETWEEN 0 AND 100),
    alternator_status alternator_health_status NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- F. Resúmenes de Telemetría Térmica y de Viajes
CREATE TABLE IF NOT EXISTS public.telemetry_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    max_coolant_temp_c SMALLINT NOT NULL,
    temp_rise_rate_c_per_min NUMERIC(5,2),
    trip_distance_km NUMERIC(7,2) DEFAULT 0,
    trip_duration_minutes INT DEFAULT 0,
    idle_traffic_minutes INT DEFAULT 0,
    overheating_event_triggered BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- G. Catálogo Maestro de Códigos de Falla (DTC)
CREATE TABLE IF NOT EXISTS public.dtc_master_catalog (
    code VARCHAR(10) PRIMARY KEY,
    system_category system_category_type NOT NULL,
    severity_level severity_level_type NOT NULL,
    human_title TEXT NOT NULL,
    human_explanation TEXT NOT NULL,
    can_keep_driving BOOLEAN NOT NULL,
    driving_advice TEXT NOT NULL,
    consequence_if_ignored TEXT NOT NULL
);

-- H. Matriz de Costos de Reparación y Riesgo Financiero
CREATE TABLE IF NOT EXISTS public.repair_cost_matrix (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dtc_code VARCHAR(10) NOT NULL REFERENCES public.dtc_master_catalog(code) ON DELETE CASCADE,
    vehicle_segment vehicle_segment_type NOT NULL,
    part_name TEXT NOT NULL,
    part_cost_min_usd NUMERIC(8,2) NOT NULL CHECK (part_cost_min_usd >= 0),
    part_cost_max_usd NUMERIC(8,2) NOT NULL CHECK (part_cost_max_usd >= part_cost_min_usd),
    labor_cost_usd NUMERIC(8,2) NOT NULL CHECK (labor_cost_usd >= 0),
    ignored_damage_cost_usd NUMERIC(8,2) NOT NULL CHECK (ignored_damage_cost_usd >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_dtc_segment UNIQUE (dtc_code, vehicle_segment)
);

-- I. Registro de Fallas en Vehículos
CREATE TABLE IF NOT EXISTS public.vehicle_faults (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    dtc_code VARCHAR(10) NOT NULL REFERENCES public.dtc_master_catalog(code),
    obd_mode obd_detection_mode NOT NULL,
    odometer_at_detection_km INT,
    is_resolved BOOLEAN DEFAULT FALSE,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- J. Control Predictivo de Mantenimiento
CREATE TABLE IF NOT EXISTS public.maintenance_trackers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    item_type maintenance_item_type NOT NULL,
    last_change_date DATE NOT NULL,
    last_change_km INT NOT NULL,
    interval_km INT NOT NULL,
    equivalent_wear_km NUMERIC(10,2) DEFAULT 0,
    life_remaining_percent SMALLINT DEFAULT 100 CHECK (life_remaining_percent BETWEEN 0 AND 100),
    estimated_next_date DATE,
    estimated_cost_usd NUMERIC(8,2) NOT NULL CHECK (estimated_cost_usd >= 0),
    CONSTRAINT uq_vehicle_item UNIQUE (vehicle_id, item_type)
);

-- K. Red de Talleres y Leads
CREATE TABLE IF NOT EXISTS public.partner_workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty workshop_specialty_type NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    whatsapp_phone VARCHAR(30) NOT NULL,
    commission_percent NUMERIC(5,2) DEFAULT 10.00,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workshop_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    workshop_id UUID NOT NULL REFERENCES public.partner_workshops(id) ON DELETE CASCADE,
    reason_summary TEXT NOT NULL,
    estimated_job_value_usd NUMERIC(8,2),
    commission_amount_usd NUMERIC(8,2),
    status lead_status_type DEFAULT 'SENT',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. ÍNDICES DE RENDIMIENTO (B-Tree & Compuestos para Series de Tiempo)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON public.vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_fleet ON public.vehicles(fleet_id);
CREATE INDEX IF NOT EXISTS idx_cranking_vehicle_time ON public.electrical_cranking_logs(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_time ON public.telemetry_snapshots(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_faults_vehicle_active ON public.vehicle_faults(vehicle_id) WHERE is_resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle ON public.maintenance_trackers(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_leads_workshop ON public.workshop_leads(workshop_id, status);

-- ============================================================================
-- 4. SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obd_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electrical_cranking_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_faults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_leads ENABLE ROW LEVEL SECURITY;

-- Catálogos públicos de lectura:
ALTER TABLE public.dtc_master_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_cost_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_workshops ENABLE ROW LEVEL SECURITY;

-- Políticas de perfiles:
CREATE POLICY "Users can view and update their own profile" 
ON public.profiles FOR ALL USING (auth.uid() = id);

-- Políticas de vehículos (dueño o dueño de la flota):
CREATE POLICY "Users can manage their own vehicles" 
ON public.vehicles FOR ALL USING (
    auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM public.fleets WHERE fleets.id = vehicles.fleet_id AND fleets.owner_id = auth.uid())
);

-- Políticas de telemetría y logs eléctricos:
CREATE POLICY "Users can read own electrical logs"
ON public.electrical_cranking_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = electrical_cranking_logs.vehicle_id AND vehicles.owner_id = auth.uid())
);

CREATE POLICY "Users can insert own electrical logs"
ON public.electrical_cranking_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = electrical_cranking_logs.vehicle_id AND vehicles.owner_id = auth.uid())
);

CREATE POLICY "Users can access own telemetry"
ON public.telemetry_snapshots FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = telemetry_snapshots.vehicle_id AND vehicles.owner_id = auth.uid())
);

CREATE POLICY "Users can access own vehicle faults"
ON public.vehicle_faults FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = vehicle_faults.vehicle_id AND vehicles.owner_id = auth.uid())
);

CREATE POLICY "Users can access own maintenance trackers"
ON public.maintenance_trackers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = maintenance_trackers.vehicle_id AND vehicles.owner_id = auth.uid())
);

-- Catálogos públicos accesibles para lectura autenticada:
CREATE POLICY "Authenticated users can read DTC catalog"
ON public.dtc_master_catalog FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read repair cost matrix"
ON public.repair_cost_matrix FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view verified partner workshops"
ON public.partner_workshops FOR SELECT TO authenticated USING (is_verified = true);
