/* global FormApplication */
/* global game */
/* global mergeObject */

/**
 * Form application to configure settings of Combat Numbers.
 */
export default class CombatNumbersConfig extends FormApplication {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('COMBATNUMBERS.SETTINGS.configTitle'),
      id: 'combat-numbers-config',
      template: 'modules/combat-numbers/src/templates/config.html',
      width: 500,
      height: 150,
      closeOnSubmit: true,
    });
  }

  /**
   * The default appearance settings object.
   *
   * @return {Object}
   */
  static get DEFAULT_APPEARANCE() {
    return {
      font: 'Verdana',
    };
  }

  /**
   * The available font families to choose from.
   *
   * @return {array}
   */
  static get FONT_FAMILIES() {
    return [
      'Verdana',
      'Arial',
      'Helvetica',
      'Trebuchet MS',
      'Times New Roman',
      'Modesto',
      'Didot',
      'American Typewriter',
      'Andale Mono',
      'Courier',
      'Bradley Hand',
      'Luminari',
    ];
  }

  /** @override */
  getData() {
    return {
      fontList: CombatNumbersConfig.FONT_FAMILIES,
      selectedFont: game.settings.get('combat-numbers', 'font'),
    };
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Set up the form with the current settings values.
    const appearance = game.settings.get('combat-numbers', 'appearance');
    const fontKey = this._getFontKeyByName(appearance.font);

    html.find('select[name="font"]').val(fontKey);

    html.find('button[name="reset"]').click(() => {
      this.reset(html);
    });
  }

  /** @override */
  async _updateObject(event, formData) {
    const appearance = {};

    const selectedFont = parseInt(formData.font, 10);
    appearance.font = CombatNumbersConfig.FONT_FAMILIES[selectedFont];

    await game.settings.set(
      'combat-numbers',
      'appearance',
      appearance,
    );
  }

  /**
   * Reset the form to its default state.
   *
   * @param {jQuery} html
   *   The jQuery HTML object of the form.
   */
  reset(html) {
    const defaultAppearance = CombatNumbersConfig.DEFAULT_APPEARANCE;
    const fontKey = this._getFontKeyByName(defaultAppearance.font);

    html.find('select[name="font"]').val(fontKey);
  }

  /**
   * Get the numeric font key by the font name itself.
   *
   * @param {string} name
   *   The font name. Ex: "Verdana".
   *
   * @return {number}
   *   The font key in our array. Pertaining to
   *   `CombatNumbersConfig.FONT_FAMILIES`.
   *
   * @private
   */
  _getFontKeyByName(name) {
    return CombatNumbersConfig.FONT_FAMILIES.findIndex(
      (font) => font === name,
    );
  }
}
