import { ApiOptionsInterface, NlfConfigItem } from 'app/api/api.interface';
import { Component, Input, OnInit, AfterViewInit, Inject } from '@angular/core';
import { ApiObservationsService } from 'app/api/api-observations.service';
import { Router } from '@angular/router';
import { LungoOrganizationsService } from 'app/api/lungo-organizations.service';
import { ApiUserService } from 'app/api/api-user.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NlfUserSubjectService } from 'app/user/user-subject.service';
import { NlfAlertService } from 'app/services/alert/alert.service';
import {  NlfConfigService } from 'app/nlf-config.service';
import { environment } from 'environments/environment';
import { NlfOrsEditorService } from 'app/ors/ors-editor/ors-editor.service';
// import { ApiObservationsItem} from 'app/api/api.interface';

@Component({
  selector: 'nlf-ors-fallskjerm-create',
  templateUrl: './ors-fallskjerm-create.component.html',
  styleUrls: ['./ors-fallskjerm-create.component.css']
})
export class NlfOrsFallskjermCreateComponent implements OnInit, AfterViewInit {

  @Input() layout: string; // inline, short, datetimepicker, calendar etc
  @Input() defaultBtn: boolean = false;

  userid: number;
  bsValue: Date = new Date();
  ismeridian = false;
  mytime: Date = new Date();
  public selectedMoment = new Date();

  public clubid: string;

  withDate = false;

  ENV = environment;

  clubs;
  clubChooser: FormControl;
  selected;
  settings;
  dataReady = false; // render when true
  loading = false; // On create
  public config: NlfConfigItem;

  constructor(
    private configService: NlfConfigService,
    private orsService: ApiObservationsService,
    private orgService: LungoOrganizationsService,
    private userService: ApiUserService,
    private alertService: NlfAlertService,
    private userData: NlfUserSubjectService,
    private router: Router,
    private subject: NlfOrsEditorService) {

    this.userData.observable.subscribe(
      data => {
        if (!!data && data.hasOwnProperty('settings')) {
          this.settings = data.settings;
          this.selected = data.settings.default_discipline;
        }
      });

    this.subject.observableObservation.subscribe(
      observation => {
        // this.observation = observation;
      }
    );
  }

  ngOnInit() {
    this.orsService.setActivity('fallskjerm');
    this.clubChooser = new FormControl();

    this.configService.observableConfig.subscribe(
      data => {
        this.config = data;
        this.getClubs();
      }
    );


  }

  public canCreate() {
    try {
      return this.config.fallskjerm.observation.create[this.ENV._name];
    } catch(e) {
      return false;
    }
  }

  public canCreateDefault() {
    try {
      return this.config[this.config.inv_mapping[this.settings.default_activity]].observation.create[this.ENV._name];
    } catch (e) {
      console.log('Error create default', e);
      return false;
    }
  }

  ngAfterViewInit() {
    // Subscribe to changes!
    this.clubChooser.valueChanges
      .subscribe(club => {
        this.selected = club;
      });
  }

  public getClubs() {

    const options: ApiOptionsInterface = {
      query: {
        where: {
          'main_activity.id': 109,
          type_id: 14,
          is_active: true
        },
        max_results: 1000,
        projection: { id: 1, _id: 1, parent_id: 1, name: 1 }
      }
    };
    this.orgService.getOrganizations(options).subscribe(
      data => {
        this.clubs = data._items;
        this.dataReady = true;
      },
      err => console.error(err)
    );

  }

  public createObservation() {
    if (this.selected === '' || this.selected === {}) {
      this.alertService.error('Ingen klubb valgt, velg klubb først', false, true, 10);
      return;
      // @TODO: alert here!
    }
    this.loading = true;
    this.alertService.clear();

    console.log(this.selected);

    this.clubs.forEach(element => {

      if (element.id == this.selected) {

        this.orsService.create({ 'discipline': this.selected, 'club': element.parent_id }).subscribe(
          data => {
            this.subject.reset();
            console.log('ORS Created', data);
            if (!!data._id && !!data.id) {

              this.router.navigateByUrl('/ors/fallskjerm/edit/' + data.id);
            }
          },
          err => {
            this.alertService.error('Kunne ikke opprette ORS: ' + err.message);
            this.loading = false;
          },
          () => {
            console.log('Created observation');
            this.loading = false;
          }
        );

      }

    });

  }

}