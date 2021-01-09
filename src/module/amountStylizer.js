/* global PIXI */

/**
 * Stylize the Combat Number amount for display.
 */
export default class AmountStylizer {
  constructor(text, appearance) {
    this.text = String(text);
    this.appearance = appearance;
  }

  /**
   * Get the types of styles. Used as constants.
   *
   * @return {Object}
   */
  static get types() {
    return {
      TYPE_DAMAGE: 1,
      TYPE_HEAL: 2,
    };
  }

  /**
   * Generate the combat number. Will be generated as a PIXI Sprite.
   *
   * @param {number} type
   *   The type of style to be using.
   *
   * @return {PIXI.Text}
   */
  stylize(type) {
    const values = Object.values(AmountStylizer.types);
    if (!values.includes(type)) {
      throw new TypeError(`Cannot find type for ${type}`);
    }

    return new PIXI.Text(
      this.text,
      this._getTextStyle(type),
    );
  }

  /**
   * Get the text style for the sprite.
   *
   * @param {number} type
   *   The type of style to be using.
   *
   * @return {PIXI.TextStyle}
   *
   * @private
   */
  _getTextStyle(type) {
    let textStyle;

    if (type === AmountStylizer.types.TYPE_DAMAGE) {
      textStyle = this.appearance.getHealTextStyle();
    } else {
      textStyle = this.appearance.getDamageTextStyle();
    }

    return new PIXI.TextStyle(textStyle);
  }
}
