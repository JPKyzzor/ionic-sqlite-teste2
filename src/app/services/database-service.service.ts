import { Injectable, WritableSignal, signal } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

const DB_USERS = 'myuserdb';

export interface User {
  id: number;
  name: string;
  cpf: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private users: WritableSignal<User[]> = signal<User[]>([]);
  /*private users: WritableSignal<User[]> = signal<User[]>([
    { id: 1, name: 'João Pedro Carlos da Silva', cpf: '12345678900' },
    { id: 2, name: 'Maria', cpf: '98765432100' },
    { id: 3, name: 'José', cpf: '45678912300' }
  ]);*/ //MOCK

  constructor() {}

  async initializePlugin() {
    this.db = await this.sqlite.createConnection(
      DB_USERS,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cpf TEXT NOT NULL UNIQUE
    );`;

    await this.db.execute(schema);
    this.loadUsers();
    return true;
  }

  getUsers() {
    return this.users;
  }

  async loadUsers() {
    const users = await this.db.query('SELECT * FROM users;');
    this.users.set(users.values || []);
  }

  async addUser(name: string, cpf: string) {
    const query = `INSERT INTO users (name, cpf) VALUES ('${name}', '${cpf}')`;
    const result = await this.db.query(query);

    this.loadUsers();

    return result;
  }

  async updateUserByID(id: string, nome: string, cpf: string) {
    const query = `UPDATE users SET name='${nome}', cpf='${cpf}' WHERE id='${id}'`;
    const result = await this.db.query(query);

    // Atualize os usuários após a atualização
    await this.loadUsers();

    return result;
  }

  async deleteUserByID(id: string) {
    const query = `DELETE FROM users WHERE id=${id}`;
    const result = await this.db.query(query);

    this.loadUsers();

    return result;
  }
  async getUserByID(id: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id=${id}`;
    const result = await this.db.query(query);

    const user =
      result.values && result.values.length > 0 ? result.values[0] : null;
    return user || null;
  }
}
