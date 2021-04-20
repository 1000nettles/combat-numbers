/**
 * A class for finding the HP Object path.
 *
 * This is the path used within the Lodash `get` method for object property
 * retrieval.
 *
 * A Foundry admin can adjust module settings to specify the path.
 *
 * No relation to the PathFinder game system ;)
 *
 * @see https://lodash.com/docs/4.17.15#get
 */
export default class HpObjectPathFinder {
  constructor(settings) {
    /**
     * The global Foundry Settings object.
     */
    this.settings = settings;

    /**
     * Our module name.
     *
     * @type {string}
     */
    this.moduleName = 'combat-numbers';

    /**
     * The path prefix which is present in every Foundry object path.
     *
     * @type {string}
     */
    this.prefix = 'data';

    /**
     * The default HP path within the Entity.
     *
     * @type {string}
     */
    this.defaultHpPath = 'attributes.hp.value';

    /**
     * The default temporary HP path within the Entity.
     *
     * @type {string}
     */
    this.defaultTempHpPath = 'attributes.hp.temp';
  }

  /**
   * Get the HP object path.
   *
   * @return {string}
   */
  getHpPath() {
    return this._get('hp');
  }

  /**
   * Get the temporary HP object path.
   *
   * @return {string}
   */
  getHpTempPath() {
    return this._get('temp');
  }

  /**
   * Get the full path dependant on the type specified.
   *
   * @param {string} type
   *   Must be one of "temp" or "hp".
   *
   * @return {string}
   *   The final, constructed HP object path for use within Lodash `get`.
   *
   * @private
   */
  _get(type) {
    let settingsKey;
    let pathDefault;

    if (type === 'temp') {
      settingsKey = 'temp_hp_object_path';
      pathDefault = this.defaultTempHpPath;
    } else {
      settingsKey = 'hp_object_path';
      pathDefault = this.defaultHpPath;
    }

    let value = this.settings.get(this.moduleName, settingsKey);

    if (!value) {
      value = pathDefault;
    }

    value = value.trim();
    value = `${this.prefix}.${value}`;

    return value;
  }
}
