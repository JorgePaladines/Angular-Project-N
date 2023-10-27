import { Component, HostListener } from '@angular/core';
import { ProductService } from './product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  products: any[] = [];
  searchQuery = '';

  isAddProductModalOpen = false;
  showPopover: boolean = false;
  openPopoverId: number | null = null;
  
  constructor(private productService: ProductService, public router: Router) {
    router.events.subscribe((val: any) => {
        if(val.routerEvent && val.routerEvent.url === '/'){
          this.loadProducts();
        }
    });
  }

  searchProduct(query: string) {
    this.searchQuery = query;
    this.loadProducts();
  }

  loadProducts() {
    this.isAddProductModalOpen = false;
    this.productService.getProducts(this.searchQuery).subscribe(
      (data: any) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  openAddProductModal() {
    this.isAddProductModalOpen = true;
  }

  resetForm() {
    this.isAddProductModalOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target && !target.closest('.more-options-button')) {
      this.openPopoverId = null;
    }
  }

  openPopover(productId: number) {
    if(this.openPopoverId === productId){
      this.openPopoverId = null;
      return;
    }
    this.openPopoverId = productId;
  }

  editProduct(product: any) {
    this.router.navigate(['/modal', product]);
  }

  deleteProduct(productId: string) {
    this.openPopoverId = null;
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    },
    (error) => {
      console.error('Error deleting product:', error);
    });
  }
}
