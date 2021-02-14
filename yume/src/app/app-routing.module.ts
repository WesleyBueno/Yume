import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarioComponent } from './calendario/calendario.component';
import { DbmComponent } from './dbm/dbm.component';
import { InicioComponent } from './inicio/inicio.component';
import { TimeComponent } from './time/time.component';

const routes: Routes = [
  {path: '',redirectTo: 'inicio',pathMatch: 'full'},
  {path: 'inicio', component: InicioComponent},
  {path: 'calendario', component: CalendarioComponent },
  {path: 'time', component: TimeComponent},
  {path: 'evento', component: DbmComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
