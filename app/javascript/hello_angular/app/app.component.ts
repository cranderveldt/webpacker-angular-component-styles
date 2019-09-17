import { Component } from '@angular/core';
import template from './app.component.html';
import styleString from './app.component.scss';

@Component({
  selector: 'hello-angular',
  template,
  styles: [styleString]
})
export class AppComponent {
  name = 'Angular!';
}
