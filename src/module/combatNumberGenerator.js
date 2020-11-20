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
   * @param {boolean} showModifier
   *   If we should show the addition / subtraction modifiers.
   *
   * @return {PIXI.Text}
   */
  generate(showModifier) {
    let finalAmount = this.amount;

    if (this.amount < 0) {
      finalAmount = Math.abs(this.amount);
    }

    // If we should show our addition / subtraction modifiers, add them in here.
    if (showModifier) {
      if (this.amount < 0) {
        finalAmount = `-${finalAmount}`;
      } else {
        finalAmount = `+${finalAmount}`;
      }
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
    let fill = '#95ed98';

    if (this.amount < 0) {
      fill = '#ffffff';
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
