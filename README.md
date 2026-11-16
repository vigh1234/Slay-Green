# Slay Green — Web

A web port of the Slay Green React Native app: AI-powered recommendations for
eco-friendly stays, vehicles, electronics, and more. Built with **React
(Vite) + Tailwind CSS** on the front end and **Express** on the back end,
reusing the original AI/backend logic almost unchanged.

```
SlayGreen-Web/
├── client/     React (Vite) single-page app
└── server/     Express API (Gemini, Stripe, remove.bg, etc.)
```

## Quick start

### 1. Server

```bash
cd server
cp .env.example .env   # fill in your API keys (see below)
npm install
npm run dev             # http://localhost:3000
```

### 2. Client

```bash
cd client
cp .env.example .env    # defaults are fine for local dev
npm install
npm run dev              # http://localhost:5173
```

The client dev server proxies `/api/*` to `http://localhost:3000` (see
`client/vite.config.js`), so you don't need to configure CORS or a base URL
for local development — just have both processes running.

### Production

Build the client (`npm run build` in `client/`) and the Express server will
serve the compiled `client/dist` folder automatically alongside the API (see
the bottom of `server/Server.js`). Alternatively, host the client as a static
site (Vercel, Netlify, S3, etc.) and point `VITE_API_BASE_URL` at your
deployed API's URL.

## Environment variables (server/.env)

| Variable | Used for |
|---|---|
| `MONGODB_URI` | MongoDB connection string — stores user accounts (register / login) |
| `JWT_SECRET` | Long random secret used to sign login tokens (`JWT_EXPIRES_IN` sets lifetime, default `7d`) |
| `API_KEY` | Google Gemini — powers every AI recommendation/analysis endpoint |
| `GOOGLE_PLACES_API_KEY` | Server-side location autocomplete proxy (see below) |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Payments (Marketplace checkout, EV service booking, Payment tab) |
| `REMOVE_BG_API_KEY` | Cloth try-on — removing the clothing item's background |
| `OPENAI_API_KEY` | Cloth try-on — polishing the composited image |
| `SERPAPI_KEY` | Cloth try-on — cross-store price comparison |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Gate for the `/admin` screens |
| `CLIENT_ORIGIN` | Comma-separated browser origins allowed by CORS (production, when the client is hosted separately) |
| `BODY_LIMIT` | Max request body size (default `15mb`; images are sent as base64) |
| `TRUST_PROXY` | Set to `1` when the API runs behind a reverse proxy so rate limiting sees real client IPs |

All keys are optional in the sense that the app won't crash without them —
the relevant feature will just return an error toast until configured.

> **Never commit `server/.env`.** It is git-ignored; `server/.env.example`
> lists every variable. Use test-mode Stripe keys (`sk_test_…`) for development.

## User accounts (register / login)

Users are stored in MongoDB (`server/models/User.js`); passwords are hashed
with bcrypt and sessions are JWTs.

| Endpoint | Body | Returns |
|---|---|---|
| `POST /api/v1/auth/register` | `{ name, email, password }` | `201 { token, user }` |
| `POST /api/v1/auth/login` | `{ email, password }` | `200 { token, user }` |
| `GET /api/v1/auth/me` | — (`Authorization: Bearer <token>`) | `200 { user }` |

Client: `/login` and `/register` pages, `useAuth()` hook
(`client/src/context/AuthContext.jsx`) and `<ProtectedRoute />` for pages that
require a signed-in user. On the server, add `requireAuth`
(`server/middleware/auth.js`) to any route that needs one.

## Pages and access

- **Public:** Home (landing), About, Contact, Privacy, Terms, Sign in, Register.
- **Signed-in only:** every tool (survey, searches, marketplace, AI tools, payment). Visitors
  who open one are sent to `/login` and returned afterwards. The tools sidebar only appears
  once signed in.
- **Contact form:** `POST /api/v1/contact` saves messages to the `contactmessages` collection
  in MongoDB (rate-limited, with a honeypot field). Set the optional `VITE_CONTACT_*` values in
  `client/.env` to show your email/phone/address on the Contact page and footer.

## Security notes

The API ships with `helmet` security headers, an origin allow-list for CORS
(`CLIENT_ORIGIN`), per-IP rate limiting (stricter on `/admin/login`) and
request body size limits. See [SECURITY.md](SECURITY.md) to report
vulnerabilities and [CONTRIBUTING.md](CONTRIBUTING.md) for the branch / PR
workflow.

## What changed from the React Native app

The backend was already framework-agnostic (plain JSON/base64 over HTTP), so
it needed only light changes. The notable ones:

- **`/api/v1/places-autocomplete` (new)** — the RN app called Google's
  Places Autocomplete endpoint directly from the client with a key baked
  into the app. That endpoint has no CORS headers, so a browser can't call
  it directly, and shipping the key client-side is best avoided anyway. This
  proxy keeps the key server-side.
- **Cloth try-on now accepts a bare product link** — the RN app scraped the
  Amazon product page *on the client* to find the item's image (only
  possible because native `fetch` ignores CORS). `mergeClothingWithESG`
  (`server/controllers/imageController.js`) now downloads that image itself
  when the client only sends `amazonUrl`, so the web client just sends the
  link and a body photo.
- **`/api/v1/admin/login` (new)** — the RN admin screen checked a hardcoded
  email/password pair shipped inside the app. That's moved server-side,
  checked against `ADMIN_EMAIL`/`ADMIN_PASSWORD`. This is still a very
  lightweight gate (no sessions/tokens) — swap in real auth before using it
  for anything sensitive.
- **Stripe payments use Stripe Elements**, not the mobile-only
  `@stripe/stripe-react-native` PaymentSheet. `PaymentRequestButtonElement`
  surfaces the browser's native Google Pay / Apple Pay sheet where
  supported, with a card form fallback — see
  `client/src/features/shared/StripeCheckout.jsx`.
- **Maps use Leaflet + OpenStreetMap** (no API key required) instead of
  `react-native-maps`, via `client/src/components/ui/ResultsMap.jsx`.
- Removed RN-only backend dependencies that had crept into `package.json`
  (`expo`, `@stripe/stripe-react-native`, `@datadog/mobile-react-native`,
  `react-native-bouncy-checkbox`) — none of them were actually used by any
  controller.

## Architecture notes (client)

- **`src/context/`** — one React Context per feature, ported almost 1:1 from
  the RN app's contexts (state only, no AsyncStorage was actually used).
- **`src/features/<feature>/`** — one folder per feature, mirroring the RN
  app's `app/tabs/<Feature>/` structure and screen names.
- **`src/features/shared/`** — the RN app's "search wizard" screens (choose
  a destination → set a budget → pick a travel party → see AI
  recommendations) repeat almost the same UI across 6+ features. Those are
  built once as shared components (`DestinationForm`, `BudgetDateForm`,
  `TravelPartyPicker`, `OptionGridPicker`, `RecommendationResults`) and
  reused, rather than being duplicated per feature.
- **`src/hooks/useAiRecommendations.js`** + **`src/lib/parseAiList.js`** —
  every "Recommend___" screen sends a long prompt to a Gemini-backed
  endpoint and gets back loosely-structured text (one recommendation per
  paragraph). This hook + parser handle that pattern once, including pulling
  out coordinates for the map.
- **`src/routes/AppRoutes.jsx`** — all ~65 screens are registered here,
  lazy-loaded, replacing the RN app's per-feature `Navigations/*.js` stack
  navigators with React Router routes. A top `NavBar` replaces the bottom
  tab bar (see `src/components/layout/NavBar.jsx`).

## Known limitations / good next steps

- The admin login is a shared-password gate, not real authentication.
- Marketplace products and cart live in memory only (React state) — refresh
  the page and they're gone. Wiring `ProductContext` up to the backend
  (persist to `server/DataBase` or a real database) would be the natural
  next step, matching how survey data is already persisted.
- `country-state-city`'s full dataset makes the User Survey's first screen
  a fairly large lazy chunk (~650 KB before gzip). Fine for now; if it
  becomes a problem, swap to a lighter country/state list.

## License

Released under the [MIT License](LICENSE).
