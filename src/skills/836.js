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

// skill id: 836
/** 
Inflicts damage to announce the crime and stuns the enemy for 1 turn with a 20% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "stun", 1, 20),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(836, spec.meta, multistep(spec.action))
}
