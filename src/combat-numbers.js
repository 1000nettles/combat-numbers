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
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import CombatNumberLayer from './module/combatNumberLayer.js';
import ActorCalculator from './module/actorCalculator.js';
import TokenCalculator from './module/tokenCalculator.js';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function() {
	console.log('combat-numbers | Initializing combat-numbers');

	// Assign custom classes and constants here
	
	// Register custom module settings
	registerSettings();
	
	// Preload Handlebars templates
	await preloadTemplates();

	// Register custom sheets (if any)
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
/*Hooks.once('setup', function() {
	// Do anything after initialization but before
	// ready
});*/

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
/*Hooks.once('ready', function() {
	// Do anything once the module is ready
});*/

/**
 * Add a new layer to the canvas.
 *
 * This happens every time a scene change takes place, hence the `on`.
 */
Hooks.on('canvasReady', () => {
	canvas.tokens.combatNumber = canvas.tokens.addChild(new CombatNumberLayer());
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

	const tokens = entity.getActiveTokens();

	tokens.forEach(token => {
		const center = token.center;
		canvas.tokens.combatNumber.addCombatNumber(hpDiff, center.x, center.y);
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

	const coords = tokenCalculator.getCoordinates(scene, entity);

	canvas.tokens.combatNumber.addCombatNumber(hpDiff, coords.x, coords.y);
});