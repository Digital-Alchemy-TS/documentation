---
tags: []
aliases:
---
## 📓 Description

The cache extension provides a basic configurable caching interface, using a memory cache by default. Adds `cache` to [TServiceParams](/core/exports/TServiceParams)

>
> Things work better with [redis](https://www.npmjs.com/package/redis)
> Want something else? You can set a custom driver by using the `.setClient` method.

## 🛠️ Configuration

> Caching is not available until [onBootstrap](/core/lifecycle/onBootstrap)

- [CACHE_PREFIX](/core/config/CACHE_PREFIX)
- [CACHE_PROVIDER](/core/config/CACHE_PROVIDER)
- [CACHE_TTL](/core/config/CACHE_TTL)
- [REDIS_URL](/core/config/REDIS_URL)
## 📄 Code Examples

> Some generic code to illustrate basic cache interactions

```typescript
export function WeatherForecastService({ logger, cache, lifecycle }: TServiceParams) {

  // 🌍 Simulates fetching weather data from an external API
  async function fetchWeatherData(city: string): Promise<string> {
    // 📡 Imagine this function makes an API call to get weather data
    return `Weather data for ${city}`;
  }

  // 🔄 Updates the cache with new weather data
  async function updateWeatherCache(city: string) {
    const weatherData = await fetchWeatherData(city);
    await cache.set(city, weatherData, 7200); // Cache for 2 hours ⏳
    logger.info(`Updated weather cache for ${city}`);
  }

  // 🔍 Retrieves weather data for a given city, either from cache or fresh from API
  async function getWeather(city: string): Promise<string> {
    let weatherData = await cache.get<string>(city);
    if (!weatherData) {
      logger.info(`Cache miss for ${city}. Fetching new data.`);
      await updateWeatherCache(city);
      weatherData = await fetchWeatherData(city);
    } else {
      logger.info(`Cache hit for ${city}. Using cached data.`);
    }
    return weatherData;
  }

  // 🗑️ Clears weather data for a city from the cache
  async function clearWeatherCache(city: string) {
    await cache.del(city);
    logger.info(`Cleared weather data from cache for ${city}`);
  }

  // 📊 Lists all cities with cached weather data
  async function listCachedCities() {
    const keys = await cache.keys();
    logger.info(`Cached cities: ${keys.join(', ')}`);
    return keys;
  }

  // 🚀 Initialize the service and pre-cache data for a set of cities
  lifecycle.onBootstrap(async () => {
    const cities = ['New York', 'London', 'Tokyo'];
    for (const city of cities) {
      await updateWeatherCache(city);
    }
    logger.info('Service initialized and weather data pre-cached for key cities.');

  // ⏲️ Set an interval to update the cache every hour
    setInterval(async () => {
      for (const city of cities) {
        await updateWeatherCache(city);
        logger.info(`Cache auto-refreshed for ${city}`);
      }
    }, 3600000); // 3600000 milliseconds = 1 hour
  });

  // Expose service methods
  return {
    getWeather,
    clearWeatherCache,
    listCachedCities,
  };
}
```
