export function mapObject<T, U>(obj: { [key: string]: T }, f: (k: string, v: T) => [k_: string, v_: U]): { [key: string]: U } {
    const result: { [key: string]: U } = {}
    Object.entries(obj).forEach(([k, v]) => { const [k_, v_] = f(k, v); result[k_] = v_ })
    return result
}
export function mergeObjects<T>(a: { [key: string]: T }, b: { [key: string]: T }, f: (k: string, vA: T, vB: T) => T = (_k, _vA, vB) => vB): { [key: string]: T } {
    const result: { [key: string]: T } = { ...a, ...b }
    Object.keys(a)
        .filter(k => Object.keys(b).includes(k))
        .forEach(k => { result[k] = f(k, a[k], b[k]) })
    return result
}
export function mapToObject<T, U>(arr: T[], f: (e: T) => [k: string, v: U]): { [key: string]: U } {
    const result: { [key: string]: U } = {}
    arr.forEach(e => { const [k, v] = f(e); result[k] = v })
    return result
}
