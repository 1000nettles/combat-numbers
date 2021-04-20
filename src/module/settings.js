/* global game */
/* global window */

import CombatNumbersConfig from './CombatNumbersConfig';

export default () => {
  // The Appearance settings menu and settings entry...
  game.settings.registerMenu('combat-numbers', 'combat-numbers', {
    name: 'COMBATNUMBERS.SETTINGS.configName',
    label: 'COMBATNUMBERS.SETTINGS.configTitle',
    hint: 'COMBATNUMBERS.SETTINGS.configHint',
    icon: 'fas fa-palette',
    type: CombatNumbersConfig,
    restricted: true,
  });
  game.settings.register('combat-numbers', 'appearance', {
    name: 'Appearance',
    hint: 'The appearance settings, all contained within an object',
    scope: 'world',
    config: false,
    default: CombatNumbersConfig.DEFAULT_APPEARANCE,
    type: Object,
    onChange: () => {
      // Wait until the config dialog window has closed, then refresh the
      // application.
      setTimeout(() => {
        window.location.reload();
      }, 200);
    },
  });

  // All other normal settings...
  game.settings.register('combat-numbers', 'wait_time', {
    name: game.i18n.localize('COMBATNUMBERS.SETTINGS.waitTimeName'),
    hint: game.i18n.localize('COMBATNUMBERS.SETTINGS.waitTimeHint'),
    scope: 'world',
    config: true,
    range: { min: 0, max: 10, step: 0.5 },
    default: 0,
    type: Number,
  });
  game.settings.register('combat-numbers', 'linger_time', {
    name: game.i18n.localize('COMBATNUMBERS.SETTINGS.lingerTimeName'),
    hint: game.i18n.localize('COMBATNUMBERS.SETTINGS.lingerTimeHint'),
    scope: 'world',
    config: true,
    range: { min: 0, max: 10, step: 0.5 },
    default: 1.5,
    type: Number,
  });
  game.settings.register('combat-numbers', 'show_controls', {
    name: game.i18n.localize('COMBATNUMBERS.SETTINGS.showControlsName'),
    hint: game.i18n.localize('COMBATNUMBERS.SETTINGS.showControlsHint'),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    onChange: () => window.location.reload(),
  });
  game.settings.register('combat-numbers', 'show_modifiers', {
    name: game.i18n.localize('COMBATNUMBERS.SETTINGS.showModifiersName'),
    hint: game.i18n.localize('COMBATNUMBERS.SETTINGS.showModifiersHint'),
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('combat-numbers', 'mask_default', {
    name: game.i18n.localize('COMBATNUMBERS.SETTINGS.maskDefaultName'),
    hint: game.i18n.localize('COMBATNUMBERS.SETTINGS.maskDefaultHint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('combat-numbers', 'mask_damage', {
    name: game.i18n.localize('COMBATNUMBERS.SETTINGS.maskDamage'),
    hint: game.i18n.localize('COMBATNUMBERS.SETTINGS.maskDamageHint'),
    scope: 'client',
    config: true,
    default: 'Hit',
    type: String,
  });
  game.settings.register('combat-numbers', 'mask_heal', {
    name: game.i18n.localize('COMBATNUMBERS.SETTINGS.maskHeal'),
    hint: game.i18n.localize('COMBATNUMBERS.SETTINGS.maskHealHint'),
    scope: 'client',
    config: true,
    default: 'Healed',
    type: String,
  });
  game.settings.register('combat-numbers', 'hp_object_path', {
    name: game.i18n.localize('COMBATNUMBERS.SETTINGS.hpObjectPathName'),
    hint: game.i18n.localize('COMBATNUMBERS.SETTINGS.hpObjectPathHint'),
    scope: 'world',
    config: true,
    default: '',
    type: String,
  });
  game.settings.register('combat-numbers', 'temp_hp_object_path', {
    name: game.i18n.localize('COMBATNUMBERS.SETTINGS.tempHpObjectPathName'),
    hint: game.i18n.localize('COMBATNUMBERS.SETTINGS.tempHpObjectPathHint'),
    scope: 'world',
    config: true,
    default: '',
    type: String,
  });
};
