// src/app/services/waste-pickup.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WastePickupService {
  private apiUrl = 'http://localhost:3000/api/pickups';

  constructor(private http: HttpClient) {}

  schedulePickup(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
