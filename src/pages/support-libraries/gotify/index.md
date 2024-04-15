---
aliases:
  - Gotify
---
## Description

> https://gotify.net/
> Gotify is a simple server for sending & receiving messages

Welcome to `@digital-alchemy/gotify-extension`!

- [GitHub](https://github.com/Digital-Alchemy-TS/gotify)
- [NPM](https://www.npmjs.com/package/@digital-alchemy/gotify-extension)
- [Changelog](/support-libraries/gotify/changelog/0.3.x)

## 💾 Install

This library can be installed as a simple dependency
```bash
npm i @digital-alchemy/gotify-extension
```
Then added to your project
```typescript
import { LIB_GOTIFY } from "@digital-alchemy/gotify-extension";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_GOTIFY],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_GOTIFY],
  name: "special_logic",
})
```
> 🎉
> Listing as an import will automatically load into [LoadedModules](/core/exports/LoadedModules) and make the library features available as `gotify` on [TServiceParams](/core/exports/TServiceParams).


## Configuration

- [BASE_URL](/support-libraries/gotify/config/BASE_URL)
Target server for api

- [CHANNEL_MAPPING](/support-libraries/gotify/config/CHANNEL_MAPPING)
Map tokens to friendly names to use within the application
```ini
[gotify.CHANNEL_MAPPING]
  app_name=token
  another_app=token
  app_the_third=token
```
- [TOKEN](/support-libraries/gotify/config/TOKEN)
Application token

## Services

- `application`
- `client`
- `message`

## Multi-channel type friendly messages

> Create a wrapper to send messages from a particular application. Uses the correct credentials, and quick to type
```typescript
enum MyGotifyApps {
  testing = "testing",
  reminders = "reminders",
}

export function MyGotifyServices({ gotify, config }: TServiceParams) {
  return {
    ...(Object.fromEntries(
      Object.values(MyGotifyApps).map(i => [
        i,
        async (message: Message) => {
          await gotify.message.create({
            ...message,
            appid: config.gotify.CHANNEL_MAPPING[i],
          });
        },
      ]),
    ) as Record<`${MyGotifyApps}`, (message: Message) => Promise<void>>),
  };
}
```

> Send messages

```typescript
export function MyService({ app, lifecycle, internal }: TServiceParams) {
  lifecycle.onReady(async() => {

    await app.gotify.reminders({
      message: `Failed to create countdown timer for ${internal.utils.relativeDate(target)}`,
    });
  })
}
```
