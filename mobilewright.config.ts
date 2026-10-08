import { defineConfig } from 'mobilewright';
import { testMuDriver } from '@testmuai/mobilewright';

/**
 * ONE config, two destinations — the test files never change.
 *
 *   • Local  — `npx mobilewright test`
 *       Default mobilecli driver drives a booted local emulator/simulator.
 *   • Cloud  — set testmuAI credentials, then `npx mobilewright test`
 *       The @testmuai/mobilewright driver runs on a real device on testmuAI Cloud.
 *
 * Only the driver changes, by environment — the mobilewright.dev cloud-provider pattern.
 */
const platform = (process.env.PLATFORM || 'android') as 'android' | 'ios';

// The Proverbial sample app. Defaults to its public artifact URL (the driver
// resolves an https url to an lt:// id automatically), so no app upload is needed.
// Override with TESTMU_APP (or LT_APP_ANDROID / LT_APP_IOS) — an lt://APP… id, a
// local .apk/.ipa path, or your own url.
const PROVERBIAL: Record<'android' | 'ios', string> = {
  android: 'https://prod-mobile-artefacts.lambdatest.com/assets/docs/proverbial_android.apk',
  ios: 'https://prod-mobile-artefacts.lambdatest.com/assets/docs/proverbial_ios.ipa',
};
const app = process.env.TESTMU_APP
  || (platform === 'ios' ? process.env.LT_APP_IOS : process.env.LT_APP_ANDROID)
  || PROVERBIAL[platform];

const config: any = {
  testDir: './tests',
  timeout: 180_000,
  expect: { timeout: 20_000 },
  reporter: [['list']],
  projects: [{ name: platform, use: { platform } }],
};

if (process.env.TESTMU_USERNAME || process.env.LT_USERNAME) {
  // ---- CLOUD: testmuAI ----
  // Credentials are read from the environment by the driver (TESTMU_* preferred,
  // LT_* accepted) — nothing to hardcode.
  if (platform === 'ios') {
    // Let the grid's initial launch stand so a permission alert can't block an
    // extra terminate/relaunch cycle.
    config.projects[0].use.autoAppLaunch = false;
  }
  config.driver = testMuDriver({
    app,
    build: 'testmuai-mobilewright-sample',
    project: 'mobilewright-sample',
    video: true,
    networkLog: true,
    deviceLog: true,
    autoGrantPermissions: true,
    autoAcceptAlerts: true,
  });
} else {
  // ---- LOCAL: mobilecli (booted emulator/simulator) ----
  // Install a local Proverbial build if provided; otherwise assume it's already installed.
  const localApp = platform === 'ios' ? process.env.LOCAL_APP_IOS : process.env.LOCAL_APP_ANDROID;
  if (localApp) config.projects[0].use.installApps = localApp;
  config.projects[0].use.bundleId = 'com.lambdatest.proverbial';
}

export default defineConfig(config);
