import { Component, OnInit, Input } from '@angular/core';
import { ApiOptionsInterface } from 'app/api/api.interface';
import { ApiCacheService } from 'app/api/api-cache.service';
import { LungoPersonsService } from 'app/api/lungo-persons.service';
import { ApiUserService } from 'app/api/api-user.service';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'nlf-resolve-lungo-person',
  templateUrl: './resolve-lungo-person.component.html',
  styleUrls: ['./resolve-lungo-person.component.css']
})
export class NlfResolveLungoPersonComponent implements OnInit {

  @Input() person_id: number;
  @Input() tmpname?: string;
  @Input() link?: boolean;
  @Input() avatar?: boolean;

  dataReady = false;

  full_name = '';

  constructor(private lungoUserService: LungoPersonsService,
              private userService: ApiUserService,
              private apiCache: ApiCacheService) { }

  ngOnInit() {
    if (!this.avatar) { this.avatar = false; }
    if (!this.link) { this.link = false; }
    // if (!this.tmpname ) { this.tmpname = ''; }

    if (this.person_id < 0 && !this.tmpname) {

      this.full_name = 'Hopper ' + (-1 * this.person_id);
      this.dataReady = true;

    } else if (!!this.tmpname && this.person_id <= 0) {

      this.avatar = false;
      this.link = false;
      this.full_name = this.tmpname;
      this.dataReady = true;

    } else if (typeof this.person_id === 'undefined') {

      this.full_name = 'Ingen personer';
      this.dataReady = true;

    } else {

      /**
       * We do need to check if the user exists locally too
       * - Resolve name from nlf-users
       * - Verify if user exists in users for linkage
       */


      const options: ApiOptionsInterface = {
        query: { projection: { full_name: 1 } }
      };

      const lungoPerson = this.apiCache.get(['get-lungo-person', this.person_id, options.query],
                                            this.lungoUserService.getUser(this.person_id, options));

      if (!this.link) { // Only check in nlf-lungo-users

        lungoPerson.subscribe(
          data => this.full_name = data.full_name,
          err => this.full_name = 'Ukjent person',
          () => this.dataReady = true
        );
      } else { // check in both and decide if link or not

        const optionsuser: ApiOptionsInterface = {
          query: { projection: { id: 1 } }
        };

        const users = this.apiCache.get(['get-users', this.person_id, optionsuser.query],
                                         this.userService.getUser(this.person_id, optionsuser));

        forkJoin(
          users.pipe(catchError(userError => of(userError))),
          lungoPerson.pipe(catchError(lungoPersonError => of(lungoPersonError))))
          .subscribe(

            data => {
              this.link = false;
              if (!!data[0] && typeof data[0].error === 'undefined') {
                this.link = true;
              }

              if (data[0] && typeof data[1].error === 'undefined') {
                this.full_name = data[1].full_name;
              } else if (!!data[1].status && data[1].status === 404) {
                this.full_name = 'Ukjent person';
                this.link = false;
              }
            },
            err => console.log(err),
            () => this.dataReady = true
          );
      }
    }

  }

}

