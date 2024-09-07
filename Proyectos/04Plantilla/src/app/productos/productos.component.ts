import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProductoService } from '../Services/productos.service';
import { IProducto } from '../Interfaces/iproducto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../theme/shared/shared.module';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, SharedModule]
})
export class ProductosComponent implements OnInit {
  listaproductos: IProducto[] = [];

  constructor(
    private productoServicio: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargaproductos();
  }

  cargaproductos() {
    this.productoServicio.todos().subscribe({
      next: (data) => {
        this.listaproductos = data;
      },
      error: (e) => {
        console.error('Error al cargar productos', e);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      }
    });
  }

  editar(idProductos: number) {
    this.router.navigate(['/editarproducto', idProductos]);
  }

  eliminar(idProductos: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServicio.eliminar(idProductos).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El producto ha sido eliminado',
              'success'
            );
            this.cargaproductos(); // Recargar la lista después de eliminar
          },
          error: (e) => {
            console.error('Error al eliminar el producto', e);
            Swal.fire(
              'Error',
              'No se pudo eliminar el producto',
              'error'
            );
          }
        });
      }
    });
  }

  nuevoProducto() {
    this.router.navigate(['/nuevoproducto']);
  }

  // Método opcional para el seguimiento de elementos en ngFor
  trackByFn(index: number, item: IProducto) {
    return item.idProductos;
  }
}