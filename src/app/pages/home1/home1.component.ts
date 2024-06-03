import { Component, OnInit } from '@angular/core';
import { IonicStorageDatabaseService } from 'src/app/services/ionic-storage-database.service';

@Component({
  selector: 'app-home1',
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.scss'],
})
export class Home1Component{

  seila:string = "testesqlitestorage";
  chave:string = 'chave';


    constructor(private ionicStorageSVC:IonicStorageDatabaseService) {
      this.teste();
  }

  async teste() {
    try {
      //await this.ionicStorageSVC.set("chave", "teste1");
      //await this.ionicStorageSVC.set("chave2", "teste2");
      const value = await this.ionicStorageSVC.get("chave");
      const value2 = await this.ionicStorageSVC.get("chave2");
      console.log(value);  // Deve exibir "testesqlitestorage"
      console.log(value2);
    } catch (error) {
      console.error('Erro ao testar set/get:', error);
    }
  }

}
