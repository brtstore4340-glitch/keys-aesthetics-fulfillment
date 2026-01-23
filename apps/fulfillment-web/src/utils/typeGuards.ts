/**
 * Type Guard Toolkit (migration-safe)
 * Goal: eliminate `any` by forcing boundary values to be `unknown` and validating/narrowing.
 *
 * Rules:
 * - External/untrusted -> unknown
 * - Narrow with guards before use
 * - Prefer small, composable predicates
 */

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function hasKey<K extends string>(
  obj: Record<string, unknown>,
  key: K
): obj is Record<K, unknown> & Record<string, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function isString(value: unknown): value is string {
  return typeof value === "string"
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

export function isArray<T>(
  value: unknown,
  itemGuard: (x: unknown) => x is T
): value is T[] {
  return Array.isArray(value) && value.every(itemGuard)
}

export function asRecord(value: unknown, context = "value"): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${context} must be an object`)
  return value
}

export function getString(obj: Record<string, unknown>, key: string, context = "object"): string {
  if (!hasKey(obj, key) || !isString(obj[key])) throw new Error(`${context}.${key} must be a string`)
  return obj[key]
}

export function getOptionalString(obj: Record<string, unknown>, key: string): string | undefined {
  if (!hasKey(obj, key)) return undefined
  return isString(obj[key]) ? obj[key] : undefined
}

export function getNumber(obj: Record<string, unknown>, key: string, context = "object"): number {
  if (!hasKey(obj, key) || !isNumber(obj[key])) throw new Error(`${context}.${key} must be a number`)
  return obj[key]
}

export function getBoolean(obj: Record<string, unknown>, key: string, context = "object"): boolean {
  if (!hasKey(obj, key) || !isBoolean(obj[key])) throw new Error(`${context}.${key} must be a boolean`)
  return obj[key]
}

/**
 * Assertion helper for narrowing + exhaustive checks
 */
export function assertNever(x: never, msg = "Unexpected value"): never {
  throw new Error(`${msg}: ${String(x)}`)
}
