---
title: QR Code Selector
id: synapse-selector-qr-code
---

The `QrCode` selector provides an input for QR code data.

## Options

All QR code selectors accept these common metadata options:
- `default?: string` - Default QR code value
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

QrCode-specific options (from `ServiceListSelector["qr_code"]`):
- `data: string` - Data to encode in the QR code (required)
- `scale?: number` - Scale factor for the QR code size
- `error_correction_level?: "L" | "M" | "Q" | "H"` - Error correction level: L (low), M (medium), Q (quartile), H (high)

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
      description: "Process QR code",
      fields: {
        // QR code selector
        qr_data: ServiceField.QrCode({
          description: "QR code data",
          required: true,
        }),
      },
    },
    async data => {
      // data.qr_data is typed as: string
      logger.info(`QR code data: ${data.qr_data}`);
    }
  );
}
```
