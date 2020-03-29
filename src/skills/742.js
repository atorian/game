// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 742
/** 
Attacks the enemy with condensed energy and reduces the enemy's Defense for 1 turn with a 50% chance. Shadowless Kick will be activated in succession with a 30% chance.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.9),
                debuff(roll, "def_break", 1, 50),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(742, spec.meta, multistep(spec.action))
}
