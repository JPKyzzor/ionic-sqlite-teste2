import { v4 as uuidv4 } from 'uuid';
import { Component, EventEmitter, OnInit, Input, Output, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormControl, FormGroup, Validators, NgForm, FormGroupDirective, AbstractControl } from '@angular/forms';
import { IonicStorageDatabaseService } from './../../services/ionic-storage-database.service';
import { DatabaseService, User } from 'src/app/services/database-service.service';

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
  users = this.isSVC.getAllUsers();
  maxDate: string = this.calculateMaxDate();

  constructor(
    private database: DatabaseService,
    private alertController: AlertController,
    private isSVC: IonicStorageDatabaseService
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
      height: new FormControl(
        this.userData ? parseFloat(this.userData.height.toFixed(2)) : '',
        [
          Validators.required,
          Validators.pattern(/^\d+(?:[.,]\d{1,2})?$/),
          Validators.min(0),
          Validators.max(3),
        ]
      ),
      date: new FormControl(this.userData ? this.userData.date : this.maxDate, [
        Validators.required,
        this.validateAge.bind(this),
      ]),
      productsMilho: new FormControl(this.userData ? this.userData.productsMilho : false, [
        Validators.required,
      ]),
      productsArroz: new FormControl(this.userData ? this.userData.productsArroz : false, [
        Validators.required,
      ]),
      productsSoja: new FormControl(this.userData ? this.userData.productsSoja : false, [
        Validators.required,
      ]),
      gender: new FormControl(this.userData ? this.userData.gender : '', [
        Validators.required,
      ]),
      pdfBase64: new FormControl(
        this.userData?.pdfBase64 ? this.userData.pdfBase64 : '',
        [Validators.required]
      ),
    });
  }

  get name() {
    return this.userForm.get('name')!;
  }
  get cpf() {
    return this.userForm.get('cpf')!;
  }
  get height() {
    return this.userForm.get('height')!;
  }
  get date() {
    return this.userForm.get('date')!;
  }

  get productsMilho(){
    return this.userForm.get('productsMilho')!;
  }
  get productsArroz(){
    return this.userForm.get('productsArroz')!;
  }
  get productsSoja(){
    return this.userForm.get('productsSoja')!;
  }
  get gender() {
    return this.userForm.get('gender')!;
  }
  get pdfBase64() {
    return this.userForm.get('pdfBase64')!;
  }

  async submit(formDirective: FormGroupDirective) {
    if (this.userForm.invalid) {
      return;
    }
    const userFormData: User = this.userForm.value;
    let cpfInvalid!: boolean;
    let error!: string;

    if (this.userData != null) {
      // Se for uma edição
      cpfInvalid = this.users().some(
        (userDB) =>
          userDB.cpf === userFormData.cpf && userDB.id !== userFormData.id
      );
      if (cpfInvalid) {
        error = 'Outro usuário já tem esse CPF.';
      }
    } else {
      // Se for um usuário novo
      cpfInvalid = this.users().some(
        (usersDB) => usersDB.cpf === userFormData.cpf
      );
      if (cpfInvalid) {
        error = 'Esse CPF já existe.';
      } else {
        userFormData.id = uuidv4(); // Gerar UUID para novos usuários
      }
    }

    if (cpfInvalid) {
      const alert = await this.alertController.create({
        header: error,
        buttons: ['Confirmar'],
      });
      await alert.present();
    } else {
      this.formSent.emit(userFormData);
      formDirective.resetForm();
      this.userForm.reset();
      this.limparValoresCheckboxes();
      const fileInput: HTMLInputElement | null =
        document.querySelector('input[type=file]');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  validateAge(control: AbstractControl): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);
    const ageDiff = currentDate.getFullYear() - selectedDate.getFullYear();

    if (ageDiff < 18) {
      return { underAge: true };
    }

    return null;
  }

  calculateMaxDate(): string {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);
    return minDate.toISOString();
  }

  validateCheckbox() {
    var products = document.querySelectorAll('ion-checkbox');
    var check = false;

    for (var i = 0; i < products.length; i++) {
      if (products[i].checked) {
        check = true;
        break;
      }
    }
    if (!check) {
      return false;
    }
    return true;
  }

  limparValoresCheckboxes() {
    this.userForm.get('productsArroz')?.setValue(false);
    this.userForm.get('productsSoja')?.setValue(false);
    this.userForm.get('productsMilho')?.setValue(false);
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Aqui você pode acessar o conteúdo do arquivo PDF como uma string Base64
        const pdfBase64: string = reader.result as string;
        this.userForm.patchValue({ pdfBase64: pdfBase64 });
      };
      reader.readAsDataURL(file);
    }
  }
}
