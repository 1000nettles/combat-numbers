import _ from 'lodash';

/**
 * Used for any Actor-specific calculations.
 */
export default class ActorCalculator {

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
    const origHp = _.get(origEntity, 'data.data.attributes.hp.value', null);
    const newHp = _.get(changedEntity, 'data.attributes.hp.value', null);

    if (origHp === null || newHp === null) {
      throw new ReferenceError('Cannot find original or new HP attributes');
    }

    return (
      Number(origHp) - Number(newHp)
    );
  }

}
