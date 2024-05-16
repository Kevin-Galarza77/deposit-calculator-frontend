import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styles: [`.text { color: white; cursor: pointer; transition: 0.5s; } .text:hover { transition: 0.5s; text-decoration: underline !important; } .text-url { color: rgb(233, 233, 233); text-decoration: underline !important; }`]
})

export class MenuComponent { }
