# Patriot Legacy website

The static site reads only `data/catalog.json`. Keep that file an approved public export. Private contacts, permission documents, catalog sheets, and OCR review packages never belong in this repository.

## Yearbook workflow

The v0.2 Apps Script upgrade stores frozen approvals as private Drive files instead of whole-record JSON in a single Sheet cell. It supports an item-level choice to include draft OCR, per-passage review status and exclusion, and editing passage text directly in the private dashboard. Obtain the private upgrade package from the archive administrator; the website does not contain private backend code.

After rights clearance and item approval, export the public catalog, then replace `data/catalog.json` here. Legacy schemaVersion 1 catalogs remain supported. New optional fields are `mediaType`, `pageCount`, `textPolicy`, and passage `reviewStatus` (`verified` or `ocr_draft`). Missing passage reviewStatus in legacy exports is treated as previously verified text. Unknown private fields are not part of the public export allowlist.

The public viewer lives at `yearbook.html?id=ITEM_ID&page=PDF_PAGE&q=QUERY`. Page numbers are one-based PDF positions, including covers. Printed page labels remain separate. Draft OCR is labeled as potentially inaccurate; checked transcription is identified separately. Excluded pages' text is omitted, while scans remain browseable in the original PDF.

## PDF hosting

Use a direct HTTPS PDF viewing copy in `mediaUrl` and `mediaType: application/pdf`. A same-origin PDF URL is simplest. External hosts must permit CORS. Google Drive /view URLs are linked as external sources; they do not provide a directly renderable PDF here. The viewer explicitly reports unavailable previews and keeps available text search working.

Rendering uses Mozilla PDF.js **6.5.438**, loaded on demand from jsDelivr with its matching worker. The PDF itself is fetched directly by the browser; no PDF data is uploaded by this site to a processing service. The CDN receives dependency requests. Update the pinned version and worker together after compatibility testing. Reference: https://mozilla.github.io/pdf.js/getting_started/ and https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html . The renderer uses `isEvalSupported: false` and does not execute PDF JavaScript actions or expose annotations as active scripts.

Download links appear only when allowDownload=true. This controls the link, not technical prevention of saving publicly viewable files.

## Development

Serve the repository as a static website. No build step is required. Test catalogs and sample PDFs used during local verification are not public archival records and are not part of the production catalog. Site code is split into shared catalog helpers, homepage behavior and yearbook behavior.

Current future work: automated extraction for additional yearbooks, contributor authentication, verified-contact corrections, interviews, historical school directories and mascot assets.
