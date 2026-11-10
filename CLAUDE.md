# Felix's Games — rules for working in this repo

Live site: https://felixwang.pages.dev (Cloudflare Pages project `felixwang`).
Every push to `main` deploys automatically via `.github/workflows/deploy.yml`. Pushing to `main` = publishing to the public site, so test before you push.

Games are designed and drawn by Felix, a kid. Players are kids and families.

## Layout

- `index.html` — lobby. Lists games from the `GAMES` array in its `<script>`.
- `<game>/` — one self-contained folder per game (e.g. `star-army/`).
- `privacy/` — one privacy policy for all games.
- `counter/` — owner page showing the live number of Star Army Online players (reads `/api/online`). Not a game, not linked from the lobby.
- `functions/`, `rooms-worker/`, `wrangler.toml` — the room relay used by two-device games (`star-army-online/`). It only forwards game messages between the two players in a room and stores nothing. Not part of any game folder; never served as static files.
- `sw.js` (root) — retired service worker that cleans up the first release. Do not delete it and never turn it into a caching worker.
- `_headers` — keeps service workers and manifests uncached. Keep it.
- `README.md`, `CLAUDE.md` — docs; `*.md` files are not deployed.

## Updating an existing game (e.g. new version from another chat or artifact)

Games are often developed elsewhere as a single `index.html` (plus images). That standalone version does NOT contain the PWA wiring. When you copy a new version into `<game>/index.html`:

1. **Keep these lines inside `<head>`** (adapt the title for other games), replacing the plain viewport meta:
   ```html
   <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
   <link rel="manifest" href="manifest.webmanifest">
   <meta name="theme-color" content="#3a3a3a">
   <link rel="icon" type="image/png" href="favicon.png">
   <link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
   <meta name="apple-mobile-web-app-title" content="Star Army">
   ```
2. **Keep this script right before `</body>`:**
   ```html
   <script>
   if('serviceWorker' in navigator && location.protocol!=='file:'){
     addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
   }
   </script>
   ```
3. If the new version adds files (images, sounds), add them to the `FILES` list in `<game>/sw.js` so they work offline.
4. Keep the existing save keys (e.g. `starArmySave`, `starArmyUnlocked`) so players don't lose progress.
5. Optionally refresh `<game>/thumb.jpg` (16:9 screenshot of gameplay, ~640×360) used by the lobby card.

## Adding a new game

1. Create a new kebab-case folder, e.g. `dragon-run/`. Copy `star-army/manifest.webmanifest`, `sw.js`, `icons/`, `favicon.png` as a starting point.
2. `manifest.webmanifest`: change `name`, `short_name`, `description`; keep `"start_url": "./"` and `"scope": "./"`.
3. `sw.js`: set `const VERSION = '<folder>-__BUILD__';` and list the game's files in `FILES`.
4. New icons (192, 512, maskable 512, apple-touch 180) and a `thumb.jpg`.
5. Add the head lines and script from above to its `index.html`.
6. Add an entry at the top of `GAMES` in the root `index.html`.

## Hard rules

- **Never edit `__BUILD__`** in any `sw.js`. The deploy workflow replaces it with the commit id; that is how installed players get updates. Don't bump versions by hand.
- **Home button:** games show a 🏠 button that goes to `../` (the games page) only when served from the website (http/https); it stays hidden in app builds.
- **Each game folder is self-contained.** No runtime references to files outside the folder; relative paths only (`art.jpg`, not `/art.jpg`). Each game must be shippable alone (Capacitor → App Store / Google Play).
- **Save keys must be prefixed with the game name** (all games share one origin's localStorage).
- **No ads, analytics, trackers, third-party scripts, CDNs, or external links** inside games. (Exception approved by the owner: two-device games may open a WebSocket to this site's own room relay at `/api/room/<CODE>`; no typed names, chat or stored data; players pick a nickname from a fixed list in the game, sent as list positions only. Star Army's title screen may also read the live player numbers from `/api/online`, and single-player Star Army sends an anonymous "still playing" signal to `/api/playing` about once a minute while on screen: only a random id made fresh on every launch, never stored on the device, deleted on the server ~2.5 minutes after the last signal. Approved by the owner on 2026-11-07. The menus of Hide & Seek and Hide & Seek Online may also read the live player numbers from `/api/online` (read-only; nothing is sent). Approved by the owner on 2026-11-09. Paper Adventure shows its own live player count the same way as Star Army: it reads `/api/online` (the `paper` number) and sends the same anonymous signal to `/api/playing` with `"g":"pa"`; approved by the owner on 2026-11-09.) The privacy policy promises this, and it keeps the games eligible for the App Store Kids category and Google Play Families policy. If a change would need any of these, stop and ask.
- No personal data about Felix or the family beyond his first name.
- Don't commit secrets. The Cloudflare token lives only in the GitHub secret `CLOUDFLARE_API_TOKEN`.

## Before pushing

Serve the repo locally (`python3 -m http.server`) and check in a browser: lobby lists the game, the game loads and plays, `navigator.serviceWorker` registers with scope `/<game>/`, and the game still loads offline after one visit. Then commit and push to `main`, and check the Actions run succeeded.

For `star-army-online/`, also test two players: run a local relay with the same protocol and open `star-army-online/?server=http://localhost:8787` in two browsers (one makes a room, the other joins with the code).
