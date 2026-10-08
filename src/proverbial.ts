import type { Screen, Locator } from '@mobilewright/core';

export type Platform = 'android' | 'ios';

/**
 * Proverbial sample-app locators, split per platform.
 * On Android, MobileWright's testId is the FULL resource-id
 * (com.lambdatest.proverbial:id/…); on iOS it is the short accessibility id.
 * (Same elements as the standard Proverbial sample app.)
 */
const IDS: Record<string, Record<Platform, string>> = {
  color:        { android: 'com.lambdatest.proverbial:id/color',        ios: 'color' },
  text:         { android: 'com.lambdatest.proverbial:id/Text',         ios: 'Text' },
  toast:        { android: 'com.lambdatest.proverbial:id/toast',        ios: 'toast' },
  notification: { android: 'com.lambdatest.proverbial:id/notification', ios: 'notification' },
  geoLocation:  { android: 'com.lambdatest.proverbial:id/geoLocation',  ios: 'geoLocation' },
};

export function proverbial(screen: Screen, platform: Platform) {
  const by = (key: keyof typeof IDS): Locator => screen.getByTestId(IDS[key][platform]);
  return {
    colorButton: () => by('color'),
    textButton: () => by('text'),
    toastButton: () => by('toast'),
    notificationButton: () => by('notification'),
    geoLocationButton: () => by('geoLocation'),
    /** The Text button changes the on-screen label to "Proverbial". */
    proverbialText: (): Locator => screen.getByText(/Proverbial/).first(),
  };
}
