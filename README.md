# Combat Numbers

![Downloads](https://img.shields.io/github/downloads/1000nettles/combat-numbers/latest/combat-numbers-v0.3.1.zip?style=flat-square)
![Issues](https://img.shields.io/github/issues/1000nettles/combat-numbers?style=flat-square)
![MIT License](https://img.shields.io/github/license/1000nettles/combat-numbers?style=flat-square)

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G82ZNNS)

Combat Numbers is a FoundryVTT module which showcases bouncing combat text on tokens, similar to old-school JRPGs. There's still work to do, but it allows for fine-grained control on what is broadcast to other players when an actor's HP changes. 

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

Install the module, enable it for your world, and voila! Any token or actor which has an HP attribute that changes will have the relevant Combat Numbers applied to them.

The manifest URL for manual installation is: https://github.com/1000nettles/combat-numbers/releases/latest/download/module.json

## Canvas Layer Controls

![The Combat Numbers Canvas Layer Controls in the Toolbar](img/canvas_layer_controls.png)

Combat Numbers includes an additional Canvas Layer Control button in the toolbar, seen as "#". Currently, this is only available for GMs. When clicked, you are presented with two toggleable options:

* **Pause Broadcasting:** If toggled to ON, this will pause broadcasting any Combat Number displays to other players. For example, if you modified the HP of a monster, other players would not see the Combat Numbers display on that monster token. The player can edit their own HP however and still see and broadcast their own Combat Numbers.
* **Mask Combat Numbers Display:** If toggled to ON, this will mask the numeric display of any Combat Numbers that you see and broadcast to other players. Damage Combat Numbers will be seen as "Hit", and healing Combat Numbers will be seen as "Healed". Feel free to change the text of the masked Combat Numbers in the settings.

## Settings

* **Show Canvas Layer Controls:** If enabled, it will show the Canvas Layer Controls button in the toolbar. Defaults to enabled.  
* **Show Addition / Subtraction Modifiers:** If enabled, it will show a "-" in front of a Combat Number when dealing damage, or show a "+" when healing.
* **Mask Damage Text:** When masking is on, this is the text that will display for damage instead of the numeric value.
* **Mask Heal Text:** When masking is on, this is the text that will display for healing instead of the numeric value.
* **HP Object Path:** See the section below.
* **Temporary HP Object Path:** See the section below.

## Advanced Customization for Unsupported Systems

Currently, it's tough to support every popular system out there for Foundry. In the module settings, you can specify "HP Object Path" and "Temporary HP Object Path". Some Foundry VTT systems support HP in a slightly different object structure. If you know how Actor and Token entities structure their data for the HP and temp HP attributes, you can specify this here.

For example, the default HP Object Path for the DnD5e system is `attributes.hp.value`. For the Old-School Essentials system, it is `hp.value`.

[Please see our Wiki for details on already documented systems.](https://github.com/1000nettles/combat-numbers/wiki/Advanced-Customization-for-Unsupported-Systems)

## Language Support

* English
* 日本語 (Japanese) - thanks to `touge` for this localisation!
* Svenska (Swedish) - thanks to `xdy` for this localisation!

## Future Planned Features

* Ability to change font, including size and colour
* Different animations instead of just a basic bounce
* ...please suggest some!
