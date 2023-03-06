import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { StoreModule } from '@ngrx/store';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { teamReducer } from './shared/state/team/team.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TeamEffects } from './shared/state/team/team.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HeaderComponent,
    FooterComponent,
    StoreModule.forRoot({
      team: teamReducer
    }),
    EffectsModule.forRoot([TeamEffects]),
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
