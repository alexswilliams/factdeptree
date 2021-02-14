import { mapObject, mergeObjects } from "./collections-utils";
import { fabricatorName, items, secondsToProduceOne, deriveShortName, FabOptions } from "./items";

function twoDp(x: number): number {
    return Math.round(x * 100) / 100
}

function totalIngredientsPerMinute(
    goals: { [key: string]: number }, // mapping of item name to number to be fabricated per minute
    fabOptions?: FabOptions
): { [key: string]: any } {

    function totalIngredientsForOneOf(inputName: string, depth: number = 0): { [key: string]: number } {
        const ingredients = items[inputName].ingredients

        const dependencies = Object.entries(ingredients).reduce((result, [depName, quantity]) => {
            const deps = totalIngredientsForOneOf(depName, depth + 1)
            const scaledDeps = mapObject(deps, (k, v) => [k, v * quantity])

            const mergedResults = mergeObjects(result, scaledDeps, (_, a, b) => a + b)
            return mergedResults
        }, ingredients)

        const adjustedForYield = mapObject(dependencies, (k, v) => [k, v / (items[inputName].yield ?? 1)])
        return adjustedForYield
    }

    const groupedDependencies = mapObject(goals, (name, perMinuteTarget) =>
        [name, mapObject(totalIngredientsForOneOf(name), (k, v) => [k, twoDp(v * perMinuteTarget)])]
    )

    const mergedDependencies = Object.values(groupedDependencies)
        .reduce((result, dependencies) => mergeObjects(result, dependencies, (_, a, b) => a + b), goals)


    const expandedDependencies = mapObject(mergedDependencies, (name, perMinuteTarget) => {
        const perMinute = twoDp(60 / secondsToProduceOne(name, fabOptions))
        const fabsRequired = Math.ceil(perMinuteTarget / perMinute)
        const totalPerMinute = perMinute * fabsRequired
        const surplus = twoDp(totalPerMinute - perMinuteTarget)
        const surplusPercentage = twoDp(100 * (totalPerMinute - perMinuteTarget) / totalPerMinute)

        return [name, {
            item: name,
            shortName: deriveShortName(name),
            demandPerMinute: perMinuteTarget,
            fabricatorsRequired: fabsRequired,
            fabricator: fabricatorName(name, fabOptions),
            surplusPerMinute: surplus,
            surplusPercentage: surplusPercentage
        }]
    })

    return expandedDependencies
}

function goalsAsGraphviz(
    goals: { [key: string]: number }, // mapping of item name to number to be fabricated per minute
    fabOptions?: FabOptions
) {
    const allFabricators = totalIngredientsPerMinute(goals, fabOptions)
    console.error(allFabricators)
    const dependencies = new Set<string>()
    Object.values(allFabricators)
        .forEach(({ item, shortName }) => {
            Object.keys(items[item].ingredients)
                .forEach(s => dependencies.add(`${deriveShortName(s)} -> ${shortName}`))
        })

    console.log('digraph {')
    console.log('  overlap = prism;')
    console.log('  splines = true;')

    Object.values(allFabricators).forEach(({ item, shortName, fabricatorsRequired, fabricator }) => {
        const options = [`label="${item}: ${fabricatorsRequired} x ${deriveShortName(fabricator)}"`]
        if (Object.keys(goals).includes(item)) { options.push(`fillcolor="red"`); options.push(`style="filled"`) }
        console.log(`  ${shortName} [${options.join(',')}];`)
    })
    dependencies.forEach((s) => console.log(`  ${s};`))
    console.log('}')
}


goalsAsGraphviz(
    {
        //'logistic science pack': 10,
        //'automation science pack': 10,
        //'military science pack': 10,
        //'chemical science pack': 10,
        //'production science pack': 10,
        'utility science pack': 10,
        //'solar panel': 5,
        //'rail': 100,
    },
    { fastestAssembler: 'assembling machine 3' },
)
// Feed this output to something like `neato -Tpng > test.png` to see the graph.
