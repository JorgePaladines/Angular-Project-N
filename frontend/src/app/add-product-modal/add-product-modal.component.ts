import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss'],
})
export class AddProductModalComponent {
  @Input() productEdit: any;

  newProduct: any = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: new Date(),
    date_revision: new Date((new Date()).setFullYear((new Date()).getFullYear() + 1)),
  };

  public edicion: boolean = false;
  public errorMessage: string = "";

  public idValid: boolean = false;
  public idVisited: boolean = false;
  public idError: boolean = !this.idValid && this.idVisited;
  public idErrorText: string = "";

  public nameValid: boolean = false;
  public nameVisited: boolean = false;
  public nameError:  boolean = !this.nameValid && this.nameVisited;
  public nameErrorText: string = "";

  public descriptionValid: boolean = false;
  public descriptionVisited: boolean = false;
  public descriptionError: boolean = !this.descriptionValid && this.descriptionVisited;
  public descriptionErrorText: string = "";

  public logoValid: boolean = false;
  public logoVisited: boolean = false;
  public logoError: boolean = !this.logoValid && this.logoVisited;
  public logoErrorText: string = "";

  public releaseValid: boolean = true;
  public releaseVisited: boolean = false;
  public releaseError: boolean = !this.releaseValid && this.releaseVisited;
  public releaseErrorText: string = "";
  
  public day: number = new Date().getDate();
  public month: number = new Date().getMonth();
  public fullYear: number = new Date().getFullYear();
  public minDate: Date = new Date(this.fullYear, this.month, this.day);
  public dateValue: Date = new Date();

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if(params.id){
        this.newProduct = { ...params };
        this.edicion = true;

        this.validateID();
        this.validateName();
        this.validateDescription();
        this.validateLogo();
        this.validateRelease({ value: new Date(this.newProduct.date_release) });
      }
    });
  }

  validateID(){
    this.idVisited = true;
    this.idValid = this.newProduct.id.length >= 3 && this.newProduct.id.length <= 10;
    this.idError = !this.idValid && this.idVisited;
    if(this.idError){
      this.idErrorText = "El ID debe tener entre 3 y 10 caracteres.";
    }
    else{
      this.idErrorText = "";
    }
  }

  validateName(){
    this.nameVisited = true;
    this.nameValid = this.newProduct.name.length >= 5 && this.newProduct.name.length <= 100;
    this.nameError = !this.nameValid && this.nameVisited;
    if(this.nameError){
      this.nameErrorText = "El nombre debe tener entre 5 y 100 caracteres.";
    }
    else{
      this.nameErrorText = "";
    }
  }

  validateDescription(){
    this.descriptionVisited = true;
    this.descriptionValid = this.newProduct.description.length >= 10 && this.newProduct.description.length <= 200;
    this.descriptionError = !this.descriptionValid && this.descriptionVisited;
    if(this.descriptionError){
      this.descriptionErrorText = "La descripción debe tener entre 10 y 200 caracteres.";
    }
    else{
      this.descriptionErrorText = "";
    }
  }

  validateLogo(){
    this.logoVisited = true;
    this.logoValid = this.newProduct.logo.length > 0;
    this.logoError = !this.logoValid && this.logoVisited;
    if(this.logoError){
      this.logoErrorText = "Este campo es requerido";
    }
    else{
      this.logoErrorText = "";
    }
  }

  validateRelease(args: any){
    this.releaseVisited = true;
    this.releaseValid = args.value !== null && args.value !== undefined && args.value >= this.minDate;
    this.releaseError = !this.releaseValid && this.releaseVisited;
    if(this.releaseError){
      this.releaseErrorText = "Fecha no válida";
    }
    else{
      this.releaseErrorText = "";
    }

    this.setRevision(args);
  }

  setRevision(args: any){
    if(args.value){
      this.newProduct.date_revision = new Date(args.value.getFullYear() + 1, args.value.getMonth(), args.value.getDate());
    }
    else{
      this.newProduct.date_revision = '';
    }
  }

  onSubmit() {
    if (!this.validateInputs()) {
      return;
    }

    if (!this.edicion) {
      this.createProduct();
    } else {
      this.editProduct();
    }
  }

  validateInputs() {
    return this.idValid && this.nameValid && this.descriptionValid && this.logoValid && this.releaseValid;
  }

  createProduct() {
    this.productService.checkProductId(this.newProduct.id).subscribe((idExiste: any) => {
      if (idExiste.message) {
        this.handleIdError(idExiste.message);
      } else if (idExiste) {
        this.handleIdError("El ID ya existe");
      } else {
        this.productService.createProduct(this.newProduct).subscribe((response: any) => {
          this.handleResponse(response);
        }, (error) => {
          this.handleError(error, 'Error agregando producto');
        });
      }
    });
  }

  editProduct() {
    this.productService.editProduct(this.newProduct).subscribe((response: any) => {
      this.handleResponse(response);
    }, (error) => {
      this.handleError(error, 'Error editando producto');
    });
  }

  handleResponse(response: any) {
    if (response.status === 206) {
      if (response.id) this.handleIdError(response.id);
      if (response.name) this.handleNameError(response.name);
      if (response.description) this.handleDescriptionError(response.description);
      if (response.logo) this.handleLogoError(response.logo);
      if (response.date_release) this.handleReleaseError(response.date_release);
    } else {
      this.router.navigate(['/']);
    }
  }

  handleIdError(errorText: string) {
    this.idValid = false;
    this.idVisited = true;
    this.idError = true;
    this.idErrorText = errorText;
  }

  handleNameError(errorText: string) {
    this.nameValid = false;
    this.nameVisited = true;
    this.nameError = true;
    this.nameErrorText = errorText;
  }

  handleDescriptionError(errorText: string) {
    this.descriptionValid = false;
    this.descriptionVisited = true;
    this.descriptionError = true;
    this.descriptionErrorText = errorText;
  }

  handleLogoError(errorText: string) {
    this.logoValid = false;
    this.logoVisited = true;
    this.logoError = true;
    this.logoErrorText = errorText;
  }

  handleReleaseError(errorText: string) {
    this.releaseValid = false;
    this.releaseVisited = true;
    this.releaseError = true;
    this.releaseErrorText = errorText;
  }

  handleError(error: any, errorMessage: string) {
    console.error(errorMessage, error);
    this.errorMessage = error.error.error;
  }

  resetForm() {
    this.resetFormValues();
    this.resetErrorStates();
  }

  resetFormValues() {
    this.newProduct = {
      id: this.edicion ? this.newProduct.id : '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
  }

  resetErrorStates() {
    this.idValid = this.edicion;
    this.idVisited = this.edicion;
    this.idError = !this.edicion;
    this.idErrorText = "";

    this.nameValid = false;
    this.nameVisited = false;
    this.nameError = false;
    this.nameErrorText = "";

    this.descriptionValid = false;
    this.descriptionVisited = false;
    this.descriptionError = false;
    this.descriptionErrorText = "";

    this.logoValid = false;
    this.logoVisited = false;
    this.logoError = false;
    this.logoErrorText = "";

    this.releaseValid = false;
    this.releaseVisited = false;
    this.releaseError = false;
    this.releaseErrorText = "";

    this.errorMessage = "";
  }

  formatDate(date: any) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}