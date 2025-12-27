--
-- PostgreSQL database dump
--

\restrict sXP8JwPChbSacJtfVru6mxj0Tx4RsxV97dSmNgG6LvPICCPSTh5OpSEpMWRvZuz

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-27 19:43:41

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16665)
-- Name: admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16664)
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO postgres;

--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 221
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- TOC entry 224 (class 1259 OID 16681)
-- Name: businesses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.businesses (
    id integer NOT NULL,
    owner_id integer NOT NULL,
    name character varying(255) NOT NULL,
    address text,
    phone character varying(20),
    subscription_status character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    description text
);


ALTER TABLE public.businesses OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16680)
-- Name: businesses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.businesses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.businesses_id_seq OWNER TO postgres;

--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 223
-- Name: businesses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.businesses_id_seq OWNED BY public.businesses.id;


--
-- TOC entry 232 (class 1259 OID 16756)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16755)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 231
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 230 (class 1259 OID 16741)
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16740)
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO postgres;

--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 229
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- TOC entry 226 (class 1259 OID 16699)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    image_url text,
    parent_category_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16698)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 225
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 242 (class 1259 OID 16858)
-- Name: delivery_updates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_updates (
    id integer NOT NULL,
    order_id integer NOT NULL,
    status character varying(50) NOT NULL,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    location character varying(255)
);


ALTER TABLE public.delivery_updates OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16857)
-- Name: delivery_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.delivery_updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_updates_id_seq OWNER TO postgres;

--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 241
-- Name: delivery_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.delivery_updates_id_seq OWNED BY public.delivery_updates.id;


--
-- TOC entry 244 (class 1259 OID 16875)
-- Name: languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.languages (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.languages OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16874)
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.languages_id_seq OWNER TO postgres;

--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 243
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- TOC entry 236 (class 1259 OID 16802)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16801)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 235
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 234 (class 1259 OID 16779)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    business_id integer NOT NULL,
    status character varying(50) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16778)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 233
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 238 (class 1259 OID 16824)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    method character varying(50) NOT NULL,
    provider_id character varying(100),
    status character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16823)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 237
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 228 (class 1259 OID 16716)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    business_id integer NOT NULL,
    category_id integer,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    image_url text,
    stock integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_approved boolean DEFAULT true
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16715)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 227
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 240 (class 1259 OID 16842)
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    business_id integer NOT NULL,
    plan character varying(100) NOT NULL,
    status character varying(50) NOT NULL,
    start_date date,
    end_date date
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16841)
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscriptions_id_seq OWNER TO postgres;

--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 239
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- TOC entry 246 (class 1259 OID 16887)
-- Name: translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.translations (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    language_id integer NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.translations OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16886)
-- Name: translations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.translations_id_seq OWNER TO postgres;

--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 245
-- Name: translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.translations_id_seq OWNED BY public.translations.id;


--
-- TOC entry 220 (class 1259 OID 16647)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image text,
    phone character varying(20),
    address text,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['buyer'::character varying, 'business_owner'::character varying, 'admin'::character varying, 'super_admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16646)
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
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4876 (class 2604 OID 16668)
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- TOC entry 4878 (class 2604 OID 16684)
-- Name: businesses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.businesses ALTER COLUMN id SET DEFAULT nextval('public.businesses_id_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 16759)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 16744)
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- TOC entry 4880 (class 2604 OID 16702)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 16861)
-- Name: delivery_updates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_updates ALTER COLUMN id SET DEFAULT nextval('public.delivery_updates_id_seq'::regclass);


--
-- TOC entry 4898 (class 2604 OID 16878)
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16805)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 4890 (class 2604 OID 16782)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4893 (class 2604 OID 16827)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 4882 (class 2604 OID 16719)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 16845)
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 16890)
-- Name: translations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations ALTER COLUMN id SET DEFAULT nextval('public.translations_id_seq'::regclass);


--
-- TOC entry 4874 (class 2604 OID 16650)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5101 (class 0 OID 16665)
-- Dependencies: 222
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_users (id, name, email, password_hash, created_at) FROM stdin;
\.


--
-- TOC entry 5103 (class 0 OID 16681)
-- Dependencies: 224
-- Data for Name: businesses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.businesses (id, owner_id, name, address, phone, subscription_status, created_at, description) FROM stdin;
18	51	Raju Vegetables	Ahmedabad	\N	\N	2025-12-26 22:10:52.432984	\N
19	52	Mohan Sweets & Farsan	Ahmedabad	\N	\N	2025-12-26 22:10:52.432984	\N
20	53	Amul Parlour	Ahmedabad	\N	\N	2025-12-26 22:10:52.432984	\N
21	54	Vijay General Store	Ahmedabad	\N	\N	2025-12-26 22:10:52.432984	\N
\.


--
-- TOC entry 5111 (class 0 OID 16756)
-- Dependencies: 232
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, cart_id, product_id, quantity, added_at) FROM stdin;
\.


--
-- TOC entry 5109 (class 0 OID 16741)
-- Dependencies: 230
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, user_id, created_at) FROM stdin;
\.


--
-- TOC entry 5105 (class 0 OID 16699)
-- Dependencies: 226
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, image_url, parent_category_id, created_at) FROM stdin;
73	Farsan (Snacks)	https://tse2.mm.bing.net/th?q=Gujarati%20Farsan%20Thali&w=800&h=600&c=7&rs=1	\N	2025-12-26 22:10:52.432984
74	Dairy & Amul	https://tse2.mm.bing.net/th?q=Amul%20Products&w=800&h=600&c=7&rs=1	\N	2025-12-26 22:10:52.432984
75	Textiles & Clothes	https://tse2.mm.bing.net/th?q=Indian%20Cloth%20Store&w=800&h=600&c=7&rs=1	\N	2025-12-26 22:10:52.432984
76	General Store	https://tse2.mm.bing.net/th?q=Indian%20Kirana%20Store%20Items&w=800&h=600&c=7&rs=1	\N	2025-12-26 22:10:52.432984
77	Stationery	https://tse2.mm.bing.net/th?q=Stationery%20Items%20India&w=800&h=600&c=7&rs=1	\N	2025-12-26 22:10:52.432984
78	Gujarati Sweets	https://tse2.mm.bing.net/th?q=Indian%20Sweets%20Shop&w=800&h=600&c=7&rs=1	\N	2025-12-26 22:10:52.432984
79	Pantry Staples	https://tse2.mm.bing.net/th?q=Indian%20Spices%20and%20Pulses&w=800&h=600&c=7&rs=1	\N	2025-12-26 22:10:52.432984
80	Fresh Sabzi	https://tse2.mm.bing.net/th?q=Indian%20Vegetable%20Market&w=800&h=600&c=7&rs=1	\N	2025-12-26 22:10:52.432984
\.


--
-- TOC entry 5121 (class 0 OID 16858)
-- Dependencies: 242
-- Data for Name: delivery_updates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_updates (id, order_id, status, update_time, location) FROM stdin;
\.


--
-- TOC entry 5123 (class 0 OID 16875)
-- Dependencies: 244
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.languages (id, code, name) FROM stdin;
\.


--
-- TOC entry 5115 (class 0 OID 16802)
-- Dependencies: 236
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price) FROM stdin;
396	317	657	1	350.00
397	317	663	1	20.00
398	317	668	1	10.00
399	318	655	1	15.00
400	319	662	1	70.00
401	320	676	1	120.00
402	321	652	1	34.00
403	322	659	1	200.00
404	323	664	1	58.00
405	324	671	1	150.00
406	325	650	1	160.00
407	326	685	1	15.00
408	327	651	1	80.00
409	328	647	1	120.00
410	329	658	1	450.00
411	329	668	1	10.00
412	330	666	1	95.00
413	330	680	1	130.00
414	330	659	1	200.00
415	331	662	1	70.00
416	331	669	1	45.00
417	332	647	1	120.00
418	333	658	1	450.00
419	333	661	1	400.00
420	334	674	1	400.00
421	335	661	1	400.00
422	336	686	1	30.00
423	337	661	1	400.00
424	338	682	1	800.00
425	339	676	1	120.00
426	340	657	1	350.00
427	341	675	1	250.00
428	342	685	1	15.00
429	343	672	1	300.00
430	344	656	1	120.00
431	345	661	1	400.00
432	346	661	1	400.00
433	346	660	1	600.00
434	347	661	1	400.00
435	348	664	1	58.00
436	348	662	1	70.00
437	348	662	1	70.00
438	349	683	1	40.00
439	350	678	1	150.00
440	350	668	1	10.00
441	351	684	1	20.00
442	352	676	1	120.00
443	353	670	1	50.00
444	354	678	1	150.00
445	354	663	1	20.00
446	354	661	1	400.00
447	355	648	1	140.00
448	356	677	1	500.00
449	356	679	1	120.00
450	357	650	1	160.00
451	358	671	1	150.00
452	359	666	1	95.00
453	359	669	1	45.00
454	360	656	1	120.00
455	361	666	1	95.00
456	362	684	1	20.00
457	363	682	1	800.00
458	364	648	1	140.00
459	365	661	1	400.00
460	366	684	1	20.00
461	367	648	1	140.00
462	368	652	1	34.00
463	369	685	1	15.00
464	370	679	1	120.00
465	370	669	1	45.00
466	371	686	1	30.00
467	372	667	1	50.00
468	373	648	1	140.00
469	373	674	1	400.00
470	374	664	1	58.00
471	375	653	1	35.00
472	376	663	1	20.00
473	376	658	1	450.00
474	377	667	1	50.00
475	377	666	1	95.00
476	378	672	1	300.00
477	379	677	1	500.00
478	380	663	1	20.00
479	380	678	1	150.00
480	381	685	1	15.00
481	382	686	1	30.00
482	383	649	1	200.00
483	384	661	1	400.00
484	384	680	1	130.00
485	384	669	1	45.00
486	385	664	1	58.00
487	386	685	1	15.00
488	387	680	1	130.00
489	387	666	1	95.00
490	388	667	1	50.00
491	389	652	1	34.00
492	390	659	1	200.00
493	390	661	1	400.00
494	391	663	1	20.00
495	391	659	1	200.00
496	391	681	1	160.00
497	392	654	1	58.00
498	393	677	1	500.00
499	394	649	1	200.00
500	395	654	1	58.00
501	396	668	1	10.00
\.


--
-- TOC entry 5113 (class 0 OID 16779)
-- Dependencies: 234
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, business_id, status, total_amount, created_at) FROM stdin;
317	55	21	completed	380.00	2025-12-26 22:10:52.432984
318	57	20	completed	15.00	2025-12-26 22:10:52.432984
319	57	21	completed	70.00	2025-12-26 22:10:52.432984
320	57	19	completed	120.00	2025-12-26 22:10:52.432984
321	56	20	completed	34.00	2025-12-26 22:10:52.432984
322	56	21	completed	200.00	2025-12-26 22:10:52.432984
323	58	21	pending	58.00	2025-12-26 22:10:52.432984
324	58	21	completed	150.00	2025-12-26 22:10:52.432984
325	58	19	completed	160.00	2025-12-26 22:10:52.432984
326	55	18	completed	15.00	2025-12-26 22:10:52.432984
327	55	19	completed	80.00	2025-12-26 22:10:52.432984
328	58	19	pending	120.00	2025-12-26 22:10:52.432984
329	58	21	completed	460.00	2025-12-26 22:10:52.432984
330	57	21	completed	425.00	2025-12-26 22:10:52.432984
331	57	21	completed	115.00	2025-12-26 22:10:52.432984
332	56	19	pending	120.00	2025-12-26 22:10:52.432984
333	56	21	completed	850.00	2025-12-26 22:10:52.432984
334	59	19	completed	400.00	2025-12-26 22:10:52.432984
335	59	21	completed	400.00	2025-12-26 22:10:52.432984
336	55	18	completed	30.00	2025-12-26 22:10:52.432984
337	55	21	completed	400.00	2025-12-26 22:10:52.432984
338	57	18	completed	800.00	2025-12-26 22:10:52.432984
339	57	19	completed	120.00	2025-12-26 22:10:52.432984
340	57	21	completed	350.00	2025-12-26 22:10:52.432984
341	56	19	completed	250.00	2025-12-26 22:10:52.432984
342	57	18	completed	15.00	2025-12-26 22:10:52.432984
343	56	19	completed	300.00	2025-12-26 22:10:52.432984
344	56	20	pending	120.00	2025-12-26 22:10:52.432984
345	56	21	pending	400.00	2025-12-26 22:10:52.432984
346	59	21	completed	1000.00	2025-12-26 22:10:52.432984
347	55	21	completed	400.00	2025-12-26 22:10:52.432984
348	56	21	pending	198.00	2025-12-26 22:10:52.432984
349	55	18	completed	40.00	2025-12-26 22:10:52.432984
350	55	21	pending	160.00	2025-12-26 22:10:52.432984
351	58	18	pending	20.00	2025-12-26 22:10:52.432984
352	58	19	completed	120.00	2025-12-26 22:10:52.432984
353	58	21	completed	50.00	2025-12-26 22:10:52.432984
354	59	21	pending	570.00	2025-12-26 22:10:52.432984
355	57	19	pending	140.00	2025-12-26 22:10:52.432984
356	57	21	completed	620.00	2025-12-26 22:10:52.432984
357	59	19	completed	160.00	2025-12-26 22:10:52.432984
358	59	21	completed	150.00	2025-12-26 22:10:52.432984
359	59	21	completed	140.00	2025-12-26 22:10:52.432984
360	59	20	completed	120.00	2025-12-26 22:10:52.432984
361	59	21	completed	95.00	2025-12-26 22:10:52.432984
362	56	18	completed	20.00	2025-12-26 22:10:52.432984
363	55	18	completed	800.00	2025-12-26 22:10:52.432984
364	55	19	completed	140.00	2025-12-26 22:10:52.432984
365	55	21	completed	400.00	2025-12-26 22:10:52.432984
366	59	18	completed	20.00	2025-12-26 22:10:52.432984
367	59	19	completed	140.00	2025-12-26 22:10:52.432984
368	58	20	completed	34.00	2025-12-26 22:10:52.432984
369	59	18	pending	15.00	2025-12-26 22:10:52.432984
370	59	21	completed	165.00	2025-12-26 22:10:52.432984
371	56	18	completed	30.00	2025-12-26 22:10:52.432984
372	56	21	completed	50.00	2025-12-26 22:10:52.432984
373	59	19	completed	540.00	2025-12-26 22:10:52.432984
374	59	21	completed	58.00	2025-12-26 22:10:52.432984
375	55	20	completed	35.00	2025-12-26 22:10:52.432984
376	55	21	completed	470.00	2025-12-26 22:10:52.432984
377	55	21	completed	145.00	2025-12-26 22:10:52.432984
378	57	19	completed	300.00	2025-12-26 22:10:52.432984
379	57	21	completed	500.00	2025-12-26 22:10:52.432984
380	59	21	completed	170.00	2025-12-26 22:10:52.432984
381	59	18	completed	15.00	2025-12-26 22:10:52.432984
382	56	18	completed	30.00	2025-12-26 22:10:52.432984
383	58	19	pending	200.00	2025-12-26 22:10:52.432984
384	56	21	completed	575.00	2025-12-26 22:10:52.432984
385	58	21	completed	58.00	2025-12-26 22:10:52.432984
386	59	18	completed	15.00	2025-12-26 22:10:52.432984
387	59	21	completed	225.00	2025-12-26 22:10:52.432984
388	58	21	pending	50.00	2025-12-26 22:10:52.432984
389	57	20	completed	34.00	2025-12-26 22:10:52.432984
390	57	21	completed	600.00	2025-12-26 22:10:52.432984
391	59	21	completed	380.00	2025-12-26 22:10:52.432984
392	57	20	completed	58.00	2025-12-26 22:10:52.432984
393	57	21	completed	500.00	2025-12-26 22:10:52.432984
394	59	19	completed	200.00	2025-12-26 22:10:52.432984
395	59	20	completed	58.00	2025-12-26 22:10:52.432984
396	59	21	completed	10.00	2025-12-26 22:10:52.432984
\.


--
-- TOC entry 5117 (class 0 OID 16824)
-- Dependencies: 238
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, order_id, amount, method, provider_id, status, created_at) FROM stdin;
249	317	380.00	upi	\N	success	2025-12-26 22:10:52.432984
250	318	15.00	upi	\N	success	2025-12-26 22:10:52.432984
251	319	70.00	upi	\N	success	2025-12-26 22:10:52.432984
252	320	120.00	upi	\N	success	2025-12-26 22:10:52.432984
253	321	34.00	upi	\N	success	2025-12-26 22:10:52.432984
254	322	200.00	upi	\N	success	2025-12-26 22:10:52.432984
255	324	150.00	upi	\N	success	2025-12-26 22:10:52.432984
256	325	160.00	upi	\N	success	2025-12-26 22:10:52.432984
257	326	15.00	upi	\N	success	2025-12-26 22:10:52.432984
258	327	80.00	upi	\N	success	2025-12-26 22:10:52.432984
259	329	460.00	upi	\N	success	2025-12-26 22:10:52.432984
260	330	425.00	upi	\N	success	2025-12-26 22:10:52.432984
261	331	115.00	upi	\N	success	2025-12-26 22:10:52.432984
262	333	850.00	upi	\N	success	2025-12-26 22:10:52.432984
263	334	400.00	upi	\N	success	2025-12-26 22:10:52.432984
264	335	400.00	upi	\N	success	2025-12-26 22:10:52.432984
265	336	30.00	upi	\N	success	2025-12-26 22:10:52.432984
266	337	400.00	upi	\N	success	2025-12-26 22:10:52.432984
267	338	800.00	upi	\N	success	2025-12-26 22:10:52.432984
268	339	120.00	upi	\N	success	2025-12-26 22:10:52.432984
269	340	350.00	upi	\N	success	2025-12-26 22:10:52.432984
270	341	250.00	upi	\N	success	2025-12-26 22:10:52.432984
271	342	15.00	upi	\N	success	2025-12-26 22:10:52.432984
272	343	300.00	upi	\N	success	2025-12-26 22:10:52.432984
273	346	1000.00	upi	\N	success	2025-12-26 22:10:52.432984
274	347	400.00	upi	\N	success	2025-12-26 22:10:52.432984
275	349	40.00	upi	\N	success	2025-12-26 22:10:52.432984
276	352	120.00	upi	\N	success	2025-12-26 22:10:52.432984
277	353	50.00	upi	\N	success	2025-12-26 22:10:52.432984
278	356	620.00	upi	\N	success	2025-12-26 22:10:52.432984
279	357	160.00	upi	\N	success	2025-12-26 22:10:52.432984
280	358	150.00	upi	\N	success	2025-12-26 22:10:52.432984
281	359	140.00	upi	\N	success	2025-12-26 22:10:52.432984
282	360	120.00	upi	\N	success	2025-12-26 22:10:52.432984
283	361	95.00	upi	\N	success	2025-12-26 22:10:52.432984
284	362	20.00	upi	\N	success	2025-12-26 22:10:52.432984
285	363	800.00	upi	\N	success	2025-12-26 22:10:52.432984
286	364	140.00	upi	\N	success	2025-12-26 22:10:52.432984
287	365	400.00	upi	\N	success	2025-12-26 22:10:52.432984
288	366	20.00	upi	\N	success	2025-12-26 22:10:52.432984
289	367	140.00	upi	\N	success	2025-12-26 22:10:52.432984
290	368	34.00	upi	\N	success	2025-12-26 22:10:52.432984
291	370	165.00	upi	\N	success	2025-12-26 22:10:52.432984
292	371	30.00	upi	\N	success	2025-12-26 22:10:52.432984
293	372	50.00	upi	\N	success	2025-12-26 22:10:52.432984
294	373	540.00	upi	\N	success	2025-12-26 22:10:52.432984
295	374	58.00	upi	\N	success	2025-12-26 22:10:52.432984
296	375	35.00	upi	\N	success	2025-12-26 22:10:52.432984
297	376	470.00	upi	\N	success	2025-12-26 22:10:52.432984
298	377	145.00	upi	\N	success	2025-12-26 22:10:52.432984
299	378	300.00	upi	\N	success	2025-12-26 22:10:52.432984
300	379	500.00	upi	\N	success	2025-12-26 22:10:52.432984
301	380	170.00	upi	\N	success	2025-12-26 22:10:52.432984
302	381	15.00	upi	\N	success	2025-12-26 22:10:52.432984
303	382	30.00	upi	\N	success	2025-12-26 22:10:52.432984
304	384	575.00	upi	\N	success	2025-12-26 22:10:52.432984
305	385	58.00	upi	\N	success	2025-12-26 22:10:52.432984
306	386	15.00	upi	\N	success	2025-12-26 22:10:52.432984
307	387	225.00	upi	\N	success	2025-12-26 22:10:52.432984
308	389	34.00	upi	\N	success	2025-12-26 22:10:52.432984
309	390	600.00	upi	\N	success	2025-12-26 22:10:52.432984
310	391	380.00	upi	\N	success	2025-12-26 22:10:52.432984
311	392	58.00	upi	\N	success	2025-12-26 22:10:52.432984
312	393	500.00	upi	\N	success	2025-12-26 22:10:52.432984
313	394	200.00	upi	\N	success	2025-12-26 22:10:52.432984
314	395	58.00	upi	\N	success	2025-12-26 22:10:52.432984
315	396	10.00	upi	\N	success	2025-12-26 22:10:52.432984
\.


--
-- TOC entry 5107 (class 0 OID 16716)
-- Dependencies: 228
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, business_id, category_id, name, description, price, image_url, stock, created_at, is_approved) FROM stdin;
647	19	73	Nylon Khaman	Soft and spongy Nylon Khaman with green chutney. 500g.	120.00	https://tse2.mm.bing.net/th?q=Nylon%20Khaman%20Gujarati&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
648	19	73	Sandwich Dhokla	White sandwich dhokla with spicy filling. 500g.	140.00	https://tse2.mm.bing.net/th?q=Sandwich%20Dhokla&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
649	19	73	Fafda	Crispy Fafda, perfect with papaya sambharo. 500g.	200.00	https://tse2.mm.bing.net/th?q=Fafda%20Gathiya&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
650	19	73	Khandvi	Soft rolls of gram flour garnished with coconut. 250g.	160.00	https://tse2.mm.bing.net/th?q=Gujarati%20Khandvi&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
651	19	73	Sev Mamra	Classic Sev Mamra mix for snacking. 250g.	80.00	https://tse2.mm.bing.net/th?q=Sev%20Mamra&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
652	20	74	Amul Gold Milk	Full cream Amul Gold milk. 500ml.	34.00	https://tse2.mm.bing.net/th?q=Amul%20Gold%20Milk%20500ml&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
653	20	74	Amul Masti Dahi	Thick curd, perfect for meals. 400g cup.	35.00	https://tse2.mm.bing.net/th?q=Amul%20Masti%20Dahi%20Cup&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
654	20	74	Amul Butter	The taste of India. 100g pack.	58.00	https://tse2.mm.bing.net/th?q=Amul%20Butter%20100g&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
655	20	74	Amul Chhaas	Refreshing spiced buttermilk. 500ml pouch.	15.00	https://tse2.mm.bing.net/th?q=Amul%20Masti%20Spiced%20Buttermilk%20Pouch&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
656	20	74	Amul Shrikhand	Rich Kesar Shrikhand. 500g tub.	120.00	https://tse2.mm.bing.net/th?q=Amul%20Shrikhand%20Kesar&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
657	21	75	Bandhani Dupatta	Traditional Gujarati Bandhani Dupatta.	350.00	https://tse2.mm.bing.net/th?q=Bandhani%20Dupatta%20Red&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
658	21	75	Cotton Kurti	Daily wear printed Cotton Kurti.	450.00	https://tse2.mm.bing.net/th?q=Cotton%20Kurti%20For%20Women&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
659	21	75	Cotton Leggings	Stretchable cotton leggings.	200.00	https://tse2.mm.bing.net/th?q=Ladies%20Cotton%20Leggings&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
660	21	75	Men's Formal Shirt	Formal cotton shirt for men.	600.00	https://tse2.mm.bing.net/th?q=Men%20Formal%20Shirt%20Folded&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
661	21	75	Single Bedsheet	Cotton single bedsheet with pillow cover.	400.00	https://tse2.mm.bing.net/th?q=Cotton%20Single%20Bedsheet%20Design&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
662	21	76	Nirma Detergent	Nirma washing powder. 1kg.	70.00	https://tse2.mm.bing.net/th?q=Nirma%20Washing%20Powder%20Packet&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
663	21	76	Vim Bar	Dishwash bar. 300g.	20.00	https://tse2.mm.bing.net/th?q=Vim%20Dishwash%20Bar&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
664	21	76	Colgate Toothpaste	Colgate Strong Teeth. 100g.	58.00	https://tse2.mm.bing.net/th?q=Colgate%20Strong%20Teeth%20Toothpaste&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
665	21	76	Lux Soap	Lux International creamy soap.	35.00	https://tse2.mm.bing.net/th?q=Lux%20Soap%20Bar&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
666	21	76	Parachute Hair Oil	Pure Coconut Oil. 200ml.	95.00	https://tse2.mm.bing.net/th?q=Parachute%20Coconut%20Oil%20Bottle&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
667	21	77	Classmate Notebook	Classmate long notebook single line. 172pg.	50.00	https://tse2.mm.bing.net/th?q=Classmate%20Notebook%20Long&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
668	21	77	Cello Gripper Pen	Blue ball pen.	10.00	https://tse2.mm.bing.net/th?q=Cello%20Gripper%20Pen%20Blue&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
669	21	77	Fevicol MR	Adhesive squeezy bottle. 100g.	45.00	https://tse2.mm.bing.net/th?q=Fevicol%20MR%20Bottle&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
670	21	77	Apsara Pencils	Pack of 10 pencils with eraser.	50.00	https://tse2.mm.bing.net/th?q=Apsara%20Pencil%20Box&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
671	21	77	Calculator	Basic pocket calculator.	150.00	https://tse2.mm.bing.net/th?q=Citizen%20Pocket%20Calculator&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
672	19	78	Jalebi	Hot crispy Jalebi made in Ghee.	300.00	https://tse2.mm.bing.net/th?q=Jalebi%20Sweet&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
673	19	78	Kaju Katli	Premium cashew fudge.	450.00	https://tse2.mm.bing.net/th?q=Kaju%20Katli&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
674	19	78	Mohanthal	Traditional gram flour fudge.	400.00	https://tse2.mm.bing.net/th?q=Mohanthal%20Sweet&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
675	19	78	Gulab Jamun	Soft syrup-soaked Gulab Jamun.	250.00	https://tse2.mm.bing.net/th?q=Gulab%20Jamun%20Bowl&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
676	19	78	Soan Papdi	Flaky sweet Soan Papdi.	120.00	https://tse2.mm.bing.net/th?q=Soan%20Papdi%20Box&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
677	21	79	Wagh Bakri Tea	Strong Wagh Bakri Premium Tea. 1kg.	500.00	https://tse2.mm.bing.net/th?q=Wagh%20Bakri%20Tea%20Packet&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
678	21	79	Turmeric Powder	Pure Haldi powder. 500g.	150.00	https://tse2.mm.bing.net/th?q=Turmeric%20Powder%20Bowl&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
679	21	79	Basmati Rice	Long grain Daawat Basmati. 1kg.	120.00	https://tse2.mm.bing.net/th?q=Daawat%20Basmati%20Rice%20Packet&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
680	21	79	Tuver Dal	Oily Tuver Dal.	130.00	https://tse2.mm.bing.net/th?q=Tuver%20Dal%20Bowl&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
681	21	79	Fortune Oil	Fortune Refined Oil pouch. 1L.	160.00	https://tse2.mm.bing.net/th?q=Fortune%20Oil%20Pouch&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
682	18	80	Kesar Mango	Premium Gir Kesar Mango box (Seasonal).	800.00	https://tse2.mm.bing.net/th?q=Kesar%20Mango%20Box&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
683	18	80	Desi Tomato	Fresh tomatoes. 1kg.	40.00	https://tse2.mm.bing.net/th?q=Fresh%20Tomato%20Basket&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
684	18	80	Green Chilli	Spicy Indian green chillies.	20.00	https://tse2.mm.bing.net/th?q=Green%20Chilli%20Heap&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
685	18	80	Coriander	Fresh Dhaniya bunch.	15.00	https://tse2.mm.bing.net/th?q=Fresh%20Coriander%20Bunch&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
686	18	80	Potato	Fresh potatoes. 1kg.	30.00	https://tse2.mm.bing.net/th?q=Potato%20Heap&w=800&h=600&c=7&rs=1	50	2025-12-26 22:10:52.432984	t
\.


--
-- TOC entry 5119 (class 0 OID 16842)
-- Dependencies: 240
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, business_id, plan, status, start_date, end_date) FROM stdin;
\.


--
-- TOC entry 5125 (class 0 OID 16887)
-- Dependencies: 246
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.translations (id, key, language_id, value) FROM stdin;
\.


--
-- TOC entry 5099 (class 0 OID 16647)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, created_at, image, phone, address) FROM stdin;
49	Super Admin	super@market.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	super_admin	2025-12-26 22:10:52.432984	\N	\N	\N
50	General Admin	admin@market.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	admin	2025-12-26 22:10:52.432984	\N	\N	\N
51	Raju Shakwala	raju@market.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	business_owner	2025-12-26 22:10:52.432984	\N	\N	\N
52	Mohan Mithai	mohan@market.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	business_owner	2025-12-26 22:10:52.432984	\N	\N	\N
53	Amul Center	amul@market.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	business_owner	2025-12-26 22:10:52.432984	\N	\N	\N
54	Vijay General	vijay@market.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	business_owner	2025-12-26 22:10:52.432984	\N	\N	\N
55	Buyer 1	buyer1@test.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	buyer	2025-12-26 22:10:52.432984	\N	\N	\N
56	Buyer 2	buyer2@test.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	buyer	2025-12-26 22:10:52.432984	\N	\N	\N
57	Buyer 3	buyer3@test.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	buyer	2025-12-26 22:10:52.432984	\N	\N	\N
58	Buyer 4	buyer4@test.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	buyer	2025-12-26 22:10:52.432984	\N	\N	\N
59	Buyer 5	buyer5@test.com	$2b$10$YnWCnq0CewYcfR89tt3yt.8uLKNNQjqvi4Nm3bYzbX0pvpF1gcdBK	buyer	2025-12-26 22:10:52.432984	\N	\N	\N
\.


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 221
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, false);


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 223
-- Name: businesses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.businesses_id_seq', 21, true);


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 231
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 229
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 1, false);


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 225
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 80, true);


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 241
-- Name: delivery_updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.delivery_updates_id_seq', 1, false);


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 243
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.languages_id_seq', 1, false);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 235
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 501, true);


--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 233
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 396, true);


--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 237
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 315, true);


--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 227
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 686, true);


--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 239
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 245
-- Name: translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.translations_id_seq', 1, false);


--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 59, true);


--
-- TOC entry 4907 (class 2606 OID 16679)
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- TOC entry 4909 (class 2606 OID 16677)
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- TOC entry 4911 (class 2606 OID 16692)
-- Name: businesses businesses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_pkey PRIMARY KEY (id);


--
-- TOC entry 4919 (class 2606 OID 16767)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4917 (class 2606 OID 16749)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 16709)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 16868)
-- Name: delivery_updates delivery_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_updates
    ADD CONSTRAINT delivery_updates_pkey PRIMARY KEY (id);


--
-- TOC entry 4931 (class 2606 OID 16885)
-- Name: languages languages_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_code_key UNIQUE (code);


--
-- TOC entry 4933 (class 2606 OID 16883)
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 16812)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4921 (class 2606 OID 16790)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 16835)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4915 (class 2606 OID 16729)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 2606 OID 16851)
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4935 (class 2606 OID 16898)
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- TOC entry 4903 (class 2606 OID 16663)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4905 (class 2606 OID 16661)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4936 (class 2606 OID 16693)
-- Name: businesses businesses_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- TOC entry 4941 (class 2606 OID 16768)
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- TOC entry 4942 (class 2606 OID 16773)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4940 (class 2606 OID 16750)
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4937 (class 2606 OID 16710)
-- Name: categories categories_parent_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(id);


--
-- TOC entry 4949 (class 2606 OID 16869)
-- Name: delivery_updates delivery_updates_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_updates
    ADD CONSTRAINT delivery_updates_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4945 (class 2606 OID 16813)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4946 (class 2606 OID 16818)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4943 (class 2606 OID 16796)
-- Name: orders orders_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id);


--
-- TOC entry 4944 (class 2606 OID 16791)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4947 (class 2606 OID 16836)
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4938 (class 2606 OID 16730)
-- Name: products products_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id);


--
-- TOC entry 4939 (class 2606 OID 16735)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 4948 (class 2606 OID 16852)
-- Name: subscriptions subscriptions_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id);


--
-- TOC entry 4950 (class 2606 OID 16899)
-- Name: translations translations_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


-- Completed on 2025-12-27 19:43:41

--
-- PostgreSQL database dump complete
--

\unrestrict sXP8JwPChbSacJtfVru6mxj0Tx4RsxV97dSmNgG6LvPICCPSTh5OpSEpMWRvZuz

