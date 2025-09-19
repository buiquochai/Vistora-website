import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface Order {
  _id: string;
  name: string;
  totalAmount: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  };

  recentOrders: Order[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStats();
    this.fetchRecentOrders();
  }

  fetchStats() {
    const token = localStorage.getItem('token');
    this.http.get('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => this.stats = res,
      error: (err) => console.error(err)
    });
  }

  fetchRecentOrders() {
    const token = localStorage.getItem('token');
    this.http.get<Order[]>('http://localhost:5000/api/admin/recent-orders', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => this.recentOrders = res,
      error: (err) => console.error(err)
    });
  }
}
