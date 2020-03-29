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

// skill id: 937
/** 
Attacks without waking up the enemy that's under Sleep. Replaces up to 3 beneficial effects granted on the target with Sleep, Increased chances of landing a Glancing Hit, and Decrease DEF Effects for 2 turns each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.5),
                debuff(roll, "def_break", 2, 100),
                debuff(roll, "stun", 2, 100),
                debuff(roll, "glancing", 2, 100),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(937, spec.meta, multistep(spec.action))
}
