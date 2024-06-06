import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database-service.service';
import { IonicStorageDatabaseService } from 'src/app/services/ionic-storage-database.service';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-listagem-usuarios',
  templateUrl: './listagem-usuarios.component.html',
  styleUrls: ['./listagem-usuarios.component.scss'],
})
export class ListagemUsuariosComponent{
  users = this.isSVC.getAllUsers();

  constructor(
    private database: DatabaseService,
    private alertController: AlertController,
    private isSVC: IonicStorageDatabaseService,
  ) {}

  async deleteUser(cpf: string) {
    await this.isSVC.remove(cpf);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  openPDF(pdfBase64: string) {
    console.log(pdfBase64);
  }
}
