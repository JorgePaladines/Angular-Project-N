import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductService } from './product.service';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

const sampleProduct = {
  id: '123',
  name: 'Test de Producto',
  description: 'Test Description Long',
  logo: 'test/logo/url',
  date_release: new Date('2023-11-17T03:27:36.000+00:00'),
  date_revision: new Date('2024-11-16T05:00:00.000+00:00'),
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let de: DebugElement
  let productService: ProductService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, FormsModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProducts: () => of([]),
            deleteProduct: () => of(null),
          },
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    productService = TestBed.inject(ProductService);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAddProductModalOpen to true when openAddProductModal is called', () => {
    component.openAddProductModal();

    expect(component.isAddProductModalOpen).toBeTrue();
  });

  it('should reset isAddProductModalOpen to false when resetForm is called', () => {
    component.resetForm();

    expect(component.isAddProductModalOpen).toBeFalse();
  });

  it('should open the popover when openPopover is called', () => {
    component.openPopover(1);

    expect(component.openPopoverId).toBe(1);
  });

  it('should close the popover when openPopover is called with the same ID', () => {
    component.openPopover(1);
    component.openPopover(1);

    expect(component.openPopoverId).toBeNull();
  });

  it('should load products when initialized', () => {
    const products = [sampleProduct]; // Using the sample product data
    spyOn(productService, 'getProducts').and.returnValue(of(products));
  
    // Call the loadProducts method directly to simulate initialization
    component.loadProducts();
  
    expect(component.products).toEqual(products);
  }); 
  
  it('should navigate to the product modal when editProduct is called', () => {
    const product = sampleProduct; // Using the sample product data
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  
    component.editProduct(product);
  
    expect(router.navigate).toHaveBeenCalledWith(['/modal', product]);
  });

  it('should delete the product and load products when deleteProduct is called', () => {
    const productId = '123';
    
    spyOn(productService, 'deleteProduct').and.returnValue(of({}));
  
    spyOn(component, 'loadProducts');
  
    component.deleteProduct(productId);
  
    expect(component.openPopoverId).toBeNull();
    expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
    expect(component.loadProducts).toHaveBeenCalled();
  });
});