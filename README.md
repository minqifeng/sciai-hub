# SciAI Hub

SciAI Hub is a curated research workbench for graduate students, PhD students, and AI research practitioners.
Instead of acting like a generic tool directory, it reorganizes the homepage around a real research workflow:
problem framing, literature search, reading, analysis, drafting, and submission.

Live site: [https://sciai-hub.vercel.app](https://sciai-hub.vercel.app)

## What It Does

- Rebuilds the homepage around a workflow-first research station instead of a catalog-first portal.
- Provides a guided entry from hero CTA, stage selector, and research playbooks to the right module.
- Includes high-frequency research modules such as:
  - journal shortlist and submission guidance
  - citation evidence checking
  - PaperDeck literature matrix
  - statistics selector
- Surfaces trust signals through layered sources, manifest-backed updates, model manifests, GitHub daily updates, real diffs, and editorial review records.
- Keeps the site deployable as a static frontend while preserving a structured data layer in local manifest files.

## Core Experience

### 1. Workflow-first homepage

The homepage is organized into:

- Daily AI + research digest
- Weekly curated picks
- Research playbooks
- High-frequency academic modules
- Usage and updates

This removes the old "big directory" browsing pattern and turns the first screen into a decision surface for what to do next.

### 2. Phase-based research navigation

Users can enter the site from their current stage:

- proposal
- literature
- reading
- analysis
- drafting
- submission

Each stage routes to a matching module or playbook instead of forcing the user to search manually.

### 3. Research workflow modules

The site includes a local workflow cockpit with:

- submission wizard
- statistics selector
- PaperDeck matrix
- citation evidence checker
- journal shortlist
- export panel

These are implemented as frontend interactions with local state so the workbench remains easy to deploy and iterate.

### 4. Trust and update infrastructure

The site uses manifest-backed data under [`data/`](./data) to support:

- AI daily layered sources
- GitHub daily generation metadata
- live and snapshot model manifests
- updates with field-level diffs
- editorial review records

## Project Structure

```text
.
|- index.html
|- css/
|  |- style.css
|  |- drawer-override.css
|  `- workflow.css
|- js/
|  |- app.js
|  |- features.js
|  |- station-data.js
|  |- station-home.js
|  |- station-interactions.js
|  |- api.js
|  |- data.js
|  `- recommend.js
|- data/
|  |- ai-daily.manifest.json
|  |- academic-entrypoints.manifest.json
|  |- curated-tools.manifest.json
|  |- github.manifest.json
|  |- models.manifest.json
|  |- models.snapshot.manifest.json
|  |- news.manifest.json
|  `- updates.manifest.json
`- .github/scripts/
   `- generate-station-updates.js
```

## Local Development

This project is a static site.
You can run it locally with any simple file server.

Example:

```bash
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## Data Validation

The manifest layer can be validated with:

```bash
node .github/scripts/validate-manifests.js
```

The update generator can be checked with:

```bash
node --check .github/scripts/generate-station-updates.js
```

## Deployment

Production is deployed on Vercel:

- Production: [https://sciai-hub.vercel.app](https://sciai-hub.vercel.app)

This repository is already linked to the Vercel project `sciai-hub`.

## Positioning

SciAI Hub is not trying to be a comprehensive AI tools directory.
Its goal is to be a more credible and usable research station that helps users move from information intake to concrete research actions.
