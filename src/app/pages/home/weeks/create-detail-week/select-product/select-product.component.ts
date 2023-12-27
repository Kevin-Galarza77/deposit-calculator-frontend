import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ProductsService } from '../../../../services/products.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-select-product',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './select-product.component.html',
  styleUrl: './select-product.component.css'
})
export class SelectProductComponent implements OnInit,OnDestroy {

  products_filter: any[] = [];
  products: any[] = [];

  allProducts!: Subscription;

  constructor(private productsService: ProductsService,
    public dialogref: MatDialogRef<SelectProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getAllProducts() {
    this.spinner.show();
    this.allProducts = this.productsService.getAllProducts().subscribe({
      next: result => {
        if (result.status) this.products = this.products_filter = result.data;
        this.spinner.hide();
      },
      error: e => this.spinner.hide()
    });
  }

  filterProducts(input: any) {
    const name = String(input.target.value).toLowerCase();
    this.products = this.products_filter.filter(product => product.product_name.toLowerCase().includes(name));
  }

  close(data?: any) {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

  saveProduct(product: any) {
    if (this.data.products_id.includes(product.product_id)) {
      Swal.fire({ icon: "error", title: 'Producto ya registrado', text: 'Por favor selecciona un producto que no a sido seleccionado en esta semana', confirmButtonColor: 'red' });
    } else {
      this.close({ product_id: product.product_id, product_name: product.product_name });
    }
  }

}
