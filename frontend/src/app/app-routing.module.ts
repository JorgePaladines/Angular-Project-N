import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';

const routes: Routes = [
  { path: 'modal', component: AddProductModalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
