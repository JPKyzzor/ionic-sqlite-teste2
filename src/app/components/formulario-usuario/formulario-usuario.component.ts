import {
  DatabaseService,
  User,
} from 'src/app/services/database-service.service';
import { RouterModule } from '@angular/router';
import { Component, EventEmitter, OnInit, input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  NgForm,
  FormGroupDirective,
} from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Input, Output } from '@angular/core';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.scss'],
})
export class FormularioUsuarioComponent implements OnInit {
  @ViewChild('ngForm') formDir!: NgForm;
  @Output() formEnviado = new EventEmitter<User>();
  @Input() userData: User | null = null;
  @Input() btnText!: string;

  userForm!: FormGroup;
  users = this.database.getUsers();
  constructor(
    private database: DatabaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      id: new FormControl(this.userData ? this.userData.id : ''),
      name: new FormControl(this.userData ? this.userData.name : '', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
      ]),
      cpf: new FormControl(this.userData ? this.userData.cpf : '', [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }

  get nome() {
    return this.userForm.get('name')!;
  }
  get cpf() {
    return this.userForm.get('cpf')!;
  }

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

  async submit(formDirective: FormGroupDirective) {
    if (this.userForm.invalid) {
      return;
    }
    const userFormData: User = this.userForm.value;

    let cpfInvalid!: boolean;
    let erro!:string;

    if (this.userData?.id === userFormData.id) {
      // Se for uma edição
      cpfInvalid = this.users().some(
        (userDB) => userDB.id !== userFormData.id && userDB.cpf === userFormData.cpf
      );
      if(cpfInvalid){
        erro = "Outro usuário já tem esse CPF."
      }
    } else {
      //Se for um usuário novo
      cpfInvalid = this.users().some(
        (usersDB) => usersDB.cpf === userFormData.cpf
      );
      if(cpfInvalid){
        erro = "Esse CPF já existe."
      }
    }

    if (cpfInvalid) {
      if(cpfInvalid){
        const alert = await this.alertController.create({
          header: erro,
          buttons: ['Confirmar'],
        });
        await alert.present();
      }
    } else {
      this.formEnviado.emit(this.userForm.value);
      formDirective.resetForm();
      this.userForm.reset();
    }
  }
}
