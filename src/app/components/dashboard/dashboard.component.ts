interface SiteStats {
  associates: number;
  top: number;
  avg: number;
  bottom: number;
  kudos: string;
}
interface Person {
  name: string;
  status: string;
  specialization: string;
}
interface CesData {
  string_field_6: string;
  string_field_9: string;
}

import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CesDataService } from '../../services/ces-data.service';
import { SiteService } from '../../services/site-data.service';

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
    // private siteDataService: SiteDataService,
    private googleAuth: GoogleAuthService,
    private cesDataService: CesDataService,
    private siteService: SiteService
  ) { }
  selectedSite: string = 'Select Site';

  selectedSpecialization: string = 'All Specializations';
  specializations: string[] = [
    'All Specializations',
    'Compute',
    'DevOps',
    'Security',
    'GKE',
    'Networking',
    'Databases',
    'Data Analytics',
    'AI/ML',
    'Serverless',
    'Storage'
  ];

  siteStats: any;
  startDate: string = '';
  endDate: string = '';
  allItems: any[] = [];
  filteredItems: any[] = [];
  searchTerm: string = '';
  filteredPopupContent: string[] = [];
  cesData: any[] = [];
  sheetData: any[] = [];
  headers: string[] = [];
  trainingSheetHeaders: string[] = [];
  trainingSheetData: any[] = [];
  nestedCount = 0;
  readyCount = 0;
  trainingCount = 0;
  onboardingCount = 0;
  data: Person[] = [];


  onSearchAssociate() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPopupContent = this.popupContent.filter(name =>
      name.toLowerCase().includes(term)
    );
  }
  filterByDate() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    this.filteredItems = this.allItems.filter(item => {
      const itemDate = new Date(item.date); // assuming item.date is a string
      return itemDate >= start && itemDate <= end;
    });
  }


  ngOnInit(): void {
    this.siteService.selectedSite$.subscribe(site => {
      this.selectedSite = site ?? '';
    });
    const spreadsheetId = '1mfnbjmMP6nUavrjlV5C_g7W1S4Hx72jABsfY-aQiT10';
    const range = 'TSR_LDAP_wise_Performance!A1:D189';
    const apiKey = 'AIzaSyB2Wal4dub_mS231LVH2yq_oPQBckF74Q4';
    this.googleAuth.getSheetData(spreadsheetId, range, apiKey).then(data => {
      if (!data || !Array.isArray(data) || data.length === 0) {
        return;
      } 
      //columns
      this.headers = data[0];
      this.sheetData = data.slice(1);
      const ratingIndex = this.headers.indexOf('Rating');
      const nameIndex = this.headers.indexOf('Name');
      const statusIndex = this.headers.indexOf('Status');
      const specializationIndex = this.headers.indexOf('Specialization');
      //stat grid
      this.totalAssociates = this.sheetData.length;
      this.topPerformers = this.sheetData.filter(row => row[ratingIndex] == 5 || row[ratingIndex] == 4).length;
      this.averagePerformers = this.sheetData.filter(row => row[ratingIndex] == 3).length;
      this.bottomPerformers = this.sheetData.filter(row => row[ratingIndex] == 2 || row[ratingIndex] == 1).length;

      this.data = this.sheetData
        .map(row => ({
          name: row[nameIndex]?.trim(),
          status: row[statusIndex]?.trim(),
          specialization: row[specializationIndex]?.trim()
        }))
        .filter(row => row.name && row.status && row.specialization);
      this.calculateCounts();
    });
    this.fetchTrainingSheetData();
    this.cesDataService.getCesData().subscribe((data: CesData[]) => {
      this.cesData = data;
    });
  }

  showCesPopup = false;
  openCesPopup() {
    this.showCesPopup = true;
  }
  closeCesPopup() {
    this.showCesPopup = false;
  }

  async loadData() {
    const spreadsheetId = '1mfnbjmMP6nUavrjlV5C_g7W1S4Hx72jABsfY-aQiT10';
    const range = 'TSR_LDAP_wise_Performance!A1:D189';
    this.sheetData = await this.googleAuth.getSheetData(spreadsheetId, range, 'AIzaSyB2Wal4dub_mS231LVH2yq_oPQBckF74Q4');
  }

  fetchTrainingSheetData() {
    const spreadsheetId = '1mfnbjmMP6nUavrjlV5C_g7W1S4Hx72jABsfY-aQiT10';
    const range = 'Training!A1:C21';
    const apiKey = 'AIzaSyB2Wal4dub_mS231LVH2yq_oPQBckF74Q4';

    this.googleAuth.getSheetData(spreadsheetId, range, apiKey).then(data => {
      this.trainingSheetHeaders = data[0];
      const nameIndex = this.trainingSheetHeaders.indexOf('Name');
      const statusIndex = this.trainingSheetHeaders.indexOf('Status');
      const rows = data.slice(1);
      const specIndex = this.trainingSheetHeaders.indexOf('Specialization');

      this.data = rows
        .map(row => ({
          name: row[nameIndex]?.trim(),
          status: row[statusIndex]?.trim(),
          specialization: row[specIndex]?.trim()
        }))
        .filter(row => row.name && row.status && row.specialization);

      this.calculateCounts();
    });
  }

  calculateCounts() {
    const filtered = this.selectedSpecialization === 'All Specializations'
      ? this.data
      : this.data.filter(d =>
        d.specialization.toLowerCase() === this.selectedSpecialization.toLowerCase()
      );
    this.nestedCount = filtered.filter(d => d.status?.toLowerCase() === 'nested').length;
    this.readyCount = filtered.filter(d => d.status?.toLowerCase() === 'ready').length;
    this.trainingCount = this.nestedCount + this.readyCount;
    this.onboardingCount = filtered.filter(d => d.status?.toLowerCase() === 'onboarding').length;
  }
  selectedMission: string = '';
  missionData: { [key: string]: { name: string, score: number }[] } = {
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
      missionList.innerHTML = '';
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

  closeModal() {
    const modal = document.getElementById('missionModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showStatPopup = false;
  popupTitle = '';
  popupContent: string[] = [];

  showPopup(type: string) {
    this.showStatPopup = true;
    this.searchTerm = '';

    const nameIndex = this.headers.findIndex(h => h?.toLowerCase().trim() === 'name');
    const ratingIndex = this.headers.findIndex(h => h?.toLowerCase().trim() === 'rating');

    if (nameIndex === -1 || ratingIndex === -1) {
      console.error('Name or Rating column not found. Headers:', this.headers);
      this.popupContent = ['Error: Name/Rating header not found.'];
      this.filteredPopupContent = [...this.popupContent];
      return;
    }

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
    console.log('Filtering stats by:', filterType);
  }

  //my actions
  supportability = [
  "Set up a custom container for model serving",
  "Request for training in GENAI",
  "Review and update support documentation"
];
escalations = [
  "Escalation 1: AI/ML - High Priority",
  "Escalation 2: Serverless - Medium Priority",
  "Escalation 3: Data Analytics - Low Priority"
];
teamGrowthPlan = [
  "Conduct one-on-one meetings with team members",
  "Identify skill gaps and training needs",
  "Set individual performance goals"
];

showActionPopup = false;
actionPopupTitle = '';
actionPopupList: string[] = [];

showActionDetails(type: string) {
  if (type === 'Supportability') {
    this.actionPopupTitle = 'Supportability';
    this.actionPopupList = this.supportability;
  } else if (type === 'Escalations Yet to be Reviewed') {
    this.actionPopupTitle = 'Escalations Yet to be Reviewed';
    this.actionPopupList = this.escalations;
  } else if (type === 'Team Growth Plan') {
    this.actionPopupTitle = 'Team Growth Plan';
    this.actionPopupList = this.teamGrowthPlan;
  }
  this.showActionPopup = true;
}

closeActionPopup() {
  this.showActionPopup = false;
}
}