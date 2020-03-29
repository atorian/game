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

// skill id: 2210
/** 
Attacks the enemy with razor-sharp claws and decreases the Defense for 2 turns. This attack will deal more damage according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.8 + attacker.def * 2.7,
                ),
                debuff(roll, "def_break", 2, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2210, spec.meta, multistep(spec.action))
}
