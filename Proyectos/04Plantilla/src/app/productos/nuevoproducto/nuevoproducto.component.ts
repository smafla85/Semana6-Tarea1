import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Iproveedor } from 'src/app/Interfaces/iproveedor';
import { IUnidadMedida } from 'src/app/Interfaces/iunidadmedida';
import { Iiva } from 'src/app/Interfaces/iiva';
import { IProducto } from 'src/app/Interfaces/iproducto';
import { ProveedorService } from 'src/app/Services/proveedores.service';
import { UnidadmedidaService } from 'src/app/Services/unidadmedida.service';
import { IvaService } from 'src/app/Services/iva.service';
import { ProductoService } from 'src/app/Services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevoproducto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './nuevoproducto.component.html',
  styleUrls: ['./nuevoproducto.component.scss']
})
export class NuevoproductoComponent implements OnInit {
  frm_Producto: FormGroup;
  titulo: string = 'Nuevo Producto';
  idProducto: number | null = null;
  listaUnidadMedida: IUnidadMedida[] = [];
  listaIVA: Iiva[] = [];
  listaProveedores: Iproveedor[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoServicio: ProductoService,
    private unidadMedidaServicio: UnidadmedidaService,
    private ivaServicio: IvaService,
    private proveedorServicio: ProveedorService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarListas();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.idProducto = +params['id'];
        this.titulo = 'Editar Producto';
        this.cargarProducto();
      }
    });
  }

  crearFormulario() {
    this.frm_Producto = this.fb.group({
      Codigo_Barras: ['', Validators.required],
      Nombre_Producto: ['', Validators.required],
      Graba_IVA: ['', Validators.required],
      Unidad_Medida_idUnidad_Medida: ['', Validators.required],
      IVA_idIVA: ['', Validators.required],
      Cantidad: ['', [Validators.required, Validators.min(1)]],
      Valor_Compra: ['', [Validators.required, Validators.min(0)]],
      Valor_Venta: ['', [Validators.required, Validators.min(0)]],
      Proveedores_idProveedores: ['', Validators.required]
    });
  }

  cargarListas() {
    this.unidadMedidaServicio.todos().subscribe(data => this.listaUnidadMedida = data);
    this.ivaServicio.todos().subscribe(data => this.listaIVA = data);
    this.proveedorServicio.todos().subscribe(data => this.listaProveedores = data);
  }

  cargarProducto() {
    if (this.idProducto) {
      this.productoServicio.uno(this.idProducto).subscribe({
        next: (producto: IProducto) => {
          this.frm_Producto.patchValue(producto);
        },
        error: (e) => {
          console.error('Error al cargar el producto', e);
          Swal.fire('Error', 'No se pudo cargar el producto', 'error');
        }
      });
    }
  }

  grabar() {
    if (this.frm_Producto.valid) {
      const productoData = this.frm_Producto.value;
      if (this.idProducto) {
        // Actualizar producto existente
        productoData.idProductos = this.idProducto;
        this.productoServicio.actualizar(productoData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
            this.router.navigate(['/productos']);
          },
          error: (e) => {
            console.error('Error al actualizar el producto', e);
            Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
          }
        });
      } else {
        // Insertar nuevo producto
        this.productoServicio.insertar(productoData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Producto guardado correctamente', 'success');
            this.router.navigate(['/productos']);
          },
          error: (e) => {
            console.error('Error al guardar el producto', e);
            Swal.fire('Error', 'No se pudo guardar el producto', 'error');
          }
        });
      }
    } else {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos', 'warning');
    }
  }
}