import * as codegen from '../src/swarfarm/codegen';
import prettier from "prettier";
import {assert} from "chai";

describe.only('codegen', () => {
    it('skill with dmg', () => {
        const data = {
            "id": 666,
            "description": "Test Description",
            "slot": 5,
            "icon": "skill_icon.png",
            "passive": false,
            "meta": {
                "dmg": 5,
                "effect": 5,
                "cooldown": 2,
                "recovery": 0.5,
                "shield": 0.1,
                "atbIncrease": 0.1,
                "debuffDuration": 1
            },
            "steps": [
                {
                    "target": "enemy",
                    "atkDmg": {
                        "atkMultiplier": 1.9,
                        "ignoresDef": false,
                        "ignoresDefReduction": true
                    },
                    "atkAndDefDmg": {
                        "atkMultiplier": 2,
                        "defMultiplier": 2.1,
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    "defDmg": {
                        "defMultiplier": 4.6,
                        "ignoresDef": true,
                        "ignoresDefReduction": false
                    },
                    "atkAndMaxHpDmg": {
                        "atkMultiplier": 3,
                        "maxHpMultiplier": 0.15,
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    "lostHpDmg": {
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    "spdDmg": {
                        "atkMultiplier": 1,
                        "atkSpdModifier": 150,
                        "divisor": 100,
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    "atkAndCurHpDmg": {
                        "atkMultiplier": 1,
                        "curHpMultiplier": 3.5,
                        "curHpModifier": 4,
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    "atkAndTargetMaxHpDmg": {
                        "atkMultiplier": 5.6,
                        "targetMaxHpMultiplier": 0.15,
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    "atkAndTargetCurHpRateDmg": {
                        "atkMultiplier": 1,
                        "targetCurHpRateMultiplier": -3.3,
                        "targetCurHpRateModifier": 8.8,
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    "atkAndRelativeSpdDmg": {
                        "atkSpdMultiplier": 2,
                        "atkMultiplier": 2,
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    "debuffs": [
                        [
                            "atk_break",
                            2,
                            20
                        ]
                    ]
                },
            ]
        };

        const skillStr = codegen.skill(data);
        const formatted = prettier.format(skillStr, { semi: false, "tabWidth": 4, trailingComma: "all",parser: "babel" });

        assert.equal(formatted, `/** 666, Test Description
*/
module.exports = {
    action: [
        step(
            targetEnemy,
            cumulativeDmgWithoutDmgReduction(
                roll,
                attacker => attacker.atk * 1.9,
            ),
            cumulativeDmg(
                roll,
                attacker => attacker.atk * 2 + attacker.def * 2.1,
            ),
            cumulativeDmgWithDefIgnore(roll, attacker => attacker.def * 4.6),
            cumulativeDmg(
                roll,
                attacker => attacker.atk * 3 + attacker.maxHp * 0.15,
            ),
            cumulativeDmg(
                roll,
                (attacker, target) => attacker.atk * 5.6 + target.maxHp * 0.15,
            ),
            fixedDmg(roll, attacker => attacker.maxHp - attacker.hp),
            multiplicativeDmg(
                roll,
                attacker => (attacker.atk * 1 * (attacker.atkSpd + 150)) / 100,
            ),
            multiplicativeDmg(
                roll,
                attacker => attacker.atk * 1 * (attacker.curHp * 3.5 + 4),
            ),
            multiplicativeDmg(
                roll,
                (attacker, target) =>
                    attacker.atk *
                    1 *
                    ((target.hp / target.maxHp) * -3.3 + 8.8),
            ),
            // fixme: atkAndRelativeSpdDmg
            debuff(roll, "atk_break", 2, 20),
        ),
        
    ],
    meta: {
        dmg: 5,
        effect: 5,
        cooldown: 2,
        recovery: 0.5,
        shield: 0.1,
        atbIncrease: 0.1,
        debuffDuration: 1,
    },
}
`);
    });
    it('passive skill', () => {
        const data = {
            "id": 666,
            "description": "Test Description",
            "slot": 5,
            "passive": true,
            "meta": {
                "dmg": 5,
                "effect": 5,
                "cooldown": 2,
            },
            "steps": []
        };

        const skillStr = codegen.skill(data);
        const formatted = prettier.format(skillStr, { semi: false, "tabWidth": 4, trailingComma: "all",parser: "babel" });

        assert.equal(formatted, `/** 666, Test Description
*/
// fixme: passive skill
module.exports = {
    action: [],
    meta: {
        dmg: 5,
        effect: 5,
        cooldown: 2,
    },
}
`);
    });

    it('healing skill', () => {
        const data = {
            "id": 666,
            "description": "Test Description",
            "slot": 5,
            "passive": true,
            "meta": {
                "dmg": 5,
                "effect": 5,
                "cooldown": 2,
            },
            "steps": [
                {
                    target: 'self',
                    atkHeal: 4,
                    ratioHeal: 0.3,
                    myRatioHeal: 0.3,
                }
            ]
        };

        const skillStr = codegen.skill(data);
        const formatted = prettier.format(skillStr, { semi: false, "tabWidth": 4, trailingComma: "all",parser: "babel" });

        assert.equal(formatted, `/** 666, Test Description
*/
// fixme: passive skill
module.exports = {
    action: [
        step(
            targetSelf,
            heal((self, target) => self.atk * 4),
            heal((self, target) => target.maxHp * 0.3),
            heal((self, target) => self.maxHp * 0.3),
        ),
    ],
    meta: {
        dmg: 5,
        effect: 5,
        cooldown: 2,
    },
}
`);
    });

    it('shielding skill', () => {
        const data = {
            "id": 666,
            "description": "Test Description",
            "slot": 5,
            "passive": true,
            "meta": {
                "dmg": 5,
                "effect": 5,
                "cooldown": 2,
            },
            "steps": [
                {
                    target: 'self',
                    atkHeal: 4,
                    ratioHeal: 0.3,
                    myRatioHeal: 0.3,
                }
            ]
        };

        const skillStr = codegen.skill(data);
        const formatted = prettier.format(skillStr, { semi: false, "tabWidth": 4, trailingComma: "all",parser: "babel" });

        assert.equal(formatted, `/** 666, Test Description
*/
// fixme: passive skill
module.exports = {
    action: [
        step(
            targetSelf,
            heal((self, target) => self.atk * 4),
            heal((self, target) => target.maxHp * 0.3),
            heal((self, target) => self.maxHp * 0.3),
        ),
    ],
    meta: {
        dmg: 5,
        effect: 5,
        cooldown: 2,
    },
}
`);
    });

    it('buffs', () => {
        const data = {
            "id": 666,
            "description": "Test Description",
            "slot": 1,
            "passive": false,
            "meta": {
                "dmg": 5,
                "effect": 5,
                "cooldown": 2,
            },
            "steps": [
                {
                    target: 'ally',
                    buffs: [
                        ['atk', 3],
                        ['def', 3],
                    ],
                    additionalTurn: [100, true],
                },
                {
                    target: 'self',
                    additionalTurn: [22, false],
                }
            ]
        };

        const skillStr = codegen.skill(data);
        const formatted = prettier.format(skillStr, { semi: false, "tabWidth": 4, trailingComma: "all",parser: "babel" });

        assert.equal(formatted, `/** 666, Test Description
*/
module.exports = {
    action: [
        step(
            targetAlly,
            buff((self, target) => target.buf("atk", 3)),
            buff((self, target) => target.buf("def", 3)),
            onKill(additionalTurn(roll, 100)),
        ),
        step(targetSelf, additionalTurn(roll, 22)),
    ],
    meta: {
        dmg: 5,
        effect: 5,
        cooldown: 2,
    },
}
`);

    });

    it('skill with additional atk chance, notes, groupAttack', () => {
        const data = {
            "id": 666,
            "notes": [
                "note 1",
                "note 2",
            ],
            "description": "Test Description",
            "slot": 1,
            "icon": "skill_icon.png",
            "passive": false,
            "meta": {
                "dmg": 5,
                "effect": 5,
                "cooldown": 2,
            },
            "steps": [
                {
                    "target": "enemy",
                    "atkDmg": {
                        "atkMultiplier": 1.9,
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    additionalAttack: 30,
                },
            ]
        };

        const skillStr = codegen.skill(data);
        const formatted = prettier.format(skillStr, { semi: false, "tabWidth": 4, trailingComma: "all",parser: "babel" });

        assert.equal(formatted, `/** 666, Test Description
*/
// fixme: note 1
// fixme: note 2
module.exports = {
    action: [
        step(
            targetEnemy,
            cumulativeDmg(roll, attacker => attacker.atk * 1.9),
        ),
        // fixme: check, chance source
        withChance(
            self => 30,
            step(
                targetEnemy,
                cumulativeDmg(roll, attacker => attacker.atk * 1.9),
            ),
        ),
    ],
    meta: {
        dmg: 5,
        effect: 5,
        cooldown: 2,
    },
}
`);
    });

    it.only('groupAttack', () => {
        const data = {
            "id": 666,
            "description": "Test Description",
            "slot": 1,
            "icon": "skill_icon.png",
            "passive": false,
            "meta": {
                "dmg": 5,
                "effect": 5,
                "cooldown": 2,
            },
            "steps": [
                {
                    "target": "enemy",
                    "atkDmg": {
                        "atkMultiplier": 1.9,
                        "ignoresDef": false,
                        "ignoresDefReduction": false
                    },
                    groupAttack: 2,
                    atbIncrease: 50,
                    atbDecrease: 50,
                    strip: [10, 100],
                    skillRefresh: 2,
                    cleanse: 2,
                    skillReset: {
                         amount: 2,
                         chance: 50
                    },
                    hpDestroy: 0.3,
                    dmgReduce: 0.25,
                    atbSteal: [0.2, 70],
                    stealBuff: [1, 50],
                    increaseBuffDuration: 1,
                    transferDebuffs: {
                         chance: 20,
                         amount: 3,
                         target: 'self',
                    },
                    detonate: 'bomb',
                    cantRevive: true,
                    selfHarm: 0.1,
                },
            ]
        };

        const skillStr = codegen.skill(data);
        const formatted = prettier.format(skillStr, { semi: false, "tabWidth": 4, trailingComma: "all",parser: "babel" });

        assert.equal(formatted, `/** 666, Test Description
*/
module.exports = {
    action: [
        step(
            targetEnemy,
            cumulativeDmg(roll, attacker => attacker.atk * 1.9),
            groupAttack(self => 2), // fixme: might scale of something
            atbIncrease(50),
            atbDecrease(roll, 50),
            strip(roll, 10, 100),
            skillRefresh(2),
            cleanse(2),
            skillReset(2, 50),
            hpDestroy(0.3),
            dmgReduce(0.25),
            atbSteal(0.2, 70),
            stealBuff(1, 50),
            increaseBuffDuration(1),
            transferMyDebuffs(3, 20),
            detonate("bomb"),
            cantRevive()
            selfHarm(0.1)
        ),
    ],
    meta: {
        dmg: 5,
        effect: 5,
        cooldown: 2,
    },
}
`);
    });
});
