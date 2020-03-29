// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 747
/** 
Attacks the target with a turning kick and decreases its Attack Bar by 50% with an 80% chance and decreases its Attack Speed for 2 turns. If the target's Attack Bar is depleted by this attack, the target will be stunned for 1 turn.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If ATB reduced to 0
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.5),
                debuff(roll, "slow", 2, 100),
                debuff(roll, "stun", 1, null),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(747, spec.meta, multistep(spec.action))
}
