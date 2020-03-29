// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1705
/** 
Attacks the enemy to Provoke for 1 turn with a 75% chance and counterattacks the enemy for 2 turns whenever you're attacked. The damage increases accordingly to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3 + attacker.maxHp * 0.2,
                ),
                debuff(roll, "provoke", 2, 75),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", 2)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1705, spec.meta, multistep(spec.action))
}
