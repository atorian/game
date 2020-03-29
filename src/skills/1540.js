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

// skill id: 1540
/** 
Swiftly attacks the enemy 2 times, leaving Continuous Damage for 2 turns. This skill has a 30% chance to activate the Sword of the Supreme Sky Wolf, and the activation chance increases by 20% additionally when you land a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "dot", 2, null),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "dot", 2, null),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1540, spec.meta, multistep(spec.action))
}
