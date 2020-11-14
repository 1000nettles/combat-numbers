/**
 * This is your JavaScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: 1000Nettles
 * Content License: MIT
 * Software License: MIT
 */

// Import JavaScript modules
import _ from 'lodash';
import registerSettings from './module/settings';
import CombatNumberLayer from './module/combatNumberLayer';
import ActorCalculator from './module/actorCalculator';
import TokenCalculator from './module/tokenCalculator';
import SocketController from './module/socketController';

/* eslint no-console: ["error", { allow: ['warn', 'log', 'debug'] }] */
/* global Hooks */
/* global game */
/* global canvas */

/**
 * Our SocketController instance for use within hooks.
 */
let socketController;

/**
 * Our CombatNumberLayer instance for use within hooks.
 */
let layer;

/* ------------------------------------ */
/* Initialize module                    */
/* ------------------------------------ */
Hooks.once('init', async () => {
  console.log('combat-numbers | Initializing combat-numbers');

  // Register custom module settings
  registerSettings();
});

/**
 * Add a new layer to the canvas.
 *
 * This happens every time a scene change takes place, hence the `on`.
 */
Hooks.on('canvasReady', () => {
  layer = new CombatNumberLayer();
  canvas.tokens.combatNumber = canvas.tokens.addChild(layer);

  socketController = new SocketController(game, layer);
});

Hooks.on('ready', async () => {
  await socketController.init();
});

/**
 * Capture the Actor's HP and show the combat number on their token.
 */
Hooks.on('preUpdateActor', (entity, options, audit) => {
  if (
    !_.get(audit, 'diff')
  ) {
    return;
  }

  let hpDiff;
  const actorCalculator = new ActorCalculator();

  try {
    hpDiff = actorCalculator.getHpDiff(entity, options);
  } catch (e) {
    // We may just not have been changing the HP attribute, or potentially it
    // doesn't exist. Either way, let's not continue.
    return;
  }

  if (hpDiff === 0) {
    return;
  }

  const tokens = entity.getActiveTokens();

  tokens.forEach((token) => {
    const { center } = token;
    canvas.tokens.combatNumber.addCombatNumber(hpDiff, center.x, center.y);
    socketController.emit(hpDiff, center.x, center.y);
  });
});

/**
 * Capture the Token's HP and show the combat number on them.
 */
Hooks.on('preUpdateToken', (scene, entity, options, audit) => {
  if (
    !_.get(audit, 'diff')
    || _.get(entity, 'hidden')
  ) {
    return;
  }

  let hpDiff;
  const tokenCalculator = new TokenCalculator();

  try {
    hpDiff = tokenCalculator.getHpDiff(entity, options);
  } catch (e) {
    // We may just not have been changing the HP attribute, or potentially it
    // doesn't exist. Either way, let's not continue.
    return;
  }

  if (hpDiff === 0) {
    return;
  }

  const coords = tokenCalculator.getCoordinates(scene, entity);

  canvas.tokens.combatNumber.addCombatNumber(hpDiff, coords.x, coords.y);
  socketController.emit(hpDiff, coords.x, coords.y);
});
