# Patriot Legacy website starter

The root `index.html` is a responsive static website. It reads `data/catalog.json`, the public catalog exported from the private Apps Script backend. No dependencies or build step are required. Enable GitHub Pages using the main branch and root folder to host it.

## Implemented

- District homepage and four school gateways; historical schoolhouse symbol for Community Schools.
- Scottsville green/white accent theme, shared layout, reduced-motion support.
- Separate Athletics and Honors collections. Collection-name mapping matches backend exports.
- Search across titles, names, tags, descriptions, citations and all approved passages. School abbreviation aliases for the three high schools.
- Year/school/collection filters, record details, page/time labels and 24-record pagination.
- Safe text rendering and HTTPS-only media links. Explicit empty and loading/error states.
- Honest contributor-area notice while authentication is under development.

## Publishing reviewed records

Export from the private catalog Sheet. Download the generated JSON. Replace `data/catalog.json` in this repository with that complete export. Commit it. Public changes become available after GitHub Pages deploys. No private Sheets, contact information, consent documents or original uploads belong in this repository.

The site does not connect directly to a private Drive folder. It has no credentials. View-source links require separately reviewed public viewing copies; public access must be tested while signed out. The download flag controls a link, not technical prevention of copying.

## Next stages

Approved mascot assets (current placeholders use school initials), individual historical school directories, expandable school alias data, OCR/page indexing for full yearbooks, a PDF page viewer, timestamp media playback, contributor authentication and uploads, verified-email corrections, and scheduled publishing. The current site displays approved passages and media links; it does not yet provide those future features.

“Community Schools” filters to nonempty school IDs outside the three high-school IDs. Add historical Schools entries with stable IDs, then use them on Items. To display historical school names instead of IDs in this starter, extend `schoolNames` in index.html; a later version will read a reviewed school directory.

Keep catalog schema version 1 for this starter. The implementation is intentionally empty at first, without invented historical records or demonstration people presented as real archive material.
