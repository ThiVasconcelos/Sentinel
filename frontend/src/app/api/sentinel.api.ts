import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatInfo, UserBadWordObject } from '../types/sentinel.types';

@Injectable({ providedIn: 'root' })
export class SentinelApi {
  constructor(private http: HttpClient) {}

  hasAnotherInfractionOccurred(lastDate: Date) {
    return this.http.get<{ occurred: boolean }>('http://localhost:3000/admin/notification', {
      params: { date: lastDate.toISOString() },
    });
  }

  getChatsData(): Observable<{ data: UserBadWordObject[]; chats: ChatInfo[] }> {
    return this.http.get<{ data: UserBadWordObject[]; chats: ChatInfo[] }>(
      'http://localhost:3000/admin/get-data'
    );
  }

  freeUser(userData: UserBadWordObject) {
    return this.http.post('http://localhost:3000/admin/free-user/', userData);
  }

  banUser(userData: UserBadWordObject) {
    return this.http.post('http://localhost:3000/admin/ban-user/', userData);
  }

  timeoutUser(userData: UserBadWordObject) {
    return this.http.post('http://localhost:3000/admin/timeout-user/', userData);
  }
}
