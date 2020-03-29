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

// skill id: 524
/** 
Slams the enemy with a hammer, weakening the target's Defense for 2 turns with a 75% chance. The damage increases according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3 + attacker.def * 4,
                ),
                debuff(roll, "def_break", 2, 75),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(524, spec.meta, multistep(spec.action))
}
