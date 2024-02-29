import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { FormularioUsuarioComponent } from './components/formulario-usuario/formulario-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListagemUsuariosComponent } from './components/listagem-usuarios/listagem-usuarios.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { HomeComponent } from './pages/home/home.component';
import { Home1Component } from './pages/home1/home1.component';
import { Home2Component } from './pages/home2/home2.component';

@NgModule({
  declarations: [AppComponent, FormularioUsuarioComponent, ListagemUsuariosComponent, EditarUsuarioComponent, HomeComponent, Home1Component, Home2Component],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
