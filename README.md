This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Public news claim assessment

Apply the Supabase migrations in `supabase/migrations/` before using public-news intake. The Next.js server requires `SUPABASE_SERVICE_ROLE_KEY` and `AI_SERVICE_URL`; never expose the service-role key with a `NEXT_PUBLIC_` prefix. Run the FastAPI service from `ai-service/` and configure `GEMINI_API_KEY` in its server-side environment. `GEMINI_MODEL` is optional and defaults to `gemini-2.5-flash`.

The assessment can only cite non-demo source records already stored in `evidence_items`. Gemini receives those records' titles, descriptions, provenance notes, and URLs—not the full contents of linked documents. Users should open the source links and review the original material. If no non-demo records are available, claims are labeled as lacking sufficient evidence rather than being treated as verified.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
