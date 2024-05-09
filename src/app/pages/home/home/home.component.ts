import { MenuComponent } from '../menu/menu.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuComponent, RouterModule],
  templateUrl: './home.component.html'
})
export default class HomeComponent { }
