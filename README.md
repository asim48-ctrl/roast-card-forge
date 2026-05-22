# Roast Card Forge

Free FORGE challenge entry candidate for the "Best Roast My ___ Tool" bounty.

## What it does

- Accepts a target and pasted context.
- Generates a specific roast from deterministic local templates.
- Renders a 1200 x 630 share card on canvas.
- Downloads the result as `roast-card.png`.
- Runs as static HTML/CSS/JS with no backend and no paid API.

## Challenge fit

- Free tier only.
- User input is required.
- Output is a downloadable/shareable PNG card.
- Upload tag should include `roast`.

## Local preview

```sh
python3 -m http.server 4199 --bind 127.0.0.1
```

Open `http://127.0.0.1:4199` from this folder.
