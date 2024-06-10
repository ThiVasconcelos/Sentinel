import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBadWordObject } from '../types/sentinel.types';

@Injectable({ providedIn: 'root' })
export class SentinelApi {
  constructor(private http: HttpClient) {}

  test() {
    return this.http.get('http://localhost:3000/');
  }

  getChatsData(): Observable<UserBadWordObject[]> {
    return this.http.get<UserBadWordObject[]>('http:localhost:3000/get-data');
  }

  freeUser(userData: UserBadWordObject) {
    return this.http.post('http://localhost:3000/free-user/', userData);
  }

  banUser(userData: UserBadWordObject) {
    return this.http.post('http://localhost:3000/ban-user/', userData);
  }

  timeoutUser(userData: UserBadWordObject) {
    return this.http.post('http://localhost:3000/timeout-user/', userData);
  }
}
