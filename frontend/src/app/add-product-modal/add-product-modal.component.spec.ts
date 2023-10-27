import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AddProductModalComponent } from './add-product-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

const sampleProduct = {
  id: '123',
  name: 'Test de Producto',
  description: 'Test Description Long',
  logo: 'test/logo/url',
  date_release: new Date('2023-11-17T03:27:36.000+00:00'),
  date_revision: new Date('2024-11-16T05:00:00.000+00:00'),
};

describe('AddProductModalComponent', () => {
  let component: AddProductModalComponent;
  let fixture: ComponentFixture<AddProductModalComponent>;
  let productService: ProductService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, DatePickerModule, FormsModule],
      declarations: [AddProductModalComponent]
    });
    fixture = TestBed.createComponent(AddProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    beforeEach(() => {
      fixture = TestBed.createComponent(AddProductModalComponent);
      component = fixture.componentInstance;
      productService = TestBed.inject(ProductService);
      router = TestBed.inject(Router);
      route = TestBed.inject(ActivatedRoute);
      fixture.detectChanges();
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate ID', () => {
    component.newProduct.id = '123';
    component.validateID();
    expect(component.idValid).toBeTrue();
  
    component.newProduct.id = '12';
    component.validateID();
    expect(component.idValid).toBeFalse();
    expect(component.idErrorText).toBe("El ID debe tener entre 3 y 10 caracteres.");
  });

  it('should validate release date', () => {
    const validDate = new Date('2024-11-17T03:27:36.000+00:00');
    const invalidDate = new Date('2022-10-01T00:00:00.000+00:00');
    
    component.validateRelease({ value: validDate });
    expect(component.releaseValid).toBeTrue();
  
    component.validateRelease({ value: invalidDate });
    expect(component.releaseValid).toBeFalse();
    expect(component.releaseErrorText).toBe('Fecha no válida');
  });

  it('should create a new product when not in edit mode', () => {
    const productService = TestBed.inject(ProductService);
    const router = TestBed.inject(Router);

    spyOn(productService, 'checkProductId').and.returnValue(of({}));
    spyOn(productService, 'createProduct').and.returnValue(of({}));

    component.newProduct = sampleProduct;
    component.edicion = false;

    productService.checkProductId(component.newProduct.id);
    productService.createProduct(component.newProduct);

    component.onSubmit();

    expect(productService.checkProductId).toHaveBeenCalledWith(component.newProduct.id);
    expect(productService.createProduct).toHaveBeenCalledWith(component.newProduct);
  });

  it('should edit an existing product when in edit mode', () => {
    const productService = TestBed.inject(ProductService);
    const router = TestBed.inject(Router);
  
    spyOn(productService, 'editProduct').and.returnValue(of({}));
  
    component.newProduct = sampleProduct;
    component.edicion = true;
  
    component.onSubmit();

    productService.editProduct(component.newProduct);
  
    expect(productService.editProduct).toHaveBeenCalledWith(component.newProduct);
  });

  it('should reset the form and error states', () => {
    component.newProduct = sampleProduct;
    component.edicion = true;
    
    component.resetForm();
  
    expect(component.newProduct).toEqual({
      id: component.newProduct.id,
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });

    expect(component.idValid).toBeTrue();
    expect(component.idVisited).toBeTrue();
    expect(component.idError).toBeFalse();
    expect(component.idErrorText).toBe('');
    expect(component.nameValid).toBeFalse();
    expect(component.nameVisited).toBeFalse();
    expect(component.nameError).toBeFalse();
    expect(component.nameErrorText).toBe('');
    expect(component.descriptionValid).toBeFalse();
    expect(component.descriptionVisited).toBeFalse();
    expect(component.descriptionError).toBeFalse();
    expect(component.descriptionErrorText).toBe('');
    expect(component.logoValid).toBeFalse();
    expect(component.logoVisited).toBeFalse();
    expect(component.logoError).toBeFalse();
    expect(component.logoErrorText).toBe('');
    expect(component.releaseValid).toBeFalse();
    expect(component.releaseVisited).toBeFalse();
    expect(component.releaseError).toBeFalse();
    expect(component.releaseErrorText).toBe('');

    component.newProduct = sampleProduct;
    component.edicion = false;
    
    component.resetForm();
  
    expect(component.newProduct).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });

    expect(component.idValid).toBeFalse();
    expect(component.idVisited).toBeFalse();
    expect(component.idError).toBeTrue();
    expect(component.idErrorText).toBe('');
    expect(component.nameValid).toBeFalse();
    expect(component.nameVisited).toBeFalse();
    expect(component.nameError).toBeFalse();
    expect(component.nameErrorText).toBe('');
    expect(component.descriptionValid).toBeFalse();
    expect(component.descriptionVisited).toBeFalse();
    expect(component.descriptionError).toBeFalse();
    expect(component.descriptionErrorText).toBe('');
    expect(component.logoValid).toBeFalse();
    expect(component.logoVisited).toBeFalse();
    expect(component.logoError).toBeFalse();
    expect(component.logoErrorText).toBe('');
    expect(component.releaseValid).toBeFalse();
    expect(component.releaseVisited).toBeFalse();
    expect(component.releaseError).toBeFalse();
    expect(component.releaseErrorText).toBe('');
  });  
  
});