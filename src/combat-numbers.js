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
import HpObjectPathFinder from './module/hpObjectPathFinder';

/* eslint no-console: ["error", { allow: ['warn', 'log', 'debug'] }] */
/* global Hooks */
/* global game */
/* global canvas */

/**
 * Our SocketController instance for use within hooks.
 */
let socketController;

/**
 * Our ActorUpdateCoordinator instance for use within hooks.
 */
let actorUpdateCoordinator;

/**
 * Our TokenUpdateCoordinator instance for use within hooks.
 */
let tokenUpdateCoordinator;

/**
 * Our TokenCalculator instance for use within hooks.
 */
let tokenCalculator;

/**
 * Our ActorCalculator instance for use within hooks.
 */
let actorCalculator;

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
Hooks.on('canvasReady', async () => {
  const layer = new CombatNumberLayer();
  canvas.tokens.combatNumber = canvas.tokens.addChild(layer);

  // Ensure that we only have a single socket open for our module so we don't
  // clutter up open sockets when changing scenes (or, more specifically,
  // rendering new canvases.)
  if (socketController instanceof SocketController) {
    await socketController.deactivate();
  }

  socketController = new SocketController(game, layer);

  actorUpdateCoordinator = new ActorUpdateCoordinator();
  tokenUpdateCoordinator = new TokenUpdateCoordinator();

  const hpObjectPathFinder = new HpObjectPathFinder(game.settings);
  tokenCalculator = new TokenCalculator(hpObjectPathFinder);
  actorCalculator = new ActorCalculator(hpObjectPathFinder);

  actorUpdateCoordinator = new ActorUpdateCoordinator(
    game.scenes,
    layer,
    socketController,
    actorCalculator,
  );
  tokenUpdateCoordinator = new TokenUpdateCoordinator(
    layer,
    socketController,
    tokenCalculator,
  );

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
  if (tokenCalculator.shouldUseActorCoordination(entity)) {
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
