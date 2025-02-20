import { getPool } from "../db/db.js";

export class CompoundModel {
  // print all compounds
  static async findAll() {
    const result = await getPool().query("SELECT * FROM gehege");

    return result.rows;
  }

  // print compound by id
  static async findCompoundById(id: string) {
    const values = [id];
    const result = await getPool().query("SELECT * FROM gehege WHERE id = $1", values);

    if (result.rows.length > 0) {
      return result.rows[0];
    }
  }

  // update compound by id
  static async updateCompound(id: string, data: { groesse: number; instandhaltungskosten: number; name: string }) {
    const { groesse, instandhaltungskosten, name } = data;
    const values = [groesse, instandhaltungskosten, name, id];

    const result = await getPool().query(
      `UPDATE gehege
        SET groesse = $1, instandhaltungskosten = $2, name = $3
        WHERE id = $4
        RETURNING *`,
      values
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }
  }

  // create new compound
  static async createCompound(data: { groesse: number; instandhaltungskosten: number; name: string }) {
    const { groesse, instandhaltungskosten, name } = data;
    const values = [groesse, instandhaltungskosten, name];

    const result = await getPool().query(
      `INSERT INTO gehege (groesse, instandhaltungskosten, name)
        VALUES ($1, $2, $3)
        RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // delete existed compound by id
  static async deleteCompound(id: string) {
    const values = [id];

    const result = await getPool().query(
      `DELETE FROM gehege 
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

  static async updateCompoundParticial() {}
}
