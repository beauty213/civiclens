ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS image_caption TEXT,
  ADD COLUMN IF NOT EXISTS image_credit TEXT;

ALTER TABLE public.claims
  ADD COLUMN IF NOT EXISTS extracted_quote TEXT,
  ADD COLUMN IF NOT EXISTS weight NUMERIC(3, 2)
    CHECK (weight IN (1.00, 0.75, 0.40, 0.20, 0.15, 0.00)),
  ADD COLUMN IF NOT EXISTS order_index INTEGER;

ALTER TABLE public.evidence_items
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.evidence_items
  DROP CONSTRAINT IF EXISTS evidence_items_type_check;

ALTER TABLE public.evidence_items
  ADD CONSTRAINT evidence_items_type_check CHECK (
    type IN (
      'Official document', 'News source', 'External source', 'Photo', 'Video',
      'Dataset', 'Firsthand account', 'official_record', 'sensor_log',
      'eyewitness_account', 'expert_analysis'
    )
  );

INSERT INTO public.locations (id, area, district, state, country)
VALUES
  ('10000000-0000-4000-8000-000000000101', 'National Sports Bureau', 'National', 'India', 'India'),
  ('10000000-0000-4000-8000-000000000102', 'Outer Ring Road Corridor', 'Hyderabad', 'Telangana', 'India'),
  ('10000000-0000-4000-8000-000000000103', 'Lake Water Basin', 'Hyderabad', 'Telangana', 'India')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.articles (
  id, title, summary, body_paragraphs, source_name, author, published_at,
  category, location_id, image_url, image_caption, image_credit, is_demo,
  intake_method, assessment_status
)
VALUES
  (
    'a0000000-0000-4000-8000-000000000101',
    'Podium vs. Market: Did the Silver Medalist Sign 4x More Brand Contracts Than the Gold Medalist?',
    'An investigation into brand sponsorship disparities following the Olympic finals, tracking social media engagement spikes, broadcast airtime, and verified brand disclosure filings.',
    ARRAY[
      'This illustrative case study examines a proposed comparison of Olympic medalists'' endorsement counts, broadcast attention, and prize payments.',
      'Illustrative case study based on the supplied brief. No primary-source URL was provided; this material has not been independently verified.'
    ],
    'CivicLens Case Study (Illustrative)', 'CivicLens Desk', '2026-09-30 00:00:00+00',
    'Sports & Media Ethics', '10000000-0000-4000-8000-000000000101',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
    'Illustrative athletics image; not a photograph of the case-study subjects.', 'Unsplash (illustrative)', TRUE,
    'manual', 'in_progress'
  ),
  (
    'a0000000-0000-4000-8000-000000000102',
    'Flyover Structural Emergency: Expansion Joint Maintenance or Concrete Fracture Panic?',
    'Viral video forwards claimed a major flyover was facing imminent collapse, triggering morning traffic chaos. Municipal inspections reveal scheduled elastomer joint replacements.',
    ARRAY[
      'This illustrative case study contrasts a viral structural-emergency claim with the maintenance and traffic details described in the supplied brief.',
      'Illustrative case study based on the supplied brief. No primary-source URL was provided; this material has not been independently verified.'
    ],
    'CivicLens Case Study (Illustrative)', 'CivicLens Desk', '2026-09-29 23:00:00+00',
    'Municipal Infrastructure', '10000000-0000-4000-8000-000000000102',
    'https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=80&w=1200&auto=format&fit=crop',
    'Illustrative roadway image; not a photograph of the flyover in the case study.', 'Unsplash (illustrative)', TRUE,
    'manual', 'in_progress'
  ),
  (
    'a0000000-0000-4000-8000-000000000103',
    'Urban Lake Contamination: Industrial Effluent Leak vs. Natural Algal Bloom',
    'Citizen complaints of discolored tap water and foam build-up prompt conflicting accounts between local resident welfare associations and pollution control board findings.',
    ARRAY[
      'This illustrative case study examines a proposed water-quality dispute involving sensor readings, industrial discharge, citizen reports, and distribution-pipeline isolation.',
      'Illustrative case study based on the supplied brief. No primary-source URL was provided; this material has not been independently verified.'
    ],
    'CivicLens Case Study (Illustrative)', 'CivicLens Desk', '2026-09-29 22:00:00+00',
    'Public Health & Environment', '10000000-0000-4000-8000-000000000103',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    'Illustrative water image; not a photograph of the lake in the case study.', 'Unsplash (illustrative)', TRUE,
    'manual', 'in_progress'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.claims (
  id, article_id, claim_text, extracted_quote, speaker_or_source, status,
  weight, order_index, status_explanation, missing_information, generated_questions
)
VALUES
  ('c0000000-0000-4000-8000-000000000101', 'a0000000-0000-4000-8000-000000000101', 'Silver medalist signed 14 commercial endorsements within 30 days of the finals, while the Gold medalist signed 3.', 'Silver medalist signed 14 commercial endorsements within 30 days of the finals, while the Gold medalist signed 3.', 'ASCI corporate brand registry and press disclosures', 'Well-supported', 1.00, 0, 'Provisional tier from the supplied brief. The registry entry and disclosures are not linked and this demo claim is not verified.', ARRAY['Specific public source URL and underlying primary record.'], ARRAY[]::TEXT[]),
  ('c0000000-0000-4000-8000-000000000102', 'a0000000-0000-4000-8000-000000000101', 'National sports broadcast allocated 78% more prime-time homecoming coverage to the Silver medalist.', 'National sports broadcast allocated 78% more prime-time homecoming coverage to the Silver medalist.', 'Independent broadcast media monitoring logs', 'Supported with context', 0.75, 1, 'Provisional tier from the supplied brief. Monitoring logs and airport-arrival context are not linked; this demo claim is not verified.', ARRAY['Specific public source URL and underlying primary record.'], ARRAY[]::TEXT[]),
  ('c0000000-0000-4000-8000-000000000103', 'a0000000-0000-4000-8000-000000000101', 'State Ministry withheld cash prize allocations from the Gold medalist due to sponsorship conflicts.', 'State Ministry withheld cash prize allocations from the Gold medalist due to sponsorship conflicts.', 'Ministry of Youth Affairs public treasury circular', 'Contradicted by available evidence', 0.00, 2, 'Provisional tier from the supplied brief. No treasury circular or payment record was linked; this demo claim is not verified.', ARRAY['Specific public source URL and underlying primary record.'], ARRAY[]::TEXT[]),
  ('c0000000-0000-4000-8000-000000000104', 'a0000000-0000-4000-8000-000000000102', 'Flyover deck experienced major structural concrete fracture halting transit.', 'Flyover deck experienced major structural concrete fracture halting transit.', 'Municipal Development Authority Structural Inspection Report #GHMC-402/2026', 'Contradicted by available evidence', 0.00, 0, 'Provisional tier from the supplied brief. The inspection report was not linked; this demo claim is not verified.', ARRAY['Specific public source URL and underlying primary record.'], ARRAY[]::TEXT[]),
  ('c0000000-0000-4000-8000-000000000105', 'a0000000-0000-4000-8000-000000000102', 'Traffic was diverted without advance public advisory.', 'Traffic was diverted without advance public advisory.', 'Traffic Police alert described in the brief', 'Supported with context', 0.75, 1, 'Provisional tier from the supplied brief. The alert and barricade timeline were not linked; this demo claim is not verified.', ARRAY['Specific public source URL and underlying primary record.'], ARRAY[]::TEXT[]),
  ('c0000000-0000-4000-8000-000000000106', 'a0000000-0000-4000-8000-000000000102', 'Contractor was penalized for sub-standard asphalt re-layering.', 'Contractor was penalized for sub-standard asphalt re-layering.', 'Internal vigilance inquiry described in the brief', 'Needs verification', 0.40, 2, 'Provisional tier from the supplied brief. No final penalty circular was linked; this demo claim is not verified.', ARRAY['Specific public source URL and underlying primary record.'], ARRAY[]::TEXT[]),
  ('c0000000-0000-4000-8000-000000000107', 'a0000000-0000-4000-8000-000000000103', 'Dissolved oxygen levels dropped below 2.0 mg/L along eastern inlets.', 'Dissolved oxygen levels dropped below 2.0 mg/L along eastern inlets.', 'State Pollution Control Board Daily Water Sensor Telemetry Logs', 'Well-supported', 1.00, 0, 'Provisional tier from the supplied brief. Telemetry logs were not linked; this demo claim is not verified.', ARRAY['Specific public source URL and underlying primary record.'], ARRAY[]::TEXT[]),
  ('c0000000-0000-4000-8000-000000000108', 'a0000000-0000-4000-8000-000000000103', 'Chemical plant directly breached zero-liquid discharge regulations.', 'Chemical plant directly breached zero-liquid discharge regulations.', 'Industrial Inspector audit and citizen drone footage', 'Conflicting reports', 0.20, 1, 'Provisional tier from the supplied brief. Neither the audit nor footage was linked; this demo claim is not verified.', ARRAY['Specific public source URL and underlying primary record.'], ARRAY[]::TEXT[]),
  ('c0000000-0000-4000-8000-000000000109', 'a0000000-0000-4000-8000-000000000103', 'Drinking water distribution mains are isolated from lake seepage.', 'Drinking water distribution mains are isolated from lake seepage.', 'Water Supply & Sewerage Board Pipeline Pressure Manifest', 'Well-supported', 1.00, 2, 'Provisional tier from the supplied brief. The pipeline manifest was not linked; this demo claim is not verified.', ARRAY['Specific public source URL and underlying primary record.'], ARRAY[]::TEXT[])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.evidence_items (
  id, claim_id, type, title, description, source_url, provenance_note,
  uploader_pseudonym, is_demo, is_verified
)
VALUES
  ('e0000000-0000-4000-8000-000000000101', 'c0000000-0000-4000-8000-000000000101', 'official_record', 'ASCI corporate brand registry and press disclosures', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE),
  ('e0000000-0000-4000-8000-000000000102', 'c0000000-0000-4000-8000-000000000102', 'expert_analysis', 'Prime-time homecoming monitoring logs', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE),
  ('e0000000-0000-4000-8000-000000000103', 'c0000000-0000-4000-8000-000000000103', 'official_record', 'Ministry of Youth Affairs public treasury circular', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE),
  ('e0000000-0000-4000-8000-000000000104', 'c0000000-0000-4000-8000-000000000104', 'official_record', 'Structural Inspection Report #GHMC-402/2026', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE),
  ('e0000000-0000-4000-8000-000000000105', 'c0000000-0000-4000-8000-000000000105', 'official_record', 'Traffic Police alert logged at 05:30 AM', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE),
  ('e0000000-0000-4000-8000-000000000106', 'c0000000-0000-4000-8000-000000000106', 'official_record', 'Internal vigilance inquiry', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE),
  ('e0000000-0000-4000-8000-000000000107', 'c0000000-0000-4000-8000-000000000107', 'sensor_log', 'Daily Water Sensor Telemetry Logs', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE),
  ('e0000000-0000-4000-8000-000000000108', 'c0000000-0000-4000-8000-000000000108', 'official_record', 'Industrial Inspector audit', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE),
  ('e0000000-0000-4000-8000-000000000109', 'c0000000-0000-4000-8000-000000000109', 'official_record', 'Pipeline Pressure Manifest', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE),
  ('e0000000-0000-4000-8000-000000000110', 'c0000000-0000-4000-8000-000000000108', 'eyewitness_account', 'Citizen drone footage of runoff canal', 'Source described in the case-study brief; public record link not supplied.', NULL, 'Illustrative reference only. Not independently verified.', 'CivicLens Case Study', TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;