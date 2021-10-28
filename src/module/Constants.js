/**
 * A class storing our module's constants.
 */
export default class Constants {
  /**
   * The name and identifier of the module.
   *
   * @return {string}
   */
  static get MODULE_NAME() {
    return 'combat-numbers';
  }

  /**
   * The possible token disposition choices for masking Combat Numbers display.
   *
   * @return {object}
   */
  static get MASKED_DISPOSITION_CHOICES() {
    return {
      HOSTILE: 1,
      HOSTILE_NEUTRAL: 2,
      HOSTILE_NETURAL_FRIENDLY: 3,
    };
  }
}
