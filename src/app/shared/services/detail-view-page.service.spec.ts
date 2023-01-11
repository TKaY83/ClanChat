import { TestBed } from '@angular/core/testing';

import { DetailViewPageService } from './detail-view-page.service';

describe('DetailViewPageService', () => {
  let service: DetailViewPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailViewPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
