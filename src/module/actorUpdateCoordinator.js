/* eslint no-console: ["error", { allow: ['warn', 'log', 'debug'] }] */

/**
 * Coordinate any Actor updates from the Foundry Hook system.
 */
export default class ActorUpdateCoordinator {
  constructor(scenes, layer, socketController, calculator) {
    this.scenes = scenes;
    this.layer = layer;
    this.socketController = socketController;
    this.calculator = calculator;
  }

  /**
   * Coordinate the pre-update functionality.
   *
   * @param {Object} entity
   *   The entity object about to be updated.
   * @param {Object} delta
   *   The provided delta of the Actor data.
   * @param {Array} tokens
   *   The associated Tokens which need updating that are associated to the
   *   Actor.
   */
  coordinatePreUpdate(entity, delta, tokens) {
    let hpDiff;
    let currentScene;

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

    // Determine the current scene for emission later.
    for (const value of this.scenes) {
      if (value._view === true) {
        currentScene = value;
        break;
      }
    }

    if (!currentScene) {
      console.warn(
        'combat-numbers | Could not find current scene when rendering',
      );
      return;
    }

    tokens.forEach((token) => {
      const coords = this.calculator.getCoordinates(currentScene, token);
      this.layer.addCombatNumber(hpDiff, coords.x, coords.y);
      this.socketController.emit(hpDiff, coords.x, coords.y, currentScene._id);
    });
  }
}
