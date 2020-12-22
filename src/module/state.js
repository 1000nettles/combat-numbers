/**
 * A class to manage current state across the Combat Numbers module.
 */
export default class State {
  constructor() {
    this.isPauseBroadcast = false;
    this.isMask = false;
  }

  /**
   * If Combat Numbers should pause broadcasting combat numbers to other users.
   *
   * @return {boolean}
   */
  getIsPauseBroadcast() {
    return this.isPauseBroadcast;
  }

  /**
   * If Combat Numbers should mask combat numbers to everyone.
   *
   * @return {boolean}
   */
  getIsMask() {
    return game.settings.get('combat-numbers', 'do_masking');
  }

  /**
   * Set the Pause Broadcast state.
   *
   * @param {Boolean} value
   */
  setIsPauseBroadcast(value) {
    this.isPauseBroadcast = !!value;
  }

  /**
   * Set the Mask state.
   *
   * @param {Boolean} value
   */
  setIsMask(value) {
    game.settings.set('combat-numbers', 'do_masking', !!value);
  }
}
