import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

// 1. IMPORT ICONS AND LIBRARY
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faChartBar, faUserGroup, faStar, faCheckCircle, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';

// 2. ADD THE ICONS TO THE GLOBAL LIBRARY
// This makes them available everywhere without re-importing in every component
// library.add(faChartBar, faUserGroup, faStar, faCheckCircle, faAngleDoubleUp);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()
  ]
});