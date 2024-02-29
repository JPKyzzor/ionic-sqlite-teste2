import {
  DatabaseService,
  User,
} from 'src/app/services/database-service.service';
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
  @Output() formSent = new EventEmitter<User>();
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
      height: new FormControl(this.userData ? this.userData.height.toFixed(2) : '', [
        Validators.required,
        Validators.pattern(/^\d+(?:[.,]\d{1,2})?$/),
        Validators.min(0),
        Validators.max(3),
      ]),


    });
  }

  get name() {
    return this.userForm.get('name')!;
  }
  get cpf() {
    return this.userForm.get('cpf')!;
  }
  get height(){
    return this.userForm.get('height')!;
  }

  async submit(formDirective: FormGroupDirective) {
    if (this.userForm.invalid) {
      return;
    }
    const userFormData: User = this.userForm.value;

    let cpfInvalid!: boolean;
    let error!:string;

    if (this.userData?.id === userFormData.id) {
      // Se for uma edição
      cpfInvalid = this.users().some(
        (userDB) => userDB.id !== userFormData.id && userDB.cpf === userFormData.cpf
      );
      if(cpfInvalid){
        error = "Outro usuário já tem esse CPF."
      }
    } else {
      //Se for um usuário novo
      cpfInvalid = this.users().some(
        (usersDB) => usersDB.cpf === userFormData.cpf
      );
      if(cpfInvalid){
        error = "Esse CPF já existe."
      }
    }

    if (cpfInvalid) {
      if(cpfInvalid){
        const alert = await this.alertController.create({
          header: error,
          buttons: ['Confirmar'],
        });
        await alert.present();
      }
    } else {
      this.formSent.emit(userFormData);
      formDirective.resetForm();
      this.userForm.reset();
    }
  }
}
