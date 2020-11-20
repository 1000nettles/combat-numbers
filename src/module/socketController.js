/* eslint no-console: ["error", { allow: ['warn', 'log', 'debug'] }] */

/**
 * A controller for handling socket related operations for our module.
 */
export default class SocketController {
  /**
   * SocketController constructor.
   *
   * @param {Game} game
   *   The current Game instance.
   * @param {CombatNumberLayer} layer
   *   The current CombatNumberLayer instance.
   */
  constructor(game, layer) {
    this.game = game;
    this.layer = layer;
    this.socketName = 'module.combat-numbers';
  }

  /**
   * Initialize any socket controller behaviour.
   *
   * @return {Promise<void>}
   */
  async init() {
    await this._listen();
  }

  /**
   * Deactivate the currently open socket.
   *
   * @return {Promise<void>}
   */
  async deactivate() {
    await this._removeListener();
  }

  /**
   * Emit an event to our module's socket.
   *
   * Specifically, this will emit data to construct and show a combat number.
   *
   * @param {number} number
   *   The relevant combat number value.
   * @param {number} x
   *   The relevant X position for later rendering.
   * @param {number} y
   *   The relevant Y position for later rendering.
   * @param {string} sceneId
   *   The current scene ID.
   *
   * @return {Promise<void>}
   */
  async emit(number, x, y, sceneId) {
    console.debug(`combat-numbers | Emitting to ${this.socketName}`);

    this.game.socket.emit(
      this.socketName,
      {
        number, x, y, sceneId,
      },
    );
  }

  /**
   * Listen for events on our module's socket.
   *
   * Any event received will subsequently add the relevant data to create a
   * new combat number.
   *
   * @return {Promise<void>}
   * @private
   */
  async _listen() {
    this.game.socket.on(this.socketName, async (data) => {
      console.debug(`combat-numbers | Emission received on ${this.socketName}`);

      if (!this._shouldShowInScene(data.sceneId)) {
        return;
      }

      this.layer.addCombatNumber(
        Number(data.number),
        Number(data.x),
        Number(data.y),
      );
    });
  }

  /**
   * Remove the associated socket listener.
   *
   * @return {Promise<void>}
   *
   * @private
   */
  async _removeListener() {
    this.game.socket.off(this.socketName);
  }

  /**
   * Determine if we should show the combat numbers on the provided scene ID.
   *
   * This checks if the current user is viewing the associated scene or not.
   *
   * @param {string} sceneId
   *   The provided scene ID that the action took place on.
   *
   * @return {boolean}
   *   If we should show in the provided scene or not.
   *
   * @private
   */
  _shouldShowInScene(sceneId) {
    return (this.game.user.viewedScene === sceneId);
  }
}
