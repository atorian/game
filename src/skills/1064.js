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

// skill id: 1064
/** 
Collapses the earth to inflict damage that increases accordingly to your MAX HP and provokes the enemy for 1 turn. If this skill is on cooldown, you have a 30% chance to counterattack the attacker with the [Collapse] Skill when attacked. Deals 75% of the damage when counterattacking. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If skill on cooldown
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 4.4 + attacker.maxHp * 0.4,
                ),
                debuff(roll, "provoke", 1, 100),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", 1)),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1064, spec.meta, multistep(spec.action))
}
