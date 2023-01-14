const { songPayloadSchema } = require('./schema');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = songPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
