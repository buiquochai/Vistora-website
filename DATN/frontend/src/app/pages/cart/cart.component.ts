import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DecimalPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  increaseQuantity(item: any) {
    item.quantity += 1;
    this.saveCart();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.saveCart();
    }
  }

  removeItem(item: any) {
    this.cart = this.cart.filter(i => i.productId !== item.productId);
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  checkout() {
    if (this.cart.length === 0) {
      alert('Giỏ hàng đang trống!');
      return;
    }
    // chuyển đến trang checkout và truyền cart qua queryParams (hoặc backend)
    this.router.navigate(['/checkout']);
  }
}
