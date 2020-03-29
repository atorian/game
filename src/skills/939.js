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

// skill id: 939
/** 
Attacks without waking up the enemy that's under Sleep. Disturbs the HP Recovery of the target for 2 turns. Increases the damage by 50% if the target is asleep. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.5),
                debuff(roll, "heal_block", 2, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(939, spec.meta, multistep(spec.action))
}
