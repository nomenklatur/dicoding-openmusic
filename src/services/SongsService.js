const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'insert into songs values($1, $2, $3, $4, $5, $6, $7) returning id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw console.error();
    }
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('select * from songs');
    return result.rows.map(mapDBToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'select * from songs where id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error();
    }
    return result.rows.map(mapDBToModel)[0];
  }

  async getSongsByQuery({ title = null, performer = null }) {
    if (title === null) {
      const query = {
        text: 'select * from songs where performer = $1',
        values: [performer],
      };
      const result = await this._pool.query(query);
      if (!result.rows[0]) {
        throw new Error();
      }
      return result.rows.map(mapDBToModel);
    } if (performer === null) {
      const query = {
        text: 'select * from songs where title = $1',
        values: [title],
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new Error();
      }
      return result.rows.map(mapDBToModel);
    }

    const query = {
      text: 'select * from songs where title = $1 and performer = $2',
      values: [title, performer],
    };
    const result = await this._pool.query(query);
    if (!result.rows) {
      throw new Error();
    }
    return result.rows.map(mapDBToModel);
  }

  async editSongById(id, {
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const query = {
      text: 'update songs set title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 where id = $7 returning id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error();
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'delete from songs where id = $1 returning id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error();
    }
  }
}

module.exports = SongsService;
