/**
 * This is your JavaScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: 1000Nettles
 * Content License: MIT
 * Software License: MIT
 */

import _ from 'lodash';
import registerSettings from './module/settings';
import CombatNumberLayer from './module/combatNumberLayer';
import Renderer from './module/renderer';
import SocketController from './module/socketController';
import TokenUpdateCoordinator from './module/tokenUpdateCoordinator';
import ActorUpdateCoordinator from './module/actorUpdateCoordinator';
import TokenCalculator from './module/calculator/tokenCalculator';
import ActorCalculator from './module/calculator/actorCalculator';
import HpObjectPathFinder from './module/hpObjectPathFinder';
import ControlsGenerator from './module/controlsGenerator';
import State from './module/state';

/* eslint no-console: ['error', { allow: ['warn', 'log', 'debug'] }] */
/* global Canvas */
/* global Hooks */
/* global game */
/* global canvas */
/* global mergeObject */

/**
 * Our Renderer instance for use within hooks.
 */
let renderer;

/**
 * Our SocketController instance for use within hooks.
 */
let socketController;

/**
 * Our ActorUpdateCoordinator instance for use within hooks.
 */
let actorUpdateCoordinator;

/**
 * Our TokenUpdastate.test.jsteCoordinator instance for use within hooks.
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

/**
 * Our State instance for use within hooks.
 */
let state;

/**
 * If our current Foundry's Canvas class is using statically stored layers.
 *
 * This is a large change between Foundry versions so we depend on this for
 * how we register our CombatNumbersLayer.
 *
 * @type {boolean}
 */
let isUsingStaticLayers = true;

/**
 * The name of our module.
 *
 * @type {string}
 */
const moduleName = 'combat-numbers';

/**
 * Register the Combat Numbers layer into the Canvas' static layers.
 */
function registerStaticLayer() {
  const layers = mergeObject(Canvas.layers, {
    combatNumbers: CombatNumberLayer,
  });
  Object.defineProperty(Canvas, 'layers', {
    get: () => layers,
  });
}

/**
 * Find the currently viewed Scene for the User.
 *
 * @return {Scene|null}
 */
function findViewedScene() {
  let currentScene = null;

  // Determine the current scene for emission later.
  for (const value of game.scenes) {
    if (value._view === true) {
      currentScene = value;
      break;
    }
  }

  return currentScene;
}

/* ------------------------------------ */
/* Initialize module                    */
/* ------------------------------------ */
Hooks.once('init', async () => {
  console.log('combat-numbers | Initializing combat-numbers');

  // This is important for later layer retrieval and manipulation.
  isUsingStaticLayers = !_.isNil(Canvas.layers);

  // Register custom module settings.
  registerSettings();

  if (isUsingStaticLayers) {
    registerStaticLayer();
  }

  state = new State();
});

Hooks.on('canvasInit', (canvas) => {
  // We only hook into this for non-static layer adding.
  if (isUsingStaticLayers) {
    return;
  }

  /* eslint-disable-next-line no-param-reassign */
  canvas.combatNumbers = canvas.stage.addChildAt(new CombatNumberLayer(), 12);
});

/**
 * Add a new layer to the canvas.
 *
 * This happens every time a scene change takes place, hence the `on`.
 */
Hooks.on('canvasReady', async () => {
  const layer = canvas.layers.find(
    (targetLayer) => targetLayer instanceof CombatNumberLayer,
  );

  renderer = new Renderer(layer, game.settings, state);

  // Ensure that we only have a single socket open for our module so we don't
  // clutter up open sockets when changing scenes (or, more specifically,
  // rendering new canvases.)
  if (socketController instanceof SocketController) {
    await socketController.deactivate();
  }

  socketController = new SocketController(game.socket, game.user, state, renderer);

  const hpObjectPathFinder = new HpObjectPathFinder(game.settings);
  tokenCalculator = new TokenCalculator(hpObjectPathFinder);
  actorCalculator = new ActorCalculator(hpObjectPathFinder);

  actorUpdateCoordinator = new ActorUpdateCoordinator(
    renderer,
    socketController,
    actorCalculator,
    state,
  );
  tokenUpdateCoordinator = new TokenUpdateCoordinator(
    renderer,
    socketController,
    tokenCalculator,
    state,
  );

  await socketController.init();

  // Set the initial default of the masking setting.
  const maskDefault = !!(game.settings.get(
    moduleName,
    'mask_default',
  ));
  state.setIsMask(maskDefault);
});

Hooks.on('preUpdateActor', (entity, delta, audit) => {
  if (!_.get(audit, 'diff')) {
    return;
  }

  const viewedScene = findViewedScene();
  if (!viewedScene) {
    return;
  }

  actorUpdateCoordinator.coordinatePreUpdate(
    entity,
    delta,
    entity.getActiveTokens(),
    viewedScene,
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

    // If we don't even have the appropriate data to use, just exit. This
    // could happen if a "lightweight" update has taken place, and someone is
    // just updating specific Token attributes.
    if (actorId === null || actorData === null) {
      return;
    }

    const origActor = game.actors.get(actorId);

    if (!origActor) {
      console.warn('combat-numbers | Cannot find associated actor to token');
      return;
    }

    const viewedScene = findViewedScene();
    if (!viewedScene) {
      return;
    }

    actorUpdateCoordinator.coordinatePreUpdate(
      origActor,
      actorData,
      [entity],
      viewedScene,
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

Hooks.on('getSceneControlButtons', (controls) => {
  const showControls = !!(game.settings.get(
    moduleName,
    'show_controls',
  ));

  const controlsGenerator = new ControlsGenerator(state);
  controlsGenerator.generate(
    controls,
    game.user.isGM,
    showControls,
  );
});
