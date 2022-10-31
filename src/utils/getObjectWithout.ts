export function getObjectWithout<T extends Object>(obj: T, value: string | number): Partial<T> {
  const keys = Object.keys(obj) as Array<keyof typeof obj>;
  const newObj  = {} as T;

  keys.forEach((key) => {
    if (obj[key] !== value) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}