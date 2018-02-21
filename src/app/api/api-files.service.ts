import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ApiRestService } from './api-rest.service';
import { ApiOptionsInterface, ApiFileItem, ApiFileList } from './api.interface';
import { saveAs } from 'file-saver';
// import { getFileNameFromResponseContentDisposition, saveFile } from './api-file-server.component';

@Injectable()
export class ApiFilesService extends ApiRestService {

  constructor(http: HttpClient) { super(http); }

  private relativeUrl = '/files/'; // Eve resource
  private downloadUrl = '/download/'; // Blueprint resource

  public getFile(id: string, options?: ApiOptionsInterface): Observable<ApiFileItem> {

    return this.getItem(this.relativeUrl, id, options);
  }

  public getFiles(options?: ApiOptionsInterface): Observable<ApiFileList> {

    return this.getList(this.relativeUrl, options);
  }

  /**
   *
   * @param _id MongoId
   * @param string optional size small|medium|large
   * @param options
   * @returns Observable
   * {'mimetype': 'image/png',
   * 'encoding': 'base64',
   * 'src': encoded_img}
   * All images will be converted to png
   */
  public getImage(_id: string, size?: string, options?: ApiOptionsInterface): Observable<any> {
    return this.getItem(this.downloadUrl + 'image/' + _id + '/' + size, ' ', options);
  }

  public getDirectLink(_id: string) {

    return this.baseUrl + this.downloadUrl + _id;
  }

  /**
   *
   * @param _id Downloads from eve files
   * @param options
   */
  public downloadFile(_id: string, options?: ApiOptionsInterface): void {

    this.getItem(this.relativeUrl, _id, options).subscribe(
      response => {
        const blob = new Blob([response.file], { type: response.content_type });
        saveAs(blob, response.name);
      },
      err => console.log(err)
    );
  }

}
