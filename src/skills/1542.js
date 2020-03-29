// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1542
/** 
Attacks an enemy with lightning speed, putting the target's skills on cool down. The damage increases according to your Attack Speed. This skill has a 70% chance to activate the Sword of the Supreme Sky Wolf, and the activation chance increases by 30% additionally when you land a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 192)) / 41,
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1542, spec.meta, multistep(spec.action))
}
