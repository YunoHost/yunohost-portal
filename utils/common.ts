export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const filtered = {} as Pick<T, K>
  keys.forEach((key) => {
    filtered[key] = obj[key]
  })
  return filtered
}

export function exclude<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const filtered = { ...obj }
  keys.forEach((key) => {
    delete filtered[key]
  })
  return filtered
}

export function keysOf<T extends Record<string, string>>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}
