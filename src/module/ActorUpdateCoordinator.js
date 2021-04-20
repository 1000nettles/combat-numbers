/* eslint no-console: ["error", { allow: ['warn', 'log', 'debug'] }] */

import Renderer from './Renderer';
import SocketController from './SocketController';

/**
 * Coordinate any Actor updates from the Foundry Hook system.
 */
export default class ActorUpdateCoordinator {
  constructor(renderer, socketController, calculator, state) {
    this.renderer = renderer;
    this.socketController = socketController;
    this.calculator = calculator;
    this.state = state;
  }

  /**
   * Coordinate the pre-update functionality.
   *
   * @param {Entity} entity
   *   The entity object about to be updated.
   * @param {Object} delta
   *   The provided delta of the Actor data.
   * @param {Array} tokens
   *   The associated Tokens which need updating that are associated to the
   *   Actor.
   * @param {Scene} scene
   *   The current scene where the pre-update is taking place.
   */
  coordinatePreUpdate(entity, delta, tokens, scene) {
    let hpDiff;

    try {
      hpDiff = this.calculator.getHpDiff(entity, delta);
    } catch (e) {
      // We may just not have been changing the HP attribute, or potentially it
      // doesn't exist. Either way, let's not continue.
      return;
    }

    if (hpDiff === 0) {
      return;
    }

    tokens.forEach((token) => {
      const coords = this.calculator.getCoordinates(scene, token);

      if (this.state.getIsMask()) {
        const maskedType = (hpDiff < 0)
          ? Renderer.maskedTypes.TYPE_DAMAGE
          : Renderer.maskedTypes.TYPE_HEAL;

        this.renderer.processMaskedAndRender(maskedType, coords.x, coords.y);
        this.socketController.emit(
          maskedType,
          SocketController.emitTypes.TYPE_MASKED,
          coords.x,
          coords.y,
          scene._id,
        );

        return;
      }

      this.renderer.processNumericAndRender(hpDiff, coords.x, coords.y);
      this.socketController.emit(
        hpDiff,
        SocketController.emitTypes.TYPE_NUMERIC,
        coords.x,
        coords.y,
        scene._id,
      );
    });
  }
}
