// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    strip,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1038
/** 
Smashes the enemy and removes a beneficial effect granted on the target with a 100% chance. The damage of this skill is proportionate to your MAX HP and this attack will increase your Attack Speed for 2 turns if it lands as a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.1 + attacker.maxHp * 0.18,
                ),
                strip(roll, 10, 100),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", 2)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1038, spec.meta, multistep(spec.action))
}
