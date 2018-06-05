SWO.func.calculateDamage = function (monster, options) {
    var maxCritRate = 100;
    var modes = ['b', 'a', 'm'];
    var loopLength = modes.length;

    for (var i = 0; i < loopLength; i++) {
        var crate = (monster[modes[i] + '_crate'] > maxCritRate) ? maxCritRate : monster[modes[i] + '_crate'];
        if (!options || options.mode === 'standard') {
            if (options) {
                crate = ((options.addcrit + crate) < maxCritRate) ? crate += options.addcrit : crate = maxCritRate;
            }

            monster[modes[i] + '_dps'] = Math.floor(((maxCritRate - crate) + crate * (100 + monster[modes[i] + '_cdmg']) / 100) * monster[modes[i] + '_atk'] / 100);
        } else {
            // var def_base = (monster[modes[i] + '_def'] + monster['b_def'] * options.multiplier.buildings.def + monster['b_def'] * options.multiplier.lead.def) * options.multiplier.skill.def * options.multiplier.buffs.def;


            // base - lvl 12
            // actual
            // max - lvl 15

            var atk_spd_base = (
                monster[modes[i] + '_atk'] + // b_atk, a_atk, m_atk
                monster['b_atk'] * options.multiplier.buildings.atk +
                monster['b_atk'] * options.multiplier.lead.atk
            ) * options.multiplier.skill.atk * options.multiplier.buffs.atk;

            // if (options.multiplier.skill.spd.summand > 0 && options.multiplier.skill.spd.divisor > 0) {
            //     if (options.enemy_spd > 0) {
            //         atk_spd_base = atk_spd_base * ((options.enemy_spd + options.multiplier.skill.spd.summand) / options.multiplier.skill.spd.divisor / 100);
            //     } else {
            //         atk_spd_base = atk_spd_base * (((((monster[modes[i] + '_spd'] + (monster['b_spd'] * options.multiplier.buildings.spd) + (monster['b_spd'] * options.multiplier.lead.spd)) * options.multiplier.buffs.spd) + options.multiplier.skill.spd.summand) / options.multiplier.skill.spd.divisor) / 100);
            //     }
            // }

            // if (options.enemy_hp > 0) {
            //     var hp_base = options.enemy_hp * options.multiplier.skill.hp;
            // } else {
            //     var hp_base = (monster[modes[i] + '_hp'] + monster['b_hp'] * options.multiplier.buildings.hp + monster['b_hp'] * options.multiplier.lead.hp) * options.multiplier.skill.hp;
            // }

            var base_sum = def_base + atk_spd_base + hp_base;
            var skillupBonus = base_sum * options.skillups;

            // brand
            // if (options.multiplier.debuffs)
            //     base_sum = base_sum * options.multiplier.debuffs.brand;

            // if (!options.isBomb) {
            //     if (options.isCrit) {

            // crit dmg
            base_sum = base_sum * (
                1 +
                (monster[modes[i] + '_cdmg'] / 100) +
                options.multiplier.buildings.cdmg +
                options.multiplier.lead.cdmg
            );


                // } else if (options.isAverage) {
                //     if (monster[modes[i] + '_crate'] > 0) {
                //         var maxCrit = 1;
                //         var crit = (monster[modes[i] + '_crate'] / 100 + options.multiplier.lead.crate);
                //         var realCrit = (crit > maxCrit) ? maxCrit : crit;
                //         var critDmg = (1 + (monster[modes[i] + '_cdmg'] / 100) + options.multiplier.buildings.cdmg + options.multiplier.lead.cdmg);
                //         base_sum = base_sum * ((maxCrit - realCrit) + realCrit * critDmg);
                //     }
                // }
            // }

            if (skillupBonus > 0)
                base_sum += skillupBonus;

            if (!options.isBomb)
                base_sum = base_sum * (1000 / (1140 + 3.5 * options.defense));

            monster[modes[i] + '_dps'] = Math.floor(base_sum);
        }
    }

    return monster;
}
