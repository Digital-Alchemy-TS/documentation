> [!tldr] Tldr #Changelog for [[Type Writer Overview|@digital-alchemy/type-writer]]
> -  [[Changelog|Changelog Hub]]

## 0.3.8 
- 🛠 test coverage for [[Wiring]] & [[Configuration]] systems ([#23](https://github.com/Digital-Alchemy-TS/core/pull/23))
	- 🐛💣 the sorting order for lifecycle events is has been reversed to properly align with documentation
	- 📈 negative values can be used as sort orders for [[Lifecycle]]
	- 🐛 libraries are now loaded in an order based on their `depends` array, instead of the sort order of `libraries` on the application
	- 📈 custom config loaders 
	- 🐛 bugfix to file selection for loading configs

## 0.3.7
- 📈  log messages now show their level as text in the body of the message by default ([#24](https://github.com/Digital-Alchemy-TS/core/pull/24))
	- The `hideLogLevel` attached to `application.bootstrap` can be used to hide / use previous functionality

## 0.3.6
- 📑 updating docs / links