import { ApiObservationsItem } from './../../api/api.interface';
import { ApiObservationsService } from './../../api/api-observations.service';
import { Component, OnInit, KeyValueDiffers, DoCheck } from '@angular/core';
import { NlfAlertService } from '../../services/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { NlfComponent } from '../../nlf.component';

@Component({
  selector: 'nlf-ors-editor',
  templateUrl: './ors-editor.component.html',
  styleUrls: ['./ors-editor.component.css']
})
export class NlfOrsEditorComponent implements OnInit, DoCheck {

  id: number | string;
  dataReady = false;
  observation: ApiObservationsItem;
  differ: any;
  changes = false;
  initialized = false;

  constructor(private route: ActivatedRoute,
    private orsService: ApiObservationsService,
    private alertService: NlfAlertService,
    private app: NlfComponent,
    private differs: KeyValueDiffers) {
    // Instantiate diff checking:
    this.differ = this.differs.find({}).create();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'] ? params['id'] : 0;
      this.app.setTitle('NLF - ORS Editor #' + this.id);
      this.getData();
    });

  }

  save() {
    let tmp = {...this.observation};
    const tmp_id = this.observation._id;
    const tmp_etag = this.observation._etag;
    // if (!!tmp._id) { delete tmp._id; }
    if (!!tmp._links) { delete tmp._links; }
    if (!!tmp._created) { delete tmp._created; }
    if (!!tmp._etag) { delete tmp._etag; }
    if (!!tmp._latest_version) { delete tmp._latest_version; }
    if (!!tmp._updated) { delete tmp._updated; }
    if (!!tmp._version) { delete tmp._version; }
    if (!!tmp.id) { delete tmp.id; }
    // if (!!tmp.audit) { delete tmp.audit; }
    if (!!tmp.reporter) { delete tmp.reporter; }
    if (!!tmp.club) { delete tmp.club; }
    if (!!tmp.owner) { delete tmp.owner; }
    if (!!tmp.workflow) { try {delete tmp.workflow; } catch (e) {} }
    // if (!!tmp._meta) { delete tmp._meta; }

    this.orsService.save(tmp_id, tmp, tmp_etag).subscribe(
      data => {
        this.changes = false;
        this.observation._etag = data._etag;
        this.observation._updated = data._updated;
        this.observation._version = data._version;
        this.observation._latest_version = data._latest_version;
      },
      err => console.log(err)
    );
  }


ngDoCheck() {
  if (this.dataReady) {
    const change = this.differ.diff(this.observation);
    if (change) {
      console.log('Changes:');
      console.log(change);
      change.forEachChangedItem(r => console.log('changed ', r.currentValue));
      change.forEachAddedItem(r => console.log('added ' + r.currentValue));
      change.forEachRemovedItem(r => console.log('removed ' + r.currentValue));

      // Need to let first change pass as it's init
      if (this.initialized) {
        this.changes = true;
      } else {
        this.initialized = true;
      }
    }
  } else {
    // const change = this.differ.diff(this.observation);
    this.changes = false;
  }

}

  public getData() {
  this.dataReady = false;

  this.orsService.get(this.id).subscribe(
    data => {
      this.observation = data;

      // Make some defaults:
      if (typeof this.observation.rating === 'undefined') {
        this.observation.rating = {actual: 1, potential: 1};
      }
      // this.observation.tags = ['test', '1234'];

    },
    err => {
      this.alertService.error(err.message);
    },
    () => this.dataReady = true
  );
}

}