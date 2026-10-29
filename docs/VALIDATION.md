# Vihaara upgrade validation

## Scope

Preserves journal, mood, companion, health, mental peace, settings, and about destinations. Removes paid cloud inference in favour of an explicitly enabled local model and a labelled prepared guide. Preserves existing personal-data keys and adds a complete botanical interface and quiet-room tools.

## Checks executed

- TypeScript check and production build.
- Automated tests for prepared support routing, non-medical boundaries, journal keyword reflections, actual mood summaries and ties, missing/valid/corrupt saved records, server startup without API keys, retired API routes, and service-worker cache routing.
- Desktop browser: initial home, quick mood persistence, journal reflection/save/expansion, offline chat, unsupported-WebGPU handling, breathing start/pause/reset, audio start/stop, grounding navigation.
- Phone-width browser frame (390 × 844): home layout, navigation menu and evening-mode quiet room.

## Limits

- The QA browser did not expose WebGPU on its preview origin. The unsupported-device fallback was verified, but a complete model download and live generative inference were **not** hardware-tested.
- Offline cache routing is exercised in an automated service-worker harness; a full disconnected-device browser lifecycle remains to be tested on the deployed HTTPS origin.
- Audio controls and lifecycle were checked in the browser; no calibrated acoustic or headphone testing was performed.
- These checks are engineering verification, not clinical validation or proof of reliable crisis recognition.
- Vercel and Render configuration is provided. Publishing or migration in either hosting account is not implied by a GitHub branch/PR.

## Release checks on a compatible device

1. Run a production build at HTTPS or localhost and enable on-device AI.
2. Confirm model download progress, cancellation, successful load, and a non-sensitive chat reply.
3. Confirm journal reflection uses the ready model; disable it and confirm prepared-guide mode returns.
4. Close the site after caching, disconnect, reopen, and check journal, moods, local sound, and model reuse.
5. Review representative generated outputs for quality and safety before inviting users to rely on the companion.
