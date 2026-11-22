export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const filtered = {} as Pick<T, K>;
  keys.forEach((key) => {
    filtered[key] = obj[key];
  });
  return filtered;
}

export function exclude<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj as object).filter(([k]) => !keys.includes(k as K)),
  ) as Omit<T, K>;
}
