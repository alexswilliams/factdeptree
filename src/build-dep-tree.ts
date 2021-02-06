import { mapObject, mergeObjects } from "./collections-utils";
import { fabricatorName, items, secondsToProduceOne, shortName } from "./items";

function twoDp(x: number): number {
    return Math.round(x * 100) / 100
}

function totalIngredientsPerMinute(
    goals: { [key: string]: number }, // mapping of item name to number to be fabricated per minute
    fastestAssembler: string = 'assembling machine 3',
    fastestFurnace: string = 'steel furnace',
    fastestMine: string = 'electric mining drill',
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
        const perMinute = twoDp(60 / secondsToProduceOne(name, fastestAssembler, fastestFurnace, fastestMine))
        const fabsRequired = Math.ceil(perMinuteTarget / perMinute)
        const totalPerMinute = perMinute * fabsRequired
        const surplus = twoDp(totalPerMinute - perMinuteTarget)
        const surplusPercentage = twoDp(100 * (totalPerMinute - perMinuteTarget) / totalPerMinute)

        if (Object.keys(goals).includes(name))
            console.log(name, '-', fabsRequired, 'fab unit(s) are needed to produce', perMinuteTarget, 'per minute, with', surplus, '(', surplusPercentage, '%) surplus')

        return [name, {
            item: name,
            shortName: shortName(name),
            demandPerMinute: perMinuteTarget,
            fabricatorsRequired: fabsRequired,
            fabricator: fabricatorName(name, fastestAssembler, fastestFurnace, fastestMine),
            surplusPerMinute: surplus,
            surplusPercentage: surplusPercentage
        }]
    })

    return expandedDependencies
}



console.log(totalIngredientsPerMinute(
    {
        'logistic science pack': 10,
        'automation science pack': 10,
        'military science pack': 10,
        'chemical science pack': 10
    },
    'assembling machine 2',
))
