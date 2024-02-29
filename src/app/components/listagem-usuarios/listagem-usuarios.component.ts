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

  async deleteUser(user: User) {
    this.database.deleteUserByID(user.id.toString());
  }
}
