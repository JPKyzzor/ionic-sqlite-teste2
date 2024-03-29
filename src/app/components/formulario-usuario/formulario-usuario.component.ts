import { DatabaseService, User,} from 'src/app/services/database-service.service';
import { Component, EventEmitter, OnInit, input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, NgForm, FormGroupDirective, AbstractControl, } from '@angular/forms';
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
  maxDate: string = this.calculateMaxDate();

  constructor(
    private database: DatabaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const dataTeste = new Date();
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
        this.validateCPF.bind(this),
      ]),
      height: new FormControl(
        this.userData ? this.userData.height.toFixed(2) : '',
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
    console.log(this.userForm.value);
    if (this.userForm.invalid) {
      return;
    }
    const userFormData: User = this.userForm.value;
    let cpfInvalid!: boolean;
    let error!: string;

    if (this.userData?.id === userFormData.id) {
      // Se for uma edição
      cpfInvalid = this.users().some(
        (userDB) =>
          userDB.id !== userFormData.id && userDB.cpf === userFormData.cpf
      );
      if (cpfInvalid) {
        error = 'Outro usuário já tem esse CPF.';
      }
    } else {
      //Se for um usuário novo
      cpfInvalid = this.users().some(
        (usersDB) => usersDB.cpf === userFormData.cpf
      );
      if (cpfInvalid) {
        error = 'Esse CPF já existe.';
      }
    }

    if (cpfInvalid) {
      if (cpfInvalid) {
        const alert = await this.alertController.create({
          header: error,
          buttons: ['Confirmar'],
        });
        await alert.present();
      }
    } else {
      console.log('Formulário: ', userFormData);
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

  validateCPF(control: AbstractControl): { [key: string]: boolean } | null {
    const cpf = control.value;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto > 9 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto > 9 ? 0 : resto;
    console.log(cpf.charAt(9));
    console.log(cpf.charAt(10));
    console.log(digitoVerificador1);
    console.log(digitoVerificador2);

    if (parseInt(cpf.charAt(9)) !== digitoVerificador1 || parseInt(cpf.charAt(10)) !== digitoVerificador2) {
      console.log(cpf.charAt(9));
      console.log(cpf.charAt(10));
      console.log(digitoVerificador1);
      console.log(digitoVerificador2);
        return { CPFinvalido: true };
    }

    return null;
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
