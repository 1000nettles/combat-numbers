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
    return this.isMask;
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
    this.isMask = !!value;
  }
}
