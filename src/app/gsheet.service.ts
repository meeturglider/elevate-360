import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GsheetService {
  private apiKey = 'AIzaSyB2Wal4dub_mS231LVH2yq_oPQBckF74Q4';
  private sheetId = '1Uk66AjHDwqEzJBfp3aeu4w8ZKElv7gRuZLX0Lhvvu_E';
  private sheetName = 'Summary'; // or actual tab name

  constructor(private http: HttpClient) {}

  fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${this.sheetName}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(res => res.values) 
    );
  }
}



