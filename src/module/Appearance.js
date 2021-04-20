import CombatNumbersConfig from './CombatNumbersConfig';

/**
 * A class to translate our appearance settings into a PIXI Text Style object.
 */
export default class Appearance {
  constructor(appearanceSettings, gridSize) {
    /**
     * The current Scene's grid size.
     *
     * @type {number}
     */
    this.gridSize = Number(gridSize);

    const defaults = CombatNumbersConfig.DEFAULT_APPEARANCE;

    this.healColor = appearanceSettings?.healColor === undefined
      ? defaults.healColor
      : appearanceSettings.healColor;

    this.damageColor = appearanceSettings?.damageColor === undefined
      ? defaults.damageColor
      : appearanceSettings.damageColor;

    this.fontFamily = appearanceSettings?.font === undefined
      ? defaults.font
      : appearanceSettings.font;

    this.fontSizeSetting = appearanceSettings?.fontSize === undefined
      ? defaults.fontSize
      : appearanceSettings.fontSize;

    if (
      appearanceSettings?.bold === undefined
      || !appearanceSettings.bold
    ) {
      this.fontWeight = 'normal';
    } else {
      this.fontWeight = 'bold';
    }

    if (
      appearanceSettings?.italic === undefined
      || !appearanceSettings.italic
    ) {
      this.fontStyle = 'normal';
    } else {
      this.fontStyle = 'italic';
    }

    this.stroke = appearanceSettings?.strokeColor === undefined
      ? defaults.strokeColor
      : appearanceSettings.strokeColor;

    this.strokeThickness = appearanceSettings?.strokeThickness === undefined
      ? defaults.strokeThickness
      : Number(appearanceSettings.strokeThickness);

    // Ensure that the user hasn't turned off drop shadow via the alpha
    // setting.
    if (
      appearanceSettings?.dropShadowAlpha === undefined
      || Number(appearanceSettings.dropShadowAlpha) !== 0
    ) {
      this.dropShadow = true;
      this.dropShadowColor = appearanceSettings?.dropShadowColor === undefined
        ? defaults.dropShadowColor
        : appearanceSettings.dropShadowColor;
      this.dropShadowAlpha = appearanceSettings?.dropShadowAlpha === undefined
        ? defaults.dropShadowAlpha
        : Number(appearanceSettings.dropShadowAlpha);
    }
  }

  /**
   * Get the PIXI text style object for heal text.
   *
   * @return {Object}
   */
  getHealTextStyle() {
    return {
      ...this._getBaseTextStyle(),
      ...{
        fill: this.healColor,
      },
    };
  }

  /**
   * Get the PIXI text style object for damage text.
   *
   * @return {Object}
   */
  getDamageTextStyle() {
    return {
      ...this._getBaseTextStyle(),
      ...{
        fill: this.damageColor,
      },
    };
  }

  /**
   * Get the base PIXI text style object for use.
   *
   * @return {Object}
   *
   * @private
   */
  _getBaseTextStyle() {
    const baseTextStyle = {
      fontFamily: this.fontFamily,
      fontSize: this._getFontSizeForTextStyle(),
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      stroke: this.stroke,
      strokeThickness: this.strokeThickness,
    };

    if (this.dropShadow) {
      baseTextStyle.dropShadow = this.dropShadow;
      baseTextStyle.dropShadowColor = this.dropShadowColor;
      baseTextStyle.dropShadowAlpha = this.dropShadowAlpha;
    }

    return baseTextStyle;
  }

  /**
   * Calculate and get the font size for the PIXI Text Style object.
   *
   * @return {number}
   *   The final numeric text size, rounded.
   *
   * @private
   */
  _getFontSizeForTextStyle() {
    let modifier;

    switch (this.fontSizeSetting) {
      case 'xsmall':
        modifier = 0.1;
        break;
      case 'small':
        modifier = 0.2;
        break;
      case 'medium':
        modifier = 0.3;
        break;
      case 'large':
        modifier = 0.5;
        break;
      case 'xlarge':
        modifier = 0.75;
        break;
      default:
        throw new TypeError(`Cannot find a font size for font size setting "${this.fontSizeSetting}"`);
    }

    return Math.round(this.gridSize * modifier);
  }
}
