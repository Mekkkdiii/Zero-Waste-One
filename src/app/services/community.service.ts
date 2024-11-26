// src/app/services/community.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private apiUrl = 'http://localhost:3000/api/communities';

  constructor(private http: HttpClient) {}

  private communities = [
    { name: 'Community A', postalCode: '12345' },
    { name: 'Community B', postalCode: '67890' },
  ];

  getAllCommunities(): Observable<{ name: string; postalCode: string }[]> {
    return of(this.communities); // Simulating an API response
  }

  getCommunity(name: string): Observable<{ name: string; postalCode: string } | undefined> {
    const community = this.communities.find((c) => c.name === name);
    return of(community);
  }

  createCommunity(community: { name: string; address: string }): Observable<void> {
    this.communities.push({ ...community, postalCode: 'New Postal Code' });
    return of(); // Simulating successful creation
  }
}
