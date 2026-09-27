# CivicLens Goals 2 & 3: Completion Summary

## Overview
This document summarizes the completion of **Goal 2** (Replace `/demo` with "How it works" modal) and **Goal 3** (Unify category taxonomy and fix carried-over issues).

---

## Goal 2: Replace /demo with "How it works" Modal ✅

### Completed
- **Status:** ✅ Fully implemented
- **Location:** `components/home/HowItWorksModal.tsx` (preexisting, enhanced)
- **Integration:** Modal is fixed near the top of the homepage at position `right-4 top-[4.75rem]`

### What Changed
1. **Modal Integration into Homepage (`app/page.tsx`)**
   - `HowItWorksModal` is imported and rendered at the top of the homepage
   - Appears as a fixed "How it works" button with `BookOpenCheck` icon
   - Accessible via keyboard (Escape to close, proper ARIA attributes)

2. **Enhanced Copy for Image Attribution**
   - **Step 4 updated:** "A grounding score summarizes the review. Open the story to read each claim, its receipts, and **always credit the original source and image**."
   - **Footer disclaimer updated:** "Always verify by reading the source receipts and **attributed image credits**."
   - Explicitly ties image attribution to the product's "receipts, not hallucinations" philosophy

3. **CTA to Manual Intake**
   - "Submit your own story" button links to `/intake` with proper focus restoration
   - Fallback path (manual submission) remains fully functional even if auto-fetch fails

### Design
- **Button:** Fixed position, compact size (`px-3 py-2`), dark theme (`bg-zinc-900/95`)
- **Modal:** Full-screen overlay, centered dialog (max-width: `max-w-xl`), dark theme, 4-step explanation
- **Accessibility:** Semantic HTML, ARIA labels, tab trapping, Escape key support

---

## Goal 3: Fix Carried-Over Issues ✅

### 3.1 Unified Category Taxonomy ✅

**Before:** 9 categories scattered across multiple files (some files had duplicates, others had outdated lists)
- `Technology`, `Science`, `Culture` (out of scope for v1)
- Duplicate category names in different files

**After:** Single source of truth with exactly **7 civic categories**
```typescript
// lib/newsCategories.ts
const CIVIC_NEWS_CATEGORIES = [
  'Politics',
  'Education',
  'Business',
  'Environment',
  'Public Safety',
  'Health',
  'High Hoax Risk',  // ← Added as a first-class category, not a separate filter
] as const;
```

**Files Updated:**
1. **`lib/newsCategories.ts`** - Single source of truth
   - Exported `CIVIC_NEWS_CATEGORIES` constant
   - Exported `CivicNewsCategory` type
   - Exported `isCivicNewsCategory()` type guard

2. **`types/index.ts`** - Type definition
   - `NewsCategory` type now uses the 7-category union

3. **`app/publish/page.tsx`** - Intake form
   - Replaced hardcoded category list with import from `newsCategories`
   - `const CATEGORIES = CIVIC_NEWS_CATEGORIES`

4. **`components/home/StoryPulseFilters.tsx`** - Homepage filter
   - Added "High Hoax Risk" to `CATEGORY_ICONS` map
   - Filter chip automatically generates from `CIVIC_NEWS_CATEGORIES`
   - No manual duplication

5. **`components/forensics/NewsIntakeForm.tsx`** - Already unified (no changes needed)

6. **`app/explore/page.tsx`** - Explore page filter
   - Imports `CIVIC_NEWS_CATEGORIES` from central location
   - Filters auto-populate from the shared list

### Why "High Hoax Risk" is a Category, Not a Filter
- **Product alignment:** Viral/unverified claims can occur in *any* civic topic (Politics, Health, Business, etc.)
- **UI consistency:** One dropdown for all topics, rather than a mix of "topic" and "hoax-detection" filters
- **Auto-fetch compatibility:** When Gemini scores articles for hoax risk, it tags them as `High Hoax Risk` category alongside other civic topics
- **Homepage feed:** Users can browse "High Hoax Risk" stories like any other category

---

### 3.2 Empty States for /explore ✅

**Status:** Filter now correctly excludes demo articles
- **File:** `app/explore/page.tsx`
- **Change:** Added `if (article.isDemo) return false;` to `filteredArticles` logic
- **Result:** Demo articles (if any) are invisible on `/explore`, ensuring real user-facing content only

**Remaining consideration:** Once Goal 1's auto-fetch runs successfully, verify all 7 categories have at least one real article. If a category is empty, it will show the "No articles matched your query" message—this is acceptable UX.

---

### 3.3 /publish Navigation Wiring ✅

**Status:** All navigation is functional or properly labeled

| Card | Link/Action | Status |
|------|------------|--------|
| Write an Article | → `/intake` | ✅ Wired (Links to article submission) |
| I Witnessed Something | "Coming soon" label | ✅ Labeled |
| Share Something I Saw | "Coming soon" label | ✅ Labeled |
| Ask My Community | "Coming soon" label | ✅ Labeled |
| Share My Opinion | "Coming soon" label | ✅ Labeled |

**Code location:** `app/publish/page.tsx` lines 155–175
- Only "Write an Article" (id: `article`) is functional and links to `/intake`
- All others have `aria-disabled="true"` and show "Coming soon" badge

---

### 3.4 /local "Start Discussion" Button ✅

**Status:** Functional (toggles inline form creation)
- **File:** `app/local/page.tsx`
- **Behavior:** Clicking button shows/hides a form for creating new community posts
- **Disclaimer:** "Discussion preview only. Posts are not saved or shared with other people."
- **Assessment:** This accurately reflects that `/local` is a UI stub with no persistent backend

---

## File-by-File Summary

### New Files
1. **`components/news/ArticleImage.tsx`** (created)
   - Reusable image component with fallback category icon
   - Handles image load failures gracefully
   - Used in both feed cards and article detail

2. **`supabase/migrations/20260927000003_article_image_attribution.sql`** (created)
   - Adds `image_caption` and `image_credit` columns to `articles` table
   - Safe migration with `IF NOT EXISTS` clauses

### Modified Files
1. **`types/index.ts`**
   - Added `imageCredit?: string` to `Article` interface
   - Updated `NewsCategory` type to include all 7 civic categories + "High Hoax Risk"

2. **`lib/newsCategories.ts`**
   - Centralized category list with `CIVIC_NEWS_CATEGORIES`
   - Exported type guard `isCivicNewsCategory()`

3. **`ai-service/main.py`** (Major enhancements for Goal 1)
   - Added `ArticlePageParser` class for HTML parsing
   - Implemented `extract_publisher_page()` function with safety checks
   - Enhanced `/trending-stories` endpoint to scrape and enrich articles

4. **`lib/dataService.ts`**
   - Added `imageCredit` field mapping from Supabase

5. **`lib/forensics/analyzeArticle.ts`**
   - Extended to accept and persist `imageUrl`, `imageCaption`, `imageCredit`

6. **`app/api/forensic/refresh-feed/route.ts`**
   - Added image field validation and sanitization
   - Passes image metadata to article persistence layer

7. **`components/home/HowItWorksModal.tsx`**
   - Enhanced steps to mention image attribution and receipts
   - Updated footer disclaimer

8. **`components/home/StoryPulseFilters.tsx`**
   - Added "High Hoax Risk" icon to category map
   - Removed "High Hoax Risk" as a separate filter button

9. **`components/news/StoryCard.tsx`** (Goal 1 integration)
   - Uses `ArticleImage` component for image display
   - Shows grounding score overlay on image

10. **`app/article/[id]/page.tsx`** (Goal 1 integration)
    - Integrated `ArticleImage` for full-width article header

11. **`app/publish/page.tsx`**
    - Imports unified `CIVIC_NEWS_CATEGORIES`
    - Category dropdown now auto-syncs with other pages

12. **`app/explore/page.tsx`**
    - Filters out demo articles
    - Categories auto-populated from central source

---

## Validation ✅

### TypeScript
- ✅ Full `npx tsc --noEmit` passes with zero errors

### ESLint
- ✅ No linting errors on modified components

### Type Safety
- ✅ All image fields properly typed with optional chaining
- ✅ Category type union enforced across all components
- ✅ Article type includes all new image attribution fields

---

## Next Steps (For Future Sessions)

### Immediate (Before Vercel Deploy)
1. **Database Migration:** Run `20260927000003_article_image_attribution.sql` on Supabase
2. **Environment Secrets:** Ensure `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are set in server environment
3. **Testing:**
   - Test `/trending-stories` endpoint with real Gemini API
   - Verify image URLs are hotlinked correctly
   - Test feed refresh with at least one article per category

### For Goal 1 Completion (Auto-Fetch)
1. Confirm `/trending-stories` returns enriched articles with image metadata
2. Verify claim extraction works on auto-fetched articles
3. Test `/api/forensic/refresh-feed` end-to-end
4. Confirm all 7 categories have at least one real article in feed

### For Production Readiness
1. Add image caching strategy if needed (currently hotlinked, no rehosting)
2. Monitor image CDN performance (external URLs may be slow)
3. Add fallback images for broken og:image meta tags

---

## Summary of Scope Changes

**Removed/Deprecated:**
- "High Hoax Risk" as a separate filter button on homepage (now a regular category)
- Duplicate category lists (consolidated to single source)

**Added:**
- Image attribution fields (`imageCaption`, `imageCredit`) to Article type and database
- "How it works" modal with explicit mention of source attribution
- Image fallback component (`ArticleImage`)

**Unchanged (Out of Scope):**
- Incident Room (remains stub with "coming soon" message)
- Live community discussion (posts not persisted, preview-only)
- Citizen report intake (exists but safety-check logic stubbed)
- Snapdragon/NPU on-device inference (badge-only, no real deployment)

---

## Key Design Decisions

### Why Image Attribution Matters
1. **Legal:** Publishers own copyrights to article images; hotlinking with attribution is standard practice
2. **Product Pitch:** CivicLens is "receipts, not hallucinations"—image attribution is part of that promise
3. **Trust:** Users can verify the original article and see if the image is actually from that publication

### Why "High Hoax Risk" is a Category
- Allows auto-fetch to tag any topic's viral/unverified claims in one pass
- Simplifies UI (one category dropdown, not a mix of filters)
- Aligns with forensic grounding pipeline (claims are evaluated, not topics)

### Why Modal Over Separate Route
- Reduces navigation overhead (users learn "how it works" without leaving homepage)
- Improves discoverability (fixed button always visible)
- Faster path to manual `/intake` as fallback

---

## Files Ready for Deployment

All modified files are:
- ✅ TypeScript type-safe
- ✅ ESLint compliant
- ✅ Consistent with existing code conventions (from AGENTS.md & CLAUDE.md)
- ✅ Backward compatible (optional image fields, no breaking changes)

**Deploy checklist:**
- [ ] Run database migration on Supabase
- [ ] Confirm `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in production env
- [ ] Test feed refresh with real Gemini API
- [ ] Verify image display on all 7 categories
- [ ] Monitor error logs for broken image URLs
