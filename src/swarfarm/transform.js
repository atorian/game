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
                    return { recovery: 5 };
                case "Recovery +10%":
                    return { recovery: 10 };
                case "Recovery +15%":
                    return { recovery: 15 };
                case "Recovery +20%":
                    return { recovery: 20 };
                case "Cooltime Turn -1":
                    return { cooldown: -1 };
                case "Shield +5%":
                    return { shield: 0.05 };
                case "Shield +10%":
                    return { shield: 0.1 };
                case "Attack Bar Recovery +5%":
                    return { atbIncrease: 0.05 };
                case "Attack Bar Recovery +10%":
                    return { atbIncrease: 0.1 };
                case "Harmful Effect Rate +1 Turns":
                    return { debuffDuration: 1 };
                default:
                    throw new NotImplementedError(`Unknown modifier: ${l}`);
            }
        })
        .reduce((carry, el) => {

            for (let [k, v] of Object.entries(el)) {
                if (!carry[k]) carry[k] = 0;
                carry[k] += v;
            }

            // return carry;

            // if (el.dmg) {
            //     carry.dmg += el.dmg;
            // }
            // if (el.effect) {
            //     carry.effect += el.effect;
            // }
            // if (el.effect) {
            //     carry.effect += el.effect;
            // }
            // if (el.cooldown) {
            //     carry.cooldown += el.cooldown;
            // }
            return carry;
        }, meta);
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
    if (e.effect.id === 4) {
        return { buffs: ['anti_cr', e.quantity] };
    }
    if (e.effect.id === 5) {
        return { buffs: ['spd', e.quantity] };
    }
    if (e.effect.id === 6) {
        return { buffs: ['hot', e.quantity] };
    }
    if (e.effect.id === 7) {
        return { buffs: ['counterAtk', e.quantity] };
    }
    if (e.effect.id === 9) {
        return { buffs: ['immunity', e.quantity] };
    }
    if (e.effect.id === 10) {
        return { buffs: ['invincibility', e.quantity] };
    }
    if (e.effect.id === 11) {
        return { buffs: ['reflectDmg', e.quantity] };
    }
    if (e.effect.id === 12) {
        return {};
    }
    if (e.effect.id === 13) {
        return { buffs: ['endure', e.quantity] };
    }
    if (e.effect.id === 14) {
        return { buffs: ['defend', e.quantity] };
    }
    if (e.effect.id === 15) {
        return { buffs: ['soul_protect', e.quantity] };
    }
    if (e.effect.id === 17) {
        return { atbIncrease: e.quantity };
    }
    if (e.effect.id === 18) {
        return { debuffs: ['glancing', e.quantity, e.chance] };
    }
    if (e.effect.id === 19) {
        return { debuffs: ['atk_break', e.quantity, e.chance] };
    }
    if (e.effect.id === 20) {
        return { debuffs: ['def_break', e.quantity, e.chance] };
    }
    if (e.effect.id === 21) {
        return { debuffs: ['slow', e.quantity, e.chance] };
    }
    if (e.effect.id === 22) {
        return { debuffs: ['blockBuff', e.quantity, e.chance] };
    }
    if (e.effect.id === 23) {
        return { debuffs: ['bomb', e.quantity, e.chance] };
    }
    if (e.effect.id === 24) {
        return { debuffs: ['provoke', e.quantity, e.chance] };
    }
    if (e.effect.id === 25) {
        return { debuffs: ['sleep', e.quantity, e.chance] };
    }
    if (e.effect.id === 26) {
        return { debuffs: ['dot', e.quantity, e.chance] };
    }
    if (e.effect.id === 27) {
        return { debuffs: ['freeze', e.quantity, e.chance] };
    }
    if (e.effect.id === 28) {
        return { debuffs: ['stun', e.quantity, e.chance] };
    }
    if (e.effect.id === 29) {
        return { debuffs: ['heal_block', e.quantity, e.chance] };
    }
    if (e.effect.id === 30) {
        return { debuffs: ['silence', e.quantity, e.chance] };
    }
    if (e.effect.id === 31) {
        return { debuffs: ['brand', e.quantity, e.chance] };
    }
    if (e.effect.id === 32) {
        return { debuffs: ['oblivious', e.quantity, e.chance] };
    }
    if (e.effect.id === 33) {
        return { atbDecrease: [e.quantity, e.chance] };
    }
    if (e.effect.id === 34) {
        return { cleanse: e.quantity || Infinity } // all, as it 10 is max amount of debuffs
    }
    if (e.effect.id === 35) { // heal
        return {};
    }
    if (e.effect.id === 36) {
        return {}
    }
    if (e.effect.id === 37) {
        return { strip: [10, 100] };
    }
    if (e.effect.id === 38) {
        return {};
    }
    if (e.effect.id === 39) {
        let eff = [e.effect.chance || 100];
        if (e.on_death) eff.push(true);
        return { additionalTurn: eff };
    }
    if (e.effect.id === 41) {
        return { detonate: 'bomb' };
    }
    if (e.effect.id === 42) {
        return { stealBuff: [e.quantity || Infinity, e.chance] };
    }
    if (e.effect.id === 43) {
        return { skillRefresh: e.quantity || Infinity };
    }
    if (e.effect.id === 44) {
        return {
            skillReset: {
                amount: e.quantity || Infinity,
                chance: e.chance
            }
        };
    }
    if (e.effect.id === 48) {
        return { cantRevive: true };
    }
    if (e.effect.id === 50) {
        return {
            transferDebuffs: {
                chance: e.chance || 100,
                amount: e.quantity || Infinity,
                target: e.aoe ? 'allies' : 'self',
            }
        };
    }
    if (e.effect.id === 51) {
        return { additionalAttack: e.chance };
    }
    if (e.effect.id === 52) {
        return { increaseBuffDuration: e.quantity };
    }
    if (e.effect.id === 54) {
        return { selfHarm: e.quantity / 100 };
    }
    if (e.effect.id === 55) {
        // element advantage
        return { };
    }
    if (e.effect.id === 56) {
        return { };
    }
    if (e.effect.id === 57) {
        return {
            hpDestroy: e.quantity / 100,
        };
    }
    if (e.effect.id === 61) {
        return { dmgReduce: e.quantity / 100 };
    }
    if (e.effect.id === 63) {
        return {};
    }
    if (e.effect.id === 67) {
        return {};
    }
    if (e.effect.id === 65) {
        return {};
    }
    if (e.effect.id === 75) {
        return { atbSteal: [e.quantity, e.chance] };
    }

    return {notes: [`Unknown effect: ${e.effect.id}`]};
}

let allyMatch = /\bally\b/;
let alliesMatch = /\ballies\b/;
let enemyMatch = /\b(enemy|target|target\'s)\b/;
let enemiesMatch = /\b(enemies|targets)\b/;
let damageMatch = /\bdamage\b/;

export function parseTargetFromText(text) {
    if (text.includes('attack with')) return 'enemy';
    if (allyMatch.test(text)) return 'ally';
    if (alliesMatch.test(text)) return 'allies';
    if (enemyMatch.test(text)) return 'enemy';
    if (enemiesMatch.test(text)) return 'enemies';
    if (damageMatch.test(text) && !text.includes('absorbs')) return 'enemy';
    if (/\b(Attacks|Shoots)\b/.test(text)) return 'enemy';
    if (/\b(itself|your)\b/.test(text)) return 'self';

    return "self";
    // throw new NotImplementedError(`Unknown Target in: "${text}"`);
}

class NotImplementedError extends Error {

}

function mapStat(rawStat) {
    let stat = rawStat.toLowerCase();

    if ('ATTACK_TOT_HP' === rawStat) {
        stat = 'maxHp';
    } else if ('ATTACK_CUR_HP_RATE' === rawStat) {
        stat = 'curHp';
    } else if ('Target MAX HP' === rawStat) {
        stat = 'targetMaxHp';
    } else if ('TARGET_TOT_HP' === rawStat) {
        stat = 'targetMaxHp';
    } else if ('ATTACK_SPEED' === rawStat) {
        stat = 'atkSpd';
    } else if ('RIDER_SPEED' === rawStat) {
        stat = 'atkSpd';
    } else if ('TARGET_CUR_HP_RATE' === rawStat) {
        stat = 'targetCurHpRate';
    }

    return stat
}

export function parseMultipliers(rawMultipliers) {
    return rawMultipliers.reduce((opts, mod) => {
        if (mod.length < 3) return opts;

        const type = mod[1] === '*' ? 'Multiplier' : 'Modifier';
        let stat = mapStat(mod[0]);

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

        if (mod.includes('FIXED')) {
            notes.push('Fixed dmg need manual handling');
        }

        return opts;
    }, {});
}

function parseEffects(effects) {
    return effects
        .map(skillEffect)
        .reduce((effects, effect) => {
            if (effect.buffs) {
                if (!effects.buffs) effects.buffs = [];
                effects.buffs.push(effect.buffs);
            } else if (effect.debuffs) {
                if (!effects.debuffs) effects.debuffs = [];
                effects.debuffs.push(effect.debuffs);
            } else if (effect.notes) {
                if (!effects.notes) effects.notes = [];
                effects.notes.push(...effect.notes);
            } else {
                effects = {
                    ...effects,
                    ...effect
                };
            }
            return effects;
        }, {});
}

function hasHealEffect(skill) {
    return skill.effects.some(e => e.effect.id === 35);
}
function hasHealOfDmgEffect(skill) {
    return skill.effects.some(e => e.effect.id === 35 && e.damage);
}

function findShieldEffect(skill) {
    return skill.effects.find(e => e.effect.id === 12);
}
function findGroupAttack(skill) {
    return skill.effects.find(e => e.effect.id === 56);
}

function hasElementAdvantage(skill) {
    return skill.effects.some(e => e.effect.id === 55);
}
function hasDebuffTransfer(skill) {
    return skill.effects.some(e => e.effect.id === 50);
}

function findBomb(skill) {
    return skill.effects.find(e => e.effect.id === 23);
}

export function skill(skl) {

    if (!(skl.effects && skl.effects.length)) {
        return {
            id: skl.id,
            meta: { dmg: 0, effect: 0, cooldown: 0 },
            steps: [],
        };
    }
    let notes = [];
    let dealsDmg = skl.description.includes('damage');
    let revive = skl.effects.find(e => e.effect.id === 36);
    let isHeal = hasHealEffect(skl);

    let target = null;
    try {
        target = parseTargetFromText(skl.description);
    } catch (e) {
        console.error(e.message);
    }

    if (hasDebuffTransfer(skl)) {
        target = 'enemy';
    }

    let step = { target };

    let rawMultiplier = eval(skl.multiplier_formula_raw);

    if ((isHeal || revive) && !dealsDmg) {
        let mainEffect = skl.effects.find(el => el.effect.id === 35) || revive;
        if (skl.scales_with.length === 1 && skl.scales_with[0] === 'ATK') {
            step.atkHeal = rawMultiplier[0][2];
        } else if (skl.scales_with.length === 1 && skl.scales_with[0] === 'Target MAX HP') {
            step.ratioHeal = mainEffect.quantity / 100;
        } else if (skl.scales_with.length === 0 || skl.scales_with.length === 1 && skl.scales_with[0] === 'MAX HP') {
            step.ratioHeal = mainEffect.quantity / 100;
        } else {
            notes.push('Cant parse heal multiplier');
        }
    }
    let shieldEffect = findShieldEffect(skl);
    if (shieldEffect) {
        if (skl.scales_with.length === 0 || skl.scales_with.length === 1 && skl.scales_with[0] === 'MAX HP') {
            step.shield = {
                maxHpMultiplier: 1,
                duration: shieldEffect.quantity,
            };
        } else if (skl.scales_with.length === 1 && skl.scales_with[0] === 'ATK') {
            notes.push(`Shield scales with ATK or Damage for skill: ${skl.id}`);
        } else if (skl.scales_with.length === 1 && skl.scales_with[0] === 'DEF') {
            step.shield = {
                ...parseMultipliers(rawMultiplier),
                duration: shieldEffect.quantity,
            };
        }  else if (skl.scales_with.length === 1 && skl.scales_with[0] === 'Level') {
            step.shield = {
                level: 120,
                duration: shieldEffect.quantity,
            };
        } else {
            notes.push(`Shield of ${skl.scales_with.join()}`);
        }
    }

    if (target !== 'self' && skl.scales_with.length > 0 && !isHeal && !findBomb(skl) && !revive) {
        let debuffMultiplier = undefined;
        let debuffMultiplierEffect = skl.effects.find(el => el.effect.id === 67);
        if (debuffMultiplierEffect) {
            debuffMultiplier = debuffMultiplierEffect.quantity / 100;
        }

        const ignoresDef = skl.effects.some(el => el.effect.id === 38);
        const ignoresDefReduction = skl.effects.some(el => el.effect.id === 65);
        const soulDestroy = skl.effects.some(el => el.effect.id === 63);
        try {
            if (skl.scales_with.length === 1 && skl.scales_with[0] === 'ATK') {
                step.atkDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.atkDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 1 && skl.scales_with[0] === 'DEF') {
                step.defDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.defDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 1 && skl.scales_with[0] === 'MAX HP') {
                step.maxHpDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.defDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 1 && skl.scales_with[0] === "Missing HP") {
                step.lostHpDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.defDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'SPD') {
                try {
                    step.spdDmg = {
                        ...parseMultipliers(rawMultiplier),
                        divisor: rawMultiplier[4][0],
                        ignoresDef,
                        ignoresDefReduction,
                    };
                } catch(e) {
                    notes.push('spdDmg multiplier is broken')
                }

                if (debuffMultiplier) step.spdDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'DEF') {
                step.atkAndDefDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.atkAndDefDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'MAX HP') {
                step.atkAndMaxHpDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.atkAndMaxHpDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'Current HP %') {
                step.atkAndCurHpDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.atkAndCurHpDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'Target MAX HP') {
                step.atkAndTargetMaxHpDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.atkAndTargetMaxHpDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'Target Current HP %') {
                step.atkAndTargetCurHpRateDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.atkAndTargetMaxHpDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 2 && skl.scales_with[0] === 'ATK' && skl.scales_with[1] === 'Relative SPD') {
                step.atkAndRelativeSpdDmg = {
                    ...parseMultipliers(rawMultiplier),
                    ignoresDef,
                    ignoresDefReduction,
                };
                if (debuffMultiplier) step.atkAndTargetMaxHpDmg.debuffMultiplier = debuffMultiplier;
                if (soulDestroy) step.atkDmg.soulDestroy = true;
            } else if (skl.scales_with.length === 1 && skl.scales_with[0] === 'Level') {
                // shoudn'd be a case
            } else {
                notes.push(`Cant parse dmg multiplier: ${skl.scales_with.join()}`);
            }
        } catch(e) {
            notes.push(e.message);
        }


    } else if(findBomb(skl) && skl.scales_with.length === 1 && skl.scales_with[0] !== 'ATK') {
        throw new NotImplementedError(`Invalid multiplier for bomb: ${skl.id}`);
    } else {
        // no dmg skill
    }

    if(dealsDmg && hasHealOfDmgEffect(skl)) {
        step.dmgHeal = skl.effects.find(el => el.effect.id === 35).quantity / 100;
    }

    const effects = parseEffects(skl.effects);
    // not applicable to enemy
    delete effects.additionalTurn;
    delete effects.additionalAttack;
    delete effects.skillRefresh;
    delete effects.selfHarm;
    delete effects.atbIncrease;
    if (effects.notes) {
        notes.push(...effects.notes);
        delete effects.notes;
    }
    if (!['ally', 'allies', 'self'].includes(target)) {
        delete effects.buffs;
    }
    if (effects.buffs) {
        for (const b of effects.buffs) {
            if (b[1] > 3) {
                notes.push(`Duration of buff is too big for skill ${skl.id}.`);
            }
        }
    }

    if (hasElementAdvantage(skl)) {
        notes.push(`Element advantage behavior detected: ${skl.id}.`);
    }

    if (effects.debuffs) {
        const debuffsExceptDot = effects.debuffs.filter(e => e[0] !== 'dot' && e[0] !== 'bomb');
        const uniqDebuffs = new Set(debuffsExceptDot.map(el => el[0]));
        if (debuffsExceptDot.length !== uniqDebuffs.size) {
            notes.push('Duplicate debuffs');
        }

        if (effects.buffs) {
            const buffsExceptHot = effects.buffs.filter(e => e[0] !== 'hot');
            const uniqBuffs = new Set(buffsExceptHot.map(el => el[0]));
            if (buffsExceptHot.length !== uniqBuffs.size) {
                notes.push('Duplicate buffs');
            }
        }
    }

    Object.assign(step, effects);
    let numSteps = skl.hits || 1;

    let groupAttack = findGroupAttack(skl);
    if (groupAttack) {
        step.groupAttack = groupAttack.quantity;
    }
    // at least 1 action. skills without dmg have hits = 0

    const selfEffects = parseEffects(skl.effects.filter(e => e.self_effect === true));
    delete selfEffects.notes;

    const steps = Array(numSteps).fill(step);
    if (Object.keys(selfEffects).length > 0) {
        if (step.target !== 'self') {
            const selfHeal = skl.effects.find(e => e.effect.id === 35 && e.self_effect === true);

            const selfStep = {
                target: 'self',
                ...selfEffects
            };

            if (selfHeal) {
                selfStep.ratioHeal = selfHeal.quantity / 100;
            }

            steps.push(selfStep);
        }
    }

    const parsedSkill = {
        id: skl.id,
        description: skl.description,
        slot: skl.slot,
        icon: skl.icon_filename,
        passive: skl.passive,
        meta: parseDmgMultiplier(
            skl.level_progress_description,
            { dmg: 0, effect: 0, cooldown: parseInt(skl.cooltime, 10) || 0 }
        ),
        steps,
    };

    notes.push(...skl.effects.map(el => el.note).filter(v => v));
    if (skl.passive && skl.effects.some(e => e.effect.id === 11)) {
        notes.push('FIXME: Passive DMG reflect');
    }

    if (notes.length) parsedSkill.notes = notes;

    return parsedSkill;
}
