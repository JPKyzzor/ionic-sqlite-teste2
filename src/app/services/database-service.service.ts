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
  height: number;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private users: WritableSignal<User[]> = signal<User[]>([]);
  /*private users: WritableSignal<User[]> = signal<User[]>([
    { id: 1, name: 'João Pedro Carlos da Silva', cpf: '12345678900', height: 1.72},
    { id: 2, name: 'Dani', cpf: '98765432100', height: 1.57},
    { id: 3, name: 'Augusto', cpf: '45678912300', height: 1.80},
    { id: 4, name: 'Maria', cpf: '78912345600', height: 1.65},
    { id: 5, name: 'Carlos', cpf: '32165498700', height: 1.78},
    { id: 6, name: 'Ana', cpf: '65498732100', height: 1.60},
    { id: 7, name: 'Pedro', cpf: '98732165400', height: 1.75},
    { id: 8, name: 'Luisa', cpf: '14725836900', height: 1.70},
    { id: 9, name: 'Felipe', cpf: '36925814700', height: 1.85},
    { id: 10, name: 'Mariana', cpf: '25836914700', height: 1.68}
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
      cpf TEXT NOT NULL UNIQUE,
      height NUMERIC NOT NULL,
      date TEXT NOT NULL
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

  async addUser(name: string, cpf: string, height:number, date:string) {
    const query = `INSERT INTO users (name, cpf, height, date) VALUES ('${name}', '${cpf}', '${height}', '${date}');`;
    const result = await this.db.query(query);

    this.loadUsers();

    return result;
  }

  async updateUserByID(id: number, nome: string, cpf: string, height:number, date:string) {
    const query = `UPDATE users SET name='${nome}', cpf='${cpf}', height='${height}', date='${date}' WHERE id='${id}';`;
    console.log("Query pro banco: "+query);
    const result = await this.db.query(query);

    // Atualize os usuários após a atualização
    await this.loadUsers();

    return result;
  }

  async deleteUserByID(id: string) {
    const query = `DELETE FROM users WHERE id=${id};`;
    const result = await this.db.query(query);

    this.loadUsers();

    return result;
  }
  async getUserByID(id: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id=${id};`;
    const result = await this.db.query(query);

    const user =
      result.values && result.values.length > 0 ? result.values[0] : null;
    return user || null;
  }
}
