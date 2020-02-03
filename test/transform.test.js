import { assert } from 'chai';
import * as transform from '../src/swarfarm/transform';
import { FIRE } from "../src";
import _ from 'lodash';
import { parseMultipliers } from "../src/swarfarm/transform";

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

            assert.deepEqual(transform.skillEffect(atkBuf), {buffs: ['atk', 3]});
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

            assert.deepEqual(transform.skillEffect(crBuf), {buffs: ['cr', 3]});
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

            assert.deepEqual(transform.skillEffect(effect), {atbIncrease: 50});
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

            assert.deepEqual(transform.skillEffect(effect), {debuffs: ['dot', 3, 100]});
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

            assert.deepEqual(transform.skillEffect(effect), {buffs: ['endure', 1]});
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

            assert.deepEqual(transform.skillEffect(effect), {shield: null});
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

        assert.deepEqual(transform.skill(skill), {
            id: 60,
            steps: [
                {
                    target: 'ally',
                    atkHeal: 4,
                    cleanse: 10,
                    buffs: [],
                }
            ],
            meta: {
                dmg: 0,
                effect: 30,
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

        assert.deepEqual(transform.skill(skill), {
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

        assert.deepEqual(transform.skill(skill), {
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

        assert.deepEqual(transform.skill(skill), {
            id: 1,
            steps: [],
            meta: {
                dmg: 0,
                effect: 0,
                cooldown: 0,
            }
        });
    });

    it('attacking skill', () => {
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
        assert.deepEqual(transformed, {
            id: 4,
            steps: [
                {
                    target: 'enemy',
                    atkDmg: {
                        atkMultiplier: 3.6,
                    },
                    buffs: [],
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
                try{
                    transform.skill(skill);
                    parsed++;
                } catch(e) {
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

        const topErrors = _.sortBy(Object.values(errors), (err) => err.skills.length).reverse().slice(0, 10);

        console.log('Errors:');
        console.dir(topErrors);
        console.log('skipped:', skipped);
        console.log(`total coverage: ${(parsed / (swSkillsArr.length - skipped) * 100).toFixed(0)}%`);

        assert.equal(parsed, swSkillsArr.length - skipped);
    });

    it('parse dmg multipliers', () => {
        assert.deepEqual(parseMultipliers([ [ 'ATK', '*', 4.1, '+', 180 ] ]), {
            atkMultiplier: 4.1,
            atkModifier: 180,
        });
    });
});
