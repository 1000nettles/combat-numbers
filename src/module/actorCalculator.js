import _ from 'lodash';

/**
 * Used for any Actor-specific HP calculations.
 */
export default class ActorCalculator {
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
    const changedEntityRawHpKey = 'data.attributes.hp.value';
    const changedEntityTempHpKey = 'data.attributes.hp.temp';

    // First, ensure that we even have any HP changes at all.
    if (
      !_.has(changedEntity, changedEntityRawHpKey)
      && !_.has(changedEntity, changedEntityTempHpKey)
    ) {
      throw new ReferenceError('Cannot find any changed HP attributes.');
    }

    // Secondly, find which part changed in the provided `changedEntity`
    // and return the difference.
    const rawHpChanged = _.has(changedEntity, changedEntityRawHpKey);

    if (rawHpChanged) {
      return Number(_.get(origEntity, 'data.data.attributes.hp.value', 0))
        - Number(_.get(changedEntity, changedEntityRawHpKey, 0));
    }

    // If we're not using raw HP, we're using temp HP instead.
    return Number(_.get(origEntity, 'data.data.attributes.hp.temp', 0))
      - Number(_.get(changedEntity, changedEntityTempHpKey, 0));
  }
}
