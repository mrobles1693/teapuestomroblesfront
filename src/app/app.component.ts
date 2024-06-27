import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fcTipoRuta = new FormControl<any>(null, [Validators.required]);
  fcOrigen = new FormControl<any>(null, [Validators.required]);
  fcDestino = new FormControl<any>(null, [Validators.required]);
  fcProgramacion = new FormControl<any>(null, [Validators.required]);
  fcCantidad = new FormControl<any>(null, [Validators.required]);
}
