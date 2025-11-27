import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/colaboradores';

export type RolSupervisor = 'SUPERVISOR_DIRECTO' | 'TUTOR_ACADEMICO' | 'COORDINADOR' | 'EVALUADOR';

export interface Colaborador {
  id: number;
  rut: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: RolSupervisor;
  cargo?: string;
  area?: string;
  profesion?: string;
  aniosExperiencia?: number;
  empresaId: number;
  activo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Campos de compatibilidad temporal (deprecados)
  correo?: string; // usar email
  tipo?: string; // usar rol
  direccion?: string;
  universidad_egreso?: string; // usar profesion
}

export interface ColaboradorResponse {
  items: Colaborador[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface QueryColaboradorParams {
  rol?: RolSupervisor;
  empresaId?: number;
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: 'nombre' | 'createdAt';
  orderDir?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class ColaboradoresService {
  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de colaboradores con filtros opcionales
   */
  listar(params?: QueryColaboradorParams): Observable<ColaboradorResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof QueryColaboradorParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ColaboradorResponse>(API_URL, { params: httpParams });
  }

  /**
   * Obtener un colaborador por ID
   */
  obtenerPorId(id: number): Observable<Colaborador> {
    return this.http.get<Colaborador>(`${API_URL}/${id}`);
  }

  /**
   * Crear un nuevo colaborador
   */
  crear(colaborador: Partial<Colaborador>): Observable<Colaborador> {
    return this.http.post<Colaborador>(API_URL, colaborador);
  }

  /**
   * Actualizar un colaborador existente
   */
  actualizar(id: number, colaborador: Partial<Colaborador>): Observable<Colaborador> {
    return this.http.patch<Colaborador>(`${API_URL}/${id}`, colaborador);
  }

  /**
   * Eliminar un colaborador
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}

