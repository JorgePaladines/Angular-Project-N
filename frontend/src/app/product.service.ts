import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/bp';
  private authorId = "1";

  constructor(private http: HttpClient) {}

  getProducts(searchQuery: string = "") {
    const headers = new HttpHeaders().set('authorId', this.authorId);
    const params = new HttpParams().set('searchText', searchQuery);
    return this.http.get(`${this.apiUrl}/products`, { headers, params });
  }

  checkProductId(id: string) {
    const headers = new HttpHeaders().set('authorId', this.authorId);
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.apiUrl}/products/verification`, { headers, params });
  }

  createProduct(newProduct: any) {
    const headers = new HttpHeaders().set('authorId', this.authorId);
    return this.http.post(`${this.apiUrl}/products`, newProduct, { headers });
  }

  editProduct(editProduct: any) {
    const headers = new HttpHeaders().set('authorId', this.authorId);
    return this.http.put(`${this.apiUrl}/products/${editProduct.id}`, editProduct, { headers });
  }

  deleteProduct(productId: string) {
    const headers = new HttpHeaders().set('authorId', this.authorId);
    return this.http.delete(`${this.apiUrl}/products/${productId}`, { headers });
  }
}