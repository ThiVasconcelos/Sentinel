import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatInfo, UserBadWordObject } from '../types/sentinel.types';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SentinelApi {
  constructor(private http: HttpClient) {}

  hasAnotherInfractionOccurred(lastDate: Date) {
    return this.http.get<{ occurred: boolean }>(`${environment.apiUrl}/admin/notification`, {
      params: { date: lastDate.toISOString() },
    });
  }

  getChatsData(): Observable<{ data: UserBadWordObject[]; chats: ChatInfo[] }> {
    return this.http.get<{ data: UserBadWordObject[]; chats: ChatInfo[] }>(
      `${environment.apiUrl}/admin/get-data`
    );
  }

  freeUser(userData: UserBadWordObject) {
    return this.http.post(`${environment.apiUrl}/admin/free-user/`, userData);
  }

  banUser(userData: UserBadWordObject) {
    return this.http.post(`${environment.apiUrl}/admin/ban-user/`, userData);
  }

  timeoutUser(userData: UserBadWordObject) {
    return this.http.post(`${environment.apiUrl}/admin/timeout-user/`, userData);
  }
}
