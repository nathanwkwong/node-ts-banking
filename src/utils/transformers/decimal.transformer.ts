import { ValueTransformer } from 'typeorm'

export class DecimalTransformer implements ValueTransformer {
  to(decimal?: number | string): string | undefined {
    if (decimal === null || decimal === undefined) {
      return undefined
    }
    return decimal.toString()
  }

  from(decimal?: string): number | undefined {
    if (decimal === null || decimal === undefined) {
      return undefined
    }
    const parsed = parseFloat(decimal)
    if (isNaN(parsed)) {
      return undefined
    }
    return parsed
  }
}
