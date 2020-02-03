import { DARK, FIRE, LIGHT, WATER, WIND } from "../index";

// const swarfarmUnits = require('../../data/units');

function mapElement(strElement) {
    switch (strElement) {
        case 'fire':
            return FIRE;
        case 'wind':
            return WIND;
        case 'water':
            return WATER;
        case 'dark':
            return DARK;
        case 'light':
            return LIGHT;
        default:
            throw new Error(`Unknown element ${strElement}`);
    }
}

export function stats(unit) {
    return {
        id: unit.id,
        element: mapElement(unit.element.toLowerCase()),
        hp: unit.max_lvl_hp,
        atk: unit.max_lvl_attack,
        def: unit.max_lvl_defense,
        spd: unit.speed,
        cr: unit.crit_rate,
        cd: unit.crit_damage,
        acc: unit.accuracy,
        res: unit.resistance,
        skills: unit.skills
    };
}

export function view(unit) {
    return {
        id: unit.id,
        name: unit.name,
        icon: `https://swarfarm.com/static/herders/images/monsters/${unit.image_filename}`,
    };
}


function parseDmgMultiplier(rawMultipliers, meta) {
    return rawMultipliers
        .map(l => {
            switch (l.trim()) {
                case "Damage +5%":
                    return { dmg: 5 };
                case "Damage +10%":
                    return { dmg: 10 };
                case "Damage +15%":
                    return { dmg: 15 };
                case "Damage +20%":
                    return { dmg: 20 };
                case "Damage +25%":
                    return { dmg: 25 };
                case "Effect Rate +5%":
                    return { effect: 5 };
                case "Effect Rate +10%":
                    return { effect: 10 };
                case "Effect Rate +15%":
                    return { effect: 15 };
                case "Effect Rate +20%":
                    return { effect: 20 };
                case "Effect Rate +25%":
                    return { effect: 25 };
                case "Recovery +5%":
                    return { effect: 5 };
                case "Recovery +10%":
                    return { effect: 10 };
                case "Recovery +15%":
                    return { effect: 15 };
                case "Cooltime Turn -1":
                    return { cooldown: -1 };
                default:
                    throw new NotImplementedError(`Unknown modifier: ${l}`);
            }
        })
        .reduce((carry, el) => {
            if (el.dmg) {
                carry.dmg += el.dmg;
            }
            if (el.effect) {
                carry.effect += el.effect;
            }
            if (el.cooldown) {
                carry.cooldown += el.cooldown;
            }
            return carry;
        }, meta);
}

function mapEffectName(effectId) {
    if (effectId === 28) {
        return 'stun';
    }

    return effectId;
}

export function skillEffect(e) {
    if (e.effect.id === 1) {
        return { buffs: ['atk', e.quantity] };
    }
    if (e.effect.id === 2) {
        return { buffs: ['def', e.quantity] };
    }
    if (e.effect.id === 3) {
        return { buffs: ['cr', e.quantity] };
    }
    if (e.effect.id === 5) {
        return { buffs: ['spd', e.quantity] };
    }
    if (e.effect.id === 17) {
        return { atbIncrease: e.quantity };
    }
    if (e.effect.id === 12) {
        return { shield: null };
    }
    if (e.effect.id === 26) {
        return { debuffs: ['dot', e.quantity, e.chance] };
    }
    if (e.effect.id === 13) {
        return { buffs: ['endure', e.quantity] };
    }
    if (e.effect.id === 9) {
        return { buffs: ['immunity', e.quantity] };
    }
    if (e.effect.id === 34) {
        return {cleanse: e.quantity || 10} // all, as it 10 is max amount of debuffs
    }
    if (e.effect.id === 35) { // heal
        return {};
    }
    if (e.effect.id === 75) {
        return { atbSteal: [e.quantity, e.chance] };
    }
    if (e.effect.id === 36) {
        return {}
    }

    throw new NotImplementedError(`Unknown effect: ${e.effect.id}`);
}


let allyMatch = /\bally\b/;
let alliesMatch = /\ballies\b/;
let enemyMatch = /\benemy\b/;
let enemiesMatch = /\benemies\b/;
let damageMatch = /\bdamage\b/;

function parseTargetFromText(text) {
    if (enemyMatch.test(text)) {
        return 'enemy';
    }
    if (enemiesMatch.test(text)) {
        return 'enemies';
    }
    if (allyMatch.test(text)) {
        return 'ally';
    }
    if (alliesMatch.test(text)) {
        return 'allies';
    }
    if (damageMatch.test(text)) {
        return 'enemy';
    }
    if (/\b(Attacks|Shoots)\b/) {
        return 'enemy';
    }

    throw new NotImplementedError(`Unknown Target in: "${text}"`);
}

class NotImplementedError extends Error {

}

class SpecialCaseError extends Error {

}

export function parseMultipliers(rawMultipliers) {
    return rawMultipliers.reduce((opts, mod) => {
        if (mod.length < 3) return opts;

        const type = mod[1] === '*' ? 'Multiplier' : 'Modifier';
        let stat = mod[0].toLowerCase();
        if ('ATTACK_TOT_HP' === mod[0]) {
            stat = 'maxHp';
        } else if ('ATTACK_CUR_HP_RATE' === mod[0]) {
            stat = 'curHp';
        } else if ('Target MAX HP' === mod[0]) {
            stat = 'targetMaxHp';
        } else if ('ATTACK_SPEED' === mod[0]) {
            stat = 'atkSpd';
        }
        if (mod.length >= 3) {
            opts[`${stat}${type}`] = mod[2];
        }
        if (mod.length === 5) {
            const type2 = mod[3] === '*' ? 'Multiplier' : 'Modifier';
            if (mod[3] === '-') {
                opts[`${stat}${type2}`] = -mod[4];
            } else {
                opts[`${stat}${type2}`] = mod[4];
            }
        }

        if (mod.includes('FIXED')) throw new Error('Fixed dmg need manual handling');

        return opts;
    }, {});
}

export function skill(skl) {

    if (!(skl.effects && skl.effects.length)) {
        return {
            id: skl.id,
            meta: { dmg: 0, effect: 0, cooldown: 0 },
            steps: [],
        };
    }

    let isRevive = skl.effects[0].effect.id === 36;
    let isHeal = skl.effects[0].effect.id === 35;
    let isShield = skl.effects[0].effect.id === 12;

    let target = parseTargetFromText(skl.description);

    let step = { target };

    let rawMultiplier = eval(skl.multiplier_formula_raw);

    if (isHeal) {
        if (skl.scales_with.length === 1 && skl.scales_with[0] === 'ATK') {
            step.atkHeal = rawMultiplier[0][2];
        } else if (skl.scales_with.length === 0) {
            step.ratioHeal = skl.effects.find(el => el.effect.id === 35).quantity / 100;
        } else {
            throw new NotImplementedError('Cant parse heal multiplier');
        }
    } else if (isShield) {
        throw new NotImplementedError('Shield skill');
    } else if (skl.scales_with.length > 0) {
        if (skl.scales_with.length === 1 && skl.scales_with[0] === 'ATK') {
            step.atkDmg = parseMultipliers(rawMultiplier);
        } else if (skl.scales_with.length === 1 && skl.scales_with[0] === 'DEF') {
            step.defDmg = parseMultipliers(rawMultiplier);
        } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'SPD') {
            step.spdDmg = {
                ...parseMultipliers(rawMultiplier),
                divisor: rawMultiplier[4][0],
            };
        } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'DEF') {
            step.atkAndDefDmg = parseMultipliers(rawMultiplier);
        } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'MAX HP') {
            step.atkAndMaxHpDmg = parseMultipliers(rawMultiplier);
        } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'Current HP %') {
            step.atkAndCurHpDmg = parseMultipliers(rawMultiplier);
        } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'Target MAX HP') {
            step.atkAndTargetMaxHpDmg = parseMultipliers(rawMultiplier);
        } else {
            throw new NotImplementedError(`Cant parse dmg multiplier: ${skl.scales_with.join()}`);
        }
    } else {
        // no dmg skill
    }

    const debuffs = skl.effects.filter(effect => effect.effect.is_buff === false)
        .map(el => [mapEffectName(el.effect.id), el.quantity, el.chance]);

    if (debuffs.length) step.debuffs = debuffs;

    const buffs = skl.effects.filter(effect => effect.effect.is_buff === true)
        .map(skillEffect)
        .reduce((effects, effect) => {
            if (effect.buffs) {
                effects.buffs.push(effect.buffs);
            } else if (effect.debuffs) {
                effects.debuffs.push(effect.debuffs);
            } else {
                effects = {
                    ...effects,
                    ...effect
                };
            }

            return effects;
        }, {buffs:[]});

    step = {
        ...step,
        ...buffs,
    };


    // at least 1 action. skills without dmg have hits = 0
    const numSteps = skl.hits || 1;

    return {
        id: skl.id,
        meta: parseDmgMultiplier(
            skl.level_progress_description,
            { dmg: 0, effect: 0, cooldown: parseInt(skl.cooltime, 10) || 0 }
        ),
        steps: Array(numSteps).fill(step),
    };
}



