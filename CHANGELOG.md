# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.1.0] - 2021-04-19

### Added

- Additional translations for Swedish and Japanese (thanks to touge and xdy for these localisations!)
- Added API for adjusting Combat Numbers canvas layer controls (useful for programming macros)
- Added the "wait time" setting, to allow GMs to adjust how long until Combat Numbers are rendered on the screen after an HP change
- Added the "linger time" setting, to allow GMs to adjust how long the Combat Numbers linger on the canvas for after they're displayed

### Changed

- Minor thing with JS class casing renames

## [1.0.0] - 2021-01-09

### Added

- Appearance configuration settings. Allows a GM to customize the font family, font size, bold, italics, fill colors, stoke color, stroke thickness, drop shadow color, and drop shadow alpha values of the rendered Combat Numbers
- Scale rendered Combat Numbers to grid size while taking into account the selected font size configuration

## [0.3.2] - 2021-01-03

### Added

- Mask default setting - allow for GMs to set the masking toggle to default to ON or OFF in the Canvas Layer Controls tools (thanks to TPNils for the initial approach on this!)
- Swedish localisation (thanks to xdy for the localisation!)

## [0.3.1] - 2020-12-19

### Added

- Support for FoundryVTT v0.7.9
- Japanese localisation (thanks to touge for the localisation!)

## [0.3.0] - 2020-12-05

### Added

- Add support for FoundryVTT v0.7.8
- Add support for hiding the Combat Number Canvas Layer Controls button in the toolbar
- Allow GM to pause any broadcasting of HP modifications as Combat Numbers to players (this replaces the previous "Visibility" toggle-able option.)
- Allow GM to "mask" the broadcasted Combat Numbers to players
- Additionally, allow players to change the display text of the masked Combat Numbers in Settings

## [0.2.1] - 2020-11-26

### Changed

- Fix non-static layers on the canvas not being supported. This was how layers were populated to the canvas in FoundryVTT v0.7.5, hence it not working specifically in that version

## [0.2.0] - 2020-11-20

### Added

- A new button in the controls toolbar allowing a GM to show / hide the visibility of Combat Numbers. If hidden, the Combat Numbers will not be rendered on the GM's canvas, nor the other players'
- Settings entitled "HP Object Path" and "Temporary HP Object Path" which allows Combat Numbers to be used by any game system, assuming you know the object path to the HP attributes. More explanation exists in the README and settings page in Module Settings.
- A setting entitled "Show Addition / Subtraction Modifiers" which shows a "-" in front of a Combat Number when damage is dealt, or shows a "+" when healed. This is a per-player basis, not scoped to the entire game itself
- Increased visibility on the green healing colour
- Added support for Pathfinder 1 and 3.5 SRD out-of-the-box

### Changed

- Fixed bug where scene changes were causing players' Combat Numbers to not render anymore
- Temporary HP is taken into account for tokens
- No more ominous "Malformed token and delta data in preUpdateToken hook" bug" message when lightweight updating tokens

## [0.1.4] - 2020-11-14

### Added

- Add Pathfinder 2nd Edition support

## [0.1.3] - 2020-11-14

### Changed

- Fix bug where players / users could not see Combat Numbers
- Support FoundryVTT version v0.7.7

## [0.1.2] - 2020-11-12

### Added

- Add the functionality of taking into account temporary HP, and damage numbers working when changing scenes

## [0.1.1] - 2020-11-12

### Added

- Ensure that linking to the repository's module / manifest file, located at https://github.com/1000nettles/combat-numbers/releases/latest/download/module.json, will actually work and pull in the correct files.

## [0.1.0] - 2020-11-11

Our first release! This is alpha software so please use at your own risk.

[unreleased]: https://github.com/1000nettles/combat-numbers/compare/v0.3.2...HEAD
[0.3.2]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.3.2
[0.3.1]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.3.1
[0.3.0]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.3.0
[0.2.1]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.2.1
[0.2.0]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.2.0
[0.1.4]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.1.4
[0.1.3]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.1.3
[0.1.2]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.1.2
[0.1.1]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.1.1
[0.1.0]: https://github.com/1000nettles/combat-numbers/releases/tag/v0.1.0
