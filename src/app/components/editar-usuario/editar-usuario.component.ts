import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { User, DatabaseService } from 'src/app/services/database-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicStorageDatabaseService } from 'src/app/services/ionic-storage-database.service';

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
    const cpf = this.route.snapshot.paramMap.get('id')?.trim()!;
    const usuarioParaEditar:User = await this.isSVC.get(cpf);
    this.user = usuarioParaEditar;
  }

  async editUser(user: User) {
    console.log("Edição iniciou.");
    const cpf = this.route.snapshot.paramMap.get('id')?.trim()!;
    const usuarioParaDeletar:User = await this.isSVC.get(cpf);
    console.log("Vou deletar:");
    console.log(usuarioParaDeletar);
    await this.isSVC.remove(cpf);
    console.log("Vou adicionar: ");
    console.log(user);
    await this.isSVC.set(user.cpf, user);
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Usuário editado com sucesso',
      buttons: ['OK'],
    });
    await alert.present();
    this.router.navigate(['/usuario']);
  }
}
