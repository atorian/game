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

// skill id: 738
/** 
Attacks all enemies with a bomb that blocks all magic powers, removing one beneficial effect on each enemy and denying the usage of all skills with cooldowns for 2 turns. (Passive skills excluded) 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.3),
                debuff(roll, "silence", 2, 100),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(738, spec.meta, multistep(spec.action))
}
