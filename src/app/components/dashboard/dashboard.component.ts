interface SiteStats {
  associates: number;
  top: number;
  avg: number;
  bottom: number;
  kudos: string;
}

import { Component, OnInit } from '@angular/core';
import { SiteDataService } from '../../services/site-data.service';
import { GoogleAuthService } from '../../services/google-auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [GoogleAuthService],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalAssociates = 0;
  topPerformers = 0;
  averagePerformers = 0;
  bottomPerformers = 0;

  constructor(
    private siteDataService: SiteDataService,
    private googleAuth: GoogleAuthService
  ) { }
  siteStats: any;
  selectedSite: string = 'Select Site';
  startDate: string = '';
  endDate: string = '';
  allItems: any[] = [/* your data here */];
  filteredItems: any[] = [];

  filterByDate() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    this.filteredItems = this.allItems.filter(item => {
      const itemDate = new Date(item.date); // assuming item.date is a string
      return itemDate >= start && itemDate <= end;
    });
  }

  sheetData: any[] = [];
  headers: string[] = [];


  ngOnInit(): void {
    const spreadsheetId = '1H7LdfDNYhufySKJkQYcidL6cQbOVpFisUVZqG_bKBIE';
    const range = 'TSR_LDAP_wise_Performance!B1:J100';
    const apiKey = 'AIzaSyB2Wal4dub_mS231LVH2yq_oPQBckF74Q4';

    this.googleAuth.getSheetData(spreadsheetId, range, apiKey).then(data => {
      this.headers = data[0];
      this.sheetData = data.slice(1);
      const ratingIndex = this.headers.indexOf('Rating');
      this.totalAssociates = this.sheetData.length;
      this.topPerformers = this.sheetData.filter(row => row[ratingIndex] == 5 || row[ratingIndex] == 4).length;
      this.averagePerformers = this.sheetData.filter(row => row[ratingIndex] == 3).length;
      this.bottomPerformers = this.sheetData.filter(row => row[ratingIndex] == 2 || row[ratingIndex] == 1).length;
    });
  }


  async loadData() {

    const spreadsheetId = '1H7LdfDNYhufySKJkQYcidL6cQbOVpFisUVZqG_bKBIE';

    const range = 'TSR_LDAP_wise_Performance!B1:J13';

    this.sheetData = await this.googleAuth.getSheetData(spreadsheetId, range, 'AIzaSyB2Wal4dub_mS231LVH2yq_oPQBckF74Q4');
    console.log(this.sheetData);
  }

  updateSiteData(): void {
    const data = this.siteDataService.getSiteData(this.selectedSite);
    this.siteStats = data;
  }

  updateSitePerformance(): void {
    this.updateSiteData();
  }
  selectedMission: string = '';
  missionData: { [key: string]: { name: string, score: number }[] } = {
    'CES': [
      { name: 'Compute', score: 5 },
      { name: 'DevOps', score: 4 },
      { name: 'Security', score: 5 },
      { name: 'GKE', score: 5 },
      { name: 'Networking', score: 5 },
      { name: 'Databases', score: 4 },
      { name: 'Data Analytics', score: 4 },
      { name: 'AI/ML', score: 5 },
      { name: 'Serverless', score: 5 },
      { name: 'Storage', score: 4 }
    ],
    'SDR': [
      { name: 'Compute', score: 5 },
      { name: 'DevOps', score: 4 },
      { name: 'Security', score: 5 },
      { name: 'GKE', score: 5 },
      { name: 'Networking', score: 5 },
      { name: 'Databases', score: 4 },
      { name: 'Data Analytics', score: 4 },
      { name: 'AI/ML', score: 5 },
      { name: 'Serverless', score: 5 },
      { name: 'Storage', score: 4 }
    ],
    'Escalation Rate': [
      { name: 'Preventable Escalations', score: 3 },
      { name: 'Non-Preventable Escalations', score: 2 },
    ],
    'Quality': [
      { name: 'Compute', score: 5 },
      { name: 'DevOps', score: 4 },
      { name: 'Security', score: 5 },
      { name: 'GKE', score: 5 },
      { name: 'Networking', score: 5 },
      { name: 'Databases', score: 4 },
      { name: 'Data Analytics', score: 4 },
      { name: 'AI/ML', score: 5 },
      { name: 'Serverless', score: 5 },
      { name: 'Storage', score: 4 }
    ],
    'Average FMR': [
      { name: 'Compute', score: 5 },
      { name: 'DevOps', score: 4 },
      { name: 'Security', score: 5 },
      { name: 'GKE', score: 5 },
      { name: 'Networking', score: 5 },
      { name: 'Databases', score: 4 },
      { name: 'Data Analytics', score: 4 },
      { name: 'AI/ML', score: 5 },
      { name: 'Serverless', score: 5 },
      { name: 'Storage', score: 4 }
    ],
    'Hard Consult Rate': [
      { name: 'Compute', score: 5 },
      { name: 'DevOps', score: 4 },
      { name: 'Security', score: 5 },
      { name: 'GKE', score: 5 },
      { name: 'Networking', score: 5 },
      { name: 'Databases', score: 4 },
      { name: 'Data Analytics', score: 4 },
      { name: 'AI/ML', score: 5 },
      { name: 'Serverless', score: 5 },
      { name: 'Storage', score: 4 }
    ],
    'Signal Ratio': [
      { name: 'Hard Signal Ratio', score: 4 },
      { name: 'Soft Signal Ratio', score: 3 },
    ],
    'Backlog Control Rate': [
      { name: 'Compute', score: 5 },
      { name: 'DevOps', score: 4 },
      { name: 'Security', score: 5 },
      { name: 'GKE', score: 5 },
      { name: 'Networking', score: 5 },
      { name: 'Databases', score: 4 },
      { name: 'Data Analytics', score: 4 },
      { name: 'AI/ML', score: 5 },
      { name: 'Serverless', score: 5 },
      { name: 'Storage', score: 4 }
    ],


    // add more mappings as needed
  };

  showMissions(missionType: string) {
    this.selectedMission = missionType;

    const modal = document.getElementById('missionModal');
    const missionTitle = document.getElementById('missionTitle');
    const missionList = document.getElementById('missionList');

    if (modal && missionTitle && missionList) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');

      missionTitle.textContent = missionType;

      missionList.innerHTML = ''; // Clear previous content

      const missions = this.missionData[missionType] || [];

      missions.forEach(item => {
        const row = document.createElement('li');
        row.className = 'flex justify-between items-center bg-gray-50 px-4 py-2 rounded';

        const name = document.createElement('span');
        name.className = 'text-gray-700';
        name.textContent = item.name;

        const score = document.createElement('span');
        score.className = 'text-blue-600 font-semibold';
        score.textContent = item.score.toString();

        row.appendChild(name);
        row.appendChild(score);
        missionList.appendChild(row);
      });
    }
  }


  onSiteChange(site: string): void {
    this.selectedSite = site;
    this.updateSiteData();
  }

  closeModal() {
    // Add your logic to close the modal here
    const modal = document.getElementById('missionModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showStatPopup = false;
  popupTitle = '';
  popupContent: string[] = [];
  searchTerm: string = '';
  filteredPopupContent: string[] = [];

  onSearchAssociate() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPopupContent = this.popupContent.filter(name =>
      name.toLowerCase().includes(term)
    );
  }

  showPopup(type: string) {
    this.showStatPopup = true;
    this.searchTerm = '';
    const nameIndex = this.headers.indexOf('Name');
    const ratingIndex = this.headers.indexOf('Rating');
    let filtered: any[] = [];

    switch (type) {
      case 'totalAssociates':
        this.popupTitle = 'Total Associates';
        this.popupContent = this.sheetData
          .map(row => row[nameIndex])
          .filter(name => !!name)
          .sort((a: string, b: string) => a.localeCompare(b));
        break;
      case 'topPerformers':
        this.popupTitle = 'Top Performers';
        filtered = this.sheetData.filter(row => row[ratingIndex] == 5 || row[ratingIndex] == 4);
        this.popupContent = filtered
          .map(row => row[nameIndex])
          .filter(name => !!name)
          .sort((a: string, b: string) => a.localeCompare(b));
        break;
      case 'averagePerformers':
        this.popupTitle = 'Average Performers';
        filtered = this.sheetData.filter(row => row[ratingIndex] == 3);
        this.popupContent = filtered
          .map(row => row[nameIndex])
          .filter(name => !!name)
          .sort((a: string, b: string) => a.localeCompare(b));
        break;
      case 'bottomPerformers':
        this.popupTitle = 'Bottom Performers';
        filtered = this.sheetData.filter(row => row[ratingIndex] == 2 || row[ratingIndex] == 1);
        this.popupContent = filtered
          .map(row => row[nameIndex])
          .filter(name => !!name)
          .sort((a: string, b: string) => a.localeCompare(b));
        break;
    }
    this.filteredPopupContent = [...this.popupContent];
  }

  closePopup() {
    this.showStatPopup = false;
  }
  filterStats(filterType: string) {
    // Add your filtering logic here
    // For now, just log the filter type
    console.log('Filtering stats by:', filterType);
    // Example: you might update siteStats based on the filterType
  }
}