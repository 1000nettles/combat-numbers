/* global CanvasLayer */
/* global mergeObject */

/**
 * Module-specific layer which we can render combat numbers on.
 */
export default class CombatNumberLayer extends CanvasLayer {
  /**
   * Override the layer options to situate our layer.
   *
   * @return {*}
   */
  static get layerOptions() {
    return mergeObject(super.layerOptions, {
      canDragCreate: false,
      // This will set the combat numbers above the effects layer, but below
      // the controls layer.
      zIndex: 350,
    });
  }
}
