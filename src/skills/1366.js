// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1366
/** 
Attacks an enemy. This attack has a 75% chance to remove all beneficial effect and puts the target to sleep for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.2),
                debuff(roll, "sleep", 1, 75),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1366, spec.meta, multistep(spec.action))
}
