import { DatabaseService } from 'src/app/services/database-service.service';
import { Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  constructor(private dbSVC:DatabaseService) {
    dbSVC.initializePlugin();
  }
}
