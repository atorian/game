const monster1 = {
    "id": 1,
    "url": "https://swarfarm.com/api/v2/monsters/1/",
    "com2us_id": 12302,
    "family_id": 12300,
    "name": "Forest Keeper",
    "image_filename": "unit_icon_0010_2_1.png",
    "element": "Fire",
    "archetype": "Defense",
    "base_stars": 1,
    "obtainable": true,
    "can_awaken": false,
    "is_awakened": false,
    "awaken_bonus": "",
    "skills": [
        4
    ],
    "skill_ups_to_max": 7,
    "leader_skill": null,
    "homunculus_skills": [],
    "base_hp": 1170,
    "base_attack": 66,
    "base_defense": 96,
    "speed": 88,
    "crit_rate": 15,
    "crit_damage": 50,
    "resistance": 15,
    "accuracy": 0,
    "raw_hp": 39,
    "raw_attack": 33,
    "raw_defense": 48,
    "max_lvl_hp": 6420,
    "max_lvl_attack": 362,
    "max_lvl_defense": 527,
    "awakens_from": null,
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
    "resources": {
        "Wikia": "http://summonerswar.wikia.com/wiki/Forest_Keeper_(Fire)",
        "summonerswar.co": null,
        "SummonersWarMonsters.com": "http://www.summonerswarmonsters.com/fire/forest-keeper"
    },
    "homunculus": false,
    "craft_cost": null,
    "craft_materials": []
};

const skill1 = {
    "id": 109,
    "com2us_id": 1503,
    "name": "Bite",
    "description": "Bite your enemy and recover 30% of the inflicted damage as HP.",
    "slot": 1,
    "cooltime": null,
    "hits": 1,
    "passive": false,
    "aoe": false,
    "max_level": 7,
    "level_progress_description": [
        "Damage +5%",
        "Damage +5%",
        "Damage +5%",
        "Damage +5%",
        "Damage +5%",
        "Damage +15%"
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
            "quantity": 30,
            "all": false,
            "self_hp": false,
            "target_hp": false,
            "damage": true,
            "note": ""
        }
    ],
    "multiplier_formula": "3.6*{ATK}",
    "multiplier_formula_raw": "[[\"ATK\", \"*\", 3.6]]",
    "icon_filename": "skill_icon_0000_8_5.png",
    "used_on": [
        100,
        99
    ]
};

const skill2 = {
    "id": 5,
    "com2us_id": 3601,
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
        "DebufConf Rate +10%",
        "Damage +10%",
        "DebufConf Rate +10%",
        "Damage +10%",
        "DebufConf Rate +15%"
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
    "icon_filename": "skill_icon_0003_4_7.png",
    "used_on": [
        36
    ]
};

function skill(swarfarmSkill) {
    return {
        name: swarfarmSkill.name,
        description: swarfarmSkill.description,
        slot: swarfarmSkill.slot,
        cooltime: swarfarmSkill.cooltime || 0,
        hits: swarfarmSkill.hits,
        passive: swarfarmSkill.passive,
        aoe: swarfarmSkill.aoe,
        effects: swarfarmSkill.effects.map(
            e => effects[e.id]
        ),
        formula: swarfarmSkill.multiplier_formula_raw,
        damage(atacker) {
            return atacker.atk;
        }
        //
    };
}



function parseUnit(swarfarmUnit) {
    return {
        name: swarfarmUnit.name,
        element: swarfarmUnit.element,
        skills: swarfarmUnit.skills.map(id => skills[id]),
        leader_skill: swarfarmUnit.leader_skill,
        speed: swarfarmUnit.speed,
        crit_rate: swarfarmUnit.crit_rate,
        crit_damage: swarfarmUnit.crit_damage,
        resistance: swarfarmUnit.resistance,
        accuracy: swarfarmUnit.accuracy,
        hp: swarfarmUnit.max_lvl_hp,
        attack: swarfarmUnit.max_lvl_attack,
        defense: swarfarmUnit.max_lvl_defense,
    };
}
