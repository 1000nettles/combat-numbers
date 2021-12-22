import _ from 'lodash';
import Renderer from './Renderer';
import SocketController from './SocketController';

/**
 * Coordinate any Token updates from the Foundry Hook system.
 */
export default class TokenUpdateCoordinator {
  constructor(renderer, socketController, calculator, state, masking) {
    this.renderer = renderer;
    this.socketController = socketController;
    this.calculator = calculator;
    this.state = state;
    this.masking = masking;
    this.queuedUpdates = new Map();
  }

  /**
   * Coordinate the pre-update functionality.
   *
   * @param {Object} entity
   *   The entity object about to be updated.
   */
  coordinatePreUpdate(entity) {
    const entityClone = _.cloneDeep(entity);

    // Store the update data for later when we see a full update.
    this.queuedUpdates.set(
      entityClone.id,
      entityClone,
    );
  }

  /**
   * Coordinate a token being updated.
   *
   * @param {Scene} scene
   *   The provided associated Scene object.
   * @param {Object} delta
   *   The provided delta of the Token data.
   */
  coordinateUpdate(scene, delta) {
    let hpDiff;
    const entityId = String(delta.id);

    // Let's find the previously stored delta.
    const entity = this.queuedUpdates.get(delta.id);

    if (!entity) {
      // We may not have created an update queued previously, due to a
      // lightweight update or something else. Just cleanup and exit.
      this._cleanQueuedUpdates(entityId);
      return;
    }

    try {
      hpDiff = this.calculator.getHpDiff(entity, delta);
    } catch (e) {
      // We may just not have been changing the HP attribute, or potentially it
      // doesn't exist. Either way, let's not continue.
      this._cleanQueuedUpdates(entityId);
      return;
    }

    if (hpDiff === 0) {
      this._cleanQueuedUpdates(entityId);
      return;
    }

    const coords = this.calculator.getCoordinates(scene, entity);

    if (this.masking.shouldMaskToken(entity)) {
      const maskedType = (hpDiff < 0)
        ? Renderer.maskedTypes.TYPE_DAMAGE
        : Renderer.maskedTypes.TYPE_HEAL;

      this.renderer.processMaskedAndRender(maskedType, coords.x, coords.y);
      this.socketController.emit(
        maskedType,
        SocketController.emitTypes.TYPE_MASKED,
        coords.x,
        coords.y,
        scene.id,
      );
    } else {
      this.renderer.processNumericAndRender(hpDiff, coords.x, coords.y);
      this.socketController.emit(
        hpDiff,
        SocketController.emitTypes.TYPE_NUMERIC,
        coords.x,
        coords.y,
        scene.id,
      );
    }

    this._cleanQueuedUpdates(entityId);
  }

  /**
   * Clean up any queued updates pertaining to the provided Entity ID.
   *
   * @param entityId
   *   The associated Entity ID with the queued update.
   *
   * @private
   */
  _cleanQueuedUpdates(entityId) {
    this.queuedUpdates.delete(entityId);
  }
}
