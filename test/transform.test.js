import { assert } from 'chai';
import * as transform from '../src/swarfarm/transform';
import { parseMultipliers } from '../src/swarfarm/transform';
import { FIRE } from "../src";
import _ from 'lodash';

function codegenSkill(skillData) {
    let result = '{\n';
    result += 'action: [\n';

    for (let step of skillData.steps) {
        result += 'step(\n';
        if (step.target === 'enemy') {
            result += 'targetEnemy,\n';
        }
        if (step.atkDmg) {
            result += `simpleAtkDmg(roll, (atk) => atk * ${step.atkDmg.atkMultiplier}),\n`;
        }
        if (step.debuffs) {
            for (let d of step.debuffs) {
                result += `debuff(roll, '${d[0]}', ${d[1]}, ${d[2]}),\n`;
            }
        }

        result += '),\n';
    }

    result += '],\n';
    result += 'meta: {\n';
    result += `dmg: ${skillData.meta.dmg},\n`;
    result += `effect: ${skillData.meta.effect},\n`;
    result += `cooldown: ${skillData.meta.cooldown}\n`;
    result += '}\n';
    result += '}';

    return result;
}

describe('swarfarm adapter', () => {

    it('Unit', () => {
        const unit = {
            "id": 12,
            "url": "https://swarfarm.com/api/v2/monsters/12/",
            "com2us_id": 12812,
            "family_id": 12800,
            "name": "Lamor",
            "image_filename": "unit_icon_0011_1_1.png",
            "element": "Fire",
            "archetype": "Support",
            "base_stars": 2,
            "natural_stars": 1,
            "obtainable": true,
            "can_awaken": true,
            "awaken_level": 1,
            "awaken_bonus": "Leader Skill",
            "skills": [
                20,
                25
            ],
            "skill_ups_to_max": 12,
            "leader_skill": {
                "id": 2,
                "url": "https://swarfarm.com/api/v2/leader-skills/2/",
                "attribute": "Attack Power",
                "amount": 15,
                "area": "General",
                "element": null
            },
            "homunculus_skills": [],
            "base_hp": 1995,
            "base_attack": 148,
            "base_defense": 127,
            "speed": 100,
            "crit_rate": 15,
            "crit_damage": 50,
            "resistance": 15,
            "accuracy": 0,
            "raw_hp": 44,
            "raw_attack": 49,
            "raw_defense": 42,
            "max_lvl_hp": 7245,
            "max_lvl_attack": 538,
            "max_lvl_defense": 461,
            "awakens_from": 11,
            "awakens_to": null,
            "awaken_mats_fire_low": 0,
            "awaken_mats_fire_mid": 0,
            "awaken_mats_fire_high": 0,
            "awaken_mats_water_low": 0,
            "awaken_mats_water_mid": 0,
            "awaken_mats_water_high": 0,
            "awaken_mats_wind_low": 0,
            "awaken_mats_wind_mid": 0,
            "awaken_mats_wind_high": 0,
            "awaken_mats_light_low": 0,
            "awaken_mats_light_mid": 0,
            "awaken_mats_light_high": 0,
            "awaken_mats_dark_low": 0,
            "awaken_mats_dark_mid": 0,
            "awaken_mats_dark_high": 0,
            "awaken_mats_magic_low": 0,
            "awaken_mats_magic_mid": 0,
            "awaken_mats_magic_high": 0,
            "source": [
                {
                    "id": 18,
                    "url": "https://swarfarm.com/api/v2/monster-sources/18/",
                    "name": "Vrofagus Ruins",
                    "description": "",
                    "farmable_source": true
                },
                {
                    "id": 36,
                    "url": "https://swarfarm.com/api/v2/monster-sources/36/",
                    "name": "Magic Shop",
                    "description": "",
                    "farmable_source": false
                },
                {
                    "id": 39,
                    "url": "https://swarfarm.com/api/v2/monster-sources/39/",
                    "name": "Unknown Scroll or Social Summon",
                    "description": "",
                    "farmable_source": false
                }
            ],
            "fusion_food": false,
            "homunculus": false,
            "craft_cost": null,
            "craft_materials": []
        };

        assert.deepEqual(transform.stats(unit), {
            id: 12,
            element: FIRE,
            hp: 7245,
            atk: 538,
            def: 461,
            spd: 100,
            cr: 15,
            cd: 50,
            acc: 0,
            res: 15,
            skills: [20, 25]
        });

        assert.deepEqual(transform.view(unit), {
            id: 12,
            name: "Lamor",
            icon: "https://swarfarm.com/static/herders/images/monsters/unit_icon_0011_1_1.png",
        });
    });

    describe('Effects', () => {
        it('parses ATK buff', () => {
            const atkBuf = {
                "effect": {
                    "id": 1,
                    "url": "https://swarfarm.com/api/v2/skill-effects/1/",
                    "name": "Increase ATK",
                    "is_buff": true,
                    "description": "Attack Power is increased by 50%",
                    "icon_filename": "buff_attack_up.png"
                },
                "aoe": false,
                "single_target": false,
                "self_effect": true,
                "chance": null,
                "on_crit": false,
                "on_death": false,
                "random": false,
                "quantity": 3,
                "all": false,
                "self_hp": false,
                "target_hp": false,
                "damage": false,
                "note": ""
            };

            assert.deepEqual(transform.skillEffect(atkBuf), { buffs: ['atk', 3] });
        });
        it('parses Crit Rate buff', () => {
            const crBuf = {
                "effect": {
                    "id": 3,
                    "url": "https://swarfarm.com/api/v2/skill-effects/3/",
                    "name": "Increase CRI Rate",
                    "is_buff": true,
                    "description": "Critical Hit Rate is increased by 30%",
                    "icon_filename": "buff_crit_up.png"
                },
                "aoe": false,
                "single_target": false,
                "self_effect": true,
                "chance": null,
                "on_crit": false,
                "on_death": false,
                "random": false,
                "quantity": 3,
                "all": false,
                "self_hp": false,
                "target_hp": false,
                "damage": false,
                "note": ""
            };

            assert.deepEqual(transform.skillEffect(crBuf), { buffs: ['cr', 3] });
        });
        it('parses ATB increase', () => {
            const effect = {
                "effect": {
                    "id": 17,
                    "url": "https://swarfarm.com/api/v2/skill-effects/17/",
                    "name": "Increase ATB",
                    "is_buff": true,
                    "description": "The ATK bar of ally monsters is filled by a set amount. This allows ally monsters to attack again sooner.",
                    "icon_filename": ""
                },
                "aoe": false,
                "single_target": false,
                "self_effect": true,
                "chance": null,
                "on_crit": false,
                "on_death": false,
                "random": false,
                "quantity": 50,
                "all": false,
                "self_hp": false,
                "target_hp": false,
                "damage": false,
                "note": ""
            };

            assert.deepEqual(transform.skillEffect(effect), { atbIncrease: 50 });
        });
        it('parses DOT', () => {
            const effect = {
                "effect": {
                    "id": 26,
                    "url": "https://swarfarm.com/api/v2/skill-effects/26/",
                    "name": "Continuous DMG",
                    "is_buff": false,
                    "description": "Deals 5% of monster's max HP as damage every turn",
                    "icon_filename": "debuff_dot.png"
                },
                "aoe": false,
                "single_target": true,
                "self_effect": false,
                "chance": 100,
                "on_crit": false,
                "on_death": false,
                "random": false,
                "quantity": 3,
                "all": false,
                "self_hp": false,
                "target_hp": false,
                "damage": false,
                "note": ""
            };

            assert.deepEqual(transform.skillEffect(effect), { debuffs: ['dot', 3, 100] });
        });
        it('parses Endure buff', () => {
            const effect = {
                "effect": {
                    "id": 13,
                    "url": "https://swarfarm.com/api/v2/skill-effects/13/",
                    "name": "Endure",
                    "is_buff": true,
                    "description": "Monster temporarily cannot be killed as HP cannot go below 1",
                    "icon_filename": "buff_endure.png"
                },
                "aoe": false,
                "single_target": false,
                "self_effect": true,
                "chance": 100,
                "on_crit": false,
                "on_death": false,
                "random": false,
                "quantity": 1,
                "all": false,
                "self_hp": false,
                "target_hp": false,
                "damage": false,
                "note": ""
            };

            assert.deepEqual(transform.skillEffect(effect), { buffs: ['endure', 1] });
        });

        it.skip('parses shield', () => {
            const effect = {
                "effect": {
                    "id": 12,
                    "url": "https://swarfarm.com/api/v2/skill-effects/12/",
                    "name": "Shield",
                    "is_buff": true,
                    "description": "A shield is created to absorb a portion of incoming damage",
                    "icon_filename": "buff_shield.png"
                },
                "aoe": false,
                "single_target": false,
                "self_effect": true,
                "chance": null,
                "on_crit": false,
                "on_death": false,
                "random": false,
                "quantity": 3,
                "all": false,
                "self_hp": true,
                "target_hp": false,
                "damage": false,
                "note": ""
            };

            assert.deepEqual(transform.skillEffect(effect), { shield: null });
        });
    });

    it('parses healing spell', () => {
        const skill = {
            "id": 60,
            "com2us_id": 1106,
            "name": "Purify",
            "description": "Removes all harmful effects on the target ally and recovers its HP. The recovery amount is proportionate to the Attack Power.",
            "slot": 2,
            "cooltime": 3,
            "hits": 0,
            "passive": false,
            "aoe": false,
            "max_level": 6,
            "level_progress_description": [
                "Recovery +5%",
                "Recovery +5%",
                "Recovery +10%",
                "Recovery +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 35,
                        "url": "https://swarfarm.com/api/v2/skill-effects/35/",
                        "name": "Heal",
                        "is_buff": true,
                        "description": "Increases ally's HP",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": true,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 34,
                        "url": "https://swarfarm.com/api/v2/skill-effects/34/",
                        "name": "Cleanse",
                        "is_buff": true,
                        "description": "Removes one or more debuffs",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": true,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "4*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 4]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0000_5_0.png",
            "used_on": [
                312,
                311
            ]
        };

        assert.containsAllDeepKeys(transform.skill(skill), {
            id: 60,
            passive: false,
            steps: [
                {
                    target: 'ally',
                    atkHeal: 4,
                    cleanse: Infinity,
                }
            ],
            meta: {
                dmg: 0,
                effect: 0,
                recovery: 30,
                cooldown: 2,
            }
        });
    });

    it('parses ratio healing spell', () => {
        const skill = {
            "id": 98,
            "com2us_id": 3412,
            "name": "Fiery Dance",
            "description": "Recovers the HP of all allies by 25% and increases their Attack Power for 3 turns.",
            "slot": 3,
            "cooltime": 5,
            "hits": 1,
            "passive": false,
            "aoe": true,
            "max_level": 6,
            "level_progress_description": [
                "Recovery +5%",
                "Recovery +10%",
                "Recovery +10%",
                "Cooltime Turn -1",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 35,
                        "url": "https://swarfarm.com/api/v2/skill-effects/35/",
                        "name": "Heal",
                        "is_buff": true,
                        "description": "Increases ally's HP",
                        "icon_filename": ""
                    },
                    "aoe": true,
                    "single_target": false,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 25,
                    "all": false,
                    "self_hp": false,
                    "target_hp": true,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 1,
                        "url": "https://swarfarm.com/api/v2/skill-effects/1/",
                        "name": "Increase ATK",
                        "is_buff": true,
                        "description": "Attack Power is increased by 50%",
                        "icon_filename": "buff_attack_up.png"
                    },
                    "aoe": true,
                    "single_target": false,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 3,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "",
            "multiplier_formula_raw": "[]",
            "scales_with": [],
            "icon_filename": "skill_icon_0002_8_8.png",
            "used_on": [
                23
            ]
        };

        assert.containsAllDeepKeys(transform.skill(skill), {
            id: 98,
            passive: false,
            steps: [
                {
                    target: 'allies',
                    ratioHeal: 0.25,
                    buffs: [
                        ['atk', 3]
                    ]
                }
            ],
            meta: {
                dmg: 0,
                effect: 0,
                recovery: 25,
                cooldown: 3,
            }
        });
    });

    it('parses ratio healing spell with 2 multipliers', () => {
        const skill = {
            "id": 130,
            "com2us_id": 4608,
            "name": "Dispel!",
            "description": "Removes all of the harmful effects on you and the target ally and recovers 20% of your HP.",
            "slot": 2,
            "cooltime": 3,
            "hits": 0,
            "passive": false,
            "aoe": true,
            "max_level": 5,
            "level_progress_description": [
                "Recovery +10%",
                "Recovery +10%",
                "Recovery +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 35,
                        "url": "https://swarfarm.com/api/v2/skill-effects/35/",
                        "name": "Heal",
                        "is_buff": true,
                        "description": "Increases ally's HP",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 20,
                    "all": false,
                    "self_hp": true,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 34,
                        "url": "https://swarfarm.com/api/v2/skill-effects/34/",
                        "name": "Cleanse",
                        "is_buff": true,
                        "description": "Removes one or more debuffs",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": true,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "0.15*{Target MAX HP}",
            "multiplier_formula_raw": "[[\"TARGET_TOT_HP\", \"*\", 0.15]]",
            "scales_with": [
                "Target MAX HP"
            ],
            "icon_filename": "skill_icon_0001_3_2.png",
            "used_on": [
                102,
                101
            ]
        };

        assert.containsAllDeepKeys(transform.skill(skill), {
            id: 130,
            passive: false,
            steps: [
                {
                    target: 'ally',
                    ratioHeal: 0.2,
                    cleanse: Infinity,
                },
                {
                    target: 'self',
                    cleanse: Infinity,
                    ratioHeal: 0.2,
                }
            ],
            meta: {
                dmg: 0,
                effect: 0,
                recovery: 30,
                cooldown: 2,
            }
        });
    });

    it.skip('parses Lonely Fight (Passive)', () => {
        const skill = {
            "id": 573,
            "com2us_id": 6114,
            "name": "Lonely Fight (Passive)",
            "description": "Absorbs the Attack Bar by 20% if you attack a monster with same or lower HP status compared to yours. Recovers your HP by 20% of the damage dealt if you attack a monster that has better HP status than yours. [Automatic Effect]",
            "slot": 3,
            "cooltime": null,
            "hits": 1,
            "passive": true,
            "aoe": false,
            "max_level": 1,
            "level_progress_description": [],
            "effects": [
                {
                    "effect": {
                        "id": 35,
                        "url": "https://swarfarm.com/api/v2/skill-effects/35/",
                        "name": "Heal",
                        "is_buff": true,
                        "description": "Increases ally's HP",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 20,
                    "all": false,
                    "self_hp": true,
                    "target_hp": false,
                    "damage": false,
                    "note": "If target has higher HP %"
                },
                {
                    "effect": {
                        "id": 75,
                        "url": "https://swarfarm.com/api/v2/skill-effects/75/",
                        "name": "Absorb ATB",
                        "is_buff": true,
                        "description": "Steal ATB from the enemy and add it to yourself",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 20,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": "If target has lower HP %"
                }
            ],
            "multiplier_formula": "",
            "multiplier_formula_raw": "[]",
            "scales_with": [],
            "icon_filename": "skill_icon_0005_7_4.png",
            "used_on": [
                443,
                444
            ]
        };

        assert.containsAllDeepKeys(transform.skill(skill), {
            id: 98,
            steps: [
                {
                    target: 'allies',
                    ratioHeal: 0.25,
                    buffs: [
                        ['atk', 3]
                    ]
                }
            ],
            meta: {
                dmg: 0,
                effect: 25,
                cooldown: 3,
            }
        });
    });

    it('parses devilmon skill', () => {
        const skill = {
            "id": 1,
            "com2us_id": 99004,
            "name": "Forbidden Ingredient (Passive)",
            "description": "Increases the Skill Level of the monster by 1 when used as Power-up material.",
            "slot": 1,
            "cooltime": null,
            "hits": 0,
            "passive": true,
            "aoe": false,
            "max_level": 1,
            "level_progress_description": [],
            "effects": [],
            "multiplier_formula": "",
            "multiplier_formula_raw": "[]",
            "scales_with": [],
            "icon_filename": "skill_icon_0006_0_1.png",
            "used_on": [
                115
            ]
        };

        assert.containsAllDeepKeys(transform.skill(skill), {
            id: 1,
            steps: [],
            meta: {
                dmg: 0,
                effect: 0,
                cooldown: 0,
            }
        });
    });

    it('attacking skill with stun', () => {
        const skill = {
            "id": 4,
            "com2us_id": 3602,
            "name": "Splinter Attack",
            "description": "Hurls sharp pieces of lumber and stuns the enemy with a 15% chance.",
            "slot": 1,
            "cooltime": null,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 8,
            "level_progress_description": [
                "Damage +5%",
                "Damage +5%",
                "Effect Rate +10%",
                "Damage +10%",
                "Effect Rate +10%",
                "Damage +10%",
                "Effect Rate +15%"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 28,
                        "url": "https://swarfarm.com/api/v2/skill-effects/28/",
                        "name": "Stun",
                        "is_buff": false,
                        "description": "Enemy is stunned and immobilized for a number of turns",
                        "icon_filename": "debuff_stun.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 15,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 1,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "3.6*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 3.6]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0003_5_7.png",
            "used_on": [
                1
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 4,
            passive: false,
            steps: [
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 3.6,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['stun', 1, 15],
                    ],
                }
            ],
            meta: {
                dmg: 30,
                effect: 35,
                cooldown: 0,
            }
        });

        const code = codegenSkill(transformed);
        assert.equal(`{
action: [
step(
targetEnemy,
simpleAtkDmg(roll, (atk) => atk * 3.6),
debuff(roll, 'stun', 1, 15),
),
],
meta: {
dmg: 30,
effect: 35,
cooldown: 0
}
}`, code);
    });

    it('attacking skill with provoke', () => {
        const skill = {
            "id": 210,
            "com2us_id": 6610,
            "name": "Taunting Strike",
            "description": "Attacks an enemy with a humiliating strike, provoking the target with an 80% chance. This attack will deal more damage according to your MAX HP.",
            "slot": 2,
            "cooltime": 3,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 6,
            "level_progress_description": [
                "Effect Rate +10%",
                "Damage +10%",
                "Effect Rate +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 24,
                        "url": "https://swarfarm.com/api/v2/skill-effects/24/",
                        "name": "Provoke",
                        "is_buff": false,
                        "description": "The monster is forced to only attack the monster which applied the effect",
                        "icon_filename": "debuff_provoke.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 80,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 1,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "1.9*{ATK} + 0.26*{MAX HP}",
            "multiplier_formula_raw": "[[\"ATTACK_TOT_HP\", \"*\", 0.26], [\"+\"], [\"ATK\", \"*\", 1.9]]",
            "scales_with": [
                "ATK",
                "MAX HP"
            ],
            "icon_filename": "skill_icon_0006_3_2.png",
            "used_on": [
                514,
                513
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 210,
            passive: false,
            steps: [
                {
                    target: 'enemy',
                    atkAndMaxHpDmg: {
                        atkMultiplier: 1.9,
                        maxHpMultiplier: 0.26,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['provoke', 1, 80],
                    ],
                }
            ],
            meta: {
                dmg: 20,
                effect: 20,
                cooldown: 2,
            }
        });
    });

    it('attacking skill with def break', () => {
        const skill = {
            "id": 24,
            "com2us_id": 4010,
            "name": "Crushing Rocks",
            "description": "Attacks with 4 strong consecutive strikes. Each strike has a 30% chance to decrease the enemy's Defense for 2 turns.",
            "slot": 2,
            "cooltime": 3,
            "hits": 4,
            "passive": false,
            "aoe": false,
            "max_level": 6,
            "level_progress_description": [
                "Effect Rate +5%",
                "Effect Rate +5%",
                "Damage +10%",
                "Damage +10%",
                "Damage +15%"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 20,
                        "url": "https://swarfarm.com/api/v2/skill-effects/20/",
                        "name": "Decrease DEF",
                        "is_buff": false,
                        "description": "Defense is reduced by 70%",
                        "icon_filename": "debuff_defence_down.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 30,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "1.3*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 1.3]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0003_4_9.png",
            "used_on": [
                125,
                124
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 24,
            passive: false,
            steps: [
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 1.3,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['def_break', 2, 30],
                    ],
                },
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 1.3,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['def_break', 2, 30],
                    ],
                },
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 1.3,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['def_break', 2, 30],
                    ],
                },
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 1.3,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['def_break', 2, 30],
                    ],
                },
            ],
            meta: {
                dmg: 35,
                effect: 10,
                cooldown: 3,
            }
        });
    });

    it('attacking skill with Decrease ATB', () => {
        const skill = {
            "id": 101,
            "com2us_id": 3413,
            "name": "Whirlpool",
            "description": "Summons a powerful whirlpool, inflicting damage on all enemies, and reducing their Attack Bars by 40%.",
            "slot": 3,
            "cooltime": 5,
            "hits": 1,
            "passive": false,
            "aoe": true,
            "max_level": 5,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 33,
                        "url": "https://swarfarm.com/api/v2/skill-effects/33/",
                        "name": "Decrease ATB",
                        "is_buff": false,
                        "description": "Reduces the enemy's attack gauge",
                        "icon_filename": ""
                    },
                    "aoe": true,
                    "single_target": false,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 40,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "4.0*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 4.0]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0002_6_3.png",
            "used_on": [
                98
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 101,
            passive: false,
            steps: [
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 4,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    atbDecrease: [40, 100],
                },
            ],
            meta: {
                dmg: 30,
                effect: 0,
                cooldown: 4,
            }
        });
    });

    it('attacking skill with Slow Debuff', () => {
        // todo: revisit this - amount of hits is not fixed to 6
        const skill = {
            "id": 63,
            "com2us_id": 1112,
            "name": "Arrow Attack",
            "description": "Shoots a flurry of arrows, attacking all enemies 4 - 6 times. Each attack has a 20% chance to reduce their Attack Speed for 2 turns.",
            "slot": 3,
            "cooltime": 6,
            "hits": 6,
            "passive": false,
            "aoe": true,
            "max_level": 5,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 21,
                        "url": "https://swarfarm.com/api/v2/skill-effects/21/",
                        "name": "Decrease SPD",
                        "is_buff": false,
                        "description": "Speed is reduced by 33%",
                        "icon_filename": "debuff_slow.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 20,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "0.85*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 0.85]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0000_9_0.png",
            "used_on": [
                183,
                184
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 63,
            passive: false,
            steps: [
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 0.85,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['slow', 2, 20],
                    ],
                },
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 0.85,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['slow', 2, 20],
                    ],
                },
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 0.85,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['slow', 2, 20],
                    ],
                },
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 0.85,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['slow', 2, 20],
                    ],
                },
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 0.85,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['slow', 2, 20],
                    ],
                },
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 0.85,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['slow', 2, 20],
                    ],
                },
            ],
            meta: {
                dmg: 20,
                effect: 0,
                cooldown: 4,
            }
        });
    });

    it('attacking skill with Decrease ATK', () => {
        const skill = {
            "id": 20,
            "com2us_id": 4002,
            "name": "Sacred Water",
            "description": "Throws a condensed cloud of elements at the enemy to attack 2 times and reduces the enemy's Attack Power for 2 turns with a 20% chance for each attack.",
            "slot": 1,
            "cooltime": null,
            "hits": 2,
            "passive": false,
            "aoe": false,
            "max_level": 8,
            "level_progress_description": [
                "Damage +5%",
                "Damage +5%",
                "Effect Rate +5%",
                "Damage +10%",
                "Effect Rate +10%",
                "Damage +10%",
                "Effect Rate +15%"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 19,
                        "url": "https://swarfarm.com/api/v2/skill-effects/19/",
                        "name": "Decrease ATK",
                        "is_buff": false,
                        "description": "Attack Power is reduced by 50%",
                        "icon_filename": "debuff_attack_down.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 20,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "1.9*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 1.9]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0000_9_2.png",
            "used_on": [
                12,
                11
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 20,
            passive: false,
            steps: [
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 1.9,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['atk_break', 2, 20],
                    ],
                },
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 1.9,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['atk_break', 2, 20],
                    ],
                },

            ],
            meta: {
                dmg: 30,
                effect: 30,
                cooldown: 0,
            }
        });
    });

    it('attacking skill with Heal Block', () => {
        const skill = {
            "id": 95,
            "com2us_id": 3407,
            "name": "Deadly Dart",
            "description": "Throws sharp feathers to attack the enemy and prevents them from recovering their HP for 2 turns.",
            "slot": 2,
            "cooltime": 4,
            "hits": 3,
            "passive": false,
            "aoe": false,
            "max_level": 5,
            "level_progress_description": [
                "Damage +5%",
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 29,
                        "url": "https://swarfarm.com/api/v2/skill-effects/29/",
                        "name": "Disturb HP Recovery",
                        "is_buff": false,
                        "description": "Healing effects are blocked for a number of turns",
                        "icon_filename": "debuff_block_heal.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "1.9*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 1.9]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0002_4_8.png",
            "used_on": [
                23,
                22
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 95,
            passive: false,
            steps: [
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 1.9,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['heal_block', 2, 100],
                    ],
                },
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 1.9,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['heal_block', 2, 100],
                    ],
                },
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 1.9,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['heal_block', 2, 100],
                    ],
                },
            ],
            meta: {
                dmg: 25,
                effect: 0,
                cooldown: 3,
            }
        });
    });

    it('attacking skill with Additional Turn', () => {
        const skill = {
            "id": 367,
            "com2us_id": 8107,
            "name": "Drunken Kick",
            "description": "Kicks the enemy unsteadily. Gets drunk and attacks a random enemy with [Rolling Punch] with a 30% chance afterwards.",
            "slot": 2,
            "cooltime": 4,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 5,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 39,
                        "url": "https://swarfarm.com/api/v2/skill-effects/39/",
                        "name": "Additional Turn",
                        "is_buff": true,
                        "description": "Gain another turn immediately",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": true,
                    "random": false,
                    "quantity": null,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "2.0*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 2.0]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0008_6_4.png",
            "used_on": [
                174,
                182
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 367,
            passive: false,
            steps: [
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 2,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                },
                {
                    additionalTurn: [100, true],
                    target: "self"
                }
            ],
            meta: {
                dmg: 30,
                effect: 0,
                cooldown: 3,
            }
        });
    });

    it('attacking skill with Sleep', () => {
        const skill = {
            "id": 66,
            "com2us_id": 1111,
            "name": "Sleep Spell",
            "description": "Puts the enemy to sleep for 2 turns. Effect is removed if the enemy is attacked.",
            "slot": 3,
            "cooltime": 5,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 5,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 25,
                        "url": "https://swarfarm.com/api/v2/skill-effects/25/",
                        "name": "Sleep",
                        "is_buff": false,
                        "description": "The monster is put to sleep and cannot attack unless awakened, either after a fixed amount of turns or after taking damage",
                        "icon_filename": "debuff_sleep.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "6.0*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 6.0]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0000_8_0.png",
            "used_on": [
                312
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 66,
            passive: false,
            steps: [
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 6,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ["sleep", 2, 100],
                    ]

                },
            ],
            meta: {
                dmg: 20,
                effect: 0,
                cooldown: 3,
            }
        });
    });

    it('attacking skill with additional DMG per debuf', () => {
        // todo: revisit this - amount of hits is not fixed to 6
        const skill = {
            "id": 68,
            "com2us_id": 1113,
            "name": "Spirit's Wrath",
            "description": "Attacks the enemy with the spirit's power. Damage is increased by 30% for each harmful effect on the enemy.",
            "slot": 3,
            "cooltime": 4,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 4,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 67,
                        "url": "https://swarfarm.com/api/v2/skill-effects/67/",
                        "name": "Debuff Bonus Damage",
                        "is_buff": false,
                        "description": "Increases damage per debuff on the target",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 30,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": true,
                    "note": ""
                }
            ],
            "multiplier_formula": "6.9*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 6.9]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0000_0_1.png",
            "used_on": [
                93
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 68,
            passive: false,
            steps: [
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 6.9,
                        debuffMultiplier: 0.3,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                },
            ],
            meta: {
                dmg: 20,
                effect: 0,
                cooldown: 3,
            }
        });
    });

    it('attacking skill with MAX HP DMG', () => {
        const skill = {
            "id": 188,
            "com2us_id": 2113,
            "name": "Regenerate",
            "description": "Removes the harmful effects on itself and recovers HP accordingly to the number of effects removed.",
            "slot": 3,
            "cooltime": 5,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 5,
            "level_progress_description": [
                "Recovery +10%",
                "Recovery +10%",
                "Recovery +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 34,
                        "url": "https://swarfarm.com/api/v2/skill-effects/34/",
                        "name": "Cleanse",
                        "is_buff": true,
                        "description": "Removes one or more debuffs",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": true,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 35,
                        "url": "https://swarfarm.com/api/v2/skill-effects/35/",
                        "name": "Heal",
                        "is_buff": true,
                        "description": "Increases ally's HP",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 30,
                    "all": false,
                    "self_hp": true,
                    "target_hp": false,
                    "damage": false,
                    "note": "+10% per debuff removed"
                }
            ],
            "multiplier_formula": "0.3*{MAX HP}",
            "multiplier_formula_raw": "[[\"ATTACK_TOT_HP\", \"*\", 0.30]]",
            "scales_with": [
                "MAX HP"
            ],
            "icon_filename": "skill_icon_0001_7_5.png",
            "used_on": [
                108,
                1078
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 188,
            passive: false,
            steps: [
                {
                    cleanse: Infinity,
                    ratioHeal: 0.3,
                    target: "self",
                }
            ],
            meta: {
                dmg: 0,
                effect: 0,
                recovery: 30,
                cooldown: 4,
            },
            notes: ['+10% per debuff removed']
        });
    });

    it('attacking skill with ignore def', () => {
        const skill = {
            "id": 147,
            "com2us_id": 1214,
            "name": "Furious Pierce",
            "description": "Launches an attack that ignores the enemy's Defense. This attack receives a 50% Critical Rate bonus.",
            "slot": 3,
            "cooltime": 5,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 5,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 38,
                        "url": "https://swarfarm.com/api/v2/skill-effects/38/",
                        "name": "Ignore DEF",
                        "is_buff": true,
                        "description": "Attack will ignore the target's defense.",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 3,
                        "url": "https://swarfarm.com/api/v2/skill-effects/3/",
                        "name": "Increase CRI Rate",
                        "is_buff": true,
                        "description": "Critical Hit Rate is increased by 30%",
                        "icon_filename": "buff_crit_up.png"
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 50,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "3.7*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 3.7]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0000_6_2.png",
            "used_on": [
                154
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 147,
            passive: false,
            steps: [
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 3.7,
                        ignoresDef: true,
                        ignoresDefReduction: false,
                    },
                },
                {
                    target: "self",
                    buffs: [
                        ["cr", 50]
                    ]
                },
            ],
            meta: {
                dmg: 30,
                effect: 0,
                cooldown: 4,
            },
        });
    });

    it('attacking skill with Additional Attack', () => {
        const skill = {
            "id": 325,
            "com2us_id": 7007,
            "name": "Chain Fire",
            "description": "Attacks the enemy with 2 arrows and attacks consecutively with a 30% chance. Attacks consecutively with a 50% chance if the enemy's HP is higher.",
            "slot": 2,
            "cooltime": 3,
            "hits": 2,
            "passive": false,
            "aoe": false,
            "max_level": 5,
            "level_progress_description": [
                "Damage +5%",
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 51,
                        "url": "https://swarfarm.com/api/v2/skill-effects/51/",
                        "name": "Additional Attack",
                        "is_buff": true,
                        "description": "Attacks an additional time on the same turn. ",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": 30,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "2.4*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 2.4]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0006_0_5.png",
            "used_on": [
                172,
                179
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 325,
            passive: false,
            steps: [
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 2.4,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                },
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 2.4,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                },
                {
                    additionalAttack: 30,
                    target: "self",
                }
            ],
            meta: {
                dmg: 25,
                effect: 0,
                cooldown: 2,
            },
        });
    });

    it('attacking skill with Counter Attack', () => {
        const skill = {
            "id": 239,
            "com2us_id": 1812,
            "name": "Counterblow",
            "description": "Provokes all enemies with a 70% chance, and counterattacks every time you receive damage for 3 turns.",
            "slot": 3,
            "cooltime": 6,
            "hits": 0,
            "passive": false,
            "aoe": true,
            "max_level": 4,
            "level_progress_description": [
                "Cooltime Turn -1",
                "Cooltime Turn -1",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 24,
                        "url": "https://swarfarm.com/api/v2/skill-effects/24/",
                        "name": "Provoke",
                        "is_buff": false,
                        "description": "The monster is forced to only attack the monster which applied the effect",
                        "icon_filename": "debuff_provoke.png"
                    },
                    "aoe": true,
                    "single_target": false,
                    "self_effect": false,
                    "chance": 70,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 1,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 7,
                        "url": "https://swarfarm.com/api/v2/skill-effects/7/",
                        "name": "Counter",
                        "is_buff": true,
                        "description": "Counterattacks when attacked",
                        "icon_filename": "buff_counter.png"
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 3,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "",
            "multiplier_formula_raw": "[]",
            "scales_with": [],
            "icon_filename": "skill_icon_0001_9_0.png",
            "used_on": [
                33
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 239,
            passive: false,
            steps: [
                {
                    target: "enemies",
                    debuffs: [
                        ['provoke', 1, 70],
                    ],
                },
                {
                    target: "self",
                    buffs: [
                        ['counterAtk', 3]
                    ]
                }
            ],
            meta: {
                dmg: 0,
                effect: 0,
                cooldown: 3,
            },
        });
    });

    it('attacking skill with freeze', () => {
        const skill = {
            "id": 143,
            "com2us_id": 1206,
            "name": "Ice Ball",
            "description": "Freezes the enemy for 1 turn.",
            "slot": 2,
            "cooltime": 4,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 5,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 27,
                        "url": "https://swarfarm.com/api/v2/skill-effects/27/",
                        "name": "Freeze",
                        "is_buff": false,
                        "description": "Enemy is frozen and immobilized for a number of turns",
                        "icon_filename": "debuff_freeze.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 1,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "4.8*{ATK} + 50",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 4.8, \"+\", 50]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0000_8_1.png",
            "used_on": [
                64,
                63
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 143,
            passive: false,
            steps: [
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 4.8,
                        atkModifier: 50,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ['freeze', 1, 100],
                    ],
                },
            ],
            meta: {
                dmg: 30,
                effect: 0,
                cooldown: 3,
            },
        });
    });

    it('attacking skill with Shield', () => {
        const skill = {
            "id": 56,
            "com2us_id": 1711,
            "name": "Shadow Defense",
            "description": "Creates a shield that absorbs damage equivalent to 100% of your MAX HP for 3 turns.",
            "slot": 3,
            "cooltime": 6,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 3,
            "level_progress_description": [
                "Cooltime Turn -1",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 12,
                        "url": "https://swarfarm.com/api/v2/skill-effects/12/",
                        "name": "Shield",
                        "is_buff": true,
                        "description": "A shield is created to absorb a portion of incoming damage",
                        "icon_filename": "buff_shield.png"
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 3,
                    "all": false,
                    "self_hp": true,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "{MAX HP}",
            "multiplier_formula_raw": "[[\"ATTACK_TOT_HP\", \"*\", 1.0]]",
            "scales_with": [
                "MAX HP"
            ],
            "icon_filename": "skill_icon_0000_4_9.png",
            "used_on": [
                54
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 56,
            passive: false,
            steps: [
                {
                    target: 'self',
                    shield: {
                        maxHpMultiplier: 1,
                        duration: 3
                    },
                },
            ],
            meta: {
                dmg: 0,
                effect: 0,
                cooldown: 4,
            },
        });
    });

    it('attacking skill with cooldown reset', () => {
        const skill = {
            "id": 736,
            "com2us_id": 8913,
            "name": "Electric Bomb",
            "description": "Detonates an electric bomb to attack all enemies and increase their skill cooldown for 1 turn.",
            "slot": 3,
            "cooltime": 5,
            "hits": 1,
            "passive": false,
            "aoe": true,
            "max_level": 5,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 44,
                        "url": "https://swarfarm.com/api/v2/skill-effects/44/",
                        "name": "Increase Cooltime",
                        "is_buff": false,
                        "description": "Puts the target's skill on cool down.",
                        "icon_filename": ""
                    },
                    "aoe": true,
                    "single_target": false,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 1,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "4.1*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 4.1]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0009_2_3.png",
            "used_on": [
                528
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 736,
            passive: false,
            steps: [
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 4.1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    skillReset: {
                        amount: 1,
                        chance: 100,
                    }
                },
            ],
            meta: {
                dmg: 30,
                effect: 0,
                cooldown: 4,
            },
        });
    });

    it('attacking skill with cooldown refresh', () => {
        const skill = {
            "id": 729,
            "com2us_id": 8907,
            "name": "Multi-Firecracker",
            "description": "Attacks all enemies 3 times with a loud bomb. Each attack has a 25% chance to deal Continuous Damage for 2 turns and the skill cooldown time of [Multi-Firecracker] will be decreased by 1 turn each whenever the enemies are inflicted with Continuous Damage.",
            "slot": 2,
            "cooltime": 4,
            "hits": 3,
            "passive": false,
            "aoe": true,
            "max_level": 4,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 26,
                        "url": "https://swarfarm.com/api/v2/skill-effects/26/",
                        "name": "Continuous DMG",
                        "is_buff": false,
                        "description": "Deals 5% of monster's max HP as damage every turn",
                        "icon_filename": "debuff_dot.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 25,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 43,
                        "url": "https://swarfarm.com/api/v2/skill-effects/43/",
                        "name": "Reduce Cooltime",
                        "is_buff": true,
                        "description": "Reduces cool down counter of skills by 1 or more",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": 25,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": "1 turn per Continuous Dmg effect applied"
                }
            ],
            "multiplier_formula": "{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 1.0]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0009_6_2.png",
            "used_on": [
                237,
                238
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 729,
            passive: false,
            steps: [
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ["dot", 2, 25]
                    ],
                },
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ["dot", 2, 25]
                    ],
                },
                {
                    target: 'enemies',
                    atkDmg: {
                        atkMultiplier: 1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    debuffs: [
                        ["dot", 2, 25]
                    ],
                },
                {
                    target: 'self',
                    skillRefresh: Infinity
                }
            ],
            notes: [
                '1 turn per Continuous Dmg effect applied',
            ],
            meta: {
                dmg: 20,
                effect: 0,
                cooldown: 3,
            },
        });
    });

    it('attacking skill with buff steal', () => {
        const skill = {
            "id": 225,
            "com2us_id": 5412,
            "name": "Marauder (Passive)",
            "description": "Recovers HP by 30% of the inflicted damage and steals one beneficial effect. [Automatic Effect]",
            "slot": 3,
            "cooltime": null,
            "hits": 1,
            "passive": true,
            "aoe": false,
            "max_level": 1,
            "level_progress_description": [],
            "effects": [
                {
                    "effect": {
                        "id": 35,
                        "url": "https://swarfarm.com/api/v2/skill-effects/35/",
                        "name": "Heal",
                        "is_buff": true,
                        "description": "Increases ally's HP",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 30,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": true,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 42,
                        "url": "https://swarfarm.com/api/v2/skill-effects/42/",
                        "name": "Steal Buff",
                        "is_buff": false,
                        "description": "Remove a beneficial effect and take it for yourself",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 1,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "",
            "multiplier_formula_raw": "[]",
            "scales_with": [],
            "icon_filename": "skill_icon_0005_9_1.png",
            "used_on": [
                224
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 225,
            passive: true,
            steps: [
                {
                    target: 'enemy',
                    dmgHeal: 0.3,
                    stealBuff: [1, 100],
                },
            ],
            meta: {
                dmg: 0,
                effect: 0,
                cooldown: 0,
            },
        });
    });

    it('attacking skill with dmg ignoring dmg reduction', () => {
        const skill = {
            "id": 305,
            "com2us_id": 9302,
            "name": "Aim Body",
            "description": "Attacks an enemy to inflict damage that ignores all damage reduction effects.",
            "slot": 1,
            "cooltime": null,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 6,
            "level_progress_description": [
                "Damage +5%",
                "Damage +5%",
                "Damage +5%",
                "Damage +5%",
                "Damage +10%"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 65,
                        "url": "https://swarfarm.com/api/v2/skill-effects/65/",
                        "name": "Ignore Damage Reduction",
                        "is_buff": false,
                        "description": "Ignores damage reduction effects",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "4.1*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 4.1]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0005_8_2.png",
            "used_on": [
                170,
                178
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 305,
            passive: false,
            steps: [
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 4.1,
                        ignoresDef: false,
                        ignoresDefReduction: true,
                    },
                }

            ],
            meta: {
                dmg: 30,
                effect: 0,
                cooldown: 0,
            },
        });
    });

    it('attacking skill with ally attack', () => {
        const skill = {
            "id": 117,
            "com2us_id": 1511,
            "name": "Group Hunt",
            "description": "Performs a fierce cooperative attack with two fellow allies.",
            "slot": 3,
            "cooltime": 6,
            "hits": 3,
            "passive": false,
            "aoe": false,
            "max_level": 3,
            "level_progress_description": [
                "Cooltime Turn -1",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 56,
                        "url": "https://swarfarm.com/api/v2/skill-effects/56/",
                        "name": "Ally Attack",
                        "is_buff": true,
                        "description": "Brings one or more allies to attack at the same time. ",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "4.1*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 4.1]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0000_6_6.png",
            "used_on": [
                60
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 117,
            passive: false,
            steps: [
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 4.1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    groupAttack: 2
                },
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 4.1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    groupAttack: 2
                },
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 4.1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    groupAttack: 2
                },
            ],
            meta: {
                dmg: 0,
                effect: 0,
                cooldown: 4,
            },
        });
    });

    it('attacking skill with debuff transfer', () => {
        const skill = {
            "id": 1984,
            "com2us_id": 12809,
            "name": "Honey Bee Friends",
            "description": "Honey bees will transfer all harmful effects granted on the allies to the target enemy. If the allies don't have any harmful effects, all allies will recover their HP by 20%.",
            "slot": 2,
            "cooltime": 4,
            "hits": 1,
            "passive": false,
            "aoe": true,
            "max_level": 5,
            "level_progress_description": [
                "Recovery +5%",
                "Recovery +10%",
                "Recovery +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 50,
                        "url": "https://swarfarm.com/api/v2/skill-effects/50/",
                        "name": "Transfer Debuff",
                        "is_buff": true,
                        "description": "Removes a debuff from casting monster and applies it to the target monster. ",
                        "icon_filename": ""
                    },
                    "aoe": true,
                    "single_target": false,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": true,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 35,
                        "url": "https://swarfarm.com/api/v2/skill-effects/35/",
                        "name": "Heal",
                        "is_buff": true,
                        "description": "Increases ally's HP",
                        "icon_filename": ""
                    },
                    "aoe": true,
                    "single_target": false,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 20,
                    "all": false,
                    "self_hp": false,
                    "target_hp": true,
                    "damage": false,
                    "note": "If ally does not have harmful effects"
                }
            ],
            "multiplier_formula": "",
            "multiplier_formula_raw": "[]",
            "scales_with": [],
            "icon_filename": "skill_icon_0017_6_1.png",
            "used_on": [
                1192,
                1197
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 1984,
            passive: false,
            steps: [
                {
                    target: "enemy",
                    ratioHeal: 0.2,
                    transferDebuffs: {
                        amount: Infinity,
                        chance: 100,
                        target: 'allies',
                    }
                },
            ],
            meta: {
                dmg: 0,
                recovery: 25,
                effect: 0,
                cooldown: 3,
            },
            notes: [
                'If ally does not have harmful effects',
            ]

        });
    });

    it('attacking skill with max hp destroy', () => {
        const skill = {
            "id": 1109,
            "com2us_id": 9011,
            "name": "Eternal Scar",
            "description": "Attacks all enemies 2 times to decrease the Defense and disturbs the HP recovery for 2 turns with each attack. Additionally, destroys the enemy's MAX HP by the amount of damage inflicted by the second attack.",
            "slot": 3,
            "cooltime": 5,
            "hits": 2,
            "passive": false,
            "aoe": true,
            "max_level": 5,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 57,
                        "url": "https://swarfarm.com/api/v2/skill-effects/57/",
                        "name": "Destroy HP",
                        "is_buff": false,
                        "description": "Destroys the enemy's MAX HP",
                        "icon_filename": ""
                    },
                    "aoe": true,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 75,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": true,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 20,
                        "url": "https://swarfarm.com/api/v2/skill-effects/20/",
                        "name": "Decrease DEF",
                        "is_buff": false,
                        "description": "Defense is reduced by 70%",
                        "icon_filename": "debuff_defence_down.png"
                    },
                    "aoe": true,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 29,
                        "url": "https://swarfarm.com/api/v2/skill-effects/29/",
                        "name": "Disturb HP Recovery",
                        "is_buff": false,
                        "description": "Healing effects are blocked for a number of turns",
                        "icon_filename": "debuff_block_heal.png"
                    },
                    "aoe": true,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "2.6*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 2.6]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0009_5_4.png",
            "used_on": [
                637,
                636
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 1109,
            passive: false,
            steps: [
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 2.6,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    hpDestroy: 0.75,
                    debuffs: [
                        ["def_break", 2, 100],
                        ["heal_block", 2, 100],
                    ]
                },
                {
                    target: "enemy",
                    atkDmg: {
                        atkMultiplier: 2.6,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                    hpDestroy: 0.75,
                    debuffs: [
                        ["def_break", 2, 100],
                        ["heal_block", 2, 100],
                    ]
                },
            ],
            meta: {
                dmg: 30,
                effect: 0,
                cooldown: 4,
            },

        });
    });

    it('attacking skill with self harm', () => {
        const skill = {
            "id": 412,
            "com2us_id": 2507,
            "name": "Special Assault",
            "description": "Inflicts damage proportional to the enemy's MAX HP. Consumes 10% of your HP.",
            "slot": 2,
            "cooltime": 4,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 4,
            "level_progress_description": [
                "Damage +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 54,
                        "url": "https://swarfarm.com/api/v2/skill-effects/54/",
                        "name": "Self-Harm",
                        "is_buff": false,
                        "description": "Deals damage to the monster using the skill. ",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": 100,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 10,
                    "all": false,
                    "self_hp": true,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "3.5*{ATK} + 0.18*{Target MAX HP}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 3.5], [\"+\"], [\"TARGET_TOT_HP\", \"*\", 0.18]]",
            "scales_with": [
                "ATK",
                "Target MAX HP"
            ],
            "icon_filename": "skill_icon_0002_1_1.png",
            "used_on": [
                187,
                188
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 412,
            passive: false,
            steps: [
                {
                    "atkAndTargetMaxHpDmg": {
                        atkMultiplier: 3.5,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                        targetMaxHpMultiplier: 0.18
                    },
                    target: "enemy"
                },
                {
                    selfHarm: 0.1,
                    target: "self"
                }

            ],
            meta: {
                dmg: 20,
                effect: 0,
                cooldown: 3,
            },

        });
    });

    it('attacking skill scales with atk and target cur hp', () => {
        const skill = {
            "id": 1334,
            "com2us_id": 11206,
            "name": "Brand of Hell",
            "description": "Attacks the enemy three times, with each attack having a 50% chance to receive a Branding effect for 2 turns. The damage increases as the enemy's HP becomes lower.",
            "slot": 2,
            "cooltime": 4,
            "hits": 3,
            "passive": false,
            "aoe": false,
            "max_level": 5,
            "level_progress_description": [
                "Damage +10%",
                "Effect Rate +10%",
                "Damage +10%",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 31,
                        "url": "https://swarfarm.com/api/v2/skill-effects/31/",
                        "name": "Brand",
                        "is_buff": false,
                        "description": "Enemies with Branding Effect take 25% more Damage",
                        "icon_filename": "debuff_brand.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 50,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "{ATK}*(4.4 - 2.2*{Target Current HP %})",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 1.0], [\"*\"], [\"TARGET_CUR_HP_RATE\", \"*\", -2.2, \"+\", 4.4]]",
            "scales_with": [
                "ATK",
                "Target Current HP %"
            ],
            "icon_filename": "skill_icon_0012_7_6.png",
            "used_on": [
                917,
                923
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 1334,
            passive: false,
            steps: [
                {
                    atkAndTargetCurHpRateDmg: {
                        atkMultiplier: 1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                        targetCurHpRateModifier: 4.4,
                        targetCurHpRateMultiplier: -2.2
                    },
                    target: "enemy",
                    debuffs: [
                        ["brand", null, 50],
                    ]
                },
                {
                    atkAndTargetCurHpRateDmg: {
                        atkMultiplier: 1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                        targetCurHpRateModifier: 4.4,
                        targetCurHpRateMultiplier: -2.2
                    },
                    target: "enemy",
                    debuffs: [
                        ["brand", null, 50],
                    ]
                },
                {
                    atkAndTargetCurHpRateDmg: {
                        atkMultiplier: 1,
                        ignoresDef: false,
                        ignoresDefReduction: false,
                        targetCurHpRateModifier: 4.4,
                        targetCurHpRateMultiplier: -2.2
                    },
                    target: "enemy",
                    debuffs: [
                        ["brand", null, 50],
                    ]
                },
            ],
            meta: {
                dmg: 20,
                effect: 10,
                cooldown: 3,
            },

        });
    });

    it('attacking skill scales with atk and target cur hp', () => {
        const skill = {
            "id": 259,
            "com2us_id": 1415,
            "name": "Hostility (Passive)",
            "description": "You reflect 10% of damage back to the enemy and fill up your Attack Bar by 30% every time you're attacked. [Automatic Effect]",
            "slot": 3,
            "cooltime": null,
            "hits": 1,
            "passive": true,
            "aoe": false,
            "max_level": 1,
            "level_progress_description": [],
            "effects": [
                {
                    "effect": {
                        "id": 17,
                        "url": "https://swarfarm.com/api/v2/skill-effects/17/",
                        "name": "Increase ATB",
                        "is_buff": true,
                        "description": "The ATK bar of ally monsters is filled by a set amount. This allows ally monsters to attack again sooner.",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 30,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 11,
                        "url": "https://swarfarm.com/api/v2/skill-effects/11/",
                        "name": "Reflect DMG",
                        "is_buff": true,
                        "description": "33% of incoming damage is reflected back at the attacker. This does not nullify any Status Effects.",
                        "icon_filename": "buff_reflect.png"
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 10,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": true,
                    "note": ""
                }
            ],
            "multiplier_formula": "",
            "multiplier_formula_raw": "[]",
            "scales_with": [],
            "icon_filename": "skill_icon_0000_5_5.png",
            "used_on": [
                808
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 259,
            passive: true,
            notes: ['FIXME: Passive DMG reflect'],
            steps: [
                { target: "enemy" },
                {
                    atbIncrease: 30,
                    target: "self",
                    buffs: [
                        ["reflectDmg", 10],
                    ]

                },
            ],
            meta: {
                dmg: 0,
                effect: 0,
                cooldown: 0,
            },

        });
    });

    it('attacking skill scales with atk and relative spd', () => {
        const skill = {
            "id": 2402,
            "com2us_id": 13601,
            "name": "Spear of Protector",
            "description": "Attacks the enemy to decrease the Attack Speed for 2 turns with a 30% chance. The faster your Attack Speed compared to the enemy's, the greater damage you can inflict.",
            "slot": 1,
            "cooltime": null,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 6,
            "level_progress_description": [
                "Damage +5%",
                "Damage +5%",
                "Effect Rate +10%",
                "Damage +10%",
                "Effect Rate +10%"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 21,
                        "url": "https://swarfarm.com/api/v2/skill-effects/21/",
                        "name": "Decrease SPD",
                        "is_buff": false,
                        "description": "Speed is reduced by 33%",
                        "icon_filename": "debuff_slow.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 30,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": null
                },
                {
                    "effect": {
                        "id": 21,
                        "url": "https://swarfarm.com/api/v2/skill-effects/21/",
                        "name": "Decrease SPD",
                        "is_buff": false,
                        "description": "Speed is reduced by 33%",
                        "icon_filename": "debuff_slow.png"
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": 30,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 2,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": null
                }
            ],
            "multiplier_formula": "2.0*{ATK}*({Relative SPD} + 1)",
            "multiplier_formula_raw": "[[\"RIDER_SPEED\", \"*\", 2.0], [\"*\"], [\"ATK\", \"*\", 1.0], [\"+\"],  [\"ATK\", \"*\", 2.0]]",
            "scales_with": [
                "ATK",
                "Relative SPD"
            ],
            "icon_filename": "skill_icon_0019_9_8.png",
            "used_on": [
                1339,
                1334
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 2402,
            passive: false,
            steps: [
                {
                    target: "enemy",
                    "atkAndRelativeSpdDmg": {
                        "atkMultiplier": 2,
                        "atkSpdMultiplier": 2,
                        "ignoresDef": false,
                        "ignoresDefReduction": false,
                    },
                    debuffs: [
                        ["slow", 2, 30],
                        ["slow", 2, 30],
                    ]
                },
            ],
            meta: {
                dmg: 20,
                effect: 20,
                cooldown: 0,
            },
            notes: [
                "Duplicate debuffs"
            ]
        });
    });

    it('attacking skill scales with lost hp', () => {
        const skill = {
            "id": 2190,
            "com2us_id": 1863,
            "name": "Clean Shot",
            "description": "Attacks an enemy, inflicting the amount of HP you've lost as damage. You gain an extra turn if the enemy dies.",
            "slot": 3,
            "cooltime": 4,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 1,
            "level_progress_description": [],
            "effects": [
                {
                    "effect": {
                        "id": 39,
                        "url": "https://swarfarm.com/api/v2/skill-effects/39/",
                        "name": "Additional Turn",
                        "is_buff": true,
                        "description": "Gain another turn immediately",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": true,
                    "random": false,
                    "quantity": 1,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "{Missing HP} (Fixed)",
            "multiplier_formula_raw": "[[\"ATTACK_LOSS_HP\", \"FIXED\"]]",
            "scales_with": [
                "Missing HP"
            ],
            "icon_filename": "skill_icon_0001_0_1.png",
            "used_on": [
                1293
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 2190,
            passive: false,
            steps: [
                {
                    target: "enemy",
                    lostHpDmg: {
                        ignoresDef: false,
                        ignoresDefReduction: false,
                    },
                },
                {
                    additionalTurn: [100, true],
                    target: "self",
                }
            ],
            meta: {
                dmg: 0,
                effect: 0,
                cooldown: 4,
            },
        });
    });

    it('revive', () => {
        const skill = {
            "id": 999,
            "com2us_id": 2611,
            "name": "Revive",
            "description": "Revives a dead ally with 40% HP and grants immunity for 1 turn. If this skill is used on yourself, you receive a Soul Protection for 3 turns.",
            "slot": 3,
            "cooltime": 7,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 3,
            "level_progress_description": [
                "Cooltime Turn -1",
                "Cooltime Turn -1"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 36,
                        "url": "https://swarfarm.com/api/v2/skill-effects/36/",
                        "name": "Revive",
                        "is_buff": true,
                        "description": "Revive a dead ally",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 40,
                    "all": false,
                    "self_hp": false,
                    "target_hp": true,
                    "damage": false,
                    "note": ""
                },
                {
                    "effect": {
                        "id": 15,
                        "url": "https://swarfarm.com/api/v2/skill-effects/15/",
                        "name": "Protect Soul",
                        "is_buff": true,
                        "description": "If the monster dies with the effect active, it will revive",
                        "icon_filename": "buff_soul_protect.png"
                    },
                    "aoe": false,
                    "single_target": false,
                    "self_effect": true,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": 3,
                    "all": false,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": "If targeted on self"
                }
            ],
            "multiplier_formula": "0.4*{Target MAX HP} (Fixed)",
            "multiplier_formula_raw": "[[\"TARGET_TOT_HP\", \"*\", 0.40, \"FIXED\"]]",
            "scales_with": [
                "Target MAX HP"
            ],
            "icon_filename": "skill_icon_0005_0_9.png",
            "used_on": [
                1053,
                623,
                1075,
                622
            ]
        };

        const transformed = transform.skill(skill);
        assert.containsAllDeepKeys(transformed, {
            id: 999,
            passive: false,
            notes: [
                "If targeted on self",
            ],
            steps: [
                {
                    target: "ally",
                    ratioHeal: 0.4,
                    buffs: [
                        ['soul_protect', 3],
                    ],
                },
                {
                    target: "self",
                    buffs: [
                        ['soul_protect', 3],
                    ],
                },
            ],
            meta: {
                dmg: 0,
                effect: 0,
                cooldown: 5,
            },
        });
    });

    it('unknown effect is noted', () => {
        const skill = {
            "id": 2168,
            "com2us_id": 1362,
            "name": "Incinerate",
            "description": "Attacks the enemy to inflict damage. In addition, blows up the Continuous Damage granted on the target to inflict damage that's equivalent to its Continuous Damage.",
            "slot": 3,
            "cooltime": 3,
            "hits": 1,
            "passive": false,
            "aoe": false,
            "max_level": 4,
            "level_progress_description": [
                "Damage +5%",
                "Damage +10%",
                "Damage +10%"
            ],
            "effects": [
                {
                    "effect": {
                        "id": 74,
                        "url": "https://swarfarm.com/api/v2/skill-effects/74/",
                        "name": "Detonate Continuous Damage",
                        "is_buff": true,
                        "description": "Immediately apply the remaining Continuous Damage, consuming the effect",
                        "icon_filename": ""
                    },
                    "aoe": false,
                    "single_target": true,
                    "self_effect": false,
                    "chance": null,
                    "on_crit": false,
                    "on_death": false,
                    "random": false,
                    "quantity": null,
                    "all": true,
                    "self_hp": false,
                    "target_hp": false,
                    "damage": false,
                    "note": ""
                }
            ],
            "multiplier_formula": "7.1*{ATK}",
            "multiplier_formula_raw": "[[\"ATK\", \"*\", 7.1]]",
            "scales_with": [
                "ATK"
            ],
            "icon_filename": "skill_icon_0018_9_4.png",
            "used_on": [
                1287
            ]
        };

        const transformed = transform.skill(skill);
        assert.include(transformed.notes, 'Unknown effect: 74');
    });

    it('has coverage', () => {
        let sfSkills = require('../data/skills');
        let sfUnits = require('../data/units');
        const UsedSkills = new Set();
        Object.values(sfUnits).forEach(u => {
            if (u.skills && u.skills.length) {
                u.skills.forEach(id => UsedSkills.add(id));
            }
        });
        let parsed = 0;
        let skipped = 0;
        const errors = {};
        const swSkillsArr = Object.values(sfSkills);
        for (const skill of swSkillsArr) {
            if (UsedSkills.has(skill.id)) {
                try {
                    transform.skill(skill);
                    parsed++;
                } catch (e) {
                    if (e.message === 'Cannot read property \'0\' of undefined') {
                        console.error(e);
                    }
                    errors[e.message] = errors[e.message] || {
                        error: e.message,
                        skills: []
                    };
                    errors[e.message].skills.push(skill.id);
                }
            } else {
                skipped++;
            }
        }

        // const topErrors = _.sortBy(Object.values(errors), (err) => err.skills.length).reverse();
        // console.log('Errors:');
        // console.dir(topErrors);
        // console.log('skipped:', skipped);
        // console.log(`total coverage: ${(parsed / (swSkillsArr.length - skipped) * 100).toFixed(0)}%`);

        assert.equal(parsed, swSkillsArr.length - skipped);
    });

    it('parse dmg multipliers', () => {
        assert.deepEqual(parseMultipliers([['ATK', '*', 4.1, '+', 180]]), {
            atkMultiplier: 4.1,
            atkModifier: 180,
        });
    });

});
