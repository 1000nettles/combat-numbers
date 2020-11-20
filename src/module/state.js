/**
 * A class to manage current state across the Combat Numbers module.
 */
export default class State {
  constructor() {
    this.isVisible = true;
  }

  /**
   * If Combat Numbers should be visible / rendered.
   *
   * @return {boolean}
   */
  getIsVisible() {
    return this.isVisible;
  }

  /**
   * Set the visibility state.
   *
   * @param {Boolean} value
   */
  setIsVisible(value) {
    this.isVisible = !!value;
  }
}
