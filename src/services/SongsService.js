const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
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

  async getSongs({ title, performer }) {
    if (title === performer) {
      const query = {
        text: `select id, title, performer from songs ${title ? 'where title = $1 and performer = $2' : ''}`,
        values: title ? [title, performer] : null,
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new Error();
      }
      return result.rows;
    }
    const query = {
      text: `select id, title, performer from songs where ${title ? 'title = $1' : 'performer = $2'}`,
      values: [title || performer],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
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
