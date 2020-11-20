import { ease } from 'pixi-ease';
import CombatNumberGenerator from './combatNumberGenerator';

/* global CanvasLayer */
/* global game */
/* global mergeObject */

/**
 * A new layer which we can render combat numbers on.
 */
export default class CombatNumberLayer extends CanvasLayer {
  constructor() {
    super();

    /**
     * Our module name.
     *
     * @type {string}
     */
    this.moduleName = 'combat-numbers';
  }

  /**
   * Override the layer options to situate our layer.
   *
   * @return {*}
   */
  static get layerOptions() {
    return mergeObject(super.layerOptions, {
      canDragCreate: false,
      // This will set the combat numbers above the effects layer, but below
      // the controls layer.
      zIndex: 350,
    });
  }

  /**
   * Add a combat number at the specified position.
   *
   * @param {Number} number
   *   The number to display.
   * @param {Number} x
   *   The X coordinate.
   * @param {Number} y
   *   The Y coordinate.
   */
  addCombatNumber(number, x, y) {
    const combatNumberFactory = new CombatNumberGenerator(number);
    const dmgNum = combatNumberFactory.generate(
      this._shouldShowModifiers(),
    );

    // Ensure we're anchoring to the center of the token.
    dmgNum.anchor.set(0.5);
    dmgNum.position.x = x;
    dmgNum.position.y = y;
    dmgNum.name = Math.random().toString(36).substring(16);

    const child = this.addChild(dmgNum);

    const anim1 = ease.add(
      child,
      { x: child.transform.position.x, y: child.transform.position.y + -25 },
      { duration: 100 },
    );

    anim1.once('complete', () => {
      const anim2 = ease.add(
        child,
        { x: child.transform.position.x, y: child.transform.position.y + 40 },
        { duration: 50 },
      );

      anim2.once('complete', () => {
        const anim3 = ease.add(
          child,
          { alpha: 0 },
          { wait: 1500, duration: 500 },
        );

        anim3.once('complete', () => {
          this.removeChild(child);
        });
      });
    });
  }

  /**
   * If we should show the Combat Number modifiers or not.
   *
   * @return {boolean}
   *   If we should show it.
   *
   * @private
   */
  _shouldShowModifiers() {
    return !!(game.settings.get(
      this.moduleName,
      'show-modifiers',
    ));
  }
}
