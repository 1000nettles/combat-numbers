import { ease } from 'pixi-ease';
import AmountStylizer from './AmountStylizer';
import Constants from './Constants';

/**
 * A Renderer class to handle rendering responsibilities.
 */
export default class Renderer {
  constructor(layer, settings, state, appearance) {
    /**
     * The associated Layer instance.
     *
     * @type {CombatNumberLayer}
     */
    this.layer = layer;

    /**
     * The associated Settings instance.
     *
     * @type {Settings}
     */
    this.settings = settings;

    /**
     * The associated State instance.
     *
     * @type {State}
     */
    this.state = state;

    /**
     * The associated Appearance instance..
     */
    this.appearance = appearance;
  }

  /**
   * The types of masking that can occur.
   *
   * @return {Object}
   */
  static get maskedTypes() {
    return {
      TYPE_DAMAGE: 1,
      TYPE_HEAL: 2,
    };
  }

  /**
   * Add a numeric Combat Number and render it at the specified position.
   *
   * @param {number} number
   *   The number to display.
   * @param {number} x
   *   The X coordinate.
   * @param {number} y
   *   The Y coordinate.
   */
  processNumericAndRender(number, x, y) {
    let text;

    if (number < 0) {
      text = String(Math.abs(number));
      if (this._shouldShowModifiers()) {
        text = `-${text}`;
      }
    } else {
      text = String(number);
      if (this._shouldShowModifiers()) {
        text = `+${text}`;
      }
    }

    const stylizerType = (number < 0)
      ? AmountStylizer.types.TYPE_DAMAGE
      : AmountStylizer.types.TYPE_HEAL;

    return this._render(text, stylizerType, x, y);
  }

  /**
   * Add a masked Combat Number and render it at the specified position.
   *
   * @param {Renderer.maskedTypes} type
   *   The relevant masked type.
   * @param {number} x
   *   The X coordinate.
   * @param {number} y
   *   The Y coordinate.
   */
  processMaskedAndRender(type, x, y) {
    let text;
    let stylizerType;

    if (type === Renderer.maskedTypes.TYPE_DAMAGE) {
      text = this._getMaskDamageText();
      stylizerType = AmountStylizer.types.TYPE_DAMAGE;
    } else if (type === Renderer.maskedTypes.TYPE_HEAL) {
      text = this._getMaskHealText();
      stylizerType = AmountStylizer.types.TYPE_HEAL;
    } else {
      throw new Error(`Specified Renderer type ${type} does not exist`);
    }

    return this._render(text, stylizerType, x, y);
  }

  /**
   * Render the processed text.
   *
   * @param {string} text
   *   The processed text to render on the canvas.
   * @param {AmountStylizer.types} stylizerType
   *   The AmountStylizer type to be rendering with.
   * @param {number} x
   *   The X coordinate.
   * @param {number} y
   *   The Y coordinate.
   *
   * @private
   */
  async _render(text, stylizerType, x, y) {
    const amountStylizer = new AmountStylizer(text, this.appearance);
    const dmgNum = amountStylizer.stylize(stylizerType);

    // Ensure we're anchoring to the center of the token.
    dmgNum.anchor.set(0.5);
    dmgNum.position.x = x;
    dmgNum.position.y = y;
    dmgNum.name = Math.random().toString(36).substring(16);

    // Add a "wait" time if our settings dictate to wait until this is complete.
    await new Promise(
      (resolve) => setTimeout(resolve, this._getWaitTime()),
    );

    const child = this.layer.addChild(dmgNum);

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
          { wait: this._getLingerTime(), duration: 500 },
        );

        anim3.once('complete', () => {
          this.layer.removeChild(child);
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
    return !!(this.settings.get(
      Constants.MODULE_NAME,
      'show_modifiers',
    ));
  }

  /**
   * Get the mask damage text.
   *
   * @return {string}
   *   The mask damage text.
   *
   * @private
   */
  _getMaskDamageText() {
    return String(this.settings.get(
      Constants.MODULE_NAME,
      'mask_damage',
    ));
  }

  /**
   * Get the mask heal text.
   *
   * @return {string}
   *   The mask heal text.
   *
   * @private
   */
  _getMaskHealText() {
    return this.settings.get(
      Constants.MODULE_NAME,
      'mask_heal',
    );
  }

  /**
   * Get the wait time for until the rendered numbers to display.
   *
   * @return {number}
   *   Return the wait time in milliseconds.
   *
   * @private
   */
  _getWaitTime() {
    const waitTime = Number(this.settings.get(
      Constants.MODULE_NAME,
      'wait_time',
    ));

    return waitTime * 1000;
  }

  /**
   * Get the linger time for the rendered numbers to display.
   *
   * @return {number}
   *   Return the linger time in milliseconds.
   *
   * @private
   */
  _getLingerTime() {
    const lingerTime = Number(this.settings.get(
      Constants.MODULE_NAME,
      'linger_time',
    ));

    return lingerTime * 1000;
  }
}
