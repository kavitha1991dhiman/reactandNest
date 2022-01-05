import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateScheduleComponent } from './create-schedule/create-schedule.component';
import { ReviewInfoComponent } from './review-info/review-info.component';
import { JobHistoryComponent } from './job-history/job-history.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateScheduleComponent },
  { path: 'info', component: ReviewInfoComponent },
  { path: 'history', component: JobHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }