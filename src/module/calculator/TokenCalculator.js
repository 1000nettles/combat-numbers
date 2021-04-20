import _ from 'lodash';
import AbstractCalculator from './AbstractCalculator';

/**
 * Used for any Token-specific calculations.
 */
export default class TokenCalculator extends AbstractCalculator {
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
    const hpObjectPath = this._getOrigEntityHpPath();

    return (
      _.get(token, hpObjectPath, null) === null
    );
  }

  _getOrigEntityHpPath() {
    return `actorData.${this.hpObjectPathFinder.getHpPath()}`;
  }

  _getOrigEntityHpTempPath() {
    return `actorData.${this.hpObjectPathFinder.getHpTempPath()}`;
  }

  _getChangedEntityHpPath() {
    return `actorData.${this.hpObjectPathFinder.getHpPath()}`;
  }

  _getChangedEntityHpTempPath() {
    return `actorData.${this.hpObjectPathFinder.getHpTempPath()}`;
  }
}
