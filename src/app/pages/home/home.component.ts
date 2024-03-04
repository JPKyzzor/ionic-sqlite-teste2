import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User, DatabaseService } from 'src/app/services/database-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent{
  users = this.dbSVC.getUsers();
  btnText = "Adicionar";

  constructor(private dbSVC:DatabaseService, private alertController:AlertController, private router:Router) { }


  async createUser(user:User) {
    await this.dbSVC.addUser(user.name, user.cpf, user.height, user.date, user.gender);
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Usuário adicionado com sucesso',
      buttons: ['OK'],
    });
    await alert.present();
    this.router.navigate(['/']);
  }
}
