import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database-service.service';
import { User } from 'src/app/interfaces/user.interface';
import { IonicStorageDatabaseService } from 'src/app/services/ionic-storage-database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent{
  users = this.isSVC.getAllUsers();
  btnText = "Adicionar";

  constructor(private dbSVC:DatabaseService,
     private alertController:AlertController,
      private router:Router,
       private isSVC:IonicStorageDatabaseService) { }


  async createUser(user:User) {
    //await this.dbSVC.addUser(user.name, user.cpf, user.height, user.date, user.productsMilho, user.productsArroz, user.productsSoja, user.gender, user.pdfBase64);
    await this.isSVC.set(user.id, user);
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Usuário adicionado com sucesso',
      buttons: ['OK'],
    });

    await alert.present();
    this.router.navigate(['/']);
  }
}
