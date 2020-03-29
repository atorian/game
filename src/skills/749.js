// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 749
/** 
Strikes random targets 4 times with the power of fire. Each strike has a 50% chance to elongate the harmful effect on the enemy by 1 turn. If this skill is on cooldown, you have a 25% chance to counterattack when attacked. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 60
        // fixme: If skill on cooldown
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(749, spec.meta, multistep(spec.action))
}
