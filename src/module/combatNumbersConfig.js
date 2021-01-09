/* global FormApplication */
/* global game */
/* global jQuery */
/* global mergeObject */

/**
 * Form application to configure settings of Combat Numbers.
 *
 * Currently, specific to appearance settings.
 */
export default class CombatNumbersConfig extends FormApplication {
  constructor(object = {}, options = {}) {
    super(object, options);
    this.fontOther = game.i18n.localize('COMBATNUMBERS.SETTINGS.fontFamilyOther');
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('COMBATNUMBERS.SETTINGS.configTitle'),
      id: 'combat-numbers-config',
      template: 'modules/combat-numbers/src/templates/config.html',
      width: 500,
      height: 310,
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
      damageColor: '#ffffff',
      healColor: '#95ed98',
      bold: true,
      italic: false,
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
    const appearance = game.settings.get('combat-numbers', 'appearance');
    const defaultAppearance = CombatNumbersConfig.DEFAULT_APPEARANCE;
    const object = {
      fontList: this._getFontList(),
      font: appearance.font ?? defaultAppearance.font,
      damageColor: appearance.damageColor ?? defaultAppearance.damageColor,
      healColor: appearance.healColor ?? defaultAppearance.healColor,
      bold: appearance.bold ?? defaultAppearance.bold,
      italic: appearance.italic ?? defaultAppearance.italic,
    };

    return object;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Set up the form with the current settings values.
    const appearance = game.settings.get('combat-numbers', 'appearance');
    const fontKey = this._getFontKeyByName(appearance.font);

    // As we cannot set the current selected `option` via Handlebars, we have
    // to do it with jQuery instead.
    html.find('select[name="font"]').val(fontKey);

    const fontOtherFormGroup = html.find('.form-group-font-other');
    const fontOther = html.find('#fontOther');

    // If the user has a custom defined font, fill out the "font other" field.
    if (this._getFontList()[fontKey] === this.fontOther) {
      fontOtherFormGroup.show();
      fontOther.val(appearance.font);
    }

    // Show / hide the "font other" box only if the "Other" option is selected.
    const fontOtherName = this.fontOther;
    html.find('select[name="font"]').change(function () {
      const optionName = jQuery(this).find('option:selected').text();

      if (optionName !== fontOtherName) {
        fontOther.val('');
        fontOtherFormGroup.hide();
        return;
      }

      fontOtherFormGroup.show();
    });

    // Perform the reset action if the user clicks "Reset".
    html.find('button[name="reset"]').click(() => {
      this.reset(html);
    });
  }

  /** @override */
  async _updateObject(event, formData) {
    const appearance = {};

    appearance.font = this._getSelectedFont(
      parseInt(formData.font, 10),
      formData,
    );
    appearance.damageColor = formData.damageColor;
    appearance.healColor = formData.healColor;
    appearance.bold = formData.bold;
    appearance.italic = formData.italic;

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
    html.find('.form-group-font-other').hide();
    html.find('#fontOther').val('');
    html.find('input[name="damageColor"]').val(defaultAppearance.damageColor);
    html.find('input[name="damageColorSelector"]').val(defaultAppearance.damageColor);
    html.find('input[name="healColor"]').val(defaultAppearance.healColor);
    html.find('input[name="healColorSelector"]').val(defaultAppearance.healColor);
    html.find('input[name="bold"]').prop('checked', defaultAppearance.bold);
    html.find('input[name="italic"]').prop('checked', defaultAppearance.italic);
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
    const fontList = this._getFontList();
    const foundFontKey = fontList.findIndex(
      (font) => font === name,
    );

    // If we couldn't find the font, find the "Other" option and return that
    // key.
    if (foundFontKey === -1) {
      return fontList.findIndex(
        (font) => font === this.fontOther,
      );
    }

    return foundFontKey;
  }

  /**
   * Get the font list to display in the configuration dialog.
   *
   * @return {Array}
   *
   * @private
   */
  _getFontList() {
    const fonts = CombatNumbersConfig.FONT_FAMILIES;
    fonts.push(this.fontOther);

    return fonts;
  }

  /**
   * Get the selected font by the selected key from the font list.
   *
   * If the user has chosen "other", we will find the font they typed in and
   * use that instead.
   *
   * @param {number} selectedFontKey
   *   The selected key of the font list.
   * @param formData {Object}
   *   The object of validated form data with which to update the object.
   *
   * @return {string}
   *
   * @private
   */
  _getSelectedFont(selectedFontKey, formData) {
    const fontList = this._getFontList();
    const selected = fontList[selectedFontKey];

    if (selected === this.fontOther) {
      // If for some reason the user hasn't typed in a custom font, just
      // use the default.
      if (!formData?.fontOther) {
        return CombatNumbersConfig.DEFAULT_APPEARANCE.font;
      }

      return String(formData.fontOther).trim();
    }

    return selected;
  }
}
