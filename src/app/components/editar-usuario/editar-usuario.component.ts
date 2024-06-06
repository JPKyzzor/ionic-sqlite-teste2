import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicStorageDatabaseService } from 'src/app/services/ionic-storage-database.service';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
})
export class EditarUsuarioComponent implements OnInit {
  user: User | null = null;
  btnText = 'Editar usuário';

  constructor(
    //private dbSVC: DatabaseService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private isSVC:IonicStorageDatabaseService
  ) {}

  async ngOnInit(): Promise<void>{
    const id = this.route.snapshot.paramMap.get('id')!;
    const usuarioParaEditar:User = await this.isSVC.get(id);
    this.user = usuarioParaEditar;
  }

  async editUser(user: User) {
    await this.isSVC.set(user.id, user);
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Usuário editado com sucesso',
      buttons: ['OK'],
    });
    await alert.present();
    this.router.navigate(['/usuario']);
  }
}
