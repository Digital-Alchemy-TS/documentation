---
title: Conversation Agent Selector
id: synapse-selector-conversation-agent
---

The `ConversationAgent` selector provides a picker for conversation agents.

## Options

All conversation agent selectors accept these common metadata options:
- `default?: string` - Default selected agent
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

ConversationAgent-specific options (from `ServiceListSelector["conversation_agent"]`):
- `language?: string` - Language code for the conversation agent

## Return Type

The return type is always `string`.

## Example

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { ServiceField } from "@digital-alchemy/synapse";

export function SynapseServiceCreate({
  synapse,
  context,
  logger,
}: TServiceParams) {
  synapse.service.create(
    {
      context,
      description: "Use a conversation agent",
      fields: {
        // Conversation agent selector
        agent: ServiceField.ConversationAgent({
          description: "Conversation agent to use",
          required: true,
        }),
      },
    },
    async data => {
      // data.agent is typed as: string
      logger.info(`Using agent: ${data.agent}`);
    }
  );
}
```
