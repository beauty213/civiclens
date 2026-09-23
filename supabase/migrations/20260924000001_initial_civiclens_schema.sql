-- ==========================================================
-- CIVICLENS POSTGRESQL PRODUCTION MIGRATION
-- Migration Version: 20260924000001
-- Description: Core schema for CivicLens (Locations, Articles, Claims, Evidence, Incidents, Comments, Corrections)
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. GEOGRAPHIC HIERARCHY
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_area ON public.locations(area);
CREATE INDEX IF NOT EXISTS idx_locations_district ON public.locations(district);

-- 2. USER PROFILES & PSEUDONYMS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    pseudonym VARCHAR(100) NOT NULL UNIQUE,
    bio TEXT,
    is_verified_contributor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    body_paragraphs TEXT[] NOT NULL DEFAULT '{}',
    source_name VARCHAR(150) NOT NULL,
    author VARCHAR(150) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    category VARCHAR(50) NOT NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);

-- 4. CLAIMS (Claim Lens Engine)
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    claim_text TEXT NOT NULL,
    speaker_or_source VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (
        status IN (
            'Well-supported',
            'Supported with context',
            'Needs verification',
            'Conflicting reports',
            'Insufficient evidence',
            'Contradicted by available evidence'
        )
    ),
    status_explanation TEXT NOT NULL,
    missing_information TEXT[] DEFAULT '{}',
    conflicting_reports TEXT,
    generated_questions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_claims_article_id ON public.claims(article_id);

-- 5. EVIDENCE ITEMS (Evidence Lab)
CREATE TABLE IF NOT EXISTS public.evidence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (
        type IN (
            'Official document',
            'News source',
            'External source',
            'Photo',
            'Video',
            'Dataset',
            'Firsthand account'
        )
    ),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    source_url TEXT,
    provenance_note TEXT NOT NULL,
    uploader_pseudonym VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_claim_id ON public.evidence_items(claim_id);

-- 6. CITIZEN INCIDENTS & FIRSTHAND OBSERVATIONS
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    general_location TEXT NOT NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    firsthand_observations TEXT[] NOT NULL DEFAULT '{}',
    hearsay_or_third_party TEXT[] DEFAULT '{}',
    uncertainties TEXT[] NOT NULL DEFAULT '{}',
    evidence_notes TEXT,
    author_pseudonym VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DISCUSSIONS (Article & Claim Specific)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('Opinion', 'Question', 'Evidence', 'Firsthand experience', 'Correction')
    ),
    author_pseudonym VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_claim_id ON public.comments(claim_id);

-- 8. ARTICLE REVISIONS & CORRECTIONS
CREATE TABLE IF NOT EXISTS public.corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    reason TEXT NOT NULL,
    editor_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read access on locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on claims" ON public.claims FOR SELECT USING (true);
CREATE POLICY "Allow public read access on evidence_items" ON public.evidence_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access on incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Allow public read access on comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public read access on corrections" ON public.corrections FOR SELECT USING (true);
