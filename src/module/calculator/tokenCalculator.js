import _ from 'lodash';
import AbstractCalculator from './abstractCalculator';

/**
 * Used for any Token-specific calculations.
 */
export default class TokenCalculator extends AbstractCalculator {
  /**
   * Get the differences in HP from the original and changed entities.
   * @param origEntity
   *   The original entity provided, before any changes have been made.
   * @param changedEntity
   *   The changed entity, consisting of only the properties that have changed.
   *
   * @return {number}
   *   The numerical HP difference.
   */
  getHpDiff(origEntity, changedEntity) {
    // Our HP object path for tokens is prefixed by "actorData" on this
    // change.
    const hpObjectPath = this._getHpObjectPath();

    const origHp = _.get(origEntity, hpObjectPath, null);
    const newHp = _.get(changedEntity, hpObjectPath, null);

    if (origHp === null || newHp === null) {
      throw new ReferenceError('Cannot find original or new HP attributes');
    }

    return (
      Number(origHp) - Number(newHp)
    );
  }

  /**
   * Determine if the relevant HP data does not exist within the Token entity.
   *
   * If not, we should be coordinating using the relevant Actor instead.
   *
   * @param token
   *   The Token Entity to check.
   *
   * @return {boolean}
   *   If we should use Actor coordination instead.
   */
  shouldUseActorCoordination(token) {
    const hpObjectPath = this._getHpObjectPath();

    return (
      _.get(token, hpObjectPath, null) === null
    );
  }

  /**
   * Get the HP object path for finding the HP property on an Entity.
   *
   * @return {string}
   *   The HP object path.
   *
   * @private
   */
  _getHpObjectPath() {
    return `actorData.${this.hpObjectPathFinder.getHpPath()}`;
  }
}
