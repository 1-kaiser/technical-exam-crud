import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-form',
  imports: [],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css',
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isEdit = false;
  customerId?: number;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact_number: [''],
    });

    this.customerId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.customerId) {
      this.isEdit = true;
      this.customerService
        .getCustomer(this.customerId)
        .subscribe((customer) => {
          this.customerForm.patchValue(customer);
        });
    }
  }

  onSubmit() {
    if (this.customerForm.invalid) return;

    const customerData: Customer = this.customerForm.value;

    if (this.isEdit && this.customerId) {
      this.customerService
        .updateCustomer(this.customerId, customerData)
        .subscribe({
          next: () => this.router.navigate(['/']),
          error: (error) =>
            (this.errorMsg = error.message || 'Failed to update customer'),
        });
    } else {
      this.customerService.createCustomer(customerData).subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) =>
          (this.errorMsg = error.message || 'Creation of customer failed'),
      });
    }
  }
}
