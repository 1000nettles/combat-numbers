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
import SocketController from './module/socketController';
import TokenUpdateCoordinator from './module/tokenUpdateCoordinator';
import ActorUpdateCoordinator from './module/actorUpdateCoordinator';
import TokenCalculator from './module/calculator/tokenCalculator';
import ActorCalculator from './module/calculator/actorCalculator';

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

/**
 * Our ActorUpdateCoordinator instance for use within hooks.
 */
let actorUpdateCoordinator;

/**
 * Our TokenUpdateCoordinator instance for use within hooks.
 */
let tokenUpdateCoordinator;

/* ------------------------------------ */
/* Initialize module                    */
/* ------------------------------------ */
Hooks.once('init', async () => {
  console.log('combat-numbers | Initializing combat-numbers');

  // Register custom module settings.
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
  actorUpdateCoordinator = new ActorUpdateCoordinator();
  tokenUpdateCoordinator = new TokenUpdateCoordinator();
  actorUpdateCoordinator = new ActorUpdateCoordinator(
    game.scenes,
    layer,
    socketController,
    new ActorCalculator(),
  );
  tokenUpdateCoordinator = new TokenUpdateCoordinator(
    layer,
    socketController,
    new TokenCalculator(),
  );
});

Hooks.on('ready', async () => {
  await socketController.init();
});

Hooks.on('preUpdateActor', (entity, delta, audit) => {
  if (
    !_.get(audit, 'diff')
  ) {
    return;
  }

  actorUpdateCoordinator.coordinatePreUpdate(
    entity,
    delta,
    entity.getActiveTokens(),
  );
});

Hooks.on('preUpdateToken', (scene, entity, delta, audit) => {
  if (
    !_.get(audit, 'diff')
    || _.get(entity, 'hidden')
  ) {
    return;
  }

  // If the entity does not contain the specific data we need, let's grab
  // it from the `game` object's relevant actor. This can take place if a token
  // has been dragged to the scene and has not been populated yet with all its
  // data in some systems. (For example, PF2E.)
  if (tokenUpdateCoordinator.shouldUseActorCoordination(entity)) {
    const actorId = _.get(entity, 'actorId', null);
    const actorData = _.get(delta, 'actorData', null);

    if (actorId === null || actorData === null) {
      console.warn('combat-numbers | Malformed token and delta data in `preUpdateToken` hook');
      return;
    }

    const origActor = game.actors.get(actorId);

    if (!origActor) {
      console.warn('combat-numbers | Cannot find associated actor to token');
      return;
    }

    actorUpdateCoordinator.coordinatePreUpdate(
      origActor,
      actorData,
      [entity],
    );

    return;
  }

  tokenUpdateCoordinator.coordinatePreUpdate(entity);
});

Hooks.on('updateToken', (scene, entity, delta, audit) => {
  if (
    !_.get(audit, 'diff')
    || _.get(entity, 'hidden')
  ) {
    return;
  }

  tokenUpdateCoordinator.coordinateUpdate(scene, delta);
});
