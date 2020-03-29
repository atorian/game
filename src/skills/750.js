// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 750
/** 
Strikes random targets 4 times with the power of water and increases the inflicted damage by 15% for each harmful effect of the enemy. If this skill is on cooldown, you have a 25% chance to counterattack when attacked.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.5 + attacker.debuff * 0.15,
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(750, spec.meta, multistep(spec.action))
}
