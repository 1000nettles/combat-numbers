# Combat Numbers

![Downloads](https://img.shields.io/github/downloads/1000nettles/combat-numbers/latest/combat-numbers-v0.2.0.zip)
![MIT License](https://img.shields.io/github/license/1000nettles/combat-numbers)

Combat Numbers is a FoundryVTT module which showcases bouncing combat numbers on tokens, similar to old-school JRPGs. It currently has very basic functionality:

* Show the numeric damage amount on a token when it takes damage
* Show the numeric healing amount on a token when it gains HP

## What Does This Look Like?

### Damage
![taking damage](img/preview1.gif)

### Healing 
![getting healed](img/preview2.gif)

Thanks to [Neutral Party](https://www.patreon.com/neutralparty) for the sample background map above.

## Supported Systems

* [DnD5e](https://foundryvtt.com/packages/dnd5e/) (Dungeons and Dragons 5th Edition)
* [D35E](https://foundryvtt.com/packages/D35E/) (3.5 SRD)
* [PF2e](https://foundryvtt.com/packages/pf2e/) (Pathfinder 2nd Edition)
* [PF1](https://foundryvtt.com/packages/pf1/) (Pathfinder 1)

If you have a system you would like to use but it is not in the list above, it may just work out of the box! If you're finding that it is not or misbehaving, read the section entitled "Advanced Customization for Unsupported Systems".

## Instructions

Install the module, enabled it for your world, and voila! Any token or actor which has an HP attribute that changes will have the relevant combat numbers applied to them.

The manifest URL for manual installation is: https://github.com/1000nettles/combat-numbers/releases/latest/download/module.json

## Settings

* **Show Addition / Subtraction Modifiers:** If enabled, it will show a "-" in front of a Combat Number when dealing damage, or show a "+" when healing.
* **HP Object Path:** See the section below.
* **Temporary HP Object Path:** See the section below.

## Advanced Customization for Unsupported Systems

Currently, it's tough to support every popular system out there for Foundry. In the module settings, you can specify "HP Object Path" and "Temporary HP Object Path". Some Foundry VTT systems support HP in a slightly different object structure. If you know how Actor and Token entities structure their data for the HP and temp HP attributes, you can specify this here.

For example, the default HP Object Path for the DnD5e system is `attributes.hp.value`. For the Old-School Essentials system, it is `hp.value`.

[Please see our Wiki for details on already documented systems.](https://github.com/1000nettles/combat-numbers/wiki/Advanced-Customization-for-Unsupported-Systems)

## Future Planned Features

* Ability to change font, including size and colour
* Different animations instead of just a basic bounce
* ...please suggest some!
