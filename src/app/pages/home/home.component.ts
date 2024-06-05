import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User, DatabaseService } from 'src/app/services/database-service.service';
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
    console.log("Vou setar:");
    console.log(user);
    await this.isSVC.set(user.cpf, user);
    const result = await this.isSVC.get(user.cpf)
    console.log("Voltou assim:");
    console.log(result);
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Usuário adicionado com sucesso',
      buttons: ['OK'],
    });

    await alert.present();
    this.router.navigate(['/']);
  }
}
