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

// skill id: 1126
/** 
Attacks with the Monkey Wand and stuns the enemy for 1 turn with a 35% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "stun", 1, 35),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 15,
            cooldown: 0,
        },
    }
    return new GenericSkill(1126, spec.meta, multistep(spec.action))
}
