class SongsHandler {
  constructor(service) {
    this._service = service;
  }

  postSongHandler(request, h) {
    try {
      const {
        title, year, genre, performer, duration = null, albumId = null,
      } = request.payload;
      const songId = this._service.addSong({
        title, year, genre, performer, duration, albumId,
      });
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(400);
      return response;
    }
  }

  getSongsHandler(request, h) {
    try {
      const { title = null, performer = null } = request.query;
      const songs = this._service.getSongs({ title, performer });
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: 'Lagu tidak ditemukan',
      });
      response.code(404);
      return response;
    }
  }

  getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = this._service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = SongsHandler;
