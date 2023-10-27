import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

const routes: Routes = [
  { path: 'modal', component: AddProductModalComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AddProductModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DatePickerModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
