const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'insert into albums values($1, $2, $3) returning id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw console.error();
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const album_query = {
      text: 'select * from albums where id = $1',
      values: [id],
    };
    const songs_query = {
      text: 'select id, title, performer from songs where album_id = $1',
      values: [id],
    };

    const album = await this._pool.query(album_query);
    const songs = await this._pool.query(songs_query);

    if (!album.rows.length) {
      throw new Error();
    }
    const result = { album: album.rows[0], songs: [songs.rows] };
    return result;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'update albums set name = $1, year = $2, where id = $3 returning id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error();
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'delete albums where id = $1 returning id',
      value: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error();
    }
  }
}
module.exports = AlbumsService;
