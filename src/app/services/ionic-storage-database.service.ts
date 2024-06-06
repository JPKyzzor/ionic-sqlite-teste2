import { Injectable, WritableSignal, signal } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {Drivers} from '@ionic/storage'
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class IonicStorageDatabaseService {
  private _storage: Storage | null = null;
  private users: WritableSignal<User[]> = signal<User[]>([]);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    try {
      const storage = await this.storage.create();
      storage.defineDriver(cordovaSQLiteDriver)
      this._storage = storage;
    } catch (error) {
      console.error('Erro ao inicializar o armazenamento:', error);
    }
    this.loadUsers();
  }

  private async ensureStorageReady(): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
  }

  async loadUsers() {
    const users = await this.getUsers();
    this.users.set(users || []);
  }

  private async getUsers(): Promise<User[]> {
    await this.ensureStorageReady();
    if (this._storage) {
      try {
        const users = [];
        const keys = await this._storage.keys();
        for (const key of keys) {
          const result = await this._storage.get(key);
          if(result.cpf){
            users.push(result);
          }
        }
        return users;
      } catch (error) {
        console.error('Erro ao obter valores para as chaves:', error);
        return [];
      }
    }
    return [];
  }



  public getAllUsers(){
    return this.users;
  }

  public async set(key: string, value: User): Promise<void> {
    await this.ensureStorageReady();
    if (this._storage) {
      try {
        await this._storage.set(key, value);
        this.loadUsers();
      } catch (error) {
        console.error(`Erro ao definir valor para a chave "${key}":`, error);
      }
    }
  }

  public async get(key: string): Promise<any> {
    await this.ensureStorageReady();
    if (this._storage) {
      try {
        return await this._storage.get(key) as User;
      } catch (error) {
        console.error(`Erro ao obter valor para a chave "${key}":`, error);
        return null;
      }
    }
    return null;
  }

  public async remove(key: string): Promise<void> {
    await this.ensureStorageReady();
    if (this._storage) {
      try {
        await this._storage.remove(key);
        this.loadUsers();
      } catch (error) {
        console.error(`Erro ao remover a chave "${key}":`, error);
      }
    }
  }

  public async clear(): Promise<void> {
    await this.ensureStorageReady();
    if (this._storage) {
      try {
        await this._storage.clear();
      } catch (error) {
        console.error('Erro ao limpar o armazenamento:', error);
      }
    }
  }

  public async keys(): Promise<string[]> {
    await this.ensureStorageReady();
    if (this._storage) {
      try {
        return await this._storage.keys();
      } catch (error) {
        console.error('Erro ao obter chaves do armazenamento:', error);
        return [];
      }
    }
    return [];
  }
}
