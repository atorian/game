// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 752
/** 
Strikes random targets 4 times with the power of light and absorbs 25% of the target's Attack Bar with each attack. If this skill is on cooldown, you have a 25% chance to counterattack when attacked. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
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
    return new GenericSkill(752, spec.meta, multistep(spec.action))
}
