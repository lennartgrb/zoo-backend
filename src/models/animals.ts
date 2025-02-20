import { getPool } from "../db/db.js";

export class AnimalModel {
  // print all compounds
  static async findAll() {
    const result = await getPool().query("SELECT * FROM tier");

    return result.rows;
  }

  // print animal by id
  static async findAnimalById(id: string) {
    const values = [id];
    const result = await getPool().query("SELECT * FROM tier WHERE id = $1", values);

    if (result.rows.length > 0) {
      return result.rows[0];
    }
  }

  // update animal by id
  static async updateAnimal(id: string, data: { name: string; gehege_id: number; tierarzt_id: number }) {
    const { name, gehege_id, tierarzt_id } = data;
    const values = [name, gehege_id, tierarzt_id, id];

    const result = await getPool().query(
      `UPDATE tier
        SET name = $1, gehege_id = $2, tierarzt_id = $3
        WHERE id = $4
        RETURNING *`,
      values
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }
  }

  // create new animal
  static async createAnimal(data: { name: string; gehege_id: number; tierarzt_id: number }) {
    const { name, gehege_id, tierarzt_id } = data;
    const values = [name, gehege_id, tierarzt_id];

    const result = await getPool().query(
      `INSERT INTO tier (name, gehege_id, tierarzt_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // delete existed animal by id
  static async deleteAnimal(id: string) {
    const values = [id];

    const result = await getPool().query(
      `DELETE FROM tier 
      WHERE id = $1
      RETURNING *`,
      values
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }

  static async updateAnimalParticially(id: string, data: { name: string; gehege_id: number; tierarzt_id: number }) {
    const { name, gehege_id, tierarzt_id } = data;
    const values = [name, gehege_id, tierarzt_id, id];

    const result = await getPool().query(
      `UPDATE tier 
        SET name = COALESCE($1, name), gehege_id = COALESCE($2, gehege_id), tierarzt_id = COALESCE($3, tierarzt_id)
        WHERE id = $4
        RETURNING *`,
      values
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }
  }
}
