import { Component, OnInit } from '@angular/core';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';

@Component({
  selector: 'app-detail-view-page',
  templateUrl: './detail-view-page.component.html',
  styleUrls: ['./detail-view-page.component.scss']
})
export class DetailViewPageComponent implements OnInit {

  constructor(
    public detailViewService: DetailViewPageService
  ) { }

  ngOnInit(): void {
  }

}
