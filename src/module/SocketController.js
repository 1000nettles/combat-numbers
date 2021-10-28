/* eslint no-console: ["error", { allow: ['warn', 'log', 'debug'] }] */

/**
 * A controller for handling socket related operations for our module.
 */
export default class SocketController {
  /**
   * SocketController constructor.
   *
   * @param {Socket} socket
   *   The current Socket instance.
   * @param {User} user
   *   The current User instance.
   * @param {State} state
   *   The current User instance.
   * @param {Renderer} renderer
   *   The current Renderer instance.
   */
  constructor(socket, user, state, renderer) {
    /**
     * The current WebSocket instance.
     *
     * @type {WebSocket}
     */
    this.socket = socket;

    /**
     * The current WebSocket instance.
     *
     * @type {User}
     */
    this.user = user;

    /**
     * The current State instance.
     *
     * @type {State}
     */
    this.state = state;

    /**
     * The current Renderer.
     *
     * @type {Renderer}
     */
    this.renderer = renderer;

    /**
     * The name of our socket.
     *
     * @type {string}
     */
    this.socketName = 'module.combat-numbers';
  }

  /**
   * The types of emissions we can emit.
   *
   * @return {Object}
   */
  static get emitTypes() {
    return {
      TYPE_NUMERIC: 1,
      TYPE_MASKED: 2,
    };
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
   * @param {number} data
   *   The relevant data for the emission. Currently can be a numeric Combat
   *   Number amount, or a numeric enum value for the masked value.
   * @param {number} type
   *   The "emit type" to push. One of `SocketController.emitTypes` values.
   * @param {number} x
   *   The relevant X position for later rendering.
   * @param {number} y
   *   The relevant Y position for later rendering.
   * @param {string} sceneId
   *   The current scene ID.
   *
   * @return {Promise<void>}
   */
  async emit(data, type, x, y, sceneId) {
    if (this.state.getIsPauseBroadcast()) {
      return;
    }

    console.debug(`combat-numbers | Emitting to ${this.socketName}`);

    this.socket.emit(
      this.socketName,
      {
        data, type, x, y, sceneId,
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
   *
   * @private
   */
  async _listen() {
    this.socket.on(this.socketName, async (data) => {
      console.debug(`combat-numbers | Emission received on ${this.socketName}`);

      if (!this._shouldShowInScene(data.sceneId)) {
        return;
      }

      if (data.type === SocketController.emitTypes.TYPE_MASKED) {
        this.renderer.processMaskedAndRender(
          Number(data.data),
          Number(data.x),
          Number(data.y),
        );

        return;
      }

      this.renderer.processNumericAndRender(
        Number(data.data),
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
    this.socket.off(this.socketName);
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
    return (this.user.viewedScene === sceneId);
  }
}
