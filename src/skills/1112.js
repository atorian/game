// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1112
/** 
Attacks all enemies 3 times to weaken the Defense and inflicts continuous damage for 2 turns. Increases your Attack Bar by 10% per Continuous Damage granted on the enemies after the attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "dot", 2, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "dot", 2, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "dot", 2, 50),
            ),
            step(targetSelf, atbIncrease(10)),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1112, spec.meta, multistep(spec.action))
}
