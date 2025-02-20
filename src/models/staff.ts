import { HTTPException } from "hono/http-exception";
import { getPool } from "../db/db.js";

export class StaffModel {
  // print all compounds
  static async findAll() {
    const result = await getPool().query("SELECT * FROM personal");

    return result.rows;
  }

  // print animal by id
  static async findStaffById(id: string) {
    const values = [id];
    const result = await getPool().query("SELECT * FROM personal WHERE id = $1", values);

    if (result.rows.length > 0) {
      return result.rows[0];
    }
  }

  static async isVet(id: number) {
    const result = await getPool().query(
      `SELECT * FROM personal p
        JOIN beruf b ON p.beruf_id = b.id
        WHERE p.id = $1
        AND b.bezeichnung = 'Tierarzt'`,
      [id]
    );

    return result.rows.length > 0;
  }

  static async getFreeDoctors() {
    // Contraints:
    //1. Tiee darf niemals ohne Tierarzt
    //2. Tierarzt max 25. Tiere
    //3. Tier muss in Gehege passen (Kapazität)
    const freeDoctor = await getPool().query(
      `SELECT personal.id, COUNT(*) 
      FROM personal 
      JOIN beruf ON personal.beruf_id = beruf.id 
      JOIN tier ON tier.tierazt_id = personal.id 
      WHERE beruf.bezeichnung = 'Tierarzt' 
      GROUP BY personal.id`
    );

    if (freeDoctor.rowCount === 0) {
      throw new HTTPException(404, { message: "no animals found" });
      return freeDoctor.rows;
    }
  }
}
