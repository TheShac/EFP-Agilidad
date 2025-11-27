import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatCardModule }   from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// APIs
import { CentrosApiService, EmpresaDTO, SupervisorDTO, TipoEmpresa, TamanoEmpresa, EstadoEmpresa } from '../../services/centros-api.service';
import { TrabajadoresApiService } from '../../services/trabajadores-api.service';

// Interfaz actualizada para el nuevo modelo multi-empresa
interface CentroEducativo {
  id: number;
  rut: string;
  razonSocial: string;
  nombreFantasia?: string | null;
  tipo: TipoEmpresa;
  tamano?: TamanoEmpresa | null;
  region: string;
  comuna: string;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  sitioWeb?: string | null;
  estado?: EstadoEmpresa;
  observaciones?: string | null;
}

type CentroDetalle = CentroEducativo & {
  supervisores?: SupervisorDTO[];
};

@Component({
  standalone: true,
  selector: 'app-centros-educativos',
  templateUrl: './centros-educativos.component.html',
  styleUrls: ['./centros-educativos.component.scss'],
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule
  ]
})
export class CentrosEducativosComponent {
  private snack = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);

  // APIs
  private centrosApi = inject(CentrosApiService);
  private trabajadoresApi = inject(TrabajadoresApiService);

  // ===== UI =====
  showForm = false;
  isEditing = false;
  sortAZ = true;

  // ===== filtros (lista) =====
  searchTerm = '';
  selectedTipo: 'all' | TipoEmpresa = 'all';

  // ===== regiones y comunas ===== 
  readonly REGIONES: { nombre: string; comunas: string[] }[] = [
    { nombre: 'Región de Arica y Parinacota', comunas: ['Arica','Camarones','Putre','General Lagos'] },
    { nombre: 'Región de Tarapacá', comunas: ['Iquique','Alto Hospicio','Pozo Almonte','Camiña','Colchane','Huara','Pica'] },
    { nombre: 'Región de Antofagasta', comunas: ['Antofagasta','Mejillones','Sierra Gorda','Taltal','Calama','Ollagüe','San Pedro de Atacama','Tocopilla','María Elena'] },
    { nombre: 'Región de Atacama', comunas: ['Copiapó','Caldera','Tierra Amarilla','Chañaral','Diego de Almagro','Vallenar','Freirina','Huasco','Alto del Carmen'] },
    { nombre: 'Región de Coquimbo', comunas: ['La Serena','Coquimbo','Andacollo','La Higuera','Paihuano','Vicuña','Illapel','Canela','Los Vilos','Salamanca','Ovalle','Combarbalá','Monte Patria','Punitaqui','Río Hurtado'] },
    { nombre: 'Región de Valparaíso', comunas: ['Valparaíso','Viña del Mar','Concón','Quilpué','Villa Alemana','Casablanca','Quintero','Puchuncaví','Limache','Olmué','San Antonio','Cartagena','El Quisco','El Tabo','Algarrobo','Santo Domingo','La Ligua','Cabildo','Papudo','Zapallar','Petorca','San Felipe','Llaillay','Catemu','Panquehue','Putaendo','Santa María','Los Andes','Calle Larga','Rinconada','San Esteban','Isla de Pascua','Juan Fernández'] },
    { nombre: 'Región del Libertador General Bernardo O’Higgins', comunas: ['Rancagua','Machalí','Graneros','Doñihue','Requínoa','Rengo','Malloa','San Vicente','Las Cabras','Peumo','Pichidegua','San Fernando','Nancagua','Chimbarongo','Placilla','Santa Cruz','Lolol','Pumanque','Peralillo','Marchigüe','Pichilemu','La Estrella','Litueche','Navidad'] },
    { nombre: 'Región del Maule', comunas: ['Talca','San Clemente','Pelarco','Río Claro','Maule','San Rafael','Curepto','Constitución','Empedrado','Linares','Colbún','Yerbas Buenas','Villa Alegre','Longaví','Retiro','Parral','Cauquenes','Chanco','Pelluhue','Curicó','Teno','Romeral','Rauco','Sagrada Familia','Hualañé','Licantén','Vichuquén'] },
    { nombre: 'Región de Ñuble', comunas: ['Chillán','Chillán Viejo','Bulnes','Quillón','San Ignacio','Pinto','El Carmen','Yungay','Pemuco','Ñiquén','San Carlos','Coihueco','San Fabián','San Nicolás','Trehuaco','Ninhue','Portezuelo','Cobquecura','Coelemu','Quirihue'] },
    { nombre: 'Región del Biobío', comunas: ['Concepción','Talcahuano','Hualpén','San Pedro de la Paz','Chiguayante','Penco','Tomé','Florida','Hualqui','Coronel','Lota','Santa Juana','Los Ángeles','Mulchén','Nacimiento','Negrete','San Rosendo','Laja','Yumbel','Cabrero','Tucapel','Antuco','Quilleco','Santa Bárbara','Quilaco','Alto Biobío','Arauco','Curanilahue','Lebu','Los Álamos','Cañete','Contulmo','Tirúa'] },
    { nombre: 'Región de La Araucanía', comunas: ['Temuco','Padre Las Casas','Vilcún','Lautaro','Perquenco','Galvarino','Nueva Imperial','Carahue','Saavedra','Toltén','Teodoro Schmidt','Pitrufquén','Gorbea','Loncoche','Villarrica','Pucón','Curarrehue','Freire','Melipeuco','Cunco','Angol','Renaico','Collipulli','Ercilla','Los Sauces','Traiguén','Lumaco','Purén','Victoria','Curacautín','Lonquimay'] },
    { nombre: 'Región de Los Ríos', comunas: ['Valdivia','Corral','Lanco','Mariquina','Máfil','Los Lagos','Paillaco','Panguipulli','La Unión','Futrono','Lago Ranco','Río Bueno'] },
    { nombre: 'Región de Los Lagos', comunas: ['Puerto Montt','Puerto Varas','Frutillar','Llanquihue','Cochamó','Calbuco','Maullín','Los Muermos','Osorno','Puerto Octay','Purranque','Puyehue','Río Negro','San Juan de la Costa','San Pablo','Castro','Ancud','Quellón','Dalcahue','Curaco de Vélez','Puqueldón','Queilén','Quinchao','Chonchi','Quemchi'] },
    { nombre: 'Región de Aysén del General Carlos Ibáñez del Campo', comunas: ['Coyhaique','Lago Verde','Aysén','Cisnes','Guaitecas','Cochrane','O’Higgins','Tortel','Chile Chico','Río Ibáñez'] },
    { nombre: 'Región de Magallanes y de la Antártica Chilena', comunas: ['Punta Arenas','Río Verde','Laguna Blanca','San Gregorio','Porvenir','Primavera','Timaukel','Puerto Natales','Torres del Paine','Cabo de Hornos','Antártica'] },
    { nombre: 'Región Metropolitana de Santiago', comunas: ['Santiago','Cerrillos','Cerro Navia','Conchalí','El Bosque','Estación Central','Huechuraba','Independencia','La Cisterna','La Florida','La Granja','La Pintana','La Reina','Las Condes','Lo Barnechea','Lo Espejo','Lo Prado','Macul','Maipú','Ñuñoa','Pedro Aguirre Cerda','Peñalolén','Providencia','Pudahuel','Quilicura','Quinta Normal','Recoleta','Renca','San Joaquín','San Miguel','San Ramón','Vitacura','Puente Alto','Pirque','San José de Maipo','Colina','Lampa','Tiltil','Melipilla','María Pinto','Curacaví','Alhué','San Pedro','Talagante','El Monte','Isla de Maipo','Padre Hurtado','Peñaflor'] },
  ];
  comunasFiltradas: string[] = [];

  // ===== formulario =====
  editId: number | null = null;
  newCentroEducativo: Partial<CentroEducativo> = {
    rut: '',
    razonSocial: '',
    nombreFantasia: '',
    tipo: 'PRIVADA',
    tamano: 'MEDIANA',
    region: '',
    comuna: '',
    direccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    estado: 'ACTIVA',
    observaciones: '',
  };

  // ===== contactos (modal nuevo) =====
  contactosForm = {
    directorNombre: '', directorRut: '', directorCorreo: '', directorTelefono: '',
    utpNombre: '',      utpRut: '',      utpCorreo: '',      utpTelefono: '',
  };
  private contactoDirectorId: number | null = null;
  private contactoUtpId: number | null = null;

  // ===== datos (lista) =====
  centrosEducativos: CentroEducativo[] = [];

  // dialog detalles
  selectedCentroEducativo: CentroDetalle | null = null;
  detalleCargando = false;

  // confirm delete
  pendingDelete: CentroEducativo | null = null;

  // modal contactos (nuevo)
  contactsForCentro: CentroEducativo | null = null;

  constructor() { this.load(); }

  // ===== carga lista desde backend =====
  load() {
    this.centrosApi.list({ page: 1, limit: 1000 }).subscribe({
      next: (r) => { this.centrosEducativos = (r.items ?? []).map(this.mapDTOtoUI); },
      error: () => this.snack.open('No se pudieron cargar los centros', 'Cerrar', { duration: 2500 })
    });
  }

  private mapDTOtoUI = (dto: EmpresaDTO): CentroEducativo => ({
    id: dto.id,
    rut: dto.rut,
    razonSocial: dto.razonSocial,
    nombreFantasia: dto.nombreFantasia ?? undefined,
    tipo: dto.tipo,
    tamano: dto.tamano ?? undefined,
    region: dto.region,
    comuna: dto.comuna,
    direccion: dto.direccion ?? undefined,
    telefono: dto.telefono ?? undefined,
    email: dto.email ?? undefined,
    sitioWeb: dto.sitioWeb ?? undefined,
    estado: dto.estado ?? 'ACTIVA',
    observaciones: dto.observaciones ?? undefined,
  });

  // ===== helpers UI =====
  toggleForm() { this.showForm = !this.showForm; if (!this.showForm) this.resetForm(); }

  onRegionChange() {
    const region = this.newCentroEducativo.region || '';
    const reg = this.REGIONES.find(r => r.nombre === region);
    this.comunasFiltradas = reg ? reg.comunas : [];
    if (!this.comunasFiltradas.includes(this.newCentroEducativo.comuna || '')) {
      this.newCentroEducativo.comuna = '';
    }
  }

  private resetForm() {
    this.isEditing = false;
    this.editId = null;
    this.newCentroEducativo = {
      rut: '',
      razonSocial: '',
      nombreFantasia: '',
      tipo: 'PRIVADA',
      tamano: 'MEDIANA',
      region: '',
      comuna: '',
      direccion: '',
      telefono: '',
      email: '',
      sitioWeb: '',
      estado: 'ACTIVA',
      observaciones: '',
    };
    this.comunasFiltradas = [];
    this.contactosForm = {
      directorNombre: '', directorRut: '', directorCorreo: '', directorTelefono: '',
      utpNombre: '',      utpRut: '',      utpCorreo: '',      utpTelefono: '',
    };
    this.contactoDirectorId = null;
    this.contactoUtpId = null;
    this.selectedCentroEducativo = null;
  }

  // ===== CRUD centro =====
  addOrUpdateCentro() {
    const c = this.newCentroEducativo;
    if (!c.rut?.trim() || !c.razonSocial?.trim() || !c.tipo || !c.region || !c.comuna) {
      this.snack.open('Debe completar RUT, Razón Social, Tipo, Región y Comuna.', 'Cerrar', { duration: 2500 });
      return;
    }

    const payload: Partial<EmpresaDTO> = {
      rut: c.rut!.trim(),
      razonSocial: c.razonSocial!.trim(),
      nombreFantasia: c.nombreFantasia?.trim() || undefined,
      tipo: c.tipo,
      tamano: c.tamano || undefined,
      region: c.region!,
      comuna: c.comuna!,
      direccion: c.direccion?.trim() || undefined,
      telefono: c.telefono?.trim() || undefined,
      email: c.email?.trim() || undefined,
      sitioWeb: c.sitioWeb?.trim() || undefined,
      estado: c.estado || 'ACTIVA',
      observaciones: c.observaciones?.trim() || undefined,
    };

    const req$ = (this.isEditing && this.editId != null)
      ? this.centrosApi.update(this.editId, payload)
      : this.centrosApi.create(payload as any);

    req$.subscribe({
      next: () => {
        const msg = this.isEditing ? '✓ Empresa actualizada correctamente' : '✓ Empresa agregada correctamente';
        this.snack.open(msg, 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });
        this.toggleForm(); this.resetForm(); this.load();
      },
      error: (err) => this.snack.open(`Error: ${err.error?.message || 'No se pudo guardar'}`, 'Cerrar', { duration: 3000 })
    });
  }

  editCentro(c: CentroEducativo) {
    this.isEditing = true;
    this.editId = c.id;
    this.showForm = true;
    this.newCentroEducativo = { ...c };
    this.onRegionChange();
  }

  // ===== Confirmación de eliminación =====
  askDelete(c: CentroEducativo) { this.pendingDelete = c; }
  cancelDelete() { this.pendingDelete = null; }

  confirmDelete() {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;

    this.centrosApi.delete(id).subscribe({
      next: () => {
        this.snack.open('✓ Centro eliminado correctamente', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });
        this.pendingDelete = null;
        this.load();
      },
      error: () => {
        this.snack.open('No se pudo eliminar.', 'Cerrar', { duration: 2500 });
        this.pendingDelete = null;
      }
    });
  }

  // ===== Detalles =====
  viewCentro(c: CentroEducativo) {
    this.detalleCargando = true;
    this.selectedCentroEducativo = null;

    this.centrosApi.getById(c.id).subscribe({
      next: (full) => {
        const base = this.mapDTOtoUI(full);
        this.selectedCentroEducativo = { ...base, supervisores: full.supervisores ?? [] };
        this.detalleCargando = false;
      },
      error: () => {
        this.detalleCargando = false;
        this.snack.open('No se pudo cargar el detalle.', 'Cerrar', { duration: 2500 });
      }
    });
  }
  closeDetails() { this.selectedCentroEducativo = null; }

  // ===== Añadir/Editar contactos (modal) =====
  openContacts(c: CentroEducativo) {
    this.contactsForCentro = c;

    // reset
    this.contactoDirectorId = null;
    this.contactoUtpId = null;
    this.contactosForm = {
      directorNombre: '', directorRut: '', directorCorreo: '', directorTelefono: '',
      utpNombre: '',      utpRut: '',      utpCorreo: '',      utpTelefono: '',
    };

    // preload DIRECTOR
    this.trabajadoresApi.list({ centroId: c.id, rol: 'Director', page: 1, limit: 1 }).subscribe({
      next: r => {
        const d = r.items?.[0];
        if (d) {
          this.contactoDirectorId = d.id;
          this.contactosForm.directorNombre = d.nombre || '';
          this.contactosForm.directorRut = d.rut || '';
          this.contactosForm.directorCorreo = d.correo || '';
          this.contactosForm.directorTelefono = d.telefono != null ? String(d.telefono) : '';
        }
      }
    });

    // preload UTP
    this.trabajadoresApi.list({ centroId: c.id, rol: 'UTP', page: 1, limit: 1 }).subscribe({
      next: r => {
        const u = r.items?.[0];
        if (u) {
          this.contactoUtpId = u.id;
          this.contactosForm.utpNombre = u.nombre || '';
          this.contactosForm.utpRut = u.rut || '';
          this.contactosForm.utpCorreo = u.correo || '';
          this.contactosForm.utpTelefono = u.telefono != null ? String(u.telefono) : '';
        }
      }
    });
  }

  closeContacts() { this.contactsForCentro = null; }

  saveContactsForCentro() {
    if (!this.contactsForCentro) return;
    const centroId = this.contactsForCentro.id;

    const toNum = (v?: string | number | null) => {
      const s = (v ?? '').toString().trim();
      return s !== '' ? Number(s) : null;
    };

    const ops: Promise<any>[] = [];

    // DIRECTOR
    if ((this.contactosForm.directorNombre || '').trim() !== '') {
      const base = {
        rut: (this.contactosForm.directorRut || `TEMP-Director-${centroId}-${Date.now()}`).trim(),
        nombre: this.contactosForm.directorNombre.trim(),
        correo: this.contactosForm.directorCorreo?.trim() || undefined,
        telefono: toNum(this.contactosForm.directorTelefono),
        rol: 'Director',
        centroId,
      };
      if (this.contactoDirectorId) ops.push(this.trabajadoresApi.update(this.contactoDirectorId, base).toPromise());
      else ops.push(this.trabajadoresApi.create(base).toPromise());
    }

    // UTP
    if ((this.contactosForm.utpNombre || '').trim() !== '') {
      const base = {
        rut: (this.contactosForm.utpRut || `TEMP-UTP-${centroId}-${Date.now()}`).trim(),
        nombre: this.contactosForm.utpNombre.trim(),
        correo: this.contactosForm.utpCorreo?.trim() || undefined,
        telefono: toNum(this.contactosForm.utpTelefono),
        rol: 'UTP',
        centroId,
      };
      if (this.contactoUtpId) ops.push(this.trabajadoresApi.update(this.contactoUtpId, base).toPromise());
      else ops.push(this.trabajadoresApi.create(base).toPromise());
    }

    Promise.all(ops).then(() => {
      this.snack.open('✓ Contactos guardados correctamente', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
      });
      this.closeContacts();
      this.load();
    }).catch(() => {
      this.snack.open('✗ Error al guardar contactos', 'Cerrar', { duration: 3500 });
    });
  }

  // ===== orden y filtro =====
  toggleSort() { this.sortAZ = !this.sortAZ; }

  filteredCentros(): CentroEducativo[] {
    const t = this.searchTerm.trim().toLowerCase();
    let list = this.centrosEducativos.filter(c => {
      const matchSearch =
        !t ||
        c.razonSocial.toLowerCase().includes(t) ||
        (c.nombreFantasia || '').toLowerCase().includes(t) ||
        c.region.toLowerCase().includes(t) ||
        c.comuna.toLowerCase().includes(t) ||
        (c.tipo || '').toString().toLowerCase().includes(t);
      const matchTipo = this.selectedTipo === 'all' || c.tipo === this.selectedTipo;
      return matchSearch && matchTipo;
    });
    list = [...list].sort((a, b) => this.sortAZ ? a.razonSocial.localeCompare(b.razonSocial) : b.razonSocial.localeCompare(a.razonSocial));
    return list;
  }
}
