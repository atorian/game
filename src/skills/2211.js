// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2211
/** 
Attacks the enemy with razor-sharp claws and decreases the Defense for 2 turns. Also decreases the Attack Bar by 15% with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                debuff(roll, "def_break", 2, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 0,
        },
    }
    return new GenericSkill(2211, spec.meta, multistep(spec.action))
}
