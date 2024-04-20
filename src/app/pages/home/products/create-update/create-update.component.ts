import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../../services/products.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-update',
  standalone: true,
  imports: [MatDividerModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './create-update.component.html',
  styleUrl: './create-update.component.css'
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

  constructor(private fb: FormBuilder,
    private productsService: ProductsService,
    private spinner: NgxSpinnerService,
    public dialogref: MatDialogRef<CreateUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data) {
      this.product.patchValue(this.data);
      this.title = 'MODIFICAR PRODUCTO';
      this.section = false;
    }
  }

  close(data?: any) {
    if (data) this.dialogref.close((data));
    else this.dialogref.close();
  }

  create_update_Product() {
    this.spinner.show();
    if (this.section) {
      this.createProduct();
    } else {
      this.updateProduct();
    }
  }

  createProduct() {
    this.productsService.createProduct(this.product.value).subscribe({
      next: result => {
        if (result.status) {
          Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
          setTimeout(() => this.close(true), 1000);
        }else {
          let html = '';
          if (result.messages.length !== 0) {
            result.messages.forEach((message: any) => {
              html += `<p>- ${message}</p>`
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

  updateProduct() {
    this.productsService.updateProduct(this.product.value).subscribe({
      next: result => {
        if (result.status) {
          Swal.fire({ icon: "success", title: result.alert, showConfirmButton: false, timer: 1500 });
          setTimeout(() => this.close(true), 1000);
        } else {
          let html = '';
          if (result.messages.length !== 0) {
            result.messages.forEach((message: any) => {
              html += `<p>- ${message}</p>`
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

}
