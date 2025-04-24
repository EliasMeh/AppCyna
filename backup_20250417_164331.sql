--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: ImageType; Type: TYPE; Schema: public; Owner: bydofi
--

CREATE TYPE public."ImageType" AS ENUM (
    'JPEG',
    'PNG',
    'WEBP',
    'GIF',
    'SVG'
);


ALTER TYPE public."ImageType" OWNER TO bydofi;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: bydofi
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN',
    'MODERATOR'
);


ALTER TYPE public."Role" OWNER TO bydofi;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: CarouselImage; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."CarouselImage" (
    id integer NOT NULL,
    data bytea NOT NULL,
    title text,
    "order" integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "contentType" public."ImageType" DEFAULT 'JPEG'::public."ImageType" NOT NULL
);


ALTER TABLE public."CarouselImage" OWNER TO bydofi;

--
-- Name: CarouselImage_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."CarouselImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CarouselImage_id_seq" OWNER TO bydofi;

--
-- Name: CarouselImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."CarouselImage_id_seq" OWNED BY public."CarouselImage".id;


--
-- Name: Categorie; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."Categorie" (
    id integer NOT NULL,
    nom text NOT NULL
);


ALTER TABLE public."Categorie" OWNER TO bydofi;

--
-- Name: Categorie_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."Categorie_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Categorie_id_seq" OWNER TO bydofi;

--
-- Name: Categorie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."Categorie_id_seq" OWNED BY public."Categorie".id;


--
-- Name: GrilleCategorie; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."GrilleCategorie" (
    id integer NOT NULL,
    "categorie1Id" integer,
    "categorie2Id" integer,
    "categorie3Id" integer,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."GrilleCategorie" OWNER TO bydofi;

--
-- Name: GrilleCategorie_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."GrilleCategorie_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."GrilleCategorie_id_seq" OWNER TO bydofi;

--
-- Name: GrilleCategorie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."GrilleCategorie_id_seq" OWNED BY public."GrilleCategorie".id;


--
-- Name: Image; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."Image" (
    id integer NOT NULL,
    "produitId" integer,
    data bytea NOT NULL
);


ALTER TABLE public."Image" OWNER TO bydofi;

--
-- Name: Image_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."Image_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Image_id_seq" OWNER TO bydofi;

--
-- Name: Image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."Image_id_seq" OWNED BY public."Image".id;


--
-- Name: Panier; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."Panier" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "produitId" integer NOT NULL,
    quantite integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Panier" OWNER TO bydofi;

--
-- Name: Panier_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."Panier_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Panier_id_seq" OWNER TO bydofi;

--
-- Name: Panier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."Panier_id_seq" OWNED BY public."Panier".id;


--
-- Name: PreviousOrder; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."PreviousOrder" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "produitId" integer NOT NULL,
    quantite integer NOT NULL,
    "orderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "prixTotalPasse" integer NOT NULL,
    "prixUnitaire" integer NOT NULL
);


ALTER TABLE public."PreviousOrder" OWNER TO bydofi;

--
-- Name: PreviousOrder_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."PreviousOrder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PreviousOrder_id_seq" OWNER TO bydofi;

--
-- Name: PreviousOrder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."PreviousOrder_id_seq" OWNED BY public."PreviousOrder".id;


--
-- Name: Produit; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."Produit" (
    id integer NOT NULL,
    nom text NOT NULL,
    prix double precision NOT NULL,
    description text NOT NULL,
    "categorieId" integer,
    quantite integer NOT NULL
);


ALTER TABLE public."Produit" OWNER TO bydofi;

--
-- Name: Produit_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."Produit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Produit_id_seq" OWNER TO bydofi;

--
-- Name: Produit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."Produit_id_seq" OWNED BY public."Produit".id;


--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."Subscription" (
    id integer NOT NULL,
    "produitId" integer NOT NULL,
    "userId" integer NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone
);


ALTER TABLE public."Subscription" OWNER TO bydofi;

--
-- Name: Subscription_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."Subscription_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Subscription_id_seq" OWNER TO bydofi;

--
-- Name: Subscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."Subscription_id_seq" OWNED BY public."Subscription".id;


--
-- Name: Text; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."Text" (
    id integer NOT NULL,
    content text NOT NULL
);


ALTER TABLE public."Text" OWNER TO bydofi;

--
-- Name: Text_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."Text_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Text_id_seq" OWNER TO bydofi;

--
-- Name: Text_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."Text_id_seq" OWNED BY public."Text".id;


--
-- Name: TopDuMoment; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."TopDuMoment" (
    id integer NOT NULL,
    "produitId" integer NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TopDuMoment" OWNER TO bydofi;

--
-- Name: TopDuMoment_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."TopDuMoment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."TopDuMoment_id_seq" OWNER TO bydofi;

--
-- Name: TopDuMoment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."TopDuMoment_id_seq" OWNED BY public."TopDuMoment".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    mdp text NOT NULL,
    nom text NOT NULL,
    prenom text NOT NULL,
    adresse text,
    email text NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL
);


ALTER TABLE public."User" OWNER TO bydofi;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: bydofi
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO bydofi;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bydofi
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: bydofi
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO bydofi;

--
-- Name: CarouselImage id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."CarouselImage" ALTER COLUMN id SET DEFAULT nextval('public."CarouselImage_id_seq"'::regclass);


--
-- Name: Categorie id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Categorie" ALTER COLUMN id SET DEFAULT nextval('public."Categorie_id_seq"'::regclass);


--
-- Name: GrilleCategorie id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."GrilleCategorie" ALTER COLUMN id SET DEFAULT nextval('public."GrilleCategorie_id_seq"'::regclass);


--
-- Name: Image id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Image" ALTER COLUMN id SET DEFAULT nextval('public."Image_id_seq"'::regclass);


--
-- Name: Panier id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Panier" ALTER COLUMN id SET DEFAULT nextval('public."Panier_id_seq"'::regclass);


--
-- Name: PreviousOrder id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."PreviousOrder" ALTER COLUMN id SET DEFAULT nextval('public."PreviousOrder_id_seq"'::regclass);


--
-- Name: Produit id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Produit" ALTER COLUMN id SET DEFAULT nextval('public."Produit_id_seq"'::regclass);


--
-- Name: Subscription id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Subscription" ALTER COLUMN id SET DEFAULT nextval('public."Subscription_id_seq"'::regclass);


--
-- Name: Text id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Text" ALTER COLUMN id SET DEFAULT nextval('public."Text_id_seq"'::regclass);


--
-- Name: TopDuMoment id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."TopDuMoment" ALTER COLUMN id SET DEFAULT nextval('public."TopDuMoment_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: CarouselImage; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."CarouselImage" (id, data, title, "order", active, "createdAt", "contentType") FROM stdin;
\.


--
-- Data for Name: Categorie; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."Categorie" (id, nom) FROM stdin;
1	Électronique
2	Vêtements
3	Alimentation
\.


--
-- Data for Name: GrilleCategorie; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."GrilleCategorie" (id, "categorie1Id", "categorie2Id", "categorie3Id", active, "createdAt", "updatedAt") FROM stdin;
1	1	2	3	t	2025-04-17 11:40:54.957	2025-04-17 11:40:59.073
\.


--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."Image" (id, "produitId", data) FROM stdin;
\.


--
-- Data for Name: Panier; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."Panier" (id, "userId", "produitId", quantite) FROM stdin;
\.


--
-- Data for Name: PreviousOrder; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."PreviousOrder" (id, "userId", "produitId", quantite, "orderDate", "prixTotalPasse", "prixUnitaire") FROM stdin;
\.


--
-- Data for Name: Produit; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."Produit" (id, nom, prix, description, "categorieId", quantite) FROM stdin;
3	Chocolat Bio	4.99	Chocolat noir bio 70%	3	200
2	T-shirt Cool	29.99	T-shirt 100% coton	2	100
1	Smartphone XYZ	599.99	Un smartphone dernière génération	1	50
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."Subscription" (id, "produitId", "userId", "startDate", "endDate") FROM stdin;
\.


--
-- Data for Name: Text; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."Text" (id, content) FROM stdin;
1	Bruh
\.


--
-- Data for Name: TopDuMoment; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."TopDuMoment" (id, "produitId", "position", active, "createdAt", "updatedAt") FROM stdin;
17	3	1	t	2025-04-17 14:35:00.752	2025-04-17 14:35:11.368
2	2	1	t	2025-04-17 14:16:30.706	2025-04-17 14:35:18
8	1	3	t	2025-04-17 14:30:21.942	2025-04-17 14:38:20.115
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public."User" (id, mdp, nom, prenom, adresse, email, verified, role) FROM stdin;
1	$2b$10$rJr7GthDKbxuDOmKIUzAS.lbtT.Ps0GaQ.yJhczB4A1vR4FarWze2	Admin	Super	\N	admin@example.com	t	ADMIN
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: bydofi
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
46976078-e7cd-428d-8622-c4fa1a1660dc	d4345304503535dc999460a67ab8574a52a4e5248a9e083a72789e930713c789	2025-04-17 13:34:59.676359+02	20250220104831_add_prix_total_passe	\N	\N	2025-04-17 13:34:59.675398+02	1
2b3b740e-8cdd-4fde-80b8-2688f9edcb81	fceaa5ea755acd7492192e95642b28986fc3dbc5649fcb7ea886bfa671a67c27	2025-04-17 13:34:59.636226+02	20241125074205_init	\N	\N	2025-04-17 13:34:59.600885+02	1
cc6616e0-f698-4240-9477-626de920c8fc	cd82a3848b879fded5ac11f70dd9d87b6179acfa04f67c1357bee85e037eba06	2025-04-17 13:34:59.63799+02	20241227111821_init	\N	\N	2025-04-17 13:34:59.636649+02	1
a2aa6122-0e41-40cb-943d-881febf07bbd	c510a2cd8914928a43e4822d6dd22300eeb761dec7abb3a472fafa425049fd95	2025-04-17 13:34:59.639382+02	20241231101355_init	\N	\N	2025-04-17 13:34:59.638316+02	1
caa2ecba-1615-4667-802b-362ca3279398	bbe3b8a85e7b7854285a391b584e72a9210c4bd9809b741df4086b1ad51e1e59	2025-04-17 13:34:59.678967+02	20250220105104_add_order_relations	\N	\N	2025-04-17 13:34:59.676675+02	1
d035a7c6-7bdf-42e5-aca0-dbfc0c8422a6	bd38b04b4d7bde9b2de23767d0c2806c5edfeda930d1536d1f62712adb3a4b64	2025-04-17 13:34:59.640761+02	20241231113408_init	\N	\N	2025-04-17 13:34:59.639719+02	1
321244af-51b3-4721-9f6f-bcbf0e52724a	214d41b6d11fcf752bf1df6b19d37ce2871777590084935b61b42cc90046edc2	2025-04-17 13:34:59.647631+02	20250114221126_texte_dynamique	\N	\N	2025-04-17 13:34:59.641084+02	1
e26451cf-1cca-49ec-a1af-20da5b1f32e0	5632c95409365f1004e1a2901c8142faf389c57cb59fd2c9029974c8bef937c7	2025-04-17 13:34:59.654461+02	20250115082718_ajout_blob	\N	\N	2025-04-17 13:34:59.648048+02	1
0bcc88e8-5c40-4f2e-8266-ca3f98435ab0	63caefbeba7db3b3892c154a7d97eafefeb70980bc3773b8accd324615423258	2025-04-17 13:34:59.682933+02	20250324093817_add_carousel_images	\N	\N	2025-04-17 13:34:59.679244+02	1
fc3f7ba5-edc1-48c0-884a-396829c0845e	b26111516ee21c0bb13831b177f4d8b24283cff9844fa4ed07dce9b416f58d80	2025-04-17 13:34:59.659858+02	20250119000619_test	\N	\N	2025-04-17 13:34:59.654829+02	1
556df26a-58aa-42ff-a550-e9f56b9e7ae9	68060c2b86ce37d71a5481ed0a7c1bf61ce9d1d27542ff44a47e8b371333896a	2025-04-17 13:34:59.661834+02	20250119001504_update_image_data_type	\N	\N	2025-04-17 13:34:59.66021+02	1
0e8e7543-8d8a-45b4-9a85-757854bb54c0	ff71c96c064d29ef85429515aba6af10cb751c35a13a924922a17870a2331c17	2025-04-17 13:34:59.666363+02	20250120075337_test	\N	\N	2025-04-17 13:34:59.662202+02	1
6415c5f7-eaae-40b5-8d47-b737008ba378	bb0b2e0e3af7b677b5dbd0d6e9685a4bb1d4bd05a268da1fd2d745226955ce34	2025-04-17 13:34:59.684225+02	20250324101845_update_content_types	\N	\N	2025-04-17 13:34:59.683217+02	1
658f42a7-f246-4700-857a-61bc60bdf74b	9ad208ad3a5e36af1441d4ead8d2b8a92e85f84262c347bb0f2117411669fc83	2025-04-17 13:34:59.667943+02	20250120100952_update_image_data_type	\N	\N	2025-04-17 13:34:59.66671+02	1
58917e86-dcf3-45a1-8829-69bac47de36a	6a9402c73e4aa81b5cb902de51e9015e47b0eb77f8d0982bbb29a502347c5f49	2025-04-17 13:34:59.67167+02	20250127100532_add_categorie_model	\N	\N	2025-04-17 13:34:59.668263+02	1
8f106563-ef16-461b-bb2f-7caf48bd95e1	4ea89d0bed4a2f456967d087b80c0013db9f672e448bf47cedf3c537efc5829b	2025-04-17 13:34:59.673671+02	20250127105318_add_quantite_produit	\N	\N	2025-04-17 13:34:59.671973+02	1
298e8bda-cda0-483b-8031-488eff03382d	e4941492a695f77fa0ea05f4866aaacbfa54173348244a286e29b52f85b69f35	2025-04-17 13:34:59.690324+02	20250417100101_unique_top_du_moment	\N	\N	2025-04-17 13:34:59.684542+02	1
94542276-0df4-4b98-acbc-a11a29076835	b98cff19a40d3257c0c883984d7d68af0421667ba2971680c930f10b7cb2a72e	2025-04-17 13:34:59.675079+02	20250127105431_ajout_quantite	\N	\N	2025-04-17 13:34:59.673913+02	1
\.


--
-- Name: CarouselImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."CarouselImage_id_seq"', 1, false);


--
-- Name: Categorie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."Categorie_id_seq"', 3, true);


--
-- Name: GrilleCategorie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."GrilleCategorie_id_seq"', 1, true);


--
-- Name: Image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."Image_id_seq"', 1, false);


--
-- Name: Panier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."Panier_id_seq"', 1, false);


--
-- Name: PreviousOrder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."PreviousOrder_id_seq"', 1, false);


--
-- Name: Produit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."Produit_id_seq"', 3, true);


--
-- Name: Subscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."Subscription_id_seq"', 1, false);


--
-- Name: Text_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."Text_id_seq"', 1, true);


--
-- Name: TopDuMoment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."TopDuMoment_id_seq"', 24, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bydofi
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: CarouselImage CarouselImage_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."CarouselImage"
    ADD CONSTRAINT "CarouselImage_pkey" PRIMARY KEY (id);


--
-- Name: Categorie Categorie_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Categorie"
    ADD CONSTRAINT "Categorie_pkey" PRIMARY KEY (id);


--
-- Name: GrilleCategorie GrilleCategorie_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."GrilleCategorie"
    ADD CONSTRAINT "GrilleCategorie_pkey" PRIMARY KEY (id);


--
-- Name: Image Image_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_pkey" PRIMARY KEY (id);


--
-- Name: Panier Panier_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Panier"
    ADD CONSTRAINT "Panier_pkey" PRIMARY KEY (id);


--
-- Name: PreviousOrder PreviousOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."PreviousOrder"
    ADD CONSTRAINT "PreviousOrder_pkey" PRIMARY KEY (id);


--
-- Name: Produit Produit_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Produit"
    ADD CONSTRAINT "Produit_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: Text Text_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Text"
    ADD CONSTRAINT "Text_pkey" PRIMARY KEY (id);


--
-- Name: TopDuMoment TopDuMoment_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."TopDuMoment"
    ADD CONSTRAINT "TopDuMoment_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: TopDuMoment_produitId_key; Type: INDEX; Schema: public; Owner: bydofi
--

CREATE UNIQUE INDEX "TopDuMoment_produitId_key" ON public."TopDuMoment" USING btree ("produitId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: bydofi
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: GrilleCategorie GrilleCategorie_categorie1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."GrilleCategorie"
    ADD CONSTRAINT "GrilleCategorie_categorie1Id_fkey" FOREIGN KEY ("categorie1Id") REFERENCES public."Categorie"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GrilleCategorie GrilleCategorie_categorie2Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."GrilleCategorie"
    ADD CONSTRAINT "GrilleCategorie_categorie2Id_fkey" FOREIGN KEY ("categorie2Id") REFERENCES public."Categorie"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GrilleCategorie GrilleCategorie_categorie3Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."GrilleCategorie"
    ADD CONSTRAINT "GrilleCategorie_categorie3Id_fkey" FOREIGN KEY ("categorie3Id") REFERENCES public."Categorie"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Image Image_produitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES public."Produit"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Panier Panier_produitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Panier"
    ADD CONSTRAINT "Panier_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES public."Produit"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Panier Panier_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Panier"
    ADD CONSTRAINT "Panier_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PreviousOrder PreviousOrder_produitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."PreviousOrder"
    ADD CONSTRAINT "PreviousOrder_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES public."Produit"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PreviousOrder PreviousOrder_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."PreviousOrder"
    ADD CONSTRAINT "PreviousOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Produit Produit_categorieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Produit"
    ADD CONSTRAINT "Produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES public."Categorie"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Subscription Subscription_produitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES public."Produit"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Subscription Subscription_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TopDuMoment TopDuMoment_produitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bydofi
--

ALTER TABLE ONLY public."TopDuMoment"
    ADD CONSTRAINT "TopDuMoment_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES public."Produit"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

