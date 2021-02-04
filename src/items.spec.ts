import { items } from "./items"

test('All ingredients have an items entry', () => {
    const allItems = Object.keys(items)
    const allIngredients = Object.entries(items)
        .map(([k, v]) => Object.keys(v.ingredients))
        .reduce((acc, next) => [...new Set([...acc, ...next])], []) // flatten unique
    const missingItems = allIngredients.filter(v => !allItems.includes(v))
    expect(missingItems).toHaveLength(0)
})
