export function removeParams<T extends Object>(
  obj: T,
  params: (keyof T)[]
): Partial<T> {
  const newObj = {} as Partial<T>;

  for (const key in obj) {
    if (!params.includes(key as keyof T)) {
      newObj[key] = obj[key];
    }
  }
  
  return newObj;
}
