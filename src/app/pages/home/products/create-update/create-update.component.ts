import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ProductsService } from '../../../services/products.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-create-update',
  standalone: true,
  imports: [MatDividerModule, MatIconModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './create-update.component.html'
})
export class CreateUpdateComponent implements OnInit {

  product: FormGroup = this.fb.group({
    product_id: [''],
    product_purchase_price: ['', Validators.required],
    product_sale_price: ['', Validators.required],
    product_status: ['', Validators.required],
    product_name: ['', Validators.required],
    product_img: ['', Validators.required],
  });

  title: string = 'NUEVO PRODUCTO';
  section = true;

  constructor(private productsService: ProductsService,
    private alertService: AlertService,
    private dialogref: MatDialogRef<CreateUpdateComponent>,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.data) {
      this.product.patchValue(this.data);
      this.title = 'MODIFICAR PRODUCTO';
      this.section = false;
    }
  }

  createUpdateProduct(): void {
    this.spinner.show();
    if (this.section) this.createProduct();
    else this.updateProduct();
  }

  createProduct(): void {
    this.productsService.createProduct(this.product.value).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.close(true), 1000);
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

  updateProduct(): void {
    this.productsService.updateProduct(this.product.value).subscribe({
      next: result => {
        if (result.status) {
          this.alertService.success(result.alert);
          setTimeout(() => this.close(true), 1000);
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

  close(data?: any): void {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

}
