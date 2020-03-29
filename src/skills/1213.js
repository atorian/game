// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    onKill,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1213
/** 
Attacks all enemies with ice pillars 3 times and freezes them for 1 turn with a 15% chance on each strike. Gains another turn instantly if the enemy dies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                debuff(roll, "freeze", 1, 15),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                debuff(roll, "freeze", 1, 15),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                debuff(roll, "freeze", 1, 15),
            ),
            step(targetSelf, onKill(additionalTurn(roll, 100))),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1213, spec.meta, multistep(spec.action))
}
