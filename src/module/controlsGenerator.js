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
   * @param {Boolean} isGm
   */
  generate(controls, isGm) {
    if (!isGm) {
      return;
    }

    controls.push({
      name: 'combatNumbers',
      title: 'COMBATNUMBERS.CONTROLS.title',
      icon: 'fas fa-hashtag',
      layer: 'CombatNumberLayer',
      tools: [
        {
          name: 'visibility',
          title: 'COMBATNUMBERS.CONTROLS.TOOLS.visibility',
          icon: 'fas fa-eye-slash',
          active: !this.state.getIsVisible(),
          toggle: true,
          onClick: () => {
            this.state.setIsVisible(
              !this.state.getIsVisible(),
            );
          },
        },
      ],
    });
  }
}
