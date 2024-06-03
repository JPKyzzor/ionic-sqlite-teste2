import { TestBed } from '@angular/core/testing';
import { IonicStorageDatabaseService } from './ionic-storage-database.service';

describe('IonicStorageDatabaseService', () => {
  let service: IonicStorageDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IonicStorageDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
