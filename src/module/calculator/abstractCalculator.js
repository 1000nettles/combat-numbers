import _ from 'lodash';
import HpObjectPathFinder from '../hpObjectPathFinder';

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
    if (!(hpObjectPathFinder instanceof HpObjectPathFinder)) {
      throw new Error('Required `hpObjectPathFinder` is not instance of HpObjectPathFinder');
    }

    this.hpObjectPathFinder = hpObjectPathFinder;
  }

  /**
   * Get the differences in HP from the original and changed entities.
   *
   * Not only will this take into consideration the raw HP amounts, but also
   * the temporary HP amounts.
   *
   * @param origEntity
   *   The original entity provided, before any changes have been made.
   * @param changedEntity
   *   The changed entity, consisting of only the properties that have changed.
   *
   * @return {number}
   *   The numerical HP difference.
   */
  getHpDiff(origEntity, changedEntity) {
    const changedEntityHpPath = this._getChangedEntityHpPath();
    const changedEntityTempHpPath = this._getChangedEntityHpTempPath();

    // Within original Actor entities, the original entity is prefixed by
    // another "data".
    const origEntityHpPath = this._getOrigEntityHpPath();
    const origEntityHpTempPath = this._getOrigEntityHpTempPath();

    // First, ensure that we even have any HP changes at all.
    if (
      !_.has(changedEntity, changedEntityHpPath)
      && !_.has(changedEntity, changedEntityTempHpPath)
    ) {
      throw new ReferenceError('Cannot find any changed HP or HP temp attributes.');
    }

    // Secondly, find which part changed in the provided `changedEntity`
    // and return the difference.
    const rawHpChanged = _.has(changedEntity, changedEntityHpPath);

    if (rawHpChanged) {
      return Number(_.get(changedEntity, changedEntityHpPath, 0))
        - Number(_.get(origEntity, origEntityHpPath, 0));
    }

    // If we're not using raw HP, we're using temp HP instead.
    return Number(_.get(changedEntity, changedEntityTempHpPath, 0))
      - Number(_.get(origEntity, origEntityHpTempPath, 0));
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

  /**
   * Get the HP object path for extracting from an "original entity".
   *
   * @private
   */
  _getOrigEntityHpPath() {
    throw new Error('Child class must implement `_getOrigEntityHpPath`');
  }

  /**
   * Get the temporary HP object path for extracting from an "original entity".
   *
   * @private
   */
  _getOrigEntityHpTempPath() {
    throw new Error('Child class must implement `_getOrigEntityHpTempPath`');
  }

  /**
   * Get the HP object path for extracting from a "changed entity".
   *
   * @private
   */
  _getChangedEntityHpPath() {
    throw new Error('Child class must implement `_getChangedEntityHpPath`');
  }

  /**
   * Get the temporary HP object path for extracting from a "changed entity".
   *
   * @private
   */
  _getChangedEntityHpTempPath() {
    throw new Error('Child class must implement `_getChangedEntityHpTempPath`');
  }
}
