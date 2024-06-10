export function objectKeys<Obj extends object>(obj: Obj): (keyof Obj)[] {
  return Object.keys(obj) as (keyof Obj)[];
}

export function objectEntries<Obj extends object>(obj: Obj): (keyof Obj)[] {
  return Object.keys(obj) as (keyof Obj)[];
}
