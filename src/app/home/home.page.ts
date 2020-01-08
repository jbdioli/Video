import { Component } from '@angular/core';

export interface VideoDetail {
  name?: string;
  type?: string;
  duration?: number;
  size?: number;
  videoHeight?: number;
  videoWidth?: number;
  file?: File;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  videoBuffer: File;
  videoDetail: VideoDetail = {};

  constructor() {}


  onFileChosen(ev: Event) {
    console.log('VideoFile : ', ev);

    const files: FileList = (ev.target as HTMLInputElement).files;

    this.videoBuffer = files[0];
    console.log('Video Buffer : ', this.videoBuffer);

    const type = this.videoBuffer.type;
    console.log('Type : ', type);

    const fileReader = new FileReader();

    this.videoDetail.name = this.videoBuffer.name;
    this.videoDetail.type = this.videoBuffer.type;
    this.videoDetail.size = this.videoBuffer.size;
    this.videoDetail.file = this.videoBuffer;


    fileReader.onload = () => {
      const blob = new Blob([fileReader.result], {type});
      console.log('Blob :', blob);
      // this.videoDetail.file = blob;

      const url = (URL || webkitURL).createObjectURL(blob);
      const video = document.createElement('video');  // create video element
      console.log('video document :', video);

      video.preload = 'metadata';                     // preload setting
      video.addEventListener('loadedmetadata', () => {
        this.videoDetail.duration = video.duration;

        this.videoDetail.videoHeight = video.videoHeight;
        this.videoDetail.videoWidth = video.videoWidth;
        console.log('duration :', video.duration);
        console.log('height : ', video.videoHeight);
        console.log('Width : ', video.videoWidth);
      });


      video.src = url; // start video load

    };

    fileReader.readAsArrayBuffer(this.videoBuffer);

  }

}
