import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { clubMemberModel } from '../models/club-member-model';

@Injectable({
  providedIn: 'root'
})
export class ClubMemberService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  fetchClubMembers(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/club-member/details`;
    return this.http.get(url);
  }

  fetchClubMemberById(clubMemberId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/club-member/${clubMemberId}`;
    return this.http.get(url);
  }

  saveClubMember(clubMemberData: clubMemberModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/club-member/create`;
    return this.http.post(url, clubMemberData);
  }

  updateClubMember(clubMemberData: clubMemberModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/club-member/update`;
    return this.http.put(url, clubMemberData);
  }

  deleteClubMember(clubMemberIds: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/club-member/delete`;
    return this.http.post(url,clubMemberIds);
  }
}
