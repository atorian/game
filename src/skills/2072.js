// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2072
/** 
Attacks the enemy target and reduces the target's Attack Bar to 0. This attack will deal more damage according to your Defense. Also, this effect can't be resisted if the enemy is granted with harmful effect.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 69
        // fixme: If enemy has debuff
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2 + attacker.def * 3.3,
                ),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2072, spec.meta, multistep(spec.action))
}
