// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    groupAttack,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 117
/** 
Performs a fierce cooperative attack with two fellow allies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.1),
                groupAttack(self => 2), // fixme: might scale of something
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.1),
                groupAttack(self => 2), // fixme: might scale of something
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.1),
                groupAttack(self => 2), // fixme: might scale of something
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(117, spec.meta, multistep(spec.action))
}
