import _ from 'lodash';
import AbstractCalculator from './abstractCalculator';

/**
 * Used for any Actor-specific HP calculations.
 */
export default class ActorCalculator extends AbstractCalculator {
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
    const changedEntityRawHpKey = this.hpObjectPathFinder.getHpPath();
    const changedEntityTempHpKey = this.hpObjectPathFinder.getHpTempPath();

    // Within original Actor entities, the original entity is prefixed by
    // another "data".
    const origEntityRawHpKey = `data.${changedEntityRawHpKey}`;
    const origEntityTempHpKey = `data.${changedEntityTempHpKey}`;

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
      return Number(_.get(origEntity, origEntityRawHpKey, 0))
        - Number(_.get(changedEntity, changedEntityRawHpKey, 0));
    }

    // If we're not using raw HP, we're using temp HP instead.
    return Number(_.get(origEntity, origEntityTempHpKey, 0))
      - Number(_.get(changedEntity, changedEntityTempHpKey, 0));
  }
}
