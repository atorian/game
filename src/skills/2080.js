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

// skill id: 2080
/** 
Inflicts damage proportionate to your Defense on all Monsters except yourself, and Stuns all Monsters. This effect can't be resisted. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Including allied monsters except caster
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 4.8),
                debuff(roll, "stun", 1, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(2080, spec.meta, multistep(spec.action))
}
