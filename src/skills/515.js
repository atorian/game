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

// skill id: 515
/** 
Strikes an enemy with a hammer and stuns the target for 1 turn with a 15% chance. If the target is under Defense reduction effects, its Attack Speed is decreased for 2 turns. The damage increases according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If already has Decrease DEF debuff
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2 + attacker.def * 2.4,
                ),
                debuff(roll, "stun", 1, 15),
                debuff(roll, "slow", 2, null),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 35,
            cooldown: 0,
        },
    }
    return new GenericSkill(515, spec.meta, multistep(spec.action))
}
