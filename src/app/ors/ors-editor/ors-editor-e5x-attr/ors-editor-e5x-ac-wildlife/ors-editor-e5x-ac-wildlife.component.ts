import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isObjEmpty } from 'app/interfaces/functions';

@Component({
  selector: 'nlf-ors-editor-e5x-ac-wildlife',
  templateUrl: './ors-editor-e5x-ac-wildlife.component.html',
  styleUrls: ['./ors-editor-e5x-ac-wildlife.component.css']
})
export class NlfOrsEditorE5XAcWildlifeComponent implements OnInit {
  @Input() attr: any;
  @Input() callsign: string;
  @Output() attrChange: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  @Input() disabled: boolean = false;
  modalRef;
  _isObjectEmpty = isObjEmpty;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    console.log('Wildlife', this.attr);
  }

  public openModal(template) {

    this.modalRef = this.modalService.open(template, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  modalUpdate() {

    this.attrChange.emit(this.attr);
    this.change.emit(true);
    this.modalRef.close();
  }

}
