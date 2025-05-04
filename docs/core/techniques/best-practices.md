---
title: 👷 Best Practices
---

All of the convenience of Digital Alchemy comes at the expense of the utility types needed to make that work.
There's a number of ways you can alter that process outside of your primary logic to alter the way your project builds.

The internals of Typescript can operate in some weird ways occasionally.

## Service Definitions

Needing to do transformations and infer things is a frequent source of friction between this framework and the `Typescript` transpiler.

These can lead to laggy editing experiences at the best of times, and incorrect builds at the worst.
Both situations can corrected by providing explicit interfaces for your service in an external file.

> definitions.ts

```typescript
export type SpecialLogicOperations = {
  /**
   * extra long tsdoc description on how to use this method
   */
  exec: () => Promise<void>
}
```

> special-logic.service.ts

```typescript
export function SpecialLogic(): SpecialLogicOperations {
  return {
    async exec() {
      // 🚀 do stuff
    }
  }
}
```

When `TServiceParams` gets built, your provided type will be directly wired in instead of needing to be inferred each time

```typescript
function Example({ my_module }: TServiceParams) {
  // ✅ refers to SpecialLogicOperations
  my_module.special_logic

  // ✅ has attached tsdoc
  my_module.special_logic.exec
}
```

## TSDoc

A full guide on creating tsdoc is best elsewhere, but some key points to keep in mind:

- ✅ multiline comment
- ✅ markdown
- ❌ html

### Modules

Attaching TSDoc to higher level `TServiceParams` provided values has to be done at the module level.

#### Configuration

```typescript
CreateLibrary({
  configuration: {
    /**
     * ## ⚠️ KEEP THIS OFF AT RUNTIME!!
     *
     * > For testing only
     */
    DESTROY_ALL_HUMANS: {
      type: "boolean",
      default: false
    }
  },
  name: "skynet"
});
```

#### Services

> **note**: If a particular service is intended to be internal only, mark with `@internal`

```typescript
CreateApplication({
  services: {
    /**
     * Operations for additional runtime configurations
     */
    config: ConfigurationService,
  },
  name: "special_app"
})
```

## Configuration Definitions

Fully type checking configuration definitions requires a bit of "unique" typescript.
Taking the example of `LOG_LEVEL`:

### Using satisfies

When using `satisfies`, the data provided as part of the definition itself is type checked.
In the below example, the invalid value would throw a build error

```typescript
CreateLibrary({
  configuration: {
    LOG_LEVEL: {
      default: "trace",
      enum: ["INVALID VALUE", "silent", "trace",...],
      type: "string",
    } satisfies StringConfig<TConfigLogLevel>
  }
})
```

### Using as

The problem with using only `satisfies` appears when the configuration is used inside a service -

```typescript
function Example({ config }: TServiceParams) {
  config.boilerplate.LOG_LEVEL // presents as a generic string, instead of the expected TConfigLogLevel
}
```

In order to force correct casting in all locations, as well as type check your own definition, you need to use `as` in addition to `satisfies`.

```typescript
CreateLibrary({
  configuration: {
    LOG_LEVEL: {
      default: "trace",
      enum: ["silent", "trace",...],
      type: "string",

// You may not like it but this horror is peak performance
// I certainly don't
    } satisfies StringConfig<TConfigLogLevel> as StringConfig<TConfigLogLevel>
  }
})
```

> Using only `as` is acceptable also if you don't care about type checking your definition.
