import { HomeComponent } from './pages/home/home.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListagemUsuariosComponent } from './components/listagem-usuarios/listagem-usuarios.component';
import { FormularioUsuarioComponent } from './components/formulario-usuario/formulario-usuario.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { Home1Component } from './pages/home1/home1.component';
import { Home2Component } from './pages/home2/home2.component';

const routes: Routes = [
  {
    path: 'home1',
    component: Home1Component
  },
  {
    path: 'home2',
    component: Home2Component
  },
  {
    path: 'usuario',
    component: HomeComponent
  },
  {
    path: 'usuario/editarUsuario/:id', component:EditarUsuarioComponent
  }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
