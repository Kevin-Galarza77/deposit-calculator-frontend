import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ProductsService } from '../../../services/products.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateComponent } from '../create-update/create-update.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatDividerModule, CurrencyPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export default class ListComponent implements OnInit, OnDestroy {

  products: any[] = [];

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
        if (result.status) this.products = result.data;
        this.spinner.hide();
      },
      error: e => this.spinner.hide()
    });
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

}
