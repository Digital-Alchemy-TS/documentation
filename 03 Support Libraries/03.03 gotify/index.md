- #TServiceParams/gotify
## Description

> [!info]  https://gotify.net/
> Gotify is a simple server for sending & receiving messages

This library acts as a simple set of rest adapters for Gotify. Primary use is for emitting messages from your application 

## Configuration

- #config/gotify/BASE_URL
Target server for api

- #config/gotify/CHANNEL_MAPPING
Map tokens to friendly names to use within the application
```ini
[gotify.CHANNEL_MAPPING]
  app_name=token
  another_app=token
  app_the_third=token
```
- #config/gotify/TOKEN
Application token

## Services

- `application`
- `client`
- `message`

## Multi-channel type friendly messages

> [!example] Create a wrapper to send messages from a particular application
> Uses the correct credentials, and quick to type
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

> [!example] Send messages

```typescript
export function MyService({ app, lifecycle }: TServiceParams) {
  lifecycle.onReady(async() => {

    await app.gotify.reminders({
      message: `Failed to create countdown timer for ${ZCC.utils.relativeDate(target)}`,
    });
  })
}
```