
export type itemType = 'mine' | 'oil pump' | 'water pump' | 'furnace' | 'refinery' | 'assembler' | 'chemical plant' | 'power producer' | 'centrifuge'
export type constructorType = { type: itemType | 'raw element', excluding?: string }

export interface item {
    ingredients: { [key: string]: number }
    fabTime?: number
    shortName?: string
    yield?: number
    fuelKW?: number
    inputs?: { [key: string]: number }
    outputs?: { [key: string]: number }
    type?: itemType
    madeIn?: constructorType
    fabSpeedMultiplier?: number
    fabYieldPerSecond?: number
}

export interface FabOptions {
    fastestAssembler?: string
    fastestFurnace?: string
    fastestMine?: string
}

export const ASSEMBLER: constructorType = { type: 'assembler' }
export const ASSEMBLER_2_3: constructorType = { type: 'assembler', excluding: 'assembling machine 1' }
export const FURNACE: constructorType = { type: 'furnace' }
export const CHEMICAL_PLANT: constructorType = { type: 'chemical plant' }
export const REFINERY: constructorType = { type: 'refinery' }
export const MINE: constructorType = { type: 'mine' }
export const WATER_PUMP: constructorType = { type: 'water pump' }
export const OIL_PUMP: constructorType = { type: 'oil pump' }
export const CENTRIFUGE: constructorType = { type: 'centrifuge' }

export function secondsToProduceOne(itemName: string, fabOptions?: FabOptions): number {
    const fabricatorId = fabricatorName(itemName, fabOptions)
    const fabricator = (fabricatorId) ? items[fabricatorId] : undefined
    const fabTime = items[itemName].fabTime ?? 1
    const recipeYield = items[itemName].yield ?? 1

    const fabYieldPerSecond = fabricator?.fabYieldPerSecond
    if (fabYieldPerSecond) return recipeYield / fabYieldPerSecond

    const fabSpeedMultiplier = fabricator?.fabSpeedMultiplier ?? 1
    return (fabTime / fabSpeedMultiplier) / recipeYield
}

export function fabricatorName(itemName: string, fabOptions?: FabOptions): string | undefined {
    const madeIn = items[itemName].madeIn ?? ASSEMBLER
    return {
        'assembler': fabOptions?.fastestAssembler ?? 'assembling machine 3',
        'furnace': fabOptions?.fastestFurnace ?? 'electric furnace',
        'mine': fabOptions?.fastestMine ?? 'electric mining drill',
        'chemical plant': 'chemical plant',
        'oil pump': 'pumpjack',
        'refinery': 'oil refinery',
        'water pump': 'offshore pump',
        'centrifuge': 'centrifuge',
        'power producer': undefined,
        'raw element': undefined,
    }[madeIn.type]
}

export function deriveShortName(itemName: string): string {
    if (itemName.length <= 4) return itemName
    if (items[itemName].shortName !== undefined) return items[itemName].shortName!
    if (Object.keys(items[itemName].ingredients).length == 0) return itemName.replace('crude ', '').replace(' ore', '').replace(' ', '')
    return itemName.split(' ').map(word => word[0]).join('')
}

export const items: { [key: string]: item } = {
    // Raw materials
    // TODO: Check the fab time on these items.
    'wood': { fabTime: 100 /* it's all so manual */, ingredients: {} },
    'stone': { madeIn: MINE, ingredients: {} },
    'iron ore': { madeIn: MINE, ingredients: {} },
    'water': { madeIn: WATER_PUMP, ingredients: {} },
    'crude oil': { madeIn: OIL_PUMP, ingredients: {} },
    'copper ore': { madeIn: MINE, ingredients: {} },
    'coal': { madeIn: MINE, ingredients: {} },
    'uranium ore': { madeIn: MINE, ingredients: { 'sulfuric acid': 1 } },

    // Logistics
    'wooden chest': { fabTime: 0.5, ingredients: { 'wood': 2 } },
    'iron chest': { fabTime: 0.5, ingredients: { 'iron plate': 8 } },
    'steel chest': { fabTime: 0.5, ingredients: { 'steel plate': 8 } },
    'storage tank': { shortName: 'tank', fabTime: 3, ingredients: { 'iron plate': 20, 'steel plate': 5 } },

    'transport belt': { yield: 2, fabTime: 0.5, ingredients: { 'iron plate': 1, 'iron gear wheel': 1 } },
    'fast transport belt': { fabTime: 0.5, ingredients: { 'iron gear wheel': 5, 'transport belt': 1 } },
    'express transport belt': { madeIn: ASSEMBLER_2_3, fabTime: 0.5, ingredients: { 'iron gear wheel': 10, 'fast transport belt': 1, 'lubricant': 20 } },
    'underground belt': { yield: 2, fabTime: 1, ingredients: { 'iron plate': 10, 'transport belt': 5 } },
    'fast underground belt': { yield: 2, fabTime: 2, ingredients: { 'iron gear wheel': 40, 'underground belt': 2 } },
    'express underground belt': { yield: 2, madeIn: ASSEMBLER_2_3, fabTime: 2, ingredients: { 'iron gear wheel': 80, 'fast underground belt': 2, 'lubricant': 40 } },
    'splitter': { shortName: 'spl', fabTime: 1, ingredients: { 'iron plate': 5, 'electronic circuit': 5, 'transport belt': 4 } },
    'fast splitter': { fabTime: 2, ingredients: { 'iron gear wheel': 10, 'electronic circuit': 10, 'splitter': 1 } },
    'express splitter': { shortName: 'xspl', madeIn: ASSEMBLER_2_3, fabTime: 2, ingredients: { 'iron gear wheel': 10, 'advanced circuit': 10, 'fast splitter': 1, 'lubricant': 80 } },

    'burner inserter': { fuelKW: 94.2, fabTime: 0.5, ingredients: { 'iron plate': 1, 'iron gear wheel': 1 } },
    'inserter': { inputs: { 'electricity': 13.6 }, fabTime: 0.5, ingredients: { 'iron plate': 1, 'iron gear wheel': 1, 'electronic circuit': 1 } },
    'long-handed inserter': { inputs: { 'electricity': 20.11 }, fabTime: 0.5, ingredients: { 'iron plate': 1, 'iron gear wheel': 1, 'inserter': 1 } },
    'fast inserter': { inputs: { 'electricity': 46.7 }, fabTime: 0.5, ingredients: { 'iron plate': 2, 'electronic circuit': 2, 'inserter': 1 } },
    'filter inserter': { shortName: 'fil', inputs: { 'electricity': 53.3 }, fabTime: 0.5, ingredients: { 'electronic circuit': 4, 'fast inserter': 1 } },
    'stack inserter': { inputs: { 'electricity': 133 }, fabTime: 0.5, ingredients: { 'iron gear wheel': 15, 'electronic circuit': 15, 'advanced circuit': 1, 'fast inserter': 1 } },
    'stack filter inserter': { inputs: { 'electricity': 133 }, fabTime: 0.5, ingredients: { 'electronic circuit': 5, 'stack inserter': 1 } },

    'small electric pole': { yield: 2, fabTime: 0.5, ingredients: { 'wood': 1, 'copper cable': 2 } },
    'medium electric pole': { fabTime: 0.5, ingredients: { 'copper plate': 2, 'steel plate': 2, 'iron stick': 4 } },
    'big electric pole': { fabTime: 0.5, ingredients: { 'copper plate': 5, 'steel plate': 5, 'iron stick': 8 } },
    'substation': { shortName: 'sub', fabTime: 0.5, ingredients: { 'copper plate': 5, 'steel plate': 10, 'advanced circuit': 5 } },
    'pipe': { fabTime: 0.5, ingredients: { 'iron plate': 1 } },
    'pipe to ground': { yield: 2, fabTime: 0.5, ingredients: { 'iron plate': 5, 'pipe': 10 } },
    'pump': { inputs: { 'electricity': 30 }, fabTime: 2, ingredients: { 'steel plate': 1, 'engine unit': 1, 'pipe': 1 } },

    'rail': { yield: 2, fabTime: 0.5, ingredients: { 'stone': 1, 'steel plate': 1, 'iron stick': 1 } },
    'train stop': { fabTime: 0.5, ingredients: { 'iron plate': 6, 'steel plate': 3, 'iron stick': 6, 'electronic circuit': 5 } },
    'rail signal': { fabTime: 0.5, ingredients: { 'iron plate': 5, 'electronic circuit': 1 } },
    'rail chain signal': { fabTime: 0.5, ingredients: { 'iron plate': 5, 'electronic circuit': 1 } },
    'locomotive': { shortName: 'loc', fuelKW: 600, fabTime: 4, ingredients: { 'steel plate': 30, 'electronic circuit': 10, 'engine unit': 20 } },
    'cargo wagon': { fabTime: 1, ingredients: { 'iron plate': 20, 'steel plate': 20, 'iron gear wheel': 10 } },
    'fluid wagon': { fabTime: 1.5, ingredients: { 'steel plate': 16, 'iron gear wheel': 10, 'storage tank': 1, 'pipe': 8 } },

    'car': { fabTime: 2, ingredients: { 'iron plate': 20, 'steel plate': 5, 'engine unit': 8 } },

    'logistic robot': { fabTime: 0.5, inputs: { 'electricity': 18 }, ingredients: { 'advanced circuit': 2, 'flying robot frame': 1 } },
    'construction robot': { fabTime: 0.5, inputs: { 'electricity': 21 }, ingredients: { 'electronic circuit': 2, 'flying robot frame': 1 } },
    'passive provider chest': { fabTime: 0.5, ingredients: { 'electronic circuit': 3, 'advanced circuit': 1, 'steel chest': 1 } },
    'storage chest': { shortName: 'stoc', fabTime: 0.5, ingredients: { 'electronic circuit': 3, 'advanced circuit': 1, 'steel chest': 1 } },
    'roboport': { shortName: 'robo', fabTime: 5, inputs: { 'electricity': 4050 }, ingredients: { 'steel plate': 45, 'iron gear wheel': 45, 'advanced circuit': 45 } },

    'lamp': { shortName: 'lamp', inputs: { 'electricity': 5 }, fabTime: 0.5, ingredients: { 'iron plate': 1, 'copper cable': 3, 'electronic circuit': 1 } },
    'red wire': { fabTime: 0.5, ingredients: { 'copper cable': 1, 'electronic circuit': 1 } },
    'green wire': { fabTime: 0.5, ingredients: { 'copper cable': 1, 'electronic circuit': 1 } },
    'arithmetic combinator': { inputs: { 'electricity': 1 }, fabTime: 0.5, ingredients: { 'copper cable': 5, 'electronic circuit': 5 } },
    'decider combinator': { inputs: { 'electricity': 1 }, fabTime: 0.5, ingredients: { 'copper cable': 5, 'electronic circuit': 5 } },
    'constant combinator': { shortName: 'ccb', fabTime: 0.5, ingredients: { 'copper cable': 5, 'electronic circuit': 2 } },
    'power switch': { fabTime: 2, ingredients: { 'iron plate': 5, 'copper cable': 5, 'electronic circuit': 2 } },
    'programmable speaker': { shortName: 'spk', inputs: { 'electricity': 2 }, fabTime: 2, ingredients: { 'iron plate': 3, 'copper cable': 5, 'iron stick': 4, 'electronic circuit': 4 } },

    'stone brick': { madeIn: FURNACE, fabTime: 3.2, ingredients: { 'stone': 2 } },
    'concrete': { madeIn: ASSEMBLER_2_3, yield: 10, fabTime: 10, ingredients: { 'iron ore': 1, 'stone brick': 5, 'water': 100 } },
    'hazard concrete': { yield: 10, fabTime: 0.25, ingredients: { 'concrete': 10 } },
    'refined concrete': { madeIn: ASSEMBLER_2_3, yield: 10, fabTime: 15, ingredients: { 'steel plate': 1, 'iron stick': 8, 'concrete': 20, 'water': 100 } },
    'refined hazard concrete': { yield: 10, fabTime: 0.25, ingredients: { 'refined concrete': 10 } },
    'landfill': { fabTime: 0.5, ingredients: { 'stone': 20 } },
    'cliff explosives': { fabTime: 8, ingredients: { 'explosives': 10, 'empty barrel': 1, 'grenade': 1 } },

    // Production
    'repair pack': { fabTime: 0.5, ingredients: { 'iron gear wheel': 2, 'electronic circuit': 2 } },

    'boiler': { shortName: 'bo', fuelKW: 1800, fabYieldPerSecond: 60, inputs: { 'water': 60 }, outputs: { 'steam': 60 }, fabTime: 0.5, ingredients: { 'pipe': 4, 'stone furnace': 1 } },
    'steam engine': { type: 'power producer', fabYieldPerSecond: 900, inputs: { 'steam': 30 }, outputs: { 'electricity': 900 }, fabTime: 0.5, ingredients: { 'iron plate': 10, 'iron gear wheel': 8, 'pipe': 5 } },
    'solar panel': { shortName: 'sol', type: 'power producer', fabYieldPerSecond: 60, outputs: { 'electricity': 60 }, fabTime: 10, ingredients: { 'copper plate': 5, 'steel plate': 5, 'electronic circuit': 15 } },
    'accumulator': { inputs: { 'electricity': 300 }, fabYieldPerSecond: 300, outputs: { 'electricity': 300 }, fabTime: 10, ingredients: { 'iron plate': 2, 'battery': 5 } },
    'nuclear reactor': { inputs: { 'nuclear fuel': 40000 }, outputs: { 'heat': 40000 }, fabTime: 8, ingredients: { 'copper plate': 500, 'steel plate': 500, 'advanced circuit': 500, 'concrete': 500 } },
    'heat pipe': { fabTime: 1, ingredients: { 'copper plate': 20, 'steel plate': 10 } },
    'heat exchanger': { inputs: { 'water': 103, 'heat': 10000 }, outputs: { 'steam': 103 }, fabTime: 3, ingredients: { 'copper plate': 100, 'steel plate': 10, 'pipe': 10 } },
    'steam turbine': { type: 'power producer', fabYieldPerSecond: 5820, inputs: { 'steam': 60 }, outputs: { 'electricity': 5820 }, fabTime: 3, ingredients: { 'copper plate': 50, 'iron gear wheel': 50, 'pipe': 20 } },

    'burner mining drill': { type: 'mine', fabYieldPerSecond: 0.25, fuelKW: 150, fabTime: 2, ingredients: { 'iron plate': 3, 'iron gear wheel': 3, 'stone furnace': 1 } },
    'electric mining drill': { type: 'mine', fabYieldPerSecond: 0.5, inputs: { 'electricity': 90 }, fabTime: 2, ingredients: { 'iron plate': 10, 'iron gear wheel': 5, 'electronic circuit': 3 } },
    'offshore pump': { type: 'water pump', fabYieldPerSecond: 1200, outputs: { 'water': 1200 }, fabTime: 0.5, ingredients: { 'iron gear wheel': 1, 'electronic circuit': 2, 'pipe': 1 } },
    'pumpjack': { shortName: 'pj', type: 'oil pump', fabYieldPerSecond: 40 /* kinda average and arbitrary */, inputs: { 'electricity': 90 }, fabTime: 5, ingredients: { 'steel plate': 5, 'iron gear wheel': 10, 'electronic circuit': 5, 'pipe': 10 } },

    'stone furnace': { shortName: 'stof', type: 'furnace', fuelKW: 90, fabSpeedMultiplier: 1, fabTime: 0.5, ingredients: { 'stone': 5 } },
    'steel furnace': { shortName: 'stef', type: 'furnace', fuelKW: 90, fabSpeedMultiplier: 2, fabTime: 3, ingredients: { 'steel plate': 6, 'stone brick': 10 } },
    'electric furnace': { type: 'furnace', inputs: { 'electricity': 186 }, fabSpeedMultiplier: 2, fabTime: 5, ingredients: { 'steel plate': 10, 'advanced circuit': 5, 'stone brick': 10 } },

    'assembling machine 1': { type: 'assembler', fabSpeedMultiplier: 0.5, inputs: { 'electricity': 77.5 }, fabTime: 0.5, ingredients: { 'iron plate': 9, 'iron gear wheel': 5, 'electronic circuit': 3 } },
    'assembling machine 2': { type: 'assembler', fabSpeedMultiplier: 0.75, inputs: { 'electricity': 155 }, fabTime: 0.5, ingredients: { 'steel plate': 2, 'iron gear wheel': 5, 'electronic circuit': 3, 'assembling machine 1': 1 } },
    'assembling machine 3': { type: 'assembler', fabSpeedMultiplier: 1.25, inputs: { 'electricity': 388 }, fabTime: 0.5, ingredients: { 'assembling machine 2': 2, 'speed module': 2 } },
    'oil refinery': { type: 'refinery', fabSpeedMultiplier: 1, inputs: { 'electricity': 434 }, fabTime: 8, ingredients: { 'steel plate': 15, 'iron gear wheel': 10, 'electronic circuit': 10, 'pipe': 10, 'stone brick': 10 } },
    'chemical plant': { shortName: 'chem', type: 'chemical plant', fabSpeedMultiplier: 1, inputs: { 'electricity': 217 }, fabTime: 5, ingredients: { 'steel plate': 5, 'iron gear wheel': 5, 'electronic circuit': 5, 'pipe': 5 } },
    'centrifuge': { shortName: 'cen', type: 'centrifuge', fabTime: 4, ingredients: { 'steel plate': 50, 'iron gear wheel': 100, 'advanced circuit': 100, 'concrete': 100 } },
    'lab': { inputs: { 'electricity': 60 }, fabTime: 2, ingredients: { 'iron gear wheel': 10, 'electronic circuit': 10, 'transport belt': 4 } },

    'speed module': { fabTime: 15, ingredients: { 'electronic circuit': 5, 'advanced circuit': 5 } },
    'speed module 2': { fabTime: 30, ingredients: { 'advanced circuit': 5, 'processing unit': 5, 'speed module': 4 } },
    'speed module 3': { fabTime: 60, ingredients: { 'advanced circuit': 5, 'processing unit': 5, 'speed module 2': 5 } },
    'efficiency module': { fabTime: 15, ingredients: { 'electronic circuit': 5, 'advanced circuit': 5 } },
    'efficiency module 2': { fabTime: 30, ingredients: { 'advanced circuit': 5, 'processing unit': 5, 'efficiency module': 4 } },
    'efficiency module 3': { fabTime: 60, ingredients: { 'advanced circuit': 5, 'processing unit': 5, 'efficiency module 2': 5 } },
    'productivity module': { fabTime: 15, ingredients: { 'electronic circuit': 5, 'advanced circuit': 5 } },
    'productivity module 2': { fabTime: 30, ingredients: { 'advanced circuit': 5, 'processing unit': 5, 'productivity module': 4 } },
    'productivity module 3': { fabTime: 60, ingredients: { 'advanced circuit': 5, 'processing unit': 5, 'productivity module 2': 5 } },

    // Intermediate Products
    'sulfuric acid': { yield: 50, madeIn: CHEMICAL_PLANT, fabTime: 1, ingredients: { 'iron plate': 1, 'sulfur': 5, 'water': 100 } },
    'petroleum gas': { yield: 45, madeIn: REFINERY, fabTime: 5, ingredients: { 'crude oil': 100 } },
    'heavy oil': { yield: 25, madeIn: REFINERY, fabTime: 5, ingredients: { 'water': 50, 'crude oil': 100 } },
    'light oil': { yield: 45, madeIn: REFINERY, fabTime: 5, ingredients: { 'water': 50, 'crude oil': 100 } },
    'solid fuel': { madeIn: CHEMICAL_PLANT, fabTime: 2, ingredients: { 'petroleum gas': 20 } },
    'lubricant': { shortName: 'lube', yield: 10, madeIn: CHEMICAL_PLANT, fabTime: 1, ingredients: { 'heavy oil': 10 } },

    'iron plate': { madeIn: FURNACE, fabTime: 3.2, ingredients: { 'iron ore': 1 } },
    'copper plate': { madeIn: FURNACE, fabTime: 3.2, ingredients: { 'copper ore': 1 } },
    'steel plate': { madeIn: FURNACE, fabTime: 16, ingredients: { 'iron plate': 5 } },
    'plastic bar': { madeIn: CHEMICAL_PLANT, yield: 2, fabTime: 1, ingredients: { 'coal': 1, 'petroleum gas': 20 } },
    'sulfur': { madeIn: CHEMICAL_PLANT, yield: 2, fabTime: 1, ingredients: { 'water': 30, 'petroleum gas': 30 } },
    'battery': { madeIn: CHEMICAL_PLANT, fabTime: 4, ingredients: { 'iron plate': 1, 'copper plate': 1, 'sulfuric acid': 20 } },
    'explosives': { madeIn: CHEMICAL_PLANT, yield: 2, fabTime: 4, ingredients: { 'coal': 1, 'sulfur': 1, 'water': 10 } },
    'uranium-235': { shortName: 'u235', madeIn: CENTRIFUGE, yield: 0.07, fabTime: 12, ingredients: { 'uranium ore': 10 } },
    'uranium-238': { shortName: 'u238', madeIn: CENTRIFUGE, yield: 9.93, fabTime: 12, ingredients: { 'uranium ore': 10 } },

    'copper cable': { yield: 2, fabTime: 0.5, ingredients: { 'copper plate': 1 } },
    'iron stick': { yield: 2, fabTime: 0.5, ingredients: { 'iron plate': 1 } },
    'iron gear wheel': { fabTime: 0.5, ingredients: { 'iron plate': 2 } },
    'empty barrel': { fabTime: 1, ingredients: { 'steel plate': 1 } },
    'electronic circuit': { fabTime: 0.5, ingredients: { 'iron plate': 1, 'copper cable': 3 } },
    'advanced circuit': { shortName: 'adv', fabTime: 6, ingredients: { 'plastic bar': 2, 'copper cable': 4, 'electronic circuit': 2 } },
    'processing unit': { fabTime: 10, madeIn: ASSEMBLER_2_3, ingredients: { 'electronic circuit': 20, 'advanced circuit': 2, 'sulfuric acid': 5 } },
    'engine unit': { madeIn: ASSEMBLER, fabTime: 10, ingredients: { 'steel plate': 1, 'iron gear wheel': 1, 'pipe': 2 } },
    'electric engine unit': { madeIn: ASSEMBLER_2_3, fabTime: 10, ingredients: { 'electronic circuit': 2, 'engine unit': 1, 'lubricant': 15 } },
    'flying robot frame': { fabTime: 20, ingredients: { 'steel plate': 1, 'battery': 2, 'electronic circuit': 3, 'electric engine unit': 1 } },
    'rocket control unit': { fabTime: 30, ingredients: { 'processing unit': 1, 'speed module': 1 } },
    'low density structure': { fabTime: 20, ingredients: { 'copper plate': 20, 'steel plate': 2, 'plastic bar': 5 } },
    'rocket fuel': { madeIn: ASSEMBLER_2_3, fabTime: 30, ingredients: { 'solid fuel': 10, 'light oil': 10 } },
    'nuclear fuel': { madeIn: CENTRIFUGE, fabTime: 90, ingredients: { 'rocket fuel': 1, 'uranium-235': 1 } },
    'uranium fuel cell': { fabTime: 10, ingredients: { 'iron plate': 10, 'uranium-235': 1, 'uranium-238': 19 } },

    'automation science pack': { fabTime: 5, ingredients: { 'copper plate': 1, 'iron gear wheel': 1 } },
    'logistic science pack': { fabTime: 6, ingredients: { 'transport belt': 1, 'inserter': 1 } },
    'military science pack': { yield: 2, fabTime: 10, ingredients: { 'piercing rounds magazine': 1, 'grenade': 1, 'wall': 2 } },
    'chemical science pack': { yield: 2, fabTime: 24, ingredients: { 'sulfur': 1, 'advanced circuit': 3, 'engine unit': 2 } },
    'production science pack': { yield: 3, fabTime: 21, ingredients: { 'rail': 30, 'electric furnace': 1, 'productivity module': 1 } },
    'utility science pack': { yield: 3, fabTime: 21, ingredients: { 'processing unit': 2, 'flying robot frame': 1, 'low density structure': 3 } },

    // Combat

    'pistol': { shortName: 'pst', fabTime: 5, ingredients: { 'iron plate': 5, 'copper plate': 5 } },
    'submachine gun': { fabTime: 10, ingredients: { 'iron plate': 10, 'copper plate': 5, 'iron gear wheel': 10 } },
    'shotgun': { shortName: 'shg', fabTime: 10, ingredients: { 'wood': 5, 'iron plate': 15, 'copper plate': 10, 'iron gear wheel': 5 } },
    'combat shotgun': { fabTime: 10, ingredients: { 'wood': 10, 'copper plate': 10, 'steel plate': 15, 'iron gear wheel': 5 } },
    'rocket': { fabTime: 8, ingredients: { 'iron plate': 2, 'explosives': 1, 'electronic circuit': 1 } },
    'flamethrower': { fabTime: 10, ingredients: { 'steel plate': 5, 'iron gear wheel': 10 } },
    'land mine': { fabTime: 5, yield: 4, ingredients: { 'steel plate': 1, 'explosives': 2 } },

    'firearm magazine': { fabTime: 1, ingredients: { 'iron plate': 4 } },
    'piercing rounds magazine': { fabTime: 3, ingredients: { 'copper plate': 5, 'steel plate': 1, 'firearm magazine': 1 } },
    'shotgun shells': { fabTime: 3, ingredients: { 'iron plate': 2, 'copper plate': 2 } },
    'rocket launcher': { fabTime: 10, ingredients: { 'iron plate': 5, 'iron gear wheel': 5, 'electronic circuit': 5 } },
    'explosive rocket': { fabTime: 8, ingredients: { 'explosives': 2, 'rocket': 1 } },
    'flamethrower ammo': { madeIn: CHEMICAL_PLANT, fabTime: 6, ingredients: { 'steel plate': 5, 'crude oil': 100 } },

    'grenade': { shortName: 'gr', fabTime: 8, ingredients: { 'coal': 10, 'iron plate': 5 } },
    'poison capsule': { fabTime: 8, ingredients: { 'coal': 10, 'steel plate': 3, 'electronic circuit': 3 } },
    'slowdown capsule': { shortName: 'slo', fabTime: 8, ingredients: { 'coal': 5, 'steel plate': 2, 'electronic circuit': 2 } },
    'defender capsule': { shortName: 'def', fabTime: 8, ingredients: { 'iron gear wheel': 3, 'electronic circuit': 3, 'piercing rounds magazine': 3 } },

    'light armor': { fabTime: 3, ingredients: { 'iron plate': 40 } },
    'heavy armor': { fabTime: 8, ingredients: { 'copper plate': 100, 'steel plate': 50 } },
    'modular armor': { fabTime: 15, ingredients: { 'steel plate': 50, 'advanced circuit': 30 } },
    'power armor': { fabTime: 10, ingredients: { 'steel plate': 40, 'processing unit': 40, 'electric engine unit': 20 } },

    'portable solar panel': { shortName: 'psol', fabTime: 10, outputs: { 'electricity': 30 }, ingredients: { 'steel plate': 5, 'advanced circuit': 2, 'solar panel': 1 } },
    'personal battery': { shortName: 'pbat', fabTime: 10, ingredients: { 'steel plate': 10, 'battery': 5 } },
    'personal battery mk2': { fabTime: 10, ingredients: { 'processing unit': 15, 'low density structure': 5, 'personal battery': 10 } },
    'belt immunity equipment': { fabTime: 10, ingredients: { 'steel plate': 10, 'advanced circuit': 5 } },
    'exoskeleton': { shortName: 'xo', fabTime: 10, inputs: { 'electricity': 200 }, ingredients: { 'steel plate': 20, 'processing unit': 10, 'electric engine unit': 30 } },
    'personal roboport': { fabTime: 10, inputs: { 'electricity': 2000 }, ingredients: { 'steel plate': 20, 'battery': 45, 'iron gear wheel': 40, 'advanced circuit': 10 } },
    'nightvision': { fabTime: 10, ingredients: { 'steel plate': 10, 'advanced circuit': 5 } },

    'energy shield': { fabTime: 10, ingredients: { 'steel plate': 10, 'advanced circuit': 5 } },

    'wall': { fabTime: 0.5, ingredients: { 'stone brick': 5 } },
    'gate': { fabTime: 0.5, ingredients: { 'steel plate': 2, 'electronic circuit': 2, 'wall': 1 } },
    'gun turret': { fabTime: 8, ingredients: { 'iron plate': 20, 'copper plate': 10, 'iron gear wheel': 10 } },
    'laser turret': { fabTime: 20, inputs: { 'electricity': 1220 }, ingredients: { 'steel plate': 20, 'battery': 12, 'electronic circuit': 20 } },
    'flamethrower turret': { fabTime: 20, ingredients: { 'steel plate': 30, 'iron gear wheel': 15, 'engine unit': 5, 'pipe': 10 } },
    'radar': { shortName: 'rdr', inputs: { 'electricity': 300 }, fabTime: 0.5, ingredients: { 'iron plate': 10, 'iron gear wheel': 5, 'electronic circuit': 5 } }
}





