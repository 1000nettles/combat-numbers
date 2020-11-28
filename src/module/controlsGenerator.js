import State from './state';

/**
 * Facilitate the generation of the Controls for the toolbar.
 */
export default class ControlsGenerator {
  constructor(state) {
    if (!(state instanceof State)) {
      throw new Error('Required `state` is not instance of State');
    }

    this.state = state;
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
      layer: 'CombatNumberLayer',
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
      ],
    });
  }
}
