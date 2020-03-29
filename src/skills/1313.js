// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1313
/** 
Attacks the enemy 2 times with each attack having a 20% chance to inflict Continuous Damage for 1 turn. This damage of this attack will increase according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.5 + attacker.maxHp * 0.08,
                ),
                debuff(roll, "dot", 1, 20),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.5 + attacker.maxHp * 0.08,
                ),
                debuff(roll, "dot", 1, 20),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(1313, spec.meta, multistep(spec.action))
}
