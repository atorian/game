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

// skill id: 1041
/** 
Smashes the enemy and decreases the target's Defense for 2 turns. The damage of this skill is proportionate to your MAX HP and this attack will increase your Attack Speed for 2 turns if it lands as a Critical Hit. 
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
                debuff(roll, "def_break", 2, 100),
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
    return new GenericSkill(1041, spec.meta, multistep(spec.action))
}
