# Roast Card Forge

Free FORGE challenge entry for the "Best Roast My ___ Tool" bounty.

Live tool: https://asim48-ctrl.github.io/roast-card-forge/
FORGE page: https://forgechallenge.com/tool/roast-card-forge

## What it does

- Accepts a target and pasted context.
- Generates category-specific roasts for resumes, GitHub repos, LinkedIn
  profiles, startup pages, Spotify wraps, dating profiles, dorm rooms, and
  course schedules.
- Re-rolls roast angle, score, diagnosis, evidence, punchline, and fix.
- Renders a 1200 x 630 share card on canvas.
- Downloads the result as `roast-card.png`.
- Copies a social caption for sharing.
- Runs as static HTML/CSS/JS with no backend and no paid API.

## Challenge fit

- Free tier only.
- User input is required.
- Output is a downloadable/shareable PNG card.
- Upload tags include `roast`.
- Tool is public, free, and MIT licensed.

## Submission note

Roast Card Forge accepts a target and context, lets users pick tone/theme, and
renders a downloadable 1200 x 630 PNG roast card entirely client-side. Free,
public, and tagged `roast`.

## Local preview

```sh
python3 -m http.server 4199 --bind 127.0.0.1
```

Open `http://127.0.0.1:4199` from this folder.
