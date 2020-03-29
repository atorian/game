// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 730
/** 
Attacks all enemies 3 times with a loud bomb. Each attack has a 25% chance to deal Continuous Damage for 2 turns and the skill cooldown time of [Multi-Firecracker] will be decreased by 1 turn each whenever the enemies are inflicted with Continuous Damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 1 turn per Continuous Dmg effect applied
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "dot", 2, 25),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "dot", 2, 25),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "dot", 2, 25),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(730, spec.meta, multistep(spec.action))
}
