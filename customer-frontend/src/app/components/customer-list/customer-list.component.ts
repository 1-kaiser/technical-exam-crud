import { Component, OnInit } from '@angular/core';
import { Customer, CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  imports: [],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  searchTerm: string = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers(this.searchTerm).subscribe((data) => {
      this.customers = data;
    });
  }

  onSearch() {
    this.loadCustomers();
  }

  onEdit(customer: Customer) {
    this.router.navigate(['/edit', customer.id]);
  }

  onView(customer: Customer) {
    this.router.navigate(['/view', customer.id]);
  }

  onDelete(customer: Customer) {
    if (confirm('Are you sure to delete this customer?')) {
      this.customerService.deleteCustomer(customer.id!).subscribe(() => {
        this.loadCustomers();
      });
    }
  }
}
