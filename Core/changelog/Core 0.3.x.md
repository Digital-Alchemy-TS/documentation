> [!tldr] Tldr #Changelog for [[Type Writer Overview|@digital-alchemy/type-writer]]
> -  [[Changelog|Changelog Hub]]

## 0.3.7
- 🛠 bringing back wiring unit tests
	- **minor breaking changes**:
		- the sorting order for lifecycle events is has been reversed to properly align with documentation. a matching fix to [[Hass Overview|Hass]] will be pushed at same time, upgrade dependencies together
		- `application.lifecycle` & `library.lifecycle` have been removed (`0.0.x` legacy feature)
- 📈 negative values can be used as sort orders for [[Lifecycle]]
- 🐛 libraries are now loaded in an order based on their `depends` array, instead of the sort order of `libraries` on the application

## 0.3.6
- 📑 updating docs / links