import { Component, OnInit } from '@angular/core';
import { IUnidadMedida } from '../Interfaces/iunidadmedida';
import { RouterLink, Router } from '@angular/router';
import { SharedModule } from '../theme/shared/shared.module';
import { UnidadmedidaService } from '../Services/unidadmedida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unidadmedida',
  standalone: true,
  imports: [RouterLink, SharedModule],
  templateUrl: './unidadmedida.component.html',
  styleUrl: './unidadmedida.component.scss'
})
export class UnidadmedidaComponent implements OnInit {
  listaunidades: IUnidadMedida[] = [];

  constructor(
    private unidadServicio: UnidadmedidaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUnidades();
  }

  cargarUnidades() {
    this.unidadServicio.todos().subscribe((data) => {
      this.listaunidades = data;
    });
  }

  editar(idUnidad_Medida: number) {
    this.router.navigate(['/editarunidadmedida', idUnidad_Medida]);
  }

  eliminar(idUnidad_Medida: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.unidadServicio.eliminar(idUnidad_Medida).subscribe(() => {
          Swal.fire(
            'Eliminado!',
            'La unidad de medida ha sido eliminada.',
            'success'
          );
          this.cargarUnidades();
        });
      }
    });
  }
}