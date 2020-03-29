// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 475
/** 
Attacks random enemies 5 times by throwing javelins and inflicts continuous damage for 3 turns with a 50% chance for each attack. Inflicts continuous damage for 3 turns with a 100% chance if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: On non-crit hit
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "dot", 3, 50),
                debuff(roll, "dot", 3, null),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "dot", 3, 50),
                debuff(roll, "dot", 3, null),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "dot", 3, 50),
                debuff(roll, "dot", 3, null),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "dot", 3, 50),
                debuff(roll, "dot", 3, null),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "dot", 3, 50),
                debuff(roll, "dot", 3, null),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(475, spec.meta, multistep(spec.action))
}
