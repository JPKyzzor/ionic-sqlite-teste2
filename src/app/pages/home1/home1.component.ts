import { Component, OnInit } from '@angular/core';
import { IonicStorageDatabaseService } from 'src/app/services/ionic-storage-database.service';

@Component({
  selector: 'app-home1',
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.scss'],
})
export class Home1Component {
  seila: string = 'testesqlitestorage';
  chave: string = 'chave';
  value1 = '';
  value2 = '';

  constructor(private ionicStorageSVC: IonicStorageDatabaseService) {
    this.teste();
  }

  async teste() {
    try {
      const respose = await this.ionicStorageSVC.keys();
      console.log(respose);
      respose.forEach(async (key) => {
        const response = await this.ionicStorageSVC.get(key);
        console.log(response);
      });
    } catch (error) {
      console.error('Erro ao testar set/get:', error);
    }
  }
}
