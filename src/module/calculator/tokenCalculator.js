import _ from 'lodash';
import AbstractCalculator from './abstractCalculator';

/**
 * Used for any Token-specific calculations.
 */
export default class TokenCalculator extends AbstractCalculator {
  constructor() {
    super();
    this.hpAttributeAccessor = 'actorData.data.attributes.hp.value';
  }

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
    const origHp = _.get(origEntity, this.hpAttributeAccessor, null);
    const newHp = _.get(changedEntity, this.hpAttributeAccessor, null);

    if (origHp === null || newHp === null) {
      throw new ReferenceError('Cannot find original or new HP attributes');
    }

    return (
      Number(origHp) - Number(newHp)
    );
  }
}
