--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_employee_news_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_employee_news_status AS ENUM (
    'pending',
    'submitted',
    'approved',
    'rejected',
    'active',
    'inactive'
);


ALTER TYPE public.enum_employee_news_status OWNER TO postgres;

--
-- Name: enum_liquidations_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_liquidations_status AS ENUM (
    'draft',
    'approved',
    'paid',
    'cancelled'
);


ALTER TYPE public.enum_liquidations_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    companyname character varying(255) NOT NULL,
    nit character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    active boolean DEFAULT true,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    active boolean NOT NULL,
    createdat timestamp with time zone,
    updatedat timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: COLUMN contracts.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contracts.name IS 'Name';


--
-- Name: COLUMN contracts.active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contracts.active IS 'Active';


--
-- Name: COLUMN contracts.createdat; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contracts.createdat IS 'Creation Date';


--
-- Name: COLUMN contracts.updatedat; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contracts.updatedat IS 'Update Date';


--
-- Name: contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contracts_id_seq OWNER TO postgres;

--
-- Name: contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contracts_id_seq OWNED BY public.contracts.id;


--
-- Name: employee_news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_news (
    id integer NOT NULL,
    "companyId" integer NOT NULL,
    "employeeId" integer NOT NULL,
    "typeNewsId" integer NOT NULL,
    "startDate" timestamp with time zone NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endDate" timestamp with time zone,
    "endTime" time without time zone,
    status character varying(255) NOT NULL,
    "approvedBy" integer,
    observations text,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    document character varying(255),
    approved boolean
);


ALTER TABLE public.employee_news OWNER TO postgres;

--
-- Name: COLUMN employee_news."companyId"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."companyId" IS 'ID de la empresa';


--
-- Name: COLUMN employee_news."employeeId"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."employeeId" IS 'ID del empleado';


--
-- Name: COLUMN employee_news."typeNewsId"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."typeNewsId" IS 'ID del tipo de novedad';


--
-- Name: COLUMN employee_news."startDate"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."startDate" IS 'Fecha de inicio';


--
-- Name: COLUMN employee_news."startTime"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."startTime" IS 'Hora de inicio';


--
-- Name: COLUMN employee_news."endDate"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."endDate" IS 'Fecha de fin';


--
-- Name: COLUMN employee_news."endTime"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."endTime" IS 'Hora de fin';


--
-- Name: COLUMN employee_news.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news.status IS 'Estado de la novedad';


--
-- Name: COLUMN employee_news."approvedBy"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."approvedBy" IS 'ID del usuario que aprobó';


--
-- Name: COLUMN employee_news.observations; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news.observations IS 'Observaciones';


--
-- Name: COLUMN employee_news.active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news.active IS 'Estado activo/inactivo';


--
-- Name: COLUMN employee_news."createdAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."createdAt" IS 'Creation Date';


--
-- Name: COLUMN employee_news."updatedAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_news."updatedAt" IS 'Update Date';


--
-- Name: employee_news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_news_id_seq OWNER TO postgres;

--
-- Name: employee_news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_news_id_seq OWNED BY public.employee_news.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    documenttype character varying(512),
    documentnumber character varying(20),
    fullname character varying(512),
    contracttype character varying(512),
    "position" character varying(512),
    workday character varying(20),
    maritalstatus character varying(512),
    educationlevel character varying(512),
    bloodtype character varying(512),
    phone character varying(20),
    address character varying(512),
    email character varying(512),
    contributortype character varying(512),
    contributorsubtype character varying(512),
    eps character varying(512),
    arl character varying(512),
    arlrisklevel character varying(512),
    arlriskpercentage character varying(20),
    pension character varying(512),
    compensationfund character varying(512),
    severancefund character varying(512),
    sex character varying(512),
    birthdate date,
    contractstartdate date,
    payrolltype character varying(512),
    costcenter character varying(512),
    basicmonthlysalary character varying(20),
    hourlyrate numeric(10,2),
    transportationassistance numeric(10,2),
    mobilityassistance character varying(20),
    accounttype character varying(512),
    bank character varying(512),
    accountnumber character varying(20),
    paymentmethod character varying(512),
    workcity character varying(512),
    hasadditionaldiscount character varying(512),
    discountvalue character varying(512),
    additionaldiscountcomment character varying(512),
    shirtsize character varying(512),
    pantssize character varying(512),
    shoesize character varying(512),
    active character varying(512),
    companyid integer,
    id integer NOT NULL,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: liquidation_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liquidation_details (
    id integer NOT NULL,
    liquidation_id integer NOT NULL,
    employee_id integer NOT NULL,
    basic_salary numeric(15,2) DEFAULT 0 NOT NULL,
    transportation_assistance numeric(15,2) DEFAULT 0 NOT NULL,
    mobility_assistance numeric(15,2) DEFAULT 0 NOT NULL,
    total_novedades numeric(15,2) DEFAULT 0 NOT NULL,
    total_discounts numeric(15,2) DEFAULT 0 NOT NULL,
    net_amount numeric(15,2) DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.liquidation_details OWNER TO postgres;

--
-- Name: COLUMN liquidation_details.liquidation_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_details.liquidation_id IS 'ID de la liquidación padre';


--
-- Name: COLUMN liquidation_details.employee_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_details.employee_id IS 'ID del empleado';


--
-- Name: COLUMN liquidation_details.basic_salary; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_details.basic_salary IS 'Salario básico del empleado';


--
-- Name: COLUMN liquidation_details.transportation_assistance; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_details.transportation_assistance IS 'Auxilio de transporte';


--
-- Name: COLUMN liquidation_details.mobility_assistance; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_details.mobility_assistance IS 'Auxilio de movilidad';


--
-- Name: COLUMN liquidation_details.total_novedades; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_details.total_novedades IS 'Total de novedades (adiciones)';


--
-- Name: COLUMN liquidation_details.total_discounts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_details.total_discounts IS 'Total de descuentos';


--
-- Name: COLUMN liquidation_details.net_amount; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_details.net_amount IS 'Valor neto a pagar';


--
-- Name: liquidation_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.liquidation_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liquidation_details_id_seq OWNER TO postgres;

--
-- Name: liquidation_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.liquidation_details_id_seq OWNED BY public.liquidation_details.id;


--
-- Name: liquidation_news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liquidation_news (
    id integer NOT NULL,
    liquidation_detail_id integer NOT NULL,
    employee_news_id integer NOT NULL,
    type_news_id integer NOT NULL,
    hours numeric(8,2) DEFAULT 0 NOT NULL,
    days integer DEFAULT 0 NOT NULL,
    amount numeric(15,2) DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.liquidation_news OWNER TO postgres;

--
-- Name: COLUMN liquidation_news.liquidation_detail_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_news.liquidation_detail_id IS 'ID del detalle de liquidación';


--
-- Name: COLUMN liquidation_news.employee_news_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_news.employee_news_id IS 'ID de la novedad del empleado';


--
-- Name: COLUMN liquidation_news.type_news_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_news.type_news_id IS 'ID del tipo de novedad';


--
-- Name: COLUMN liquidation_news.hours; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_news.hours IS 'Horas aplicadas';


--
-- Name: COLUMN liquidation_news.days; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_news.days IS 'Días aplicados';


--
-- Name: COLUMN liquidation_news.amount; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidation_news.amount IS 'Valor calculado de la novedad';


--
-- Name: liquidation_news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.liquidation_news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liquidation_news_id_seq OWNER TO postgres;

--
-- Name: liquidation_news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.liquidation_news_id_seq OWNED BY public.liquidation_news.id;


--
-- Name: liquidations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liquidations (
    id integer NOT NULL,
    company_id integer NOT NULL,
    user_id integer NOT NULL,
    period character varying(7) NOT NULL,
    status public.enum_liquidations_status DEFAULT 'draft'::public.enum_liquidations_status NOT NULL,
    total_employees integer DEFAULT 0 NOT NULL,
    total_basic_salary numeric(15,2) DEFAULT 0 NOT NULL,
    total_transportation_assistance numeric(15,2) DEFAULT 0 NOT NULL,
    total_mobility_assistance numeric(15,2) DEFAULT 0 NOT NULL,
    total_novedades numeric(15,2) DEFAULT 0 NOT NULL,
    total_discounts numeric(15,2) DEFAULT 0 NOT NULL,
    total_net_amount numeric(15,2) DEFAULT 0 NOT NULL,
    notes text,
    approved_at timestamp with time zone,
    approved_by integer,
    paid_at timestamp with time zone,
    paid_by integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    created_by integer,
    CONSTRAINT chk_liquidations_status CHECK ((status = ANY (ARRAY['draft'::public.enum_liquidations_status, 'approved'::public.enum_liquidations_status, 'paid'::public.enum_liquidations_status, 'cancelled'::public.enum_liquidations_status])))
);


ALTER TABLE public.liquidations OWNER TO postgres;

--
-- Name: COLUMN liquidations.period; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.liquidations.period IS 'Formato YYYY-MM';


--
-- Name: liquidations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.liquidations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liquidations_id_seq OWNER TO postgres;

--
-- Name: liquidations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.liquidations_id_seq OWNED BY public.liquidations.id;


--
-- Name: type_news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_news (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    affects text NOT NULL,
    percentage character varying(100),
    category character varying(255) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    code character varying(10) NOT NULL,
    duration character varying(255) NOT NULL,
    payment character varying(255) NOT NULL,
    applies_to text NOT NULL,
    notes text,
    calculateperhour boolean DEFAULT false
);


ALTER TABLE public.type_news OWNER TO postgres;

--
-- Name: COLUMN type_news.affects; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.type_news.affects IS 'Campos de dinero afectados (JSON string)';


--
-- Name: COLUMN type_news.percentage; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.type_news.percentage IS 'Porcentaje de la novedad';


--
-- Name: COLUMN type_news.applies_to; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.type_news.applies_to IS 'Opciones de género aplicables (JSON string)';


--
-- Name: COLUMN type_news.calculateperhour; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.type_news.calculateperhour IS 'Calcular por hora';


--
-- Name: type_news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_news_id_seq OWNER TO postgres;

--
-- Name: type_news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_news_id_seq OWNED BY public.type_news.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    uuid character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255),
    "firstName" character varying(255),
    "lastName" character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    roles character varying(255)[] NOT NULL,
    "accessToken" character varying(255) NOT NULL,
    "refreshToken" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    active boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: COLUMN users.uuid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.uuid IS 'Code';


--
-- Name: COLUMN users.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.email IS 'email';


--
-- Name: COLUMN users.password; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.password IS 'Password';


--
-- Name: COLUMN users."firstName"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."firstName" IS 'FirstName';


--
-- Name: COLUMN users."lastName"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."lastName" IS 'LastName';


--
-- Name: COLUMN users.phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.phone IS 'Phone';


--
-- Name: COLUMN users.roles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.roles IS 'roles';


--
-- Name: COLUMN users."accessToken"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."accessToken" IS 'roles';


--
-- Name: COLUMN users."refreshToken"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."refreshToken" IS 'roles';


--
-- Name: COLUMN users."createdAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."createdAt" IS 'FCREACION';


--
-- Name: COLUMN users."updatedAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."updatedAt" IS 'FECHA_ACTUALIZACION';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts ALTER COLUMN id SET DEFAULT nextval('public.contracts_id_seq'::regclass);


--
-- Name: employee_news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_news ALTER COLUMN id SET DEFAULT nextval('public.employee_news_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: liquidation_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidation_details ALTER COLUMN id SET DEFAULT nextval('public.liquidation_details_id_seq'::regclass);


--
-- Name: liquidation_news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidation_news ALTER COLUMN id SET DEFAULT nextval('public.liquidation_news_id_seq'::regclass);


--
-- Name: liquidations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidations ALTER COLUMN id SET DEFAULT nextval('public.liquidations_id_seq'::regclass);


--
-- Name: type_news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_news ALTER COLUMN id SET DEFAULT nextval('public.type_news_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, companyname, nit, address, phone, email, active, "createdAt", "updatedAt") FROM stdin;
1	PROFESIONALES DE ASEO DE COLOMBIA SAS	901831125-6	CRA 64B # 94-44	6053225980	contabilidadproaseo@satcol.com.co	t	2025-04-24 22:19:48.651079	2025-04-24 22:19:48.651079
2	SERVICIOS TEMPORALES INTEGRALES SAS	901838653-5	CRA 64B # 94-44	6053225980	contabilidadintempro@satcol.com.co	t	2025-04-24 22:19:48.651079	2025-04-24 22:19:48.651079
3	COMPAÑÍA DE VIGILANCIA Y SEGURIDAD KNOX SECURITY LTDA	901843986-2	CRA 64B # 94-44	6053225980	contabilidadknox@satcol.com.co	t	2025-04-24 22:19:48.651079	2025-04-24 22:19:48.651079
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, name, active, createdat, updatedat, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: employee_news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_news (id, "companyId", "employeeId", "typeNewsId", "startDate", "startTime", "endDate", "endTime", status, "approvedBy", observations, active, "createdAt", "updatedAt", document, approved) FROM stdin;
7	1	1	7	2025-05-15 19:00:00-05	18:00:00	2025-05-24 19:00:00-05	23:59:00	active	1	\N	t	2025-08-11 11:16:26.951-05	2025-08-11 11:16:26.951-05	\N	\N
8	1	2	6	2025-08-17 19:00:00-05	07:00:00	2025-08-21 19:00:00-05	07:00:00	active	1		t	2025-08-16 11:50:02.237-05	2025-08-16 11:50:02.237-05	/files/document-1755363002188-940713798.pdf	\N
9	1	4	5	2025-08-13 19:00:00-05	09:03:00	2025-08-14 19:00:00-05	12:02:00	active	1	------------	t	2025-08-16 11:51:55.16-05	2025-08-16 11:51:55.16-05	/files/document-1755363115114-676857620.jpg	\N
10	1	3	5	2025-08-26 19:00:00-05	00:00:00	2025-08-27 19:00:00-05	14:08:00	active	1	--------------	t	2025-08-16 12:09:00.697-05	2025-08-28 01:35:53.012-05	/files/document-1755613826083-862852680.pdf	t
6	1	1	19	2025-04-21 19:00:00-05	18:00:00	2025-04-21 19:00:00-05	23:59:00	active	1		t	2025-05-19 19:32:32.148-05	2025-08-08 09:56:14.639-05	\N	t
4	1	1	6	2025-05-16 18:00:00-05	18:00:00	2025-05-24 23:59:00-05	23:59:00	active	1		t	2025-05-13 20:37:25.022-05	2025-08-11 11:16:26.991-05	\N	f
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (documenttype, documentnumber, fullname, contracttype, "position", workday, maritalstatus, educationlevel, bloodtype, phone, address, email, contributortype, contributorsubtype, eps, arl, arlrisklevel, arlriskpercentage, pension, compensationfund, severancefund, sex, birthdate, contractstartdate, payrolltype, costcenter, basicmonthlysalary, hourlyrate, transportationassistance, mobilityassistance, accounttype, bank, accountnumber, paymentmethod, workcity, hasadditionaldiscount, discountvalue, additionaldiscountcomment, shirtsize, pantssize, shoesize, active, companyid, id, "createdAt", "updatedAt") FROM stdin;
CC	1129572463	HORACIO ANDRES VALENCIA PEREZ	Fijo	GERENTE OPERATIVO	7.66	Soltero	Especialista	O+	3157091994	calle 68 # 65-09	valenciaperezhoracio11@gmail.com	Dependiente	sin subtipo cotizante	Sanitas	Positiva Compañía de Seguros	Riesgo I	0.522	Colfondos	comfamiliar	Protección	M	1986-12-06	2025-04-01	Administrativa	Administración	4000000	17391.30	0.00	33333.333333333336	Ahorro	BBVA	91423509	Mensual	Barranquilla	NO	0	0				SI	1	1	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	84455559	KEINER ALEXANDER MOLINA LEGARDA	Obra o labor	Auxiliar de Servicios Generales	3.83	Unión Libre	Técnico	O+	3242998387	calle 7 # 35A-06	keniermolina212@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Cajamag	Protección	M	1982-12-01	2025-04-01	Operativa	El Parador de Santa Marta	711750	3094.57	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3242998387	Quincenal	Santa Marta	NO	0	0				SI	1	2	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72311341	ARONY ENRIQUE GONZALEZ DOMINGUEZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3024260225	calle 11 # 11-04	arogonzalezdom@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1980-01-14	2025-04-02	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550488417721427	Quincenal	Barranquilla	NO	0	0				SI	1	3	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1069472381	LIDIS MERCEDES GUERRA SEÑA	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	B+	3016503476	cra 42A#43-109	lidisguerra25@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1986-09-25	2025-04-14	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	NEQUI	Bancolombia	3016503476	Quincenal	Barranquilla	NO	0	0				SI	1	5	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1045724533	ANGEL MANUEL POLO LLAMAS	Obra o labor	Conserje	7.66	Unión Libre	Bachiller	A+	3018560638	calle 55C # 4A-09	poloangel2813@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1994-09-28	2025-03-30	Operativa	Parque Central Hayuelos	1423500	6189.10	6666.60	0.0	NEQUI	Bancolombia	3018560638	Quincenal	Barranquilla	NO	0	0				SI	1	6	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1044423182	JOHAN JOSE MENDOZA PEÑA	Obra o labor	Conserje	7.66	Unión Libre	Bachiller	A+	3015213956	calle 2A BIS # 7 SUR 29	johanmendozapena@gmail.com	Dependiente	sin subtipo cotizante	Cajacopi	Positiva Compañía de Seguros	Riesgo IV	4.35	Protección	Comfamiliar	Protección	M	1987-06-20	2025-03-30	Operativa	Parque Central Hayuelos	1423500	6189.10	6666.60	0.0	Ahorro	Bancolombia	76700005160	Quincenal	Barranquilla	NO	0	0				SI	1	7	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1143152098	JORGE ANDRES MORENO OROZCO	Obra o labor	Conserje	7.66	Unión Libre	Bachiller	O+	3006554868	calle 45D # 5B - 38	jorgeandresmorenoorozco@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1995-08-24	2025-03-30	Operativa	Parque Central Hayuelos	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3504749228	Quincenal	Barranquilla	NO	0	0				SI	1	8	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	55246726	YURANYS PAOLA ANAYA CARCAMO	Obra o labor	Auxiliar de Servicios Generales	7.66	Soltero	Bachiller	O+	3244389897	calle 70B # 3C - 51	yurianaya74@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	F	1984-07-08	2025-03-17	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3244389897	Quincenal	Barranquilla	NO	0	0				SI	1	9	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	22521704	LINEET TERESA MEJIA MEZA	Obra o labor	Supervisor Operativo	7.66	Soltera	Bachiller	B+	3009006348	diagonal 77C transversal 1A-22	lineetmejiameza@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1980-11-03	2025-03-18	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3009006348	Quincenal	Barranquilla	NO	0	0				SI	1	10	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	8568952	ALVARO ANTONIO CANTILLO SARMIENTO	Obra o labor	Conserje	7.66	Unión Libre	Bachiller	O+	3005608933	calle 56B # 6C - 16	aacantillo1981@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo IV	4.35	Colfondos	Comfamiliar	Protección	M	1981-11-16	2025-03-13	Operativa	Parque Industrial Claveria	1423500	6189.10	6666.60	0.0	NEQUI	Bancolombia	3005608933	Quincenal	Barranquilla	NO	0	0				SI	1	11	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1042443173	KEVIN DAMIAN ARIZA LOMBARDIS	Obra o labor	Todero/Piscinero	7.66	Unión Libre	Técnico	O+	3246047621	CALLE 73 # 4A SUR 25	arizakevin01@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1992-02-21	2025-03-13	Operativa	Torres de Montreal	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3246047621	Quincenal	Barranquilla	NO	0	0				SI	1	12	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	55245162	MALKA IRINA MEJIA TORRES	Obra o labor	Auxiliar de Servicios Generales	7.66	Casada	Técnico	A+	3016543193	diagonal 51 # 16C-09	daimyxkalieth@hotmail.com	Dependiente	sin subtipo cotizante	Sanitas	Positiva Compañía de Seguros	Riesgo II	1.044	Colpensiones	Comfamiliar	Protección	F	1984-01-25	2025-03-08	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Bancolombia	47816105559	Quincenal	Barranquilla	NO	0	0				SI	1	13	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	32793398	GLENIS MERID BOVEA BRAVO	Obra o labor	Auxiliar de Servicios Generales	7.66	Casada	Bachiller	O+	3005878622	calle 76C # 16-15	andreagomez_3026@hotmail.com	Dependiente	sin subtipo cotizante	Sanitas	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	F	1976-07-12	2025-03-12	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	NEQUI	Bancolombia	3005878622	Quincenal	Barranquilla	NO	0	0				SI	1	14	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	32881637	CENAIDA ISABEL MEJIA GARIZABALO	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	A+	3245800062	calle 37C 3 # 1F-69	cenaidamejia24@gmail.com	Dependiente	sin subtipo cotizante	Coosalud	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1977-08-24	2025-03-07	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	NEQUI	Bancolombia	3245800062	Quincenal	Barranquilla	NO	0	0				SI	1	15	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1042431054	DECIRE DE ALBA SUAREZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	B+	3015318974	calle 10 # 22-53	dealbadecire@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1989-06-10	2025-03-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550085200078575	Quincenal	Barranquilla	NO	0	0				SI	1	16	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1045754225	RICARDO DAVID GONZALEZ CUETO	Obra o labor	Todero	7.66	Unión Libre	Técnico	A+	3009945497	calle 84 # 82-96	ricardocueto115@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1996-03-07	2025-02-26	Operativa	Palmas Mall	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550488451268061	Quincenal	Barranquilla	NO	0	0				SI	1	17	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1044428163	VICTOR ALFONSO BOLIVAR RAMIREZ	Obra o labor	Todero	7.66	Unión Libre	Técnico	A+	3001072137	cra 2B # 95-17	vibospublicidad18@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1992-10-12	2025-02-26	Operativa	Producción	1423500	6189.10	6666.60	0.0	NEQUI	Bancolombia	3025961760	Quincenal	Barranquilla	NO	0	0				SI	1	18	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
PPT	1767947	RONNY ALEXANDER VASQUEZ SALAZAR	Obra o labor	Todero/Salvavidas	7.66	Soltero	Técnico	O+	3118934175	kra 30 # 17-27	maderonny1995@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1995-07-14	2025-02-21	Operativa	Villas del puerto II	1423500	6189.10	6666.60	0.0	Ahorro	Bancolombia	77700000801	Quincenal	Barranquilla	NO	0	0				SI	1	19	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	36668915	JANETH PATRICIA SAAVEDRA ALVEAR	Obra o labor	Auxiliar de Cocina	7.66	Soltera	Técnico	A+	3023151079	calle 29 # 29f-27	yanethpatriciasaavedra@hotmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Cajamag	Protección	F	1976-02-12	2025-01-30	Operativa	Instituto San Luis Beltran	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3023151079	Quincenal	Santa Marta	NO	0	0				SI	1	20	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
PPT	1142537	YAMILDRE KARINA PIÑA ASTUDILLO	Obra o labor	Auxiliar de Cocina	7.66	Soltera	Bachiller	O+	3009844965	calle 29k-1 # 29B-09	yamitia20@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Cajamag	Protección	F	1980-05-14	2025-02-11	Operativa	Instituto San Luis Beltran	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550117100120296	Quincenal	Santa Marta	NO	0	0				SI	1	21	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	30580814	VICKY DEL CARMEN MARTINEZ QUINTERO	Obra o labor	Operaria de Aseo	7.66	soltera	Técnico	O+	3045254890	kra 15 sur # 48D-50	vickydelcarmen1607@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	F	1982-07-16	2025-02-15	Operativa	Edificio Bruxxel	1423500	6189.10	6666.60	0.0	Ahorro	Bancolombia	74500009612	Quincenal	Barranquilla	NO	0	0				SI	1	22	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CE	891790	EDWIN ANTONIO GUTIERREZ YAJURE	Obra o labor	Conserje	7.66	Unión Libre	Bachiller	O+	3002409812	calle 51 # 13B-27	eagy009@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1972-11-28	2025-02-01	Operativa	Villas del puerto II	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	26100828388	Quincenal	Barranquilla	NO	0	0				SI	1	23	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	8771151	ALVARO ALFREDO VILLARREAL MONTERO	Obra o labor	Operario de Aseo	7.66	Unión Libre	Bachiller	B+	3044215858	calle 18 # 36-26	alvarovillareal1234@hotmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Colpensiones	Comfamiliar	Protección	M	1970-11-26	2025-02-08	Operativa	Edificio Colibrí	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3044215858	Quincenal	Barranquilla	NO	0	0				SI	1	24	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72193496	RAUL JOSE FERRER BARRIOS	Obra o labor	Conserje	7.66	Casado	Bachiller	O+	3017921498	cra 3C # 90-30	raulferrer7177@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Colfondos	Comfamiliar	Protección	M	1971-03-07	2025-02-10	Operativa	Villas del puerto II	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3017921498	Quincenal	Barranquilla	NO	0	0				SI	1	25	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1143452529	ROBINSON DE JESUS CABALLERO DE LA HOZ	Obra o labor	Todero	7.66	Unión Libre	Bachiller	A+	3012855407	CALLE 9 # 20-02	robinsoncaballero02@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1995-05-16	2025-02-11	Operativa	Palmas Mall	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	570027370070784	Quincenal	Barranquilla	NO	0	0				SI	1	26	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	8803335	JAVIER JOSE CUELLO ARCON	Obra o labor	Todero	7.66	Soltero	Bachiller	O+	3217225310	TV 3C1 # 74A-61	javiercuelloarcon84@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1984-11-11	2025-02-08	Operativa	Edificio Bruxxel	1423500	6189.10	6666.60	0.0	Ahorro	Bancolombia	76700022389	Quincenal	Barranquilla	NO	0	0				SI	1	27	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	32787124	JULAY SULEIKA TORRES LEÓN	Obra o labor	Psicóloga	7.66	Unión Libre	Profesional	A+	3024405799	CARRERA 17 C # 76-14c	julaytorres0128@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo I	0.522	Protección	Comfamiliar	Protección	F	1976-01-28	2025-02-03	Administrativa	Administración	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3024405799	Mensual	Barranquilla	NO	0	0				SI	1	28	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1047418954	JULIO ADOLFO TRAEGER HERRERA	Obra o labor	Conserje	7.66	Soltero	Bachiller	O+	3024670487	TV 1B SUR CALLE 66-192	juliotraegerh@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1990-03-31	2025-01-31	Operativa	Villas del puerto II	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550026100828248	Quincenal	Barranquilla	NO	0	0				SI	1	29	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1047337328	GIOVANNI JESUS MARTINEZ JIMENEZ	Obra o labor	Conserje	7.66	Soltero	Bachiller	O+	3186039029	cra.1g #94-29	giovannismartinez086@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1987-12-28	2025-01-31	Operativa	Villas del puerto II	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550488446097898	Quincenal	Barranquilla	NO	0	0	L	38.0	42.0	SI	1	30	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1001851841	CRITIAN DAVID SUAREZ SANTANA	Obra o labor	Salvavidas	7.66	Unión Libre	Bachiller	O+	3237982060	carrera 1 c # 53 a- 65	barreracristian12@hotmail.com	Dependiente	sin subtipo cotizante	salud Total Eps	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1990-05-08	2025-01-30	Operativa	Firenze	1423500	6189.10	6666.60		Ahorro	Banco Davivienda S.A.	26800179728	Quincenal	Barranquilla	NO	0	0	M	32.0	43.0	SI	1	31	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	10828706414	GINNA PAOLA   ROMERO PEÑUELO	PRESTACION DE SERVICIO	ORIENTADOR	12.0	SOLTERA	BACHILLER	A+	3165607473	CALLE 88#7E-20	GERALYPAO2311220@GMAIL.CO0M	INDEPENDIENTE	sin subtipo cotizante	SURA	Positiva Compañía de Seguros	Riesgo IV	4.35	POVENIR	Comfamiliar	Protección	FEMENINO	1985-10-04	2025-04-08	OPS	CLINICA SANTA ANA DE DIOS	1897661	8251.00	6667.00	0	AHORRO	Davivienda	1082870641	Mensual	BARRANQUILLA	0	0	0	S	30	36	SI	3	97	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	19790335	JOSE ANDRES BARALES SALAS	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3245938603	carrera 2G # 53-80	jbarales2015@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo I	0.522	Porvenir S.A	Comfamiliar	Protección	M	1979-07-14	2025-01-31	Operativa	Villas del puerto II	1423500	6189.10	6666.60		Ahorro	Banco Davivienda S.A.	550488450597833	Quincenal	Barranquilla	NO	0	0	M	34.0	42.0	SI	1	32	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72166475	JOSE ANTONIO RUA MEDINA	Obra o labor	Jardinero	7.66	Unión Libre	Bachiller	A+	3022271225	Carrera 6#134-80	ruamedinajoseantonio@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo IV	4.35	Protección	Comfamiliar	Protección	M	1969-01-01	2025-01-24	Operativa	Edificio Colibri	1423500	6189.10	6666.60		DAVIPLATA	Banco Davivienda S.A.	3008276532	Quincenal	Barranquilla	NO	0	0				SI	1	33	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72333992	JOEL LUIS MALDONADO BORJA	Obra o labor	Supervisor De Aseo	7.66	Unión Libre	Tecnico	A+	3008393982	cra 7 d # 35-34	jmaldonadob2014@hotmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Colpensiones	Comfamiliar	Protección	M	1984-07-16	2025-01-10	Operativa	Administración	1423500	6189.10	6666.60		Ahorro	Banco Davivienda S.A.	26370316411	Quincenal	Barranquilla	NO	0	0	L	34.0	41.0	SI	1	34	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72343091	CARLOS ENRIQUE DE LOS REYES ALVARADO	Obra o labor	Todero	7.66	Union Libre	Bachiller	O+	3103977980	Calle 50 #23-15	carlosdelosreyes1984@gmail.com	Dependiente	sin subtipo cotizante	Cajacopi	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1984-09-10	2025-01-03	Operativa	Palmas Mall	1423500	6189.10	6666.60		Ahorro	Banco Davivienda S.A.	550026800179934	Quincenal	Barranquilla	NO	0	0				SI	1	35	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	8496246	ROGELIO CESAR SALAS TRUYOL	Obra o labor	Auxiliar de Servicios Generales	7.66	Union Libre	Bachiller	O+	3104674857	CL 20 CR 14 #20-03	rogelios1231@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	M	1968-12-31	2025-01-08	Operativa	Edificio Colibri	1423500	6189.10	6666.60		Ahorro	Banco Davivienda S.A.	550488449896841	Quincenal	Barranquilla	NO	0	0				SI	1	36	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	8495616	BLAS SANTIAGO FONTALVO CHARRIS	Obra o labor	Conserje	7.66	Union Libre	Bachiller	O+	3225781953	CLL 9 #8A-54	fontalvoblas5@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1965-10-23	2025-01-13	Operativa	Mystic Park	1423500	6189.10	6666.60	0.0	Ahorro	Bancolombia	48672016048	Quincenal	Barranquilla	No	0	0				SI	1	37	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1143398364	JORGE MARIO MESINO PARRA	Obra o labor	Conserje	7.66	Union Libre	Bachiller	O+	3244578945	Cr 6F #73A-22	jorgemesino24@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1989-05-24	2025-01-13	Operativa	Mystic Park	1423500	6189.10	6666.60		DAVIPLATA	Banco Davivienda S.A.	3147274424	Quincenal	Barranquilla	NO	0	0				SI	1	38	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72261369	CARLOS JOSE DIAZ RODRIGUEZ	Obra o labor	Conserje	7.66	Union Libre	Bachiller	A+	3004961472	CL 119#22-97	diazcarlos2043@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Colfondos	Comfamiliar	Protección	M	1980-03-29	2025-01-15	Operativa	Mystic Park	1423500	6189.10	6666.60		Ahorro	Banco Davivienda S.A.	27600168994	Quincenal	Barranquilla	NO	0	0				SI	1	39	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	73236429	JHON JAIRO ROMERO RODRIGUEZ	Obra o labor	Jardinero	7.66	casado	Bachiller	O+	3012973092	CR16A#5-98	jhon2929@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo IV	4.35	Colpensiones	Comfamiliar	Protección	M	1973-08-05	2024-12-30	Operativa	Firenze	1423500	6189.10	6666.60		DAVIPLATA	Banco Davivienda S.A.	3012973092	Quincenal	Barranquilla	NO	0	0				SI	1	40	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72270396	JOAQUIN PABLO CACERES BLANCO	Obra o labor	Todero	7.66	Casado	Bachiller	A+	3135890690	CLL 74B #21B-203	joaquincaceresblanco@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1979-12-22	2025-01-01	Operativa	Bahia de Cadiz	1423500	6189.10	6666.60		Ahorro	Banco Davivienda S.A.	29200054186	Quincenal	Barranquilla	NO	0	0	M	32.0	41.0	SI	1	41	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72337876	DEIVER ENRIQUE MONTENEGRO JACOME	Obra o labor	Conserje	7.66	union libre	Bachiller	A+	3008576030	CL 27#10-35	deiver.montenegro84@hotmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Colpensiones	Comfamiliar	Protección	M	1984-03-17	2025-01-13	Operativa	Mystic Park	1423500	6189.10	6666.60		Ahorro	Bancolombia	3008576030	Quincenal	Barranquilla	NO	0	0				SI	1	42	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	22546824	IVONNE MARIA FONTALVO BOLAÑO	Obra o labor	Auxiliar de Servicios Generales	7.66	Soltera	Bachiller	O+	3043614573	CLL 11#4A-44	ivonnefontalvobuzonbolano@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Colpensiones	Comfamiliar	Protección	F	1975-10-04	2025-01-02	Operativa	Carniceria Don Pedro	1423500	6189.10	6666.60		Ahorro	Banco Davivienda S.A.	550488449871026	Quincenal	Barranquilla	NO	0	0	L	12.0	40.0	SI	1	43	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	8506650	CARLOS LUIS MORALES BOVEA	Obra o labor	Auxiliar de Servicios Generales	7.66	Union Libre	Bachiller	O+	3012434301	calle 20 # 22 - 62	carlos.3morales@hotmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1979-11-03	2024-12-27	Operativa	Firenze	1423500	6189.10	6666.60		DAVIPLATA	Banco Davivienda S.A.	3012434301	Quincenal	Barranquilla	NO	0	0	L	34.0	42.0	SI	1	44	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72261500	JUAN ALBERTO CELIS HERRERA	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3004319433	Cra # 16-108	jualceh@hotmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Colpensiones	Comfamiliar	Protección	M	1979-07-10	2025-01-02	Operativa	Mistic Park	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3004319493	Quincenal	Barranquilla	0	0	0				SI	1	45	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	55222299	ENEIDA MARGARITA VERA JIMENEZ	Obra o labor	Auxiliar de Servicios Generales	3.83	Unión Libre	Bachiller	A+	3117826921	DG-111TV 27-39	margaritavera744@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Colfondos	Comfamiliar	Protección	F	1975-11-02	2025-01-02	Operativa	Bahia de Cadiz	711750	3094.57	6666.60	0.0	Ahorro	Banco Davivienda S.A.	488449724381	Quincenal	Barranquilla	0	0	0				SI	1	46	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	8509641	DAVID JAVIER MERCADO DIAZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3135426024	CLL 13#1A SUR-181	davidmercado2025@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Colfondos	Comfamiliar	Protección	M	1980-01-27	2025-01-07	Operativa	Firenze	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550026100828081	Quincenal	Barranquilla	0	0	0				SI	1	47	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1043164472	JORGE ANDRES CAMARGO GARCIA	Obra o labor	Todero	7.66	Unión Libre	Tegnologo	O+	3242397123	CR 29 CL 26-132	jorgeandrescamargogarcia@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1995-12-30	2025-01-07	Operativa	Edificio Colibrí	1423500	6189.10	6666.60	0.0	Ahorro	Bancolombia	48100003626	Quincenal	Barranquilla	0	0	0				SI	1	48	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1143434741	HANNER MANUEL CABARCAS PEREIRA	Obra o labor	Todero	7.66	Soltero	Bachiller	O+	3014016023	CLL 55B# 3E-85	pedrocabarcas1966@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo IV	4.35	Colpensiones	Comfamiliar	Protección	M	1991-08-12	2024-12-28	Operativa	Firenze	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550488449699716	Quincenal	Barranquilla	0	0	0				SI	1	49	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	8797173	AGUSTIN ALFONSO MARTINEZ GARIZABALO	Obra o labor	Auxiliar de Servicios Generales	7.66	Casado	Bachiller	O+	3009997784	CALLE 75 # 6 G 04	martizsharon@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1977-11-30	2024-12-14	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	27000169923	Quincenal	Barranquilla	0	0	0	M	30.0	40.0	SI	1	50	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1002022658	ERICK JOHAN POLO OSORIO	Obra o labor	Todero/Piscinero	7.66	Unión Libre	Bachiller	O+	3134341371	CRA 7 # 45 G 86	poloerick00@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	2000-10-17	2024-12-11	Operativa	Parques de Bolivar II	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3134341371	Quincenal	Barranquilla	0	0	0				SI	1	51	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72164999	JOSE MILTON MEZA ZAMBRANO	Obra o labor	Todero/Piscinero	7.66	Unión Libre	Bachiller	B+	3205458823	CRA 20 C # 21 -27	miltonmeza396@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	M	1969-04-21	2024-12-07	Operativa	Torres de Montreal	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3205458823	Quincenal	Barranquilla	0	0	0				SI	1	52	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1043588341	ANDREINA PATRICIA GAMERO CASTRO	Obra o labor	Auxiliar de Servicios Generales	7.66	Soltera	Bachiller	O+	3001469307	CRA 13 C # 59-11 PISO 2 APTO	gameroandreina.18@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1994-10-18	2024-11-30	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Bancolombia	48655323077	Quincenal	Barranquilla	0	0	0	M	10.0	36.0	SI	1	53	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	32768068	CLAUDIA PATRICIA BUELVAS TORRES	Fijo	Coordinador Talento Humano	7.66	Soltera	Profesional	A+	3023765601	Cra 29 # 53D-05	claudiabuelvas235@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo I	0.522	Colpensiones	Comfamiliar	Protección	F	1973-08-23	2024-11-03	Administrativa	Administración	3000000	13043.48	0.00	23333.0	Ahorro	Banco Davivienda S.A.	23300062173	Mensual	Barranquilla	0	0	0				SI	1	54	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72346926	ELVYS JOSE LUBO ACOSTA	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3246500415	Cra 12 # 39A 33	elvys201984@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1984-10-20	2024-11-02	Operativa	Torres de Montreal	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	27000168784	Quincenal	Barranquilla	0	0	0	S	30.0	40.0	SI	1	55	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72170433	JOSE ADOLFO LLANOS CONTRERAS	Obra o labor	Auxiliar de Servicios Generales	7.66	Casado	Profesional	O+	3135517190	calle 48 D # 1 SUR 15	llaconjoadol@gmail.com	Dependiente	sin subtipo cotizante	Coosalud	Positiva Compañía de Seguros	Riesgo II	1.044	Colfondos	Comfamiliar	Protección	M	1970-03-10	2024-11-13	Operativa	SeppsaFumiespecial	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3135517190	Quincenal	Barranquilla	0	0	0				SI	1	56	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	73572357	MARCOS ANTONIO GARZON MONTALVO	Obra o labor	Auxiliar de Servicios Generales	7.66	Casado	Bachiller	A+	3006569000	CL 4 #3-29	mgarzonmontalvo@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	M	1975-10-27	2024-11-12	Operativa	Parques de Bolivar II	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550026600334648	Quincenal	Barranquilla	0	0	0				SI	1	57	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1002160256	JORDAN JESUS MENCO MEJIA	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	A+	3019003266	CL 65 D 12 11	mencojordan41@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	M	2001-06-08	2024-11-09	Operativa	Carnicería Don pedro	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	380200033377	Quincenal	Barranquilla	0	0	0				SI	1	58	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1044423588	JACK HERRERA CEPEDA	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3005493026	CR 4 # 4-28	jack170488@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	M	1988-04-17	2024-11-01	Operativa	Boracay	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550488448887817	Quincenal	Barranquilla	0	0	0				SI	1	59	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72254360	ERICK JAVIER ZAMORANO FLOREZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Casado	Bachiller	O+	3248453955	Mzna 9 casa 6 la paz	ezamoranoflorez@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Cajamag	Protección	M	1979-09-05	2024-11-02	Operativa	Punta Gaira	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3508571984	Quincenal	Santa Marta	0	0	0	M	32.0	41.0	SI	1	60	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
PPT	4994740	DANIEL JOSE VILCHEZ FUENMAYOR	Obra o labor	Auxiliar de Servicios Generales	7.66	Soltero	Bachiller	O+	3017878274	Cra. 34 # 72- 247	vilchezd138@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	M	1994-09-15	2024-11-01	Operativa	Boracay	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550027600168044	Quincenal	Barranquilla	0	0	0	M	30.0	39.0	SI	1	61	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	85372081	FABIO ISACC CANTILLO LAFAURIE	Obra o labor	Auxiliar de Servicios Generales	7.66	Casado	Bachiller	A+	3116778774	Calle 4 # 13-57 pescadito	faica84@hotmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Cajamag	Protección	M	1984-07-16	2024-11-02	Operativa	Punta Gaira	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3008626634	Quincenal	Santa Marta	0	0	0	XXL	38.0	42.0	SI	1	62	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1001871269	LAURYS ANILLO BARBOSA	Obra o labor	Auxiliar de Servicios Generales	7.66	Casada	Bachiller	O+	3016214997	CL 71 No.2-12	laurisanillo07@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	F	1995-05-05	2024-11-01	Operativa	Boracay	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3016214997	Quincenal	Barranquilla	0	0	0	L	16.0	38.0	SI	1	63	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1096240566	JOSE ENRIQUE BORJA MACHUCA	Obra o labor	Auxiliar de Servicios Generales	7.66	Soltero	Bachiller	O+	3045259853	Carrera 34# 142-11	joseenriqueborjamachuca4@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	M	1996-11-07	2024-10-24	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3045259853	Quincenal	Barranquilla	0	0	0				SI	1	64	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72227614	DOUGLAS ENRIQUE MORENO PEREZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	B+	3113687443	CRA 2A SUR #50B-68	douglasmorenoperez@gmail.com	Dependiente	sin subtipo cotizante	Sanitas	Positiva Compañía de Seguros	Riesgo II	1.044	Colfondos	Comfamiliar	Protección	M	1975-10-11	2024-10-23	Operativa	Conjunto Ruiseñor	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3113687443	Quincenal	Barranquilla	0	0	0				SI	1	65	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	40938230	KELIS ESTHER CORTINA PEREZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	B+	3145322328	CRA 16 #6-60	kallycortina@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	F	1981-08-08	2024-10-18	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550026200786213	Quincenal	Barranquilla	0	0	0	XL	18.0	39.0	SI	1	66	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1082899742	LINDA LIZETH CADENA ALVARADO	Obra o labor	Ejecutiva Comercial	7.66	Soltera	Tecnico	O+	3246861720	Calle 29 Kra 1 # 29B-09	lindacadena@hotmail.com	Dependiente	sin subtipo cotizante	Sanitas	Positiva Compañía de Seguros	Riesgo I	0.522	Porvenir S.A	Cajamag	Protección	F	1988-07-27	2024-10-01	Administrativa	Administración	1423500	6189.10	6666.60	6667.0	DAVIPLATA	Banco Davivienda S.A.	3004503419	Mensual	Santa Marta	0	0	0				SI	1	67	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CE	662117	GINETH ALEJANDRA DIAZ PERDOMO	Obra o labor	Ejecutiva Comercial	7.66	Unión Libre	Tecnico	A+	3106813387	CALLE 120 N 42-129	ginethdiazp16@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo I	0.522	Porvenir S.A	Comfamiliar	Protección	F	1992-07-16	2024-10-21	Administrativa	Administración	1523500	6623.91	6666.60	11667.0	Ahorro	Banco Davivienda S.A.	26100828339	Mensual	Barranquilla	0	0	0				SI	1	68	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
PPT	1280686	TATIANA IGLEE PAEZ PALACIO	Obra o labor	Auxiliar de Servicios Generales	7.66	Soltera	Bachiller	O+	3052126863	Calle 49 # 9D-83	tatianapaezpalacio@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1979-10-15	2024-10-10	Operativa	Conjunto Ruiseñor	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550026200786106	Quincenal	Barranquilla	0	0	0				SI	1	69	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	73476090	DEIVIS CASTILLO OSPINO	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3234964518	Calle 66 c # 3c 28	deivicastillo924@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	M	1981-03-31	2024-10-01	Operativa	Conjunto Ruiseñor	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550488448323631	Quincenal	Barranquilla	0	0	0				SI	1	70	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1007071057	YULIS RODRIGUEZ PADILLA	Obra o labor	Auxiliar de Servicios Generales	7.66	Casada	Bachiller	O+	3008781546	cra 8B n. 97-15 apto 1	yulisymiguel671@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1986-04-16	2024-10-04	Operativa	Conjunto Ruiseñor	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	488446439470	Quincenal	Barranquilla	0	0	0				SI	1	71	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	55230561	JOHANNA PATRICIA MAZ AHUMADA	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3161837940	Cra 15B # 54A-30	johannamaz82@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1982-03-09	2024-09-22	Operativa	clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550488451547035	Quincenal	Barranquilla	0	0	0				SI	1	72	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	32797244	MIRIAM DEL CARMEN DONADO PACHECO	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Tecnico	O+	3137713025	CALLE 56 #6B-45	miriamdonado82@gmail.com	Dependiente	sin subtipo cotizante	Salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1976-02-03	2024-09-22	Operativa	Carniceria Alameda del Rio	1423500	6189.10	6666.60	0.0	NEQUI	Bancolombia	3137713025	Quincenal	Barranquilla	0	0	0				SI	1	73	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1042439932	LAURY MELISSA PADILLA SANDOVAL	Obra o labor	Contador	7.66	Casada	Profesional	B+	3016479491	Cr 19 No 44 135 TO 26 AP 201	laurymelissa2411@gmail.com	Dependiente	sin subtipo cotizante	Sanitas	Positiva Compañía de Seguros	Riesgo I	0.522	Porvenir S.A	Comfamiliar	Protección	F	1991-11-24	2024-09-19	Administrativa	Administración	2500000	10869.57	6666.60	16667.0	DAVIPLATA	Banco Davivienda S.A.	3016479491	Mensual	Barranquilla	0	0	0				SI	1	74	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1007048437	JOCELYN WALCOTT DEL VALEE	Obra o labor	Ejecutiva Comercial	7.66	Soltera	Profesional	A+	3135755711	CRA 9D # 148-2	joiswalcott@gmail.com	Dependiente	sin subtipo cotizante	Sanitas	Positiva Compañía de Seguros	Riesgo I	0.522	Porvenir S.A	Comfamiliar	Protección	F	1991-12-18	2024-09-17	Administrativa	Administración	1423500	6189.10	6666.60	6667.0	Ahorro	Banco Davivienda S.A.	570027670039646	Mensual	Barranquilla	0	0	0				SI	1	75	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
PPT	1448700	THANYA LUCILA MOLINA ZAMBRANO	Obra o labor	Auxiliar de Servicios Generales	7.66				3137733208		lucyzambrano756@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1980-09-25	2024-09-01	Operativa	Lagos Caujaral	1423500	6189.10	6666.60	0.0	Efectivo	0	0	Quincenal	Barranquilla	0	0	0				SI	1	76	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1042416895	DEYSI TEJEDOR JULIO	Obra o labor	Auxiliar de Servicios Generales	7.66				3009520265	Calle 66 Kra 50-166		Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1985-09-07	2024-09-01	Operativa	Lagos Caujaral	1423500	6189.10	6666.60	0.0	Efectivo	0	0	Quincenal	Barranquilla	0	0	0				SI	1	77	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72357550	DAIRO ANTONIO PAEZ CARRILLO	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Tecnico		3104896698	Cra 8J # 128-52 mzna 19 casa 124	dairoantonio200985@hotmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Colpensiones	Comfamiliar	Protección	M	1985-09-20	2024-09-01	Operativa	Lagos Caujaral	1423500	6189.10	6666.60	0.0	Efectivo	0	0	Quincenal	Barranquilla	0	0	0				SI	1	78	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	85151827	LUIS VELEZ OROZCO	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Tecnico	A+	3008478855	Calle 7 c#37-52	luisvelezorozco53@gmail.com	Dependiente	sin subtipo cotizante	Sanitas	Positiva Compañía de Seguros	Riesgo II	1.044	colpensiones	Cajamag	Protección	M	1984-08-25	2024-08-05	Operativa	Torres del sol	1423500	6189.10	6666.60	0.0	DAVIPLATA	Banco Davivienda S.A.	3008478855	Quincenal	Barranquilla	0	0	0				SI	1	79	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	55232551	NIVIES ALEXANDRA MALDONADO CAMARGO	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	A+	3005296388	CALLE 10 #46A-157	niviesalexandramaldonado40@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	F	1983-11-21	2024-07-13	Operativa	Administración	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	488446710003	Quincenal	Barranquilla	0	0	0				SI	1	80	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1066093814	DALIA VANESSA CAMACHO MANDÓN	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Técnico	A+	3243222467	Calle 16 # 21-47	vanesamandon95@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	F	1992-12-23	2024-07-15	Operativa	IPS Vihonco	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	488439320539	Quincenal	Barranquilla	0	0	0				SI	1	81	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	32696171	MARLY LUZ TORREGROSA GARCIA	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3006458062	CRA 2 SUR N. 90-74	escobarlinda563@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo II	1.044	Protección	Comfamiliar	Protección	F	1966-01-09	2024-07-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	26100831176	Quincenal	Barranquilla	0	0	0				SI	1	82	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	32783720	ELIANA RAMOS JIMENEZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Casada	Bachiller	O+	3054381242	CRA 16 N. 74B-12	elian03jimenez08@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Colfondos	Comfamiliar	Protección	F	1975-08-03	2024-07-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	488446320951	Quincenal	Barranquilla	0	0	0				SI	1	83	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1129578711	EVELIN DEL CARMEN PALLARES CARDONA	Obra o labor	Auxiliar de Servicios Generales	7.66	Unión Libre	Bachiller	O+	3008665304	CALLE 98C N. 3C 13	evelinpallares368@gmail.com	Dependiente	sin subtipo cotizante	Coosalud	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1987-03-31	2024-07-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	26100831200	Quincenal	Barranquilla	0	0	0				SI	1	84	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1012321172	LUZ ADRIANA LOPEZ GOMEZ	Indefinido	Gerente Comercial	7.66	Casada	Profesional	O+	3102265713	CALLE 47 N. 20 51 APTO 101	gerencia@satcol.com.co	Dependiente	sin subtipo cotizante	Famisanar	Positiva Compañía de Seguros	Riesgo I	0.522	Protección	Comfamiliar	Protección	F	1986-05-21	2024-06-16	Administrativa	Administración	5000000	21739.13	0.00	66667.0	Ahorro	Banco Davivienda S.A.	550488445561373	Mensual	Barranquilla	0	0	0				SI	1	85	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
PPT	5853278	LORELSY MONCADA MOTA	Obra o labor	Auxiliar de Servicios Generales	7.66	Soltera	Bachiller	B+	3004152584	calle 58 #36-50	moncadamotadayana@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1982-03-14	2024-07-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	27000168438	Quincenal	Barranquilla	0	0	0				SI	1	86	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1002443195	KAREN MARGARITA MEDINA FERNANDEZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Casada	Bachiller	A+	3012815847	CRA 15E #72C-51	kmedinafernandez6@gmail.com	Dependiente	sin subtipo cotizante	Mutualser	Positiva Compañía de Seguros	Riesgo II	1.044	Colfondos	Comfamiliar	Protección	F	1988-10-14	2024-07-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	26100831218	Quincenal	Barranquilla	0	0	0				SI	1	87	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	32613191	MILENA PATRICIA MARRUGO MARQUEZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Soltera	Bachiller	O+	3197164539	CRA 10B #40-47	fherroberto@gmail.com	Dependiente	sin subtipo cotizante	Nueva EPS	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1979-03-24	2024-07-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	488446404664	Quincenal	Barranquilla	0	0	0				SI	1	88	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1139614001	JESSICA GAVIRIA OROZCO	Obra o labor	Auxiliar de Servicios Generales	7.66	Soltera	Bachiller	B+	3044929487	CALLE 20B #22 03	jg965974@gmail.com	Dependiente	sin subtipo cotizante	salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1988-08-17	2024-07-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	488446444686	Quincenal	Barranquilla	0	0	0				SI	1	89	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	32896467	GRACIELA MARIA DE LAS AGUAS GUTIERREZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Casada	Bachiller	O+	3024380647	CALLE 60 #12 -17	cheladelasaguas@gmail.com	Dependiente	sin subtipo cotizante	Coosalud	Positiva Compañía de Seguros	Riesgo II	1.044	Porvenir S.A	Comfamiliar	Protección	F	1979-03-18	2024-07-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	550488446398262	Quincenal	Barranquilla	0	0	0				SI	1	90	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	40923597	ELVIRA ELENA CUETO DIAZ	Obra o labor	Auxiliar de Servicios Generales	7.66	Viuda	Primaria	O+	3022959222	TV 2  # 74 74	cuetodiazelviraelena@gmail.com	Dependiente	sin subtipo cotizante	salud Total Eps	Positiva Compañía de Seguros	Riesgo II	1.044	Colpensiones	Comfamiliar	Protección	F	1966-07-18	2024-07-01	Operativa	Clinica Santa Ana de Dios	1423500	6189.10	6666.60	0.0	Ahorro	Banco Davivienda S.A.	488446440916	Quincenal	Barranquilla	0	0	0				SI	1	91	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	8640385	FREDIS ALBERTO  ESCORCIA RAMBAL	PRESTACION DE SERVICIO	OPERACIONES	7.66	CASADO	UNIVERCITARIO	B+	3134796797	CALLE86#78-21	ESCORCIA.FREDIS73@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	EJERCITO NACINAL	Positiva Compañía de Seguros	Riesgo IV	4.35	POVENIR	Comfamiliar	Protección	MASCULINO	1973-09-18	2024-10-26	OPS	Administracion	2700000	11739.00	0.00	23333	AHORRO	DAVIVIENDA	550488448903697	Mensual	BARRANQUILLA	0	0	0	M	34	39	SI	3	92	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	44159747	MILADYS ESTHER  POLO MARQUEZ	PRESTACION DE SERVICIO	MONITORA	7.66	UNION LIBRE	BACHILLER	O+	3022760573	CALLE 55D 3F 90	MILARYESTHERP14@GMAIL .COM	INDEPENDIENTE	sin subtipo cotizante	SURA	Positiva Compañía de Seguros	Riesgo IV	4.35	POVENIR	Comfamiliar	Protección	FEMENINO	1983-02-14	2025-01-24	OPS	Administracion	1423500	6189.00	6667.00	3333	AHORRO	Daviplata	3022760573	Mensual	BARRANQUILLA	0	0	0	M	32	36	SI	3	93	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72330100	DEIVIS  GRANADOS VASQUEZ	PRESTACION DE SERVICIO	ORIENTADOR	12.0	UNION LIBRE	BACHILLER	B+	3006833715	CALLE 99C#9G-60	DEIVISGRANADOS85@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	SALUDTOTAL	Positiva Compañía de Seguros	Riesgo IV	4.35	PORVENIR	Comfamiliar	Protección	MASCULINO	1985-12-28	2024-11-02	OPS	CLINICA SANTA ANA DE DIOS	1897661	8251.00	6667.00	0	AHORRO	Bancolombia	8300025987	Mensual	BARRANQUILLA	0	0	0	M	34	40	SI	3	94	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72280081	LORENZO DAVID  BRUNAL	PRESTACION DE SERVICIO	ORIENTADOR	12.0	SOLTERO	BACHILLER	AB+	3012757421	CARRER A7#24-99	LORO.1983HOTMAIL,COM	INDEPENDIENTE	sin subtipo cotizante	SALUDTOTAL	Positiva Compañía de Seguros	Riesgo IV	4.35	Protección	Comfamiliar	Protección	MASCULINO	1983-02-26	2025-01-25	OPS	CLINICA SANTA ANA DE DIOS	1897661	8251.00	6667.00	0	AHORRO	Bancolombia	91235938893	Mensual	BARRANQUILLA	0	0	0	L	34	41	SI	3	95	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1048210039	JULIO NELSON  GARCIA LARA	PRESTACION DE SERVICIO	ORIENTADOR	12.0	UNION LIBRE	BACHILLER	O+	3046015207	CALLE5 BLOQUE -2	JULIONELSONGARCIALARA61@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	NUEVA EPS	Positiva Compañía de Seguros	Riesgo IV	4.35	PROTECION	Comfamiliar	Protección	MASCULINO	1989-09-01	2024-12-07	OPS	CLINICA SANTA ANA DE DIOS	1897661	8251.00	6667.00	0	AHORRO	Davivienda	550488449492823	Mensual	BARRANQUILLA	0	0	0	M	30	40	SI	3	96	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1042419848	CARLOS SAID  TORRES OLANO	PRESTACION DE SERVICIO	ORIENTADOR	12.0	Soltero	Bachiller	B+	3122474975	KRA 11@#59 A-74	CTORRESSOLANO2609@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	Salud Total	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir	Comfamiliar	Protección	Masculino	1986-09-26	2025-04-14	OPS	SUPERNUMERARIO	1897661	8251.00	6667.00	0	Ahorro	BBVA	91007175	Mensual	Barranquilla	0	0	0	L	34	42	SI	3	111	2025-04-25 04:18:07.184	2025-04-29 23:45:59.166
CC	1099990377	YONATAN DAVID  VERGARA UPARELA	PRESTACION DE SERVICIO	ORIENTADOR	12.0	SOLTERO	BACHILLER	O+	3135133173	CALLE 23B Nº 9B-26	VERGARAYONATAN172@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	FAMILIA DE COLOMBIA	Positiva Compañía de Seguros	Riesgo IV	4.35	POVENIR	Comfamiliar	Protección	MASCULINO	2001-10-19	2024-12-01	OPS	SANAR Y CURAR IPS	1897661	8251.00	6667.00	0	AHORRO	Davivienda	550488449583332	Mensual	BARRANQUILLA	0	0	0	S	30	39	SI	3	103	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1005419509	JESUS FERNANDO  DIAZ CAMPO	PRESTACION DE SERVICIO	ORIENTADOR	12.0	UNION LIBRE	BACHILLER	A+	3218946454	KRA. 3 Nº 10-11	JESUSDIAZCAMPO219@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	SALUD TOTAL	Positiva Compañía de Seguros	Riesgo IV	4.35	POVENIR	Comfamiliar	Protección	MASCULINO	2000-01-11	2024-12-01	OPS	SANAR Y CURAR IPS	1897661	8251.00	6667.00	0	AHORRO	Davivienda	488449528360	Mensual	BARRANQUILLA	0	0	0	XL	34	42	SI	3	104	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1005604449	LUIS CARLOS  HERNADEZ AGUAS	PRESTACION DE SERVICIO	ORIENTADOR	12.0	UNION LIBRE	BACHILLER	O+	3104210420	CALLE 6C Nº 8A-28	PAULAANDREAATENCIOARRIETA@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	SALUD TOTAL	Positiva Compañía de Seguros	Riesgo IV	4.35	COLPENCIONES	Comfamiliar	Protección	MASCULINO	2000-11-21	2024-12-01	OPS	SANAR Y CURAR IPS	1897661	8251.00	6667.00	0	AHORRO	Davivienda	550488449529509	Mensual	BARRANQUILLA	0	0	0	L	34	39	SI	3	105	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1044393626	JORGE ENRIQUE CORONELL MOLINA	PRESTACION DE SERVICIO	ESCOLTA	12.0	SOLTERO	BACHILLER	B+	3002238686	CALLE 9#6-35	GORGECORONELL1219@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	NUEVA EPS	Positiva Compañía de Seguros	Riesgo IV	4.35	POVENIR	Comfamiliar	Protección	MASCULINO	1995-04-15	2025-04-14	OPS	DON PEDRO	1897661	8251.00	6667.00	2339		Bancolombia	8372151243	Mensual	BARRANQUILLA	0	0	0	XL	36	41	SI	3	106	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1129526369	FABIAN ALBERTO  NIETO IMITOLA	PRESTACION DE SERVICIO	CONDUCTOR	12.0	UNION LIBRE	BACHILLER	A+	3171957839	KRA 19# 74-04	FABIANNIETO@HOTMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	SANITAS	Positiva Compañía de Seguros	Riesgo IV	4.35	PROTECION	Comfamiliar	Protección	MASCULINO	1986-04-16	2025-04-04	OPS	DON PEDRO	1897661	8251.00	6667.00	2339	AHORRO	Davivienda	1129526369	Mensual	BARRANQUILLA	0	0	0	L	38	42	SI	3	107	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1140890135	JHON JAIDER  ABUCHAIBE ARRIETA	PRESTACION DE SERVICIO	ESCOLTA	12.0	UNION LIBRE	BACHILLER	O+	3122337248	KRA 27 Nº 47-47	JHONJAIDER13@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	SANITAS	Positiva Compañía de Seguros	Riesgo IV	4.35	PROTECION	Comfamiliar	Protección	MASCULINO	1996-12-13	2024-11-01	OPS	DON PEDRO	1897661	8251.00	6667.00	0	AHORRO	Davivienda	550488447737864	Mensual	BARRANQUILLA	0	0	0	XL	36	41	SI	3	108	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1044210667	JHON DYLAN  TORRES ROJAS	PRESTACION DE SERVICIO	SOPORTE TECNICOS	4.0	SOLTERO	BACHILLER	A+	3202747917	CALLE 47B#20-51	JHONDITORRES02@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	SURA	Positiva Compañía de Seguros	Riesgo IV	4.35	PROTECION	Comfamiliar	Protección	MASCULINO	2003-03-26	2025-02-28	OPS	KNOX SECURITY	711750	6189.00	6667.00	0	AHORRO	Daviplata	3202747917	Mensual	BARRANQUILLA	0	0	0	S	28	40	SI	3	109	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1046812098	ELIAS JUNIOR  CHARRIS VILLA	PRESTACION DE SERVICIO	ORIENTADOR	7.66	UNION LIBRE	BACHILLER	A+	3008875863	KRA 10·#25-7	DAMCHARRI@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	NUEVA EPS	Positiva Compañía de Seguros	Riesgo IV	4.35	POVENIR	Comfamiliar	Protección	MASCULINO	2004-02-19	2025-03-31	OPS	RESTAURANTE PATIOS	1897661	8251.00	6667.00	0	AHORRO	Bancolombia	50531168474	Mensual	BARRANQUILLA	0	0	0	L	34	40	SI	3	110	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72194038	LUIS FERNANDO  BARRETO MEDINA	PRESTACION DE SERVICIO	ORIENTADOR	7.66	UNION LIBRE	BACHILLER	B+	3008545716	KRA. 24Q Nº 2C-33	LUIFERNANDO5@HOTMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	SURA	Positiva Compañía de Seguros	Riesgo IV	4.35	POVENIR	Comfamiliar	Protección	MASCULINO	1973-07-24	2024-11-01	OPS	CARNICERIA DON PEDRO CSAD	1897661	8251.00	6667.00	0	AHORRO	Davivienda	550028000083817	Mensual	BARRANQUILLA	0	0	0	XL	38	41	SI	3	98	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1063078051	JUAN ESTABAN  MONTALVO PORTILLO	PRESTACION DE SERVICIO	ORIENTADOR	12.0	SOLTERO	BACHILLER	AB+	3042501192	CALLE 40 Nº 19-84	MONTALVOJUANESTEBAN0@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	NUEVA EPS	Positiva Compañía de Seguros	Riesgo IV	4.35	POVENIR	Comfamiliar	Protección	MASCULINO	1987-01-18	2024-08-22	OPS	CARNICERIA DON PEDRO CSAD	1897661	8251.00	6667.00	0	AHORRO	Daviplata	3042501192	Mensual	BARRANQUILLA	0	0	0	M	30	42	SI	3	99	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72250453	WILMER FRANCISCO  REDONDO LICONA	PRESTACION DE SERVICIO	ORIENTADOR	12.0	SOLTERO	BACHILLER	O+	3046321354	KRA 19A#73-65	RODWILO480@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	SALUDTOTAL	Positiva Compañía de Seguros	Riesgo IV	4.35	COLPENCIONES	Comfamiliar	Protección	MASCULINO	1980-02-04	2024-10-31	OPS	VIHONCO VIH-ONCOLOGIA	1897661	8251.00	6667.00	0	AHORRO	Davivienda	550028000083825	Mensual	BARRANQUILLA	0	0	0	M	32	40	SI	3	100	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1143135977	DEYMER DAVID RODRIGUEZ MIRANDA	PRESTACION DE SERVICIO	ORIENTADOR	12.0	UNION LIBRE	BACHILLER	A+	3244702484	KRA. 10B Nº 42-28	DEYMERDAVID9@GMAIL.COM	INDEPENDIENTE	sin subtipo cotizante	SALUD TOTAL	Positiva Compañía de Seguros	Riesgo IV	4.35	COLFONDOS	Comfamiliar	Protección	MASCULINO	1992-09-25	2024-11-01	OPS	VIHONCO VIH-ONCOLOGIA	1897661	8251.00	6667.00	0	AHORRO	Davivienda	550025700180778	Mensual	BARRANQUILLA	0	0	0	L	34	43	SI	3	101	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	1048206066	LUIS GABRIEL  GONZALEZ ESTRADA	PRESTACION DE SERVICIO	ORIENTADOR	12.0	UNION LIBRE	BACHILLER	B+	3016160189	CALLE 130#-9-87	LUISGONZALEZOUTLOOK	INDEPENDIENTE	sin subtipo cotizante	SALUD TOTAL	Positiva Compañía de Seguros	Riesgo IV	4.35	COLPENCIONES	Comfamiliar	Protección	MASCULINO	1987-01-18	2024-11-02	OPS	VIHONCO VIH-ONCOLOGIA	1897661	8251.00	6667.00	0	AHORRO	Davivienda	550488448850963	Mensual	BARRANQUILLA	0	0	0	M	38	40	SI	3	102	2025-04-24 23:18:07.184354	2025-04-24 23:18:07.184354
CC	72271169	JHON CARLOS JIMENEZ ESCOBAR	Obra o labor	Conserje	3.83	Soltero	Técnico	O+	3015194038	CRA 57 # 17A-12	jhoncarlosj93@gmail.com	Dependiente	sin subtipo cotizante	EPS Sura	Positiva Compañía de Seguros	Riesgo IV	4.35	Porvenir S.A	Comfamiliar	Protección	Masculino	1981-10-10	2025-04-03	Operativa	Villas del puerto II	711750	3095.00	6667.00	0	DAVIPLATA	Banco Davivienda S.A.	3015194038	Quincenal	Barranquilla	NO	0	0	L	32	42	SI	1	4	2025-04-25 04:18:07.184	2025-08-28 05:14:10.248
\.


--
-- Data for Name: liquidation_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liquidation_details (id, liquidation_id, employee_id, basic_salary, transportation_assistance, mobility_assistance, total_novedades, total_discounts, net_amount, "createdAt", "updatedAt") FROM stdin;
1	1	1	4000000.00	0.00	0.00	0.00	0.00	4000000.00	2025-09-03 01:41:42.329-05	2025-09-03 01:41:42.329-05
2	1	28	1423500.00	199998.00	0.00	0.00	0.00	1623498.00	2025-09-03 01:41:42.333-05	2025-09-03 01:41:42.333-05
3	1	54	3000000.00	0.00	0.00	0.00	0.00	3000000.00	2025-09-03 01:41:42.334-05	2025-09-03 01:41:42.334-05
4	1	67	1423500.00	199998.00	0.00	0.00	0.00	1623498.00	2025-09-03 01:41:42.335-05	2025-09-03 01:41:42.335-05
5	1	68	1523500.00	199998.00	0.00	0.00	0.00	1723498.00	2025-09-03 01:41:42.336-05	2025-09-03 01:41:42.336-05
6	1	74	2500000.00	199998.00	0.00	0.00	0.00	2699998.00	2025-09-03 01:41:42.336-05	2025-09-03 01:41:42.336-05
7	1	75	1423500.00	199998.00	0.00	0.00	0.00	1623498.00	2025-09-03 01:41:42.337-05	2025-09-03 01:41:42.337-05
8	1	85	5000000.00	0.00	0.00	0.00	0.00	5000000.00	2025-09-03 01:41:42.338-05	2025-09-03 01:41:42.338-05
\.


--
-- Data for Name: liquidation_news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liquidation_news (id, liquidation_detail_id, employee_news_id, type_news_id, hours, days, amount, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: liquidations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liquidations (id, company_id, user_id, period, status, total_employees, total_basic_salary, total_transportation_assistance, total_mobility_assistance, total_novedades, total_discounts, total_net_amount, notes, approved_at, approved_by, paid_at, paid_by, created_at, updated_at, created_by) FROM stdin;
1	1	1	2025-08	draft	8	20294000.00	999990.00	0.00	0.00	0.00	21293990.00		\N	\N	\N	\N	2025-09-03 01:41:42.317-05	2025-09-03 01:41:42.317-05	\N
\.


--
-- Data for Name: type_news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_news (id, name, affects, percentage, category, active, "createdAt", "updatedAt", code, duration, payment, applies_to, notes, calculateperhour) FROM stdin;
5	Licencia de Maternidad	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":true,"mobilityassistance":false,"discountvalue":false}	100.00	Licencia	t	\N	2025-08-28 23:07:02.952-05	ILM	abierto	100%+no se cancela auxilio transporte	{"masculino":false,"femenino":true,"ambos":false}	\N	\N
6	Licencia de Paternidad	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	100.00	Licencia	t	\N	2025-08-23 18:39:57.150063-05	ILP	abierto	100%+no se cancela auxilio transporte	{"masculino":true,"femenino":false,"ambos":false}	\N	\N
7	Licencia No Remunerada	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	0.00	Licencia	t	\N	2025-08-23 18:39:57.151025-05	LNR	abierto	0%+ no se cancela auxilio transporte	{"masculino":false,"femenino":false,"ambos":true}	\N	\N
8	Licencia Remunerada	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	100.00	Licencia	t	\N	2025-08-23 18:39:57.152023-05	LR	abierto	100%+no se cancela auxilio transporte	{"masculino":false,"femenino":false,"ambos":true}	\N	\N
9	Licencia por Luto	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	100.00	Licencia	t	\N	2025-08-23 18:39:57.152792-05	LL	abierto	100%+no se cancela auxilio transporte	{"masculino":false,"femenino":false,"ambos":true}	\N	\N
10	Incapacidad por Enfermedad General Inicial	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	66.67	Incapacidad	t	\N	2025-08-23 18:39:57.153602-05	IAM	abierto	66,67%+ no se cancela auxilio de transporte	{"masculino":false,"femenino":false,"ambos":true}	los 2 primeros días son patronales a partir del 3 días es por cobrar a la EPS siempre y cuando el colaborador tenga aportado 1 mes contable en seguridad social de lo contrario va toda al costo	\N
11	Incapacidad por Enfermedad Prorroga	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	66.67	Incapacidad	t	\N	2025-08-23 18:39:57.154573-05	IPA	abierto	66,67%+ no se cancela auxilio de transporte	{"masculino":false,"femenino":false,"ambos":true}	esta incapacidad debe ser reconocida por la EPS en su totalidad siempre y cuando se haya aportado un mes calendario en la seguridad social	\N
12	Incapacidad Inicial por Accidente Trabajo	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	100.00	Incapacidad	t	\N	2025-08-23 18:39:57.155386-05	IRP	abierto	100%+ no se cancela auxilio de transporte	{"masculino":false,"femenino":false,"ambos":true}	se cancela al 100% desde el primer día, el primer día es patronal y a partir del segudo día es reconocido por la ARL	\N
13	Incapacidad Prorroga por Accidente Trabajo	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	100.00	Incapacidad	t	\N	2025-08-23 18:39:57.156063-05	IPR	abierto	100%+ no se cancela auxilio de transporte	{"masculino":false,"femenino":false,"ambos":true}	se cancela al 100%, este valor es asumido por la ARL	\N
14	Recargo Nocturno Ordinario	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	35.00	Recargo	t	\N	2025-08-23 18:39:57.156677-05	RNO	horas laboradas entre las 9:00 pm a 6:00 a.m. de lunes a sábado	el valor de la hora por el 35%	{"masculino":false,"femenino":false,"ambos":true}	\N	t
15	Recargo Nocturno Dominical o Festivo Compensado	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	110.00	Recargo	t	\N	2025-08-23 18:39:57.157255-05	RNFC	horas laboradas entre las 9:00 pm a 6:00 a.m. en domingos y festivos	el valor de la hora por el 110%	{"masculino":false,"femenino":false,"ambos":true}	\N	t
16	Recargo Nocturno Dominical o Festivo No Compensado	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	210.00	Recargo	t	\N	2025-08-23 18:39:57.157785-05	RNF	horas laboradas entre las 9:00 pm a 6:00 a.m. en domingos y festivos	el valor de la hora por el 210%	{"masculino":false,"femenino":false,"ambos":true}	\N	t
17	Hora Extra Diurna	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	125.00	Hora Extra	t	\N	2025-08-23 18:39:57.15831-05	HED	horas laboradas posterior a la jornada 7,67 entre las 6:00 am a 8:00 pm de lunes a sábado	el valor de la hora por el 125%	{"masculino":false,"femenino":false,"ambos":true}	\N	t
19	Hora Extra Nocturna	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	175.00	Hora Extra	t	\N	2025-08-23 18:39:57.161036-05	HEN	horas laboradas posterior a la jornada 7,67 entre las 9:00 pm a 6:00 am de lunes a sabado	el valor de la hora por el 175%	{"masculino":false,"femenino":false,"ambos":true}	\N	t
20	Hora Extra Nocturna Festiva	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	250.00	Hora Extra	t	\N	2025-08-23 18:39:57.161643-05	HENF	horas laboradas posterior a la jornada 7,67 entre las 9:00 pm a 6:00 am domingos y festivos	el valor de la hora por el 250%	{"masculino":false,"femenino":false,"ambos":true}	\N	t
21	Recargo Dominical Compensado	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	75.00	Recargo	t	\N	2025-08-23 18:39:57.162291-05	RDC	jornada laboral en domingos y festivos	el valor de la hora por el 75%	{"masculino":false,"femenino":false,"ambos":true}	\N	t
22	Recargo Dominical No Compensado	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	175.00	Recargo	t	\N	2025-08-23 18:39:57.162928-05	RD	jornada laboral en domingos y festivos	el valor de la hora por el 175%	{"masculino":false,"femenino":false,"ambos":true}	\N	t
23	Hora Ordinaria	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	100.00	Hora Ordinaria	t	\N	2025-08-23 18:39:57.163452-05	HO	horas ordinarias	valor de la hora sin recargos	{"masculino":false,"femenino":false,"ambos":true}	\N	t
25	Retroactivo Salario	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	100.00	Retroactivo	t	\N	2025-08-23 18:39:57.164461-05	RS	abierto	el incremento del salario	{"masculino":false,"femenino":false,"ambos":true}	\N	\N
4	intranet	{"basicmonthlysalary":true,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":true,"discountvalue":false}	3.00	General	t	2025-04-15 22:43:06.565-05	2025-08-23 18:41:24.764-05	TEMP	No especificado	No especificado	{"masculino":false,"femenino":false,"ambos":true}	\N	\N
18	Hora Extra Diurna Festiva	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	200.00	Hora Extra	t	\N	2025-08-23 18:39:57.158967-05	HEDF	horas laboradas posterior a la jornada 7,67 entre las 6:00 am a 8:00 pm en domingos y festivos	el valor de la hora por el 200%	{"masculino":false,"femenino":false,"ambos":true}	\N	t
24	Auxilio Movilidad	{"basicmonthlysalary":false,"hourlyrate":false,"transportationassistance":false,"mobilityassistance":false,"discountvalue":false}	100.00	Auxilio	t	\N	2025-08-23 18:39:57.163936-05	AM	valor fijo mensual	valor auxilio proporcional a los días	{"masculino":false,"femenino":false,"ambos":true}	si excede del 40% del devengado sin incluir el auxilio de trnasporte	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, uuid, email, password, "firstName", "lastName", phone, roles, "accessToken", "refreshToken", "createdAt", "updatedAt", active) FROM stdin;
1	1a2b3c4d-5678-90ef-ghij-klmnopqrstuv	admin@gmail.com	$2b$10$Wpy52QBXay6j967/CYIzQOdeVdelzVyYi1B6WWdTSxe6GsyOvELRq	Super	Admin	1234567890	{superadmin}	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTY5MTQ3MTQsImV4cCI6MTc1NjkxODMxNH0.f87xjY5xrYvXdzPpxAo07ivS3E9OJrRYCl3kZPpNLhw	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTY5MTQ3MTQsImV4cCI6MTc1OTUwNjcxNH0.K8GgFkY3vS1V3_7_27aSa7F6mvj-8yX1AQJMR3KHYVs	2024-11-22 01:34:40.687709-05	2025-09-03 10:51:54.426-05	t
\.


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 3, true);


--
-- Name: contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contracts_id_seq', 1, false);


--
-- Name: employee_news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_news_id_seq', 10, true);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 111, true);


--
-- Name: liquidation_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liquidation_details_id_seq', 8, true);


--
-- Name: liquidation_news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liquidation_news_id_seq', 1, false);


--
-- Name: liquidations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liquidations_id_seq', 1, true);


--
-- Name: type_news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_news_id_seq', 25, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: employee_news employee_news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_news
    ADD CONSTRAINT employee_news_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: liquidation_details liquidation_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidation_details
    ADD CONSTRAINT liquidation_details_pkey PRIMARY KEY (id);


--
-- Name: liquidation_news liquidation_news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidation_news
    ADD CONSTRAINT liquidation_news_pkey PRIMARY KEY (id);


--
-- Name: liquidations liquidations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidations
    ADD CONSTRAINT liquidations_pkey PRIMARY KEY (id);


--
-- Name: type_news type_news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_news
    ADD CONSTRAINT type_news_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: employee_news_approved_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_news_approved_by ON public.employee_news USING btree ("approvedBy");


--
-- Name: employee_news_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_news_company_id ON public.employee_news USING btree ("companyId");


--
-- Name: employee_news_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_news_created_at ON public.employee_news USING btree ("createdAt");


--
-- Name: employee_news_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_news_employee_id ON public.employee_news USING btree ("employeeId");


--
-- Name: employee_news_start_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_news_start_date ON public.employee_news USING btree ("startDate");


--
-- Name: employee_news_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_news_status ON public.employee_news USING btree (status);


--
-- Name: employee_news_type_news_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_news_type_news_id ON public.employee_news USING btree ("typeNewsId");


--
-- Name: idx_liquidation_details_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidation_details_employee_id ON public.liquidation_details USING btree (employee_id);


--
-- Name: idx_liquidation_details_liquidation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidation_details_liquidation_id ON public.liquidation_details USING btree (liquidation_id);


--
-- Name: idx_liquidation_news_detail_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidation_news_detail_id ON public.liquidation_news USING btree (liquidation_detail_id);


--
-- Name: idx_liquidation_news_employee_news_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidation_news_employee_news_id ON public.liquidation_news USING btree (employee_news_id);


--
-- Name: idx_liquidation_news_type_news_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidation_news_type_news_id ON public.liquidation_news USING btree (type_news_id);


--
-- Name: idx_liquidations_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidations_company_id ON public.liquidations USING btree (company_id);


--
-- Name: idx_liquidations_company_period; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidations_company_period ON public.liquidations USING btree (company_id, period);


--
-- Name: idx_liquidations_period; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidations_period ON public.liquidations USING btree (period);


--
-- Name: idx_liquidations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidations_status ON public.liquidations USING btree (status);


--
-- Name: idx_liquidations_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liquidations_user_id ON public.liquidations USING btree (user_id);


--
-- Name: liquidation_details_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX liquidation_details_employee_id ON public.liquidation_details USING btree (employee_id);


--
-- Name: liquidation_details_liquidation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX liquidation_details_liquidation_id ON public.liquidation_details USING btree (liquidation_id);


--
-- Name: liquidation_details_liquidation_id_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX liquidation_details_liquidation_id_employee_id ON public.liquidation_details USING btree (liquidation_id, employee_id);


--
-- Name: liquidation_news_employee_news_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX liquidation_news_employee_news_id ON public.liquidation_news USING btree (employee_news_id);


--
-- Name: liquidation_news_liquidation_detail_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX liquidation_news_liquidation_detail_id ON public.liquidation_news USING btree (liquidation_detail_id);


--
-- Name: liquidation_news_type_news_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX liquidation_news_type_news_id ON public.liquidation_news USING btree (type_news_id);


--
-- Name: liquidations_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX liquidations_company_id ON public.liquidations USING btree (company_id);


--
-- Name: liquidations_company_id_period; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX liquidations_company_id_period ON public.liquidations USING btree (company_id, period);


--
-- Name: liquidations_period; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX liquidations_period ON public.liquidations USING btree (period);


--
-- Name: liquidations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX liquidations_status ON public.liquidations USING btree (status);


--
-- Name: liquidations_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX liquidations_user_id ON public.liquidations USING btree (user_id);


--
-- Name: employee_news employee_news_approvedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_news
    ADD CONSTRAINT "employee_news_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES public.users(id);


--
-- Name: employee_news employee_news_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_news
    ADD CONSTRAINT "employee_news_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id);


--
-- Name: employee_news employee_news_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_news
    ADD CONSTRAINT "employee_news_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public.employees(id);


--
-- Name: employee_news employee_news_typeNewsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_news
    ADD CONSTRAINT "employee_news_typeNewsId_fkey" FOREIGN KEY ("typeNewsId") REFERENCES public.type_news(id);


--
-- Name: employees employees_companyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_companyid_fkey FOREIGN KEY (companyid) REFERENCES public.companies(id);


--
-- Name: liquidation_details liquidation_details_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidation_details
    ADD CONSTRAINT liquidation_details_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE;


--
-- Name: liquidation_details liquidation_details_liquidation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidation_details
    ADD CONSTRAINT liquidation_details_liquidation_id_fkey FOREIGN KEY (liquidation_id) REFERENCES public.liquidations(id) ON UPDATE CASCADE;


--
-- Name: liquidation_news liquidation_news_employee_news_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidation_news
    ADD CONSTRAINT liquidation_news_employee_news_id_fkey FOREIGN KEY (employee_news_id) REFERENCES public.employee_news(id) ON UPDATE CASCADE;


--
-- Name: liquidation_news liquidation_news_liquidation_detail_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidation_news
    ADD CONSTRAINT liquidation_news_liquidation_detail_id_fkey FOREIGN KEY (liquidation_detail_id) REFERENCES public.liquidation_details(id) ON UPDATE CASCADE;


--
-- Name: liquidation_news liquidation_news_type_news_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidation_news
    ADD CONSTRAINT liquidation_news_type_news_id_fkey FOREIGN KEY (type_news_id) REFERENCES public.type_news(id) ON UPDATE CASCADE;


--
-- Name: liquidations liquidations_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidations
    ADD CONSTRAINT liquidations_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: liquidations liquidations_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidations
    ADD CONSTRAINT liquidations_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE;


--
-- Name: liquidations liquidations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidations
    ADD CONSTRAINT liquidations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: liquidations liquidations_paid_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidations
    ADD CONSTRAINT liquidations_paid_by_fkey FOREIGN KEY (paid_by) REFERENCES public.users(id);


--
-- Name: liquidations liquidations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidations
    ADD CONSTRAINT liquidations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

