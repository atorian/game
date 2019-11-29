import { assert } from 'chai';
import { DARK, Elements, FIRE, LIGHT, WATER, WIND } from "./elements";


describe('Elements', () => {
    it('fire has advantage over wind', () => {
        assert.isTrue(Elements.hasAdvantage({ element: FIRE }, { element: WIND }))
    });
    it('water has advantage over fire', () => {
        assert.isTrue(Elements.hasAdvantage({ element: WATER }, { element: FIRE }))
    });
    it('wind has advantage over water', () => {
        assert.isTrue(Elements.hasAdvantage({ element: WIND }, { element: WATER }))
    });
    it('light has advantage over dark', () => {
        assert.isTrue(Elements.hasAdvantage({ element: LIGHT }, { element: DARK }))
    });
    it('dark has advantage over light', () => {
        assert.isTrue(Elements.hasAdvantage({ element: DARK }, { element: LIGHT }))
    });
    it('fire has disadvantage over water', () => {
        assert.isTrue(Elements.hasDisadvantage({ element: FIRE }, { element: WATER }))
    });
    it('wind has disadvantage over fire', () => {
        assert.isTrue(Elements.hasDisadvantage({ element: WIND }, { element: FIRE }))
    });
    it('water has disadvantage over wind', () => {
        assert.isTrue(Elements.hasDisadvantage({ element: WATER }, { element: WIND }))
    });
    it('water is neutral to water, light and dark', () => {
        [WATER, LIGHT, DARK].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: WATER }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: WATER }, { element }));
        });
    });
    it('fire is neutral to fire, light and dark', () => {
        [FIRE, LIGHT, DARK].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: FIRE }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: FIRE }, { element }));
        });
    });
    it('wind is neutral to wind, light and dark', () => {
        [WIND, LIGHT, DARK].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: WIND }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: WIND }, { element }));
        });
    });
    it('light is neutral to wind, fire and water', () => {
        [WIND, FIRE, WATER].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: LIGHT }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: LIGHT }, { element }));
        });
    });
    it('dark is neutral to wind, fire and water', () => {
        [WIND, FIRE, WATER].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: DARK }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: DARK }, { element }));
        });
    });
});
