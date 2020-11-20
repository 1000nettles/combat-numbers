import AbstractCalculator from './abstractCalculator';

/**
 * Used for any Actor-specific HP calculations.
 */
export default class ActorCalculator extends AbstractCalculator {
  _getOrigEntityHpPath() {
    return `data.${this.hpObjectPathFinder.getHpPath()}`;
  }

  _getOrigEntityHpTempPath() {
    return `data.${this.hpObjectPathFinder.getHpTempPath()}`;
  }

  _getChangedEntityHpPath() {
    return this.hpObjectPathFinder.getHpPath();
  }

  _getChangedEntityHpTempPath() {
    return this.hpObjectPathFinder.getHpTempPath();
  }
}
