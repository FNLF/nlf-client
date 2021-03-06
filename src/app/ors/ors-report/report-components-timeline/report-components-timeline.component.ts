import { Component, Input, OnInit } from '@angular/core';
import { ApiObservationComponentInterface } from 'app/api/api.interface';


@Component({
  selector: 'nlf-report-components-timeline',
  templateUrl: './report-components-timeline.component.html',
  styleUrls: ['./report-components-timeline.component.css']
})
export class NlfOrsReportComponentsTimelineComponent implements OnInit {

  @Input() components: ApiObservationComponentInterface[];
  @Input() activity: string;

  public componentCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
