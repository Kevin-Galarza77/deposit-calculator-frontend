import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ProductsService } from '../../../services/products.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatDividerModule, CurrencyPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export default class ListComponent implements OnInit, OnDestroy {

  products: any[] = [];
  products_filter: any[] = [];

  allProducts!: Subscription;

  constructor(private productsService: ProductsService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.allProducts?.unsubscribe();
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

  updateProduct(product?: any) {
    const updateProduct = this.dialog.open(CreateUpdateComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: '50%',
      minWidth: '300px',
      data: product
    });
    updateProduct.afterClosed().subscribe(response => {
      if (response) this.getAllProducts();
    });
  }

  deleteProduct(product: any) {
    Swal.fire({
      title: "Estas seguro de realizar esta acción?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: 'rgb(220, 53, 69)',
      cancelButtonText: "Cancelar",
      cancelButtonColor: 'rgb(108, 117, 125)',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.productsService.deleteProduct(product).subscribe({
          next: result => {
            if (result.status) {
              Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
              setTimeout(() => this.getAllProducts(), 1000);
            } else {
              let html = '';
              if (result.messages.length !== 0) {
                result.messages.forEach((message: any) => {
                  html += `<p> - ${message}</p>`
                });
              }
              Swal.fire({ icon: "error", title: result.alert, html: html, confirmButtonColor: 'red' });
            }
            this.spinner.hide();
          },
          error: e => {
            Swal.fire({ icon: "error", title: 'Se produjo un error contacta al administrador', showConfirmButton: false, timer: 1500 });
            this.spinner.hide();
          }
        });
      }
    });
  }

}
