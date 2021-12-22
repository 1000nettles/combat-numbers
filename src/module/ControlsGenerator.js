import State from './State';

/**
 * Facilitate the generation of the Controls for the toolbar.
 */
export default class ControlsGenerator {
  /**
   * @param {State} state
   *   The State dependency to inject.
   * @param {boolean} isModernVersion
   *   If we're dealing with Foundry v0.8.x or Foundry v0.9.x or not.
   */
  constructor(state, isModernVersion) {
    if (!(state instanceof State)) {
      throw new Error('Required `state` is not instance of State');
    }

    this.state = state;
    this.isModernVersion = isModernVersion;
  }

  /**
   * Generate the toolbar controls.
   *
   * @param {Object} controls
   *   The game's controls object.
   * @param {Boolean} isGm
   *   If the current user is a GM.
   * @param {Boolean} showControls
   *   If we should show the canvas layer controls for Combat Numbers.
   */
  generate(controls, isGm, showControls) {
    if (!isGm || !showControls) {
      return;
    }

    controls.push({
      name: 'combatNumbers',
      title: 'COMBATNUMBERS.CONTROLS.title',
      icon: 'fas fa-hashtag',
      layer: this.isModernVersion ? 'combatNumbers' : 'CombatNumberLayer',
      tools: [
        {
          name: 'pause-broadcast',
          title: 'COMBATNUMBERS.CONTROLS.TOOLS.pauseBroadcast',
          icon: 'fas fa-pause-circle',
          active: this.state.getIsPauseBroadcast(),
          toggle: true,
          onClick: () => {
            this.state.setIsPauseBroadcast(
              !this.state.getIsPauseBroadcast(),
            );
          },
        },
        {
          name: 'mask',
          title: 'COMBATNUMBERS.CONTROLS.TOOLS.mask',
          icon: 'fas fa-mask',
          active: this.state.getIsMask(),
          toggle: true,
          onClick: () => {
            this.state.setIsMask(
              !this.state.getIsMask(),
            );
          },
        },
      ],
    });
  }
}
