import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class IonicStorageDatabaseService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    try {
      const storage = await this.storage.create();
      this._storage = storage;
    } catch (error) {
      console.error('Erro ao inicializar o armazenamento:', error);
    }
  }

  private async ensureStorageReady(): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
  }

  public async set(key: string, value: any): Promise<void> {
    await this.ensureStorageReady();
    if (this._storage) {
      try {
        await this._storage.set(key, value);
      } catch (error) {
        console.error(`Erro ao definir valor para a chave "${key}":`, error);
      }
    }
  }

  public async get(key: string): Promise<any> {
    await this.ensureStorageReady();
    if (this._storage) {
      try {
        return await this._storage.get(key);
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
