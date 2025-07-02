import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class SiteDataService {
  private sheetUrl = 'https://script.google.com/a/macros/google.com/s/AKfycbx6GVzYexcm58lSa06MhBNSMsjpsnrv5ziGaDk4i_3AUb25F5slrJbf0FiWII_7GSvy/exec';

  // Add a BehaviorSubject for selected site
  private selectedSiteSubject = new BehaviorSubject<string>('Select Site');
  selectedSite$ = this.selectedSiteSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Fetch and parse the data
  fetchSheetData(): Observable<any[]> {
    return this.http.get(this.sheetUrl, { responseType: 'text' }).pipe(
      map(csv => Papa.parse(csv, { header: true }).data)
    );
  }

  // Set the selected site
  setSelectedSite(site: string) {
    this.selectedSiteSubject.next(site);
  }

  // Get data for a specific site (filtering logic as needed)
  getSiteData(site: string): Observable<any[]> {
    return this.fetchSheetData().pipe(
      map(data => site === 'Select Site' ? data : data.filter(item => item.site === site))
    );
  }
}