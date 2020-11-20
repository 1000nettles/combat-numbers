import _ from 'lodash';

/* eslint-disable no-unused-vars */

/**
 * Base class used for any Entity calculations.
 *
 * Must NOT be directly instantiated.
 *
 * @abstract
 */
export default class AbstractCalculator {
  constructor(hpObjectPathFinder) {
    this.hpObjectPathFinder = hpObjectPathFinder;
  }

  /**
   * Stub for `getHpDiff` method that all children must implement.
   *
   * @param origEntity
   * @param changedEntity
   */
  getHpDiff(origEntity, changedEntity) {
    throw new Error('Method \'getHpDiff()\' must be implemented.');
  }

  /**
   * Get the coordinates where the combat numbers should be rendered.
   *
   * @param scene
   *   The associated Scene object.
   * @param entity
   *   The original Token Entity provided.
   *
   * @return {x, y}
   *   The X and Y coordinates in an object of where we should render the combat
   *   numbers.
   */
  getCoordinates(scene, entity) {
    // Some tokens have a `center` attribute which helps us pinpoint their
    // exact middle. If it exists, just use it. Otherwise, let's do some
    // complex calculations...
    const center = _.get(entity, 'center', null);
    if (center !== null) {
      return this._calculateActorTokenCoords(entity);
    }

    return this._calculateRawTokenCoords(scene, entity);
  }

  /**
   * Calculate an Actor Token coordinates.
   *
   * Tokens attached to Actors should have a `center` attached to them, giving
   * us an easy way to calculate their coordinates.
   *
   * @param actorToken
   *   The Actor Token entity.
   *
   * @return {x, y}
   *   An object containing the X and Y coordinates.
   *
   * @private
   */
  _calculateActorTokenCoords(actorToken) {
    const center = _.get(actorToken, 'center');

    return {
      x: center.x,
      y: center.y,
    };
  }

  /**
   * Calculate a Token's coordinates based on their positioning and size.
   *
   * @param scene
   *   The current Scene.
   * @param token
   *   The Token Entity.
   *
   * @return {x, y}
   *   An object containing the X and Y coordinates.
   *
   * @private
   */
  _calculateRawTokenCoords(scene, token) {
    const coords = {};

    // In order to "center" our numbers, we'll need to get the in-between
    // based on the grid size.
    const gridSize = Number(scene.data.grid);
    const width = Number(token.width) * gridSize;
    const height = Number(token.height) * gridSize;

    // Take into account the width of the token - some may be larger than 1.
    coords.x = Math.round(
      token.x + (width / 2),
    );
    coords.y = Math.round(
      token.y + (height / 2),
    );

    return coords;
  }
}
