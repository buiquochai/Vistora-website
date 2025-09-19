import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrderComponent } from './pages/oder/oder.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

// admin
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { Products } from './admin/products/products';
import { OrdersComponent } from './admin/orders/orders';
import { Users } from './admin/users/users';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'gioi-thieu', component: AboutComponent },
  { path: 'san-pham', component: ProductsComponent },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  { path: 'dang-nhap', component: LoginComponent },
  { path: 'dang-ky', component: RegisterComponent },
  { path: 'gio-hang', component: CartComponent },
  { path: 'don-hang', component: OrderComponent },
  { path: 'checkout', component: CheckoutComponent },
  {
    path: 'order-detail/:id',
    loadComponent: () => import('./pages/order-detail/order-detail').then(m => m.OrderDetailComponent)
  },



   // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'products', component: Products },
      { path: 'orders', component: OrdersComponent },
      { path: 'users', component: Users },
    ]
  }
];

