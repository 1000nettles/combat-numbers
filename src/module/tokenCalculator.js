import _ from 'lodash';

/**
 * Used for any Token-specific calculations.
 */
export default class TokenCalculator {

  constructor() {
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

  /**
   * Get the coordinates where the combat numbers should be rendered.
   *
   * @param scene
   *   The associated Scene object.
   * @param entity
   *   The original entity provided.
   *
   * @return {x, y}
   *   The X and Y coordinates of where we should render the combat numbers.
   */
  getCoordinates(scene, entity) {
    // In order to "center" our numbers, we'll need to get the in-between
    // based on the grid size.
    const gridSize = Number(scene.data.grid);
    const width = Number(entity.width) * gridSize;
    const height = Number(entity.height) * gridSize;

    let coords = {};

    // Take into account the width of the token - some may be larger than 1.
    coords.x = Math.round(
      entity.x + (width / 2)
    );
    coords.y = Math.round(
      entity.y + (height / 2)
    );

    return coords;
  }

}
