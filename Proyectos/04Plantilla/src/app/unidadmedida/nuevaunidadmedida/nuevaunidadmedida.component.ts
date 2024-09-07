import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUnidadMedida } from 'src/app/Interfaces/iunidadmedida';
import { UnidadmedidaService } from '../../Services/unidadmedida.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevaunidadmedida',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './nuevaunidadmedida.component.html',
  styleUrl: './nuevaunidadmedida.component.scss'
})
export class NuevaunidadmedidaComponent implements OnInit {
  titulo = 'Nueva Unidad de Medida';
  frm_UnidadMedida: FormGroup;

  idUnidadMedida: number | null = null;

  constructor(
    private unidadService: UnidadmedidaService,
    private navegacion: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.frm_UnidadMedida = new FormGroup({
      Detalle: new FormControl('', [Validators.required]),
      Tipo: new FormControl('', [Validators.required])
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.idUnidadMedida = +id;
        this.titulo = 'Editar Unidad de Medida';
        this.cargarUnidadMedida();
      }
    });
  }

  cargarUnidadMedida() {
    if (this.idUnidadMedida !== null) {
      this.unidadService.uno(this.idUnidadMedida).subscribe((unidad) => {
        this.frm_UnidadMedida.patchValue({
          Detalle: unidad.Detalle,
          Tipo: unidad.Tipo
        });
      });
    }
  }

  cambio(objetoSelect: any) {
    this.frm_UnidadMedida.get('Tipo')?.setValue(objetoSelect.target.value);
  }

  grabar() {
    if (this.frm_UnidadMedida.valid) {
      let unidadmedida: IUnidadMedida = {
        Detalle: this.frm_UnidadMedida.get('Detalle')?.value,
        Tipo: this.frm_UnidadMedida.get('Tipo')?.value,
        idUnidad_Medida: this.idUnidadMedida || 0
      };
      
      if (this.idUnidadMedida === null) {
        // Insertar nueva unidad de medida
        this.unidadService.insertar(unidadmedida).subscribe(
          (response) => {
            console.log('Respuesta del servidor:', response);
            Swal.fire('Éxito', 'La unidad de medida se grabó con éxito', 'success');
            this.navegacion.navigate(['/unidadmedida']);
          },
          (error) => {
            console.error('Error al insertar:', error);
            Swal.fire('Error', 'Hubo un problema al grabar la unidad de medida', 'error');
          }
        );
      } else {
        // Actualizar unidad de medida existente
        this.unidadService.actualizar(unidadmedida).subscribe(
          (response) => {
            console.log('Respuesta del servidor:', response);
            Swal.fire('Éxito', 'La unidad de medida se modificó con éxito', 'success');
            this.navegacion.navigate(['/unidadmedida']);
          },
          (error) => {
            console.error('Error al actualizar:', error);
            Swal.fire('Error', 'Hubo un problema al modificar la unidad de medida', 'error');
          }
        );
      }
    } else {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos', 'error');
    }
  }
}