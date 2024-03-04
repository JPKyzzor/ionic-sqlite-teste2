import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import {
  User,
  DatabaseService,
} from 'src/app/services/database-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
})
export class EditarUsuarioComponent implements OnInit {
  user: User | null = null;
  btnText = 'Editar usuário';

  constructor(
    private dbSVC: DatabaseService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')?.trim()!;
    this.dbSVC.getUserByID(id).then((user) => {
      this.user = user;
    });
  }

  async editUser(user: User) {
    this.dbSVC.updateUserByID(
      user.id,
      user.name,
      user.cpf,
      user.height,
      user.date,
      user.gender
    );
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Usuário editado com sucesso',
      buttons: ['OK'],
    });
    await alert.present();
    this.router.navigate(['/usuario']);
  }
}
