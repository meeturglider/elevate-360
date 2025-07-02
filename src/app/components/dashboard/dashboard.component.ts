interface SiteStats {
  associates: number;
  top: number;
  avg: number;
  bottom: number;
  kudos: string;
}

import { Component, OnInit } from '@angular/core';
import { SiteDataService } from '../../services/site-data.service';
import { FormsModule } from '@angular/forms';
import { PopupDataService } from '../../services/popup-data.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalAssociates = 0;
  topPerformers = 0;
  averagePerformers = 0;
  bottomPerformers = 0;

  constructor(private siteDataService: SiteDataService) {}

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

  ngOnInit(): void {      
      this.siteDataService.fetchSheetData().subscribe(data => {
      // Assuming each row has a 'rating' column as a number
      this.totalAssociates = data.length;
      this.topPerformers = data.filter(row => row.Rating == 5 || row.Rating == 4).length;
      this.averagePerformers = data.filter(row => row.Rating == 3).length;
      this.bottomPerformers = data.filter(row => row.Rating == 2 || row.Rating == 1).length;
    });
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

showPopup(type: string) {
  this.showStatPopup = true;
  switch (type) {
    case 'totalAssociates':
      this.popupTitle = 'Total Associates';
      this.popupContent = ['List or details for Total Associates...'];
      break;
    case 'topPerformers':
      this.popupTitle = 'Top Performers';
      this.popupContent = ['List or details for Top Performers...'];
      break;
    case 'averagePerformers':
      this.popupTitle = 'Average Performers';
      this.popupContent = ['List or details for Average Performers...'];
      break;
    case 'bottomPerformers':
      this.popupTitle = 'Bottom Performers';
      break;
  }
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