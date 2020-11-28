/**
 * A class to manage current state across the Combat Numbers module.
 */
export default class State {
  constructor() {
    this.isPauseBroadcast = false;
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
   * Set the Pause Broadcast state.
   *
   * @param {Boolean} value
   */
  setIsPauseBroadcast(value) {
    this.isPauseBroadcast = !!value;
  }
}
