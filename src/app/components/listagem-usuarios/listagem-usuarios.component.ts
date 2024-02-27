import { Component} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User, DatabaseService } from 'src/app/services/database-service.service';

@Component({
  selector: 'app-listagem-usuarios',
  templateUrl: './listagem-usuarios.component.html',
  styleUrls: ['./listagem-usuarios.component.scss'],
})
export class ListagemUsuariosComponent {
  users = this.database.getUsers();

  constructor(
    private database: DatabaseService,
    private alertController: AlertController
  ) {}

  async editUser(user: User) {
    const alert = await this.alertController.create({
      header: 'Editar Usuário',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Novo Nome',
          value: user.name, // Define o valor inicial como o nome atual do usuário
        },
        {
          name: 'cpf',
          type: 'text',
          placeholder: 'Novo CPF',
          value: user.cpf, // Define o valor inicial como o CPF atual do usuário
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            // Chame sua função updateUser passando os novos dados
            this.updateUser(user, data.name, data.cpf);
          },
        },
      ],
    });

    await alert.present();
  }

  async updateUser(user: User, name: string, cpf: string) {
    this.database.updateUserByID(user.id.toString(), name, cpf);
  }

  async deleteUser(user: User) {
    this.database.deleteUserByID(user.id.toString());
  }
}
