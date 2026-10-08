# MobileWright × testmuAI Cloud — sample

A minimal [MobileWright](https://mobilewright.dev) sample where the driver is selected by
environment, so moving from a local device to **testmuAI Cloud** is a one-line change.
It drives the **Proverbial** sample app.

## The switch

`mobilewright.config.ts` picks the driver from the environment:

- **No creds** → the default **mobilecli** driver → your local device.
- **testmuAI credentials present** (`TESTMU_USERNAME` / `TESTMU_ACCESS_KEY`; `LT_…` also accepted)
  → the **`@testmuai/mobilewright`** driver → a real device on **testmuAI Cloud**.

```ts
if (process.env.TESTMU_USERNAME || process.env.LT_USERNAME) {
  config.driver = testMuDriver({ app, video: true, networkLog: true, deviceLog: true });
}
```

The driver reads the credentials from the environment, so nothing is hardcoded.

## Requirements

- Node **22.12.0+**
- An Android emulator / iOS simulator (local run) or testmuAI Cloud credentials (cloud run)

## Install

```bash
npm install
```

The cloud driver comes straight from npm — [`@testmuai/mobilewright`](https://www.npmjs.com/package/@testmuai/mobilewright).

## Run locally

Boot an Android emulator or iOS simulator, then:

```bash
npx mobilewright devices            # confirm MobileWright sees it
PLATFORM=android npx mobilewright test
```

## Run on testmuAI Cloud

```bash
export TESTMU_USERNAME=...
export TESTMU_ACCESS_KEY=...
PLATFORM=android npx mobilewright test
PLATFORM=ios     npx mobilewright test
```

The Proverbial app defaults to its public artifact URL (the driver uploads it
automatically), so no app upload is needed. Override with `TESTMU_APP` (or
`LT_APP_ANDROID` / `LT_APP_IOS`) — an `lt://APP…` id, a local `.apk`/`.ipa` path, or your own url.

## Layout

```
mobilewright.config.ts   # env-gated driver selection
tests/proverbial.test.ts # color → text → toast → notification
src/proverbial.ts        # Proverbial locators (android resource-id / iOS a11y id)
.env.example
```
