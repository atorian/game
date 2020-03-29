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

// skill id: 1042
/** 
Slams the enemy hard, granting a Branding Effect for 1 turn. The damage increases accordingly to your MAX HP and increases the Attack Speed for 2 turns if you land a Critical Hit. 
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
                debuff(roll, "brand", 1, 100),
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
    return new GenericSkill(1042, spec.meta, multistep(spec.action))
}
