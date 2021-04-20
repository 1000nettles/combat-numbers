/**
 * A class whose instance is meant to be accessed externally as an API.
 */
export default class CombatNumbersApi {
  constructor(state) {
    /**
     * The injected State instance dependency.
     */
    this.state = state;
  }

  /**
   * Set the is pause broadcast value.
   *
   * @param {boolean} value
   */
  setIsPauseBroadcast(value) {
    this.state.setIsPauseBroadcast(!!value);
  }

  /**
   * Set the is mask value.
   *
   * @param {boolean} value
   */
  setIsMask(value) {
    this.state.setIsMask(!!value);
  }
}
