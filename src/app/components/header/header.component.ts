import { Component } from '@angular/core';
import { SiteService } from '../../services/site-data.service';

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

  constructor(private siteService: SiteService) {}
  onSiteChange(site: string) {
  this.siteService.setSelectedSite(site);
}
  updateSiteData(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSite = selectElement.value;
    this.siteService.setSelectedSite(this.selectedSite);
  }

  toggleMenu() {
    const dropdown = document.getElementById("menuDropdown");
 if (dropdown) {
    dropdown.classList.toggle("hidden");
  }  }
}