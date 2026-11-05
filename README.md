# Felix's Games

Games designed and drawn by Felix. Live at **https://felixwang.pages.dev**

Every push to `main` deploys automatically to Cloudflare Pages (project `felixwang`) through GitHub Actions.

For AI assistants working in this repo, see **CLAUDE.md** (includes how to update a game without breaking the PWA).

## Layout

```
index.html            Lobby: lists every game (edit the GAMES list at the bottom)
privacy/              One privacy policy for all games (needed for app stores)
assets/               Files used by the lobby only
sw.js                 Retired root service worker (cleans up the first release). Leave it.
_headers              Cloudflare headers: service workers are never cached
star-army/            Star Army vs. The Bugs
  index.html          The game
  manifest.webmanifest, sw.js, icons/   Makes it an installable, offline PWA
  thumb.jpg           Picture shown on the lobby card
.github/workflows/deploy.yml
```

## Rules that keep games independent

1. **One folder per game, nothing shared at runtime.** Each folder must run on its own, so any game can later be wrapped with Capacitor and shipped to the App Store / Google Play by itself.
2. **Each game is its own PWA.** Its `manifest.webmanifest` uses `"start_url": "./"` and `"scope": "./"`, and it registers `sw.js` from its own folder. Never put a service worker that does caching at the site root.
3. **Cache name = game name + `__BUILD__`.** For example `const VERSION = 'star-army-__BUILD__';`. The deploy workflow replaces `__BUILD__` with the commit id, so players always get the newest version. You never bump versions by hand.
4. **Prefix saved data with the game name.** All games share one browser storage area, so use keys like `starArmySave`, `game2Save`.
5. **No ads, no third-party scripts or trackers.** Keeps the games kid-safe and ready for the App Store Kids category and Google Play Families policy.
6. Use relative paths only (`art.jpg`, not `/art.jpg`).

## Adding a new game

1. Copy `star-army/` to a new folder, e.g. `dragon-run/`, and replace `index.html` and `art.jpg` with the new game.
2. In the new folder: change `name`, `short_name` and `description` in `manifest.webmanifest`, change the cache name in `sw.js` (`'dragon-run-__BUILD__'`) and its `FILES` list, swap in new icons and a `thumb.jpg` (16:9).
3. Add an entry to the `GAMES` list in the root `index.html`.
4. Commit and push to `main`. It is live a minute later at `https://felixwang.pages.dev/dragon-run/`.

## Deployment setup (one time)

The workflow needs one repository secret, `CLOUDFLARE_API_TOKEN`: a Cloudflare API token with the **Cloudflare Pages: Edit** permission for this account. Add it under GitHub → Settings → Secrets and variables → Actions.

## Before submitting to an app store

Add a contact email to `privacy/index.html` (search for `CONTACT_EMAIL`).
