import { items, deriveShortName } from "./items"

test('All ingredients have an items entry', () => {
    const allItems = Object.keys(items)
    const allIngredients = Object.entries(items)
        .map(([k, v]) => Object.keys(v.ingredients))
        .reduce((acc, next) => [...new Set([...acc, ...next])], []) // flatten unique
    const missingItems = allIngredients.filter(v => !allItems.includes(v))
    expect(missingItems).toHaveLength(0)
})

test('No items can be built instantly', () => {
    const instantlyBuiltItems = Object.entries(items).filter(([k, v]) => v.fabTime == 0)
    expect(instantlyBuiltItems).toHaveLength(0)
})

test('All items have unique short names', () => {
    const groupedNames: { [key: string]: string[] } = {}
    Object.keys(items).forEach(name => {
        const short = deriveShortName(name)
        if (!groupedNames[short])
            groupedNames[short] = [name]
        else
            groupedNames[short].push(name)
    })
    Object.entries(groupedNames).forEach(([_short, matchingFullNames]) => {
        expect(matchingFullNames).toHaveLength(1)
    })
})