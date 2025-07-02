import { Component } from '@angular/core';
import { SiteDataService } from '../../services/site-data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  selectedSite: string = 'Select Site';
  sites: string[] = [
    'CGN-HYD',
    'CGN-TLV',
    'CGN-BUH',
    'CGN-CBE',
  ];

  constructor(private siteDataService: SiteDataService) {}

  updateSiteData(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSite = selectElement.value;
    this.siteDataService.setSelectedSite(this.selectedSite);
  }

  toggleMenu() {
    const dropdown = document.getElementById("menuDropdown");
 if (dropdown) {
    dropdown.classList.toggle("hidden");
  }  }
}