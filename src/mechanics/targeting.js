import type {ActionContext} from "../battle";


export function enemy(context:ActionContext) {
    if (context.caster.player !== context.target.player) {
        return [context.target];
    }

    throw new Error('Invalid target');
}

export function aoe_enemy(context:ActionContext) {
    const targets = context.battlefield.filter(unit => unit.player !== context.caster.player);
    if (targets.length) {
        return targets;
    }

    throw new Error('Invalid target');
}

export function self(context:ActionContext) {
    return [context.caster];
}

export function ally(context:ActionContext) {
    if (context.target.player === context.caster.player) {
        return [context.target];
    }

    throw new Error('Invalid target');
}

export function aoe_ally(context:ActionContext) {
    return context.battlefield.filter(unit => unit.player === context.caster.player);
}

export function not_self(context:ActionContext) {
    const targets = context.battlefield.filter(unit => {
        return unit.player === context.caster.player && unit.player !== context.caster.player;
    });

    if (targets.length) {
        return targets;
    }

    throw new Error('Invalid target');
}


const STRATEGIES = {
    enemy,
    aoe_enemy,
    self,
    ally,
    aoe_ally,
    not_self,
};

export function create(strategy) {
    console.log('strategy', strategy);
    switch(typeof strategy) {
        case 'string':
            if (STRATEGIES[strategy]) {
                console.log(strategy, STRATEGIES[strategy]);
                return STRATEGIES[strategy];
            }
            throw new Error(`Unknown targeting strategy "${strategy}"`);
        case 'function':
            return strategy;
        default:
            throw new Error(
                `Targeting strategy could be string or function. ${typeof strategy} given.`
            );
    }
}

export default function(strategy, context:ActionContext) {
    return create(strategy)(context);
}
