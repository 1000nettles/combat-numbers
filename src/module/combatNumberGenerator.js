/* global PIXI */

/**
 * Generate the combat number for display.
 */
export default class CombatNumberGenerator {
  constructor(amount) {
    this.amount = amount;
  }

  /**
   * Generate the combat number. Will be generated as a PIXI Sprite.
   *
   * @return {PIXI.Text}
   */
  generate() {
    let finalAmount = this.amount;

    if (this.amount < 0) {
      finalAmount = Math.abs(this.amount);
    }

    return new PIXI.Text(
      String(finalAmount),
      this._getTextStyle(),
    );
  }

  /**
   * Get the text style for the sprite.
   *
   * @return {PIXI.TextStyle}
   * @private
   */
  _getTextStyle() {
    let fill = '#ffffff';

    if (this.amount < 0) {
      fill = '#aefab2';
    }

    return new PIXI.TextStyle({
      dropShadow: true,
      dropShadowDistance: 4,
      fill,
      fontFamily: 'Verdana',
      fontSize: 24,
      fontWeight: 'bold',
      strokeThickness: 4,
    });
  }
}
