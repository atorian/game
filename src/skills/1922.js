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

// skill id: 1922
/** 
Attacks the enemy target 2 times and attacks all enemies with even more powerful attack on the 3rd attack. Inflicts continuous damage for 1 turn every hit with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "dot", 1, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "dot", 1, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "dot", 1, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1922, spec.meta, multistep(spec.action))
}
