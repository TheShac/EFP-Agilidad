import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:3000';

export interface SupervisorDTO {
  id: number;
  rut: string;
  nombre: string;
  rol?: string | null;
  cargo?: string | null;
  email?: string | null;
  telefono?: string | null;
  empresaId?: number;
  
  // Campos de compatibilidad temporal (deprecados)
  correo?: string | null; // usar email
}

export type TipoEmpresa = 'PRIVADA' | 'PUBLICA' | 'MIXTA' | 'ONG';
export type TamanoEmpresa = 'MICRO' | 'PEQUENA' | 'MEDIANA' | 'GRANDE';
export type EstadoEmpresa = 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA';

export interface EmpresaDTO {
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
  supervisores?: SupervisorDTO[];
  
  // Campos de compatibilidad temporal (deprecados)
  nombre?: string; // usar razonSocial
  correo?: string; // usar email
  convenio?: string | null;
  url_rrss?: string | null;
  nombre_calle?: string | null;
  numero_calle?: number | null;
  trabajadores?: SupervisorDTO[]; // usar supervisores
}

export interface PagedResult<T> {
  items: T[]; page: number; limit: number; total: number; pages: number;
}

// Alias para compatibilidad temporal con componentes antiguos
export type CentroEducativoDTO = EmpresaDTO;
export type TrabajadorDTO = SupervisorDTO;

@Injectable({ providedIn: 'root' })
export class CentrosApiService {
  private http = inject(HttpClient);

  list(params?: { page?: number; limit?: number; search?: string; tipo?: string; estado?: string; }): Observable<PagedResult<EmpresaDTO>> {
    let p = new HttpParams();
    if (params?.page)  p = p.set('page', params.page);
    if (params?.limit) p = p.set('limit', params.limit);
    if (params?.search) p = p.set('search', params.search);
    if (params?.tipo) p = p.set('tipo', params.tipo);
    if (params?.estado) p = p.set('estado', params.estado);
    return this.http.get<PagedResult<EmpresaDTO>>(`${API}/centros`, { params: p });
  }

  getById(id: number): Observable<EmpresaDTO> {
    return this.http.get<EmpresaDTO>(`${API}/centros/${id}`);
  }

  create(body: {
    rut: string;
    razonSocial: string;
    nombreFantasia?: string;
    tipo: TipoEmpresa;
    tamano?: TamanoEmpresa;
    region: string;
    comuna: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    sitioWeb?: string;
    estado?: EstadoEmpresa;
    observaciones?: string;
  }) {
    const isValidEmail = (e?: string) => !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

    const payload = {
      rut: body.rut,
      razonSocial: body.razonSocial,
      nombreFantasia: body.nombreFantasia ?? null,
      tipo: body.tipo,
      tamano: body.tamano ?? null,
      region: body.region,
      comuna: body.comuna,
      direccion: body.direccion ?? null,
      telefono: body.telefono ?? null,
      email: isValidEmail(body.email as string | undefined) ? (body.email as string).trim() : undefined,
      sitioWeb: body.sitioWeb ?? null,
      estado: body.estado ?? 'ACTIVA',
      observaciones: body.observaciones ?? null,
    };
    return this.http.post<EmpresaDTO>(`${API}/centros`, payload);
  }

  update(id: number, body: Partial<EmpresaDTO>) {
    const isValidEmail = (e?: string) => !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

    const payload: any = {};
    if (body.rut !== undefined) payload.rut = body.rut;
    if (body.razonSocial !== undefined) payload.razonSocial = body.razonSocial;
    if (body.nombreFantasia !== undefined) payload.nombreFantasia = body.nombreFantasia ?? null;
    if (body.tipo !== undefined) payload.tipo = body.tipo;
    if (body.tamano !== undefined) payload.tamano = body.tamano ?? null;
    if (body.region !== undefined) payload.region = body.region;
    if (body.comuna !== undefined) payload.comuna = body.comuna;
    if (body.direccion !== undefined) payload.direccion = body.direccion ?? null;
    if (body.telefono !== undefined) payload.telefono = body.telefono ?? null;
    if (body.email !== undefined) payload.email = isValidEmail(body.email as string | undefined) ? (body.email as string).trim() : undefined;
    if (body.sitioWeb !== undefined) payload.sitioWeb = body.sitioWeb ?? null;
    if (body.estado !== undefined) payload.estado = body.estado;
    if (body.observaciones !== undefined) payload.observaciones = body.observaciones ?? null;

    return this.http.patch<EmpresaDTO>(`${API}/centros/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${API}/centros/${id}`);
  } 
}
