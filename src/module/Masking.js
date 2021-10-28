import Constants from './Constants';

export default class Masking {
  constructor(state, settings) {
    this.state = state;
    this.settings = settings;
  }

  shouldMaskToken(token) {
    if (!this.state.getIsMask()) {
      return false;
    }

    const { disposition } = token.data;

    // If we have a hostile disposition, it will always be masked regardless of settings.
    if (disposition === global.CONST.TOKEN_DISPOSITIONS.HOSTILE) {
      return true;
    }

    const choices = Constants.MASKED_DISPOSITION_CHOICES;
    const dispositionsAllowed = this.settings.get(
      Constants.MODULE_NAME,
      'mask_disposition',
    );

    // If we have a neutral disposition, mask both neutral and hostile.
    if (
      disposition === global.CONST.TOKEN_DISPOSITIONS.NEUTRAL
      && [choices.HOSTILE_NETURAL_FRIENDLY, choices.HOSTILE_NEUTRAL].includes(dispositionsAllowed)
    ) {
      return true;
    }

    // If we have a hostile disposition set along with only hostile tokens to be masked, mask the
    // token.
    if (
      disposition === global.CONST.TOKEN_DISPOSITIONS.FRIENDLY
      && dispositionsAllowed === choices.HOSTILE_NETURAL_FRIENDLY
    ) {
      return true;
    }

    return false;
  }
}
