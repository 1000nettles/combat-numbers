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
   * Emit an event to our module's socket.
   *
   * Specifically, this will emit data to construct and show a combat number.
   *
   * @param {Number} number
   *   The relevant combat number value.
   * @param x
   *   The relevant X position for later rendering.
   * @param y
   *   The relevant Y position for later rendering.
   *
   * @return {Promise<void>}
   */
  async emit(number, x, y) {
    console.debug(`combat-numbers | Emitting to ${this.socketName}`);

    this.game.socket.emit(
      this.socketName,
      { number, x, y },
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

      this.layer.addCombatNumber(
        Number(data.number),
        Number(data.x),
        Number(data.y),
      );
    });
  }
}
