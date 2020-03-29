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

// skill id: 1527
/** 
Quickly draws the sword to attack the enemy, decreasing the target's Defense for 2 turns with a 50% chance. This skill has a 20% chance to activate the Sword of the Supreme Sky Wolf, and the activation chance increases by 10% additionally when you land a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "def_break", 2, 50),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(1527, spec.meta, multistep(spec.action))
}
