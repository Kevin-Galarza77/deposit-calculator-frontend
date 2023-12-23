import { HeaderService } from './headers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private headers: HeaderService) { }

  getAllProducts(): Observable<any> {
    return this.headers.http.get(`${this.headers.url}product/allProducts`, this.headers.httpOptions);
  }

  createProduct(product: any): Observable<any> {
    return this.headers.http.post(`${this.headers.url}product`, product, this.headers.httpOptions);
  }

  updateProduct(product: any): Observable<any> {
    return this.headers.http.put(`${this.headers.url}product/${product.product_id}`, product, this.headers.httpOptions);
  }

  deleteProduct(product: any): Observable<any> {
    return this.headers.http.delete(`${this.headers.url}product/${product.product_id}`, this.headers.httpOptions);
  }

}