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

// skill id: 1412
/** 
Attacks random enemies for 4 times. Each attack has a 75% chance to deal Continuous Damage for 1 turn. Decreases the cooldown time of [Arrow Storm] by 1 turn whenever you attack an enemy under Continuous Damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "dot", 1, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "dot", 1, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "dot", 1, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "dot", 1, 75),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1412, spec.meta, multistep(spec.action))
}
