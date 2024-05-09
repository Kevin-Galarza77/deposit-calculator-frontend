import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ProductsService } from '../../../services/products.service';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatDividerModule, MatIconModule, DecimalPipe],
  templateUrl: './list.component.html'
})
export default class ListComponent implements OnInit, OnDestroy {

  products_filter: any[] = [];
  products: any[] = [];

  allProducts!: Subscription;

  constructor(private productsService: ProductsService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.allProducts?.unsubscribe();
    this.spinner.hide();
  }

  getAllProducts(): void {
    this.spinner.show();
    this.allProducts = this.productsService.getAllProducts().subscribe({
      next: result => {
        if (result.status) {
          this.products = result.data;
          this.products_filter = result.data;
        }
        this.spinner.hide();
      },
      error: e => this.spinner.hide()
    });
  }

  filterProducts(input: any): void {
    this.products = this.products_filter.filter(product => product.product_name.toLowerCase().includes(input.target.value.toLowerCase()));
  }

  updateProduct(product?: any): void {
    const updateProduct = this.dialog.open(CreateUpdateComponent, {
      height: 'auto', maxHeight: '95vh', width: '30%', minWidth: '300px', data: product
    });
    updateProduct.afterClosed().subscribe(response => {
      if (response) this.getAllProducts();
    });
  }

  async deleteProductQuestion(product: any) {
    const question = await this.alertService.questionDelete();
    if (question) this.deleteProduct(product);
  }

  deleteProduct(product: any) {
    this.spinner.show();
    this.productsService.deleteProduct(product).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.getAllProducts(), 1000);
        } else {
          this.alertService.error(result.alert, result.messages);
        }
        this.spinner.hide();
      },
      error: e => {
        this.alertService.errorApplication();
        this.spinner.hide();
      }
    });
  }

}
