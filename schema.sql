--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10 (Ubuntu 14.10-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 16.0

-- Started on 2024-02-03 16:28:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16688)
-- Name: Notification; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    user_id uuid,
    title character varying(250),
    body character varying(250),
    create_time timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO devyasin;

--
-- TOC entry 222 (class 1259 OID 16687)
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: devyasin
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notification_id_seq" OWNER TO devyasin;

--
-- TOC entry 3419 (class 0 OID 0)
-- Dependencies: 222
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devyasin
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- TOC entry 214 (class 1259 OID 16504)
-- Name: admins; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public.admins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    username character varying(50),
    email character varying(320),
    uri character varying(255),
    password character varying(350),
    is_active boolean,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    project_id uuid
);


ALTER TABLE public.admins OWNER TO devyasin;

--
-- TOC entry 213 (class 1259 OID 16487)
-- Name: otp; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public.otp (
    id integer NOT NULL,
    user_id character varying(50),
    otp_code integer,
    otp_message character varying(250),
    used boolean DEFAULT false,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    otp_type character varying(20)
);


ALTER TABLE public.otp OWNER TO devyasin;

--
-- TOC entry 212 (class 1259 OID 16486)
-- Name: otp_id_seq; Type: SEQUENCE; Schema: public; Owner: devyasin
--

CREATE SEQUENCE public.otp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otp_id_seq OWNER TO devyasin;

--
-- TOC entry 3420 (class 0 OID 0)
-- Dependencies: 212
-- Name: otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devyasin
--

ALTER SEQUENCE public.otp_id_seq OWNED BY public.otp.id;


--
-- TOC entry 219 (class 1259 OID 16641)
-- Name: configuration; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public.configuration (
    batch_process_limit character varying,
    id integer DEFAULT nextval('public.otp_id_seq'::regclass) NOT NULL
);


ALTER TABLE public.configuration OWNER TO devyasin;

--
-- TOC entry 217 (class 1259 OID 16549)
-- Name: nft_minting; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public.nft_minting (
    request_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    public_address character varying(255),
    quantity integer DEFAULT 1,
    retry_count integer DEFAULT 0,
    transaction_hash character varying(100),
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    nft_id integer,
    project_id uuid,
    chain character varying,
    status public.enum_nft_mint_status DEFAULT 'PENDING'::public.enum_nft_mint_status,
    metadata json,
    image_uri character varying
);


ALTER TABLE public.nft_minting OWNER TO devyasin;

--
-- TOC entry 221 (class 1259 OID 16678)
-- Name: notification; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public.notification (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    title character varying(255),
    body character varying(255),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notification OWNER TO devyasin;

--
-- TOC entry 220 (class 1259 OID 16677)
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: devyasin
--

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_id_seq OWNER TO devyasin;

--
-- TOC entry 3421 (class 0 OID 0)
-- Dependencies: 220
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devyasin
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- TOC entry 210 (class 1259 OID 16419)
-- Name: projects; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50),
    owner_email character varying(100),
    status boolean,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    x_api_key character varying
);


ALTER TABLE public.projects OWNER TO devyasin;

--
-- TOC entry 218 (class 1259 OID 16562)
-- Name: transactions; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    type character varying(55),
    on_chain character varying(55),
    chain character varying(55),
    sender character varying(255),
    receiver character varying(255),
    amount numeric,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20),
    project_id uuid,
    transaction_hash character varying(255)
);


ALTER TABLE public.transactions OWNER TO devyasin;

--
-- TOC entry 216 (class 1259 OID 16525)
-- Name: user_wallets; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public.user_wallets (
    id integer NOT NULL,
    user_id character varying(100),
    public_key character varying(250),
    secret_key character varying(250),
    chain character varying(50),
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    onchain_balance numeric DEFAULT 0,
    offchain_balance numeric DEFAULT 0,
    project_id character varying,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_wallets OWNER TO devyasin;

--
-- TOC entry 215 (class 1259 OID 16524)
-- Name: user_wallets_id_seq; Type: SEQUENCE; Schema: public; Owner: devyasin
--

CREATE SEQUENCE public.user_wallets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_wallets_id_seq OWNER TO devyasin;

--
-- TOC entry 3422 (class 0 OID 0)
-- Dependencies: 215
-- Name: user_wallets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devyasin
--

ALTER SEQUENCE public.user_wallets_id_seq OWNED BY public.user_wallets.id;


--
-- TOC entry 211 (class 1259 OID 16473)
-- Name: users; Type: TABLE; Schema: public; Owner: devyasin
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    username character varying(50),
    email character varying(320),
    uri character varying(255),
    password character varying(260),
    is_active boolean DEFAULT false,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone,
    project_id uuid,
    fcm_token character varying(255)
);


ALTER TABLE public.users OWNER TO devyasin;

--
-- TOC entry 3246 (class 2604 OID 16691)
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- TOC entry 3244 (class 2604 OID 16681)
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- TOC entry 3223 (class 2604 OID 16490)
-- Name: otp id; Type: DEFAULT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.otp ALTER COLUMN id SET DEFAULT nextval('public.otp_id_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 16528)
-- Name: user_wallets id; Type: DEFAULT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.user_wallets ALTER COLUMN id SET DEFAULT nextval('public.user_wallets_id_seq'::regclass);


--
-- TOC entry 3273 (class 2606 OID 16695)
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- TOC entry 3254 (class 2606 OID 16513)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 3269 (class 2606 OID 16656)
-- Name: configuration configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 16559)
-- Name: nft_minting nft_minting_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.nft_minting
    ADD CONSTRAINT nft_minting_pkey PRIMARY KEY (request_id);


--
-- TOC entry 3271 (class 2606 OID 16686)
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 16493)
-- Name: otp otp_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pkey PRIMARY KEY (id);


--
-- TOC entry 3248 (class 2606 OID 16426)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 16571)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3266 (class 2606 OID 16673)
-- Name: transactions transactions_transaction_hash_key; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_transaction_hash_key UNIQUE (transaction_hash);


--
-- TOC entry 3258 (class 2606 OID 16531)
-- Name: user_wallets user_wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.user_wallets
    ADD CONSTRAINT user_wallets_pkey PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 16480)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3261 (class 1259 OID 16631)
-- Name: idx_search_filter; Type: INDEX; Schema: public; Owner: devyasin
--

CREATE INDEX idx_search_filter ON public.transactions USING btree (chain, on_chain, type, amount, status, project_id, user_id);


--
-- TOC entry 3255 (class 1259 OID 16640)
-- Name: public_key_idx; Type: INDEX; Schema: public; Owner: devyasin
--

CREATE INDEX public_key_idx ON public.user_wallets USING btree (public_key);


--
-- TOC entry 3256 (class 1259 OID 16639)
-- Name: public_key_isx; Type: INDEX; Schema: public; Owner: devyasin
--

CREATE INDEX public_key_isx ON public.user_wallets USING btree (public_key);


--
-- TOC entry 3262 (class 1259 OID 16629)
-- Name: sender; Type: INDEX; Schema: public; Owner: devyasin
--

CREATE INDEX sender ON public.transactions USING btree (sender);


--
-- TOC entry 3267 (class 1259 OID 16628)
-- Name: user_id_index; Type: INDEX; Schema: public; Owner: devyasin
--

CREATE INDEX user_id_index ON public.transactions USING btree (user_id);


--
-- TOC entry 3274 (class 2606 OID 16599)
-- Name: users project_id; Type: FK CONSTRAINT; Schema: public; Owner: devyasin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT project_id FOREIGN KEY (project_id) REFERENCES public.projects(id) NOT VALID;


-- Completed on 2024-02-03 16:29:03

--
-- PostgreSQL database dump complete
--

