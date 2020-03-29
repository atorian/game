// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 861
/** 
Attacks an enemy target 5 times, dealing massive damage. Each attack has a 50% chance to decrease the target's Defense for 2 turns. This attack depletes the enemy's Attack Bar when used with full HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(861, spec.meta, multistep(spec.action))
}
