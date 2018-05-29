import type {ActionContext} from "../battle";


export function single_enemy(context:ActionContext) {
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
