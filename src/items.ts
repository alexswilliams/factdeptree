
export type itemType = 'mine' | 'oil pump' | 'water pump' | 'furnace' | 'refinery' | 'assembler' | 'chemical plant' | 'power producer'
export type constructorType = { type: itemType | 'raw element', excluding?: string }

export interface item {
    ingredients: { [key: string]: number }
    fabTime: number
    yield?: number
    fuelKW?: number
    inputs?: { [key: string]: number }
    outputs?: { [key: string]: number }
    type?: itemType
    madeIn?: constructorType
    craftingSpeed?: number
    miningSpeed?: number
}

const ASSEMBLER: constructorType = { type: 'assembler' }
const ASSEMBLER_2_3: constructorType = { type: 'assembler', excluding: 'assembling machine 1' }
const FURNACE: constructorType = { type: 'furnace' }
const CHEMICAL_PLANT: constructorType = { type: 'chemical plant' }
const REFINERY: constructorType = { type: 'refinery' }
const MINE: constructorType = { type: 'mine' }
const WATER_PUMP: constructorType = { type: 'water pump' }
const OIL_PUMP: constructorType = { type: 'oil pump' }


export const items: { [key: string]: item } = {
    // Raw materials
    // TODO: Check the fab time on these items.
    'wood': { fabTime: 1, ingredients: {} },
    'stone': { madeIn: MINE, fabTime: 2, ingredients: {} },
    'iron ore': { madeIn: MINE, fabTime: 2, ingredients: {} },
    'water': { madeIn: WATER_PUMP, yield: 60, fabTime: 1, ingredients: {} },
    'crude oil': { madeIn: OIL_PUMP, fabTime: 1, ingredients: {} },
    'copper ore': { madeIn: MINE, fabTime: 2, ingredients: {} },
    'coal': { madeIn: MINE, fabTime: 2, ingredients: {} },

    // Logistics
    'wooden chest': { fabTime: 0.5, ingredients: { 'wood': 2 } },
    'iron chest': { fabTime: 0.5, ingredients: { 'iron plate': 8 } },
    'steel chest': { fabTime: 0.5, ingredients: { 'steel plate': 8 } },
    'storage tank': { fabTime: 3, ingredients: { 'iron plate': 20, 'steel plate': 5 } },

    'transport belt': { yield: 2, fabTime: 0.5, ingredients: { 'iron plate': 1, 'iron gear wheel': 1 } },
    'fast transport belt': { fabTime: 3.5, ingredients: { 'iron gear wheel': 5, 'transport belt': 1 } },
    'underground belt': { yield: 2, fabTime: 1, ingredients: { 'iron plate': 10, 'transport belt': 5 } },
    'fast underground belt': { yield: 2, fabTime: 2, ingredients: { 'iron gear wheel': 40, 'underground belt': 2 } },
    'splitter': { fabTime: 1, ingredients: { 'iron plate': 5, 'electronic circuit': 5, 'transport belt': 4 } },
    'fast splitter': { fabTime: 2, ingredients: { 'iron gear wheel': 10, 'electronic circuit': 10, 'splitter': 1 } },

    'burner inserter': { fuelKW: 94.2, fabTime: 0.5, ingredients: { 'iron plate': 1, 'iron gear wheel': 1 } },
    'inserter': { inputs: { 'electricity': 13.6 }, fabTime: 0.5, ingredients: { 'iron plate': 1, 'iron gear wheel': 1, 'electronic circuit': 1 } },
    'long-handed inserter': { inputs: { 'electricity': 20.11 }, fabTime: 0.5, ingredients: { 'iron plate': 1, 'iron gear wheel': 1, 'inserter': 1 } },
    'fast inserter': { inputs: { 'electricity': 46.7 }, fabTime: 0.5, ingredients: { 'iron plate': 2, 'electronic circuit': 2, 'inserter': 1 } },
    'filter inserter': { inputs: { 'electricity': 53.3 }, fabTime: 0.5, ingredients: { 'electronic circuit': 4, 'fast inserter': 1 } },
    'stack inserter': { inputs: { 'electricity': 133 }, fabTime: 0.5, ingredients: { 'iron gear wheel': 15, 'electronic circuit': 15, 'advanced circuit': 1, 'fast inserter': 1 } },
    'stack filter inserter': { inputs: { 'electricity': 133 }, fabTime: 0.5, ingredients: { 'electronic circuit': 5, 'stack inserter': 1 } },

    'small electric pole': { yield: 2, fabTime: 0.5, ingredients: { 'wood': 1, 'copper cable': 2 } },
    'medium electric pole': { fabTime: 0.5, ingredients: { 'copper plate': 2, 'steel plate': 2, 'iron stick': 4 } },
    'big electric pole': { fabTime: 0.5, ingredients: { 'copper plate': 5, 'steel plate': 5, 'iron stick': 8 } },
    'pipe': { fabTime: 0.5, ingredients: { 'iron plate': 1 } },
    'pipe to ground': { yield: 2, fabTime: 0.5, ingredients: { 'iron plate': 5, 'pipe': 10 } },
    'pump': { inputs: { 'electricity': 30 }, fabTime: 2, ingredients: { 'steel plate': 1, 'engine unit': 1, 'pipe': 1 } },

    'rail': { yield: 2, fabTime: 0.5, ingredients: { 'stone': 1, 'steel plate': 1, 'iron stick': 1 } },
    'train stop': { fabTime: 0.5, ingredients: { 'iron plate': 6, 'steel plate': 3, 'iron stick': 6, 'electronic circuit': 5 } },
    'rail signal': { fabTime: 0.5, ingredients: { 'iron plate': 5, 'electronic circuit': 1 } },
    'rail chain signal': { fabTime: 0.5, ingredients: { 'iron plate': 5, 'electronic circuit': 1 } },
    'locomotive': { fuelKW: 600, fabTime: 4, ingredients: { 'steel plate': 30, 'electronic circuit': 10, 'engine unit': 20 } },
    'cargo wagon': { fabTime: 1, ingredients: { 'iron plate': 20, 'steel plate': 20, 'iron gear wheel': 10 } },
    'fluid wagon': { fabTime: 1.5, ingredients: { 'steel plate': 16, 'iron gear wheel': 10, 'storage tank': 1, 'pipe': 8 } },

    'car': { fabTime: 2, ingredients: { 'iron plate': 20, 'steel plate': 5, 'engine unit': 8 } },

    'lamp': { inputs: { 'electricity': 5 }, fabTime: 0.5, ingredients: { 'iron plate': 1, 'copper cable': 3, 'electronic circuit': 1 } },
    'red wire': { fabTime: 0.5, ingredients: { 'copper cable': 1, 'electronic circuit': 1 } },
    'green wire': { fabTime: 0.5, ingredients: { 'copper cable': 1, 'electronic circuit': 1 } },
    'arithmetic combinator': { inputs: { 'electricity': 1 }, fabTime: 0.5, ingredients: { 'copper cable': 5, 'electronic circuit': 5 } },
    'decider combinator': { inputs: { 'electricity': 1 }, fabTime: 0.5, ingredients: { 'copper cable': 5, 'electronic circuit': 5 } },
    'constant combinator': { fabTime: 0.5, ingredients: { 'copper cable': 5, 'electronic circuit': 2 } },
    'power switch': { fabTime: 2, ingredients: { 'iron plate': 5, 'copper cable': 5, 'electronic circuit': 2 } },
    'programmable speaker': { inputs: { 'electricity': 2 }, fabTime: 2, ingredients: { 'iron plate': 3, 'copper cable': 5, 'iron stick': 4, 'electronic circuit': 4 } },

    'stone brick': { madeIn: FURNACE, fabTime: 3.2, ingredients: { 'stone': 2 } },
    'concrete': { madeIn: ASSEMBLER_2_3, yield: 10, fabTime: 10, ingredients: { 'iron ore': 1, 'stone brick': 5, 'water': 100 } },
    'hazard concrete': { yield: 10, fabTime: 0.25, ingredients: { 'concrete': 10 } },
    'refined concrete': { madeIn: ASSEMBLER_2_3, yield: 10, fabTime: 15, ingredients: { 'steel plate': 1, 'iron stick': 8, 'concrete': 20, 'water': 100 } },
    'refined hazard concrete': { yield: 10, fabTime: 0.25, ingredients: { 'refined concrete': 10 } },
    'cliff explosives': { fabTime: 8, ingredients: { 'explosives': 10, 'empty barrel': 1, 'grenade': 1 } },

    // Production
    'repair pack': { fabTime: 0.5, ingredients: { 'iron gear wheel': 2, 'electronic circuit': 2 } },

    'boiler': { fuelKW: 1800, inputs: { 'water': 60 }, outputs: { 'steam': 60 }, fabTime: 0.5, ingredients: { 'pipe': 4, 'stone furnace': 1 } },
    'steam engine': { type: 'power producer', inputs: { 'steam': 30 }, outputs: { 'electricity': 900 }, fabTime: 0.5, ingredients: { 'iron plate': 10, 'iron gear wheel': 8, 'pipe': 5 } },
    'solar panel': { type: 'power producer', outputs: { 'electricity': 60 }, fabTime: 10, ingredients: { 'copper plate': 5, 'steel plate': 5, 'electronic circuit': 15 } },
    'accumulator': { inputs: { 'electricity': 300 }, outputs: { 'electricity': 300 }, fabTime: 10, ingredients: { 'iron plate': 2, 'battery': 5 } },

    'burner mining drill': { miningSpeed: 0.25, fuelKW: 150, fabTime: 2, ingredients: { 'iron plate': 3, 'iron gear wheel': 3, 'stone furnace': 1 } },
    'electric mining drill': { miningSpeed: 0.5, inputs: { 'electricity': 90 }, fabTime: 2, ingredients: { 'iron plate': 10, 'iron gear wheel': 5, 'electronic circuit': 3 } },
    'offshore pump': { type: 'water pump', outputs: { 'water': 1200 }, fabTime: 0.5, ingredients: { 'iron gear wheel': 1, 'electronic circuit': 2, 'pipe': 1 } },
    'pumpjack': { type: 'oil pump', miningSpeed: 1, inputs: { 'electricity': 90 }, fabTime: 5, ingredients: { 'steel plate': 5, 'iron gear wheel': 10, 'electronic circuit': 5, 'pipe': 10 } },

    'stone furnace': { type: 'furnace', fuelKW: 90, craftingSpeed: 1, fabTime: 0.5, ingredients: { 'stone': 5 } },
    'steel furnace': { type: 'furnace', fuelKW: 90, craftingSpeed: 2, fabTime: 3, ingredients: { 'steel plate': 6, 'stone brick': 10 } },

    'assembling machine 1': { type: 'assembler', craftingSpeed: 0.5, inputs: { 'electricity': 77.5 }, fabTime: 0.5, ingredients: { 'iron plate': 9, 'iron gear wheel': 5, 'electronic circuit': 3 } },
    'assembling machine 2': { type: 'assembler', craftingSpeed: 0.75, inputs: { 'electricity': 155 }, fabTime: 0.5, ingredients: { 'steel plate': 2, 'iron gear wheel': 5, 'electronic circuit': 3, 'assembling machine 1': 1 } },
    'oil refinery': { type: 'refinery', craftingSpeed: 1, inputs: { 'electricity': 434 }, fabTime: 8, ingredients: { 'steel plate': 15, 'iron gear wheel': 10, 'electronic circuit': 10, 'pipe': 10, 'stone brick': 10 } },
    'chemical plant': { type: 'chemical plant', craftingSpeed: 1, inputs: { 'electricity': 217 }, fabTime: 5, ingredients: { 'steel plate': 5, 'iron gear wheel': 5, 'electronic circuit': 5, 'pipe': 5 } },
    'lab': { inputs: { 'electricity': 60 }, fabTime: 2, ingredients: { 'iron gear wheel': 10, 'electronic circuit': 10, 'transport belt': 4 } },

    'speed module': { fabTime: 15, ingredients: { 'electronic circuit': 5, 'advanced circuit': 5 } },
    'efficiency module': { fabTime: 15, ingredients: { 'electronic circuit': 5, 'advanced circuit': 5 } },
    'productivity module': { fabTime: 15, ingredients: { 'electronic circuit': 5, 'advanced circuit': 5 } },

    // Intermediate Products
    'sulfuric acid': { yield: 50, madeIn: CHEMICAL_PLANT, fabTime: 1, ingredients: { 'iron plate': 1, 'sulfur': 5, 'water': 100 } },
    'petroleum gas': { yield: 45, madeIn: REFINERY, fabTime: 5, ingredients: { 'crude oil': 100 } },
    'solid fuel': { madeIn: CHEMICAL_PLANT, fabTime: 2, ingredients: { 'petroleum gas': 20 } },

    'iron plate': { madeIn: FURNACE, fabTime: 3.2, ingredients: { 'iron ore': 1 } },
    'copper plate': { madeIn: FURNACE, fabTime: 3.2, ingredients: { 'copper ore': 1 } },
    'steel plate': { madeIn: FURNACE, fabTime: 16, ingredients: { 'iron plate': 5 } },
    'plastic bar': { madeIn: CHEMICAL_PLANT, yield: 2, fabTime: 1, ingredients: { 'coal': 1, 'petroleum gas': 20 } },
    'sulfur': { madeIn: CHEMICAL_PLANT, yield: 2, fabTime: 1, ingredients: { 'water': 30, 'petroleum gas': 30 } },
    'battery': { madeIn: CHEMICAL_PLANT, fabTime: 4, ingredients: { 'iron plate': 1, 'copper plate': 1, 'sulfuric acid': 20 } },
    'explosives': { madeIn: CHEMICAL_PLANT, yield: 2, fabTime: 4, ingredients: { 'coal': 1, 'sulfur': 1, 'water': 10 } },

    'copper cable': { yield: 2, fabTime: 0.5, ingredients: { 'copper plate': 1 } },
    'iron stick': { yield: 2, fabTime: 0.5, ingredients: { 'iron plate': 1 } },
    'iron gear wheel': { fabTime: 0.5, ingredients: { 'iron plate': 2 } },
    'empty barrel': { fabTime: 1, ingredients: { 'steel plate': 1 } },
    'electronic circuit': { fabTime: 0.5, ingredients: { 'iron plate': 1, 'copper cable': 3 } },
    'advanced circuit': { fabTime: 6, ingredients: { 'plastic bar': 2, 'copper cable': 4, 'electronic circuit': 2 } },
    'engine unit': { madeIn: ASSEMBLER, fabTime: 10, ingredients: { 'steel plate': 1, 'iron gear wheel': 1, 'pipe': 2 } },

    'automation science pack': { fabTime: 5, ingredients: { 'copper plate': 1, 'iron gear wheel': 1 } },
    'logistic science pack': { fabTime: 6, ingredients: { 'transport belt': 1, 'inserter': 1 } },
    'military science pack': { yield: 2, fabTime: 10, ingredients: { 'piercing rounds magazine': 1, 'grenade': 1, 'wall': 2 } },
    'chemical science pack': { yield: 2, fabTime: 24, ingredients: { 'sulfur': 1, 'advanced circuit': 3, 'engine unit': 2 } },

    // Combat
    'pistol': { fabTime: 5, ingredients: { 'iron plate': 5, 'copper plate': 5 } },
    'submachine gun': { fabTime: 10, ingredients: { 'iron plate': 10, 'copper plate': 5, 'iron gear wheel': 10 } },
    'shotgun': { fabTime: 10, ingredients: { 'wood': 5, 'iron plate': 15, 'copper plate': 10, 'iron gear wheel': 5 } },

    'firearm magazine': { fabTime: 1, ingredients: { 'iron plate': 4 } },
    'piercing rounds magazine': { fabTime: 3, ingredients: { 'copper plate': 5, 'steel plate': 1, 'firearm magazine': 1 } },
    'shotgun shells': { fabTime: 3, ingredients: { 'iron plate': 2, 'copper plate': 2 } },

    'grenade': { fabTime: 8, ingredients: { 'coal': 10, 'iron plate': 5 } },
    'defender capsule': { fabTime: 8, ingredients: { 'iron gear wheel': 3, 'electronic circuit': 3, 'piercing rounds magazine': 3 } },

    'light armor': { fabTime: 3, ingredients: { 'iron plate': 40 } },
    'heavy armor': { fabTime: 8, ingredients: { 'copper plate': 100, 'steel plate': 50 } },
    'modular armor': { fabTime: 15, ingredients: { 'steel plate': 50, 'advanced circuit': 30 } },

    'wall': { fabTime: 0.5, ingredients: { 'stone brick': 5 } },
    'gate': { fabTime: 0.5, ingredients: { 'steel plate': 2, 'electronic circuit': 2, 'wall': 1 } },
    'gun turret': { fabTime: 8, ingredients: { 'iron plate': 20, 'copper plate': 10, 'iron gear wheel': 10 } },
    'radar': { inputs: { 'electricity': 300 }, fabTime: 0.5, ingredients: { 'iron plate': 10, 'iron gear wheel': 5, 'electronic circuit': 5 } }
}





