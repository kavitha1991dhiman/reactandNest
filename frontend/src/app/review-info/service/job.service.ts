import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
import { ScheduledTask } from '../../create-schedule/model/scheduled-task';
import { Injectable } from '@angular/core';


const SERVER_URL = environment.baseUrl;

@Injectable({
    providedIn: "root"
})
export class JobService {
    resourcePath = SERVER_URL + "job/";
    constructor(private http: HttpClient) { }

    getJobs(): Observable<any[]> {
        return this.http.get<any[]>(this.resourcePath);
    }

    getJobHistory(): Observable<any[]> {
        return this.http.get<any[]>(this.resourcePath+"history");
    }

    deleteJob(id): Promise<any> {
        return this.http.delete(this.resourcePath + id).toPromise();
    }

    createJob(data): Promise<any> {
        return this.http.post(this.resourcePath, data).toPromise();
    }
}