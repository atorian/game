// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1285
/** 
Attacks an enemy 3 times. Each attack has a 20% chance to decrease the enemy's Defense for 2 turns. Instantly gains another turn with a 30% chance after the attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "def_break", 2, 20),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "def_break", 2, 20),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "def_break", 2, 20),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 25,
            effect: 15,
            cooldown: 3,
        },
    }
    return new GenericSkill(1285, spec.meta, multistep(spec.action))
}
