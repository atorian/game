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

// skill id: 1117
/** 
Attacks with magical powers and inflicts continuous damage for 2 turns with a 50% chance. The damage increases according to Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 210)) / 70,
                ),
                debuff(roll, "dot", 2, 50),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(1117, spec.meta, multistep(spec.action))
}
