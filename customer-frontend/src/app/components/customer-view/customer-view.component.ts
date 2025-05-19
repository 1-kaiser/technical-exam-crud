import { Component, OnInit } from '@angular/core';
import { Customer, CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-view',
  imports: [],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.css',
})
export class CustomerViewComponent implements OnInit {
  customer?: Customer;

  constructor(
    private custommerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.custommerService
      .getCustomer(id)
      .subscribe((customer) => (this.customer = customer));
  }

  back() {
    this.router.navigate(['/']);
  }
}
