import { Component, ViewChild, ElementRef } from '@angular/core';

export interface VideoDetail {
  name?: string;
  type?: string;
  duration?: number;
  size?: number;
  videoHeight?: number;
  videoWidth?: number;
  file?: File;
  dataUrl?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;

  videoBuffer: File;
  videoDetail: VideoDetail = {};

  flag = false;

  constructor() {}

  onPickVideo() {
    this.filePickerRef.nativeElement.click();
  }


  onFileChosen(ev: Event) {
    console.log('VideoFile : ', ev);

    const files: FileList = (ev.target as HTMLInputElement).files;

    this.videoBuffer = files[0];
    console.log('Video Buffer : ', this.videoBuffer);

    this.videoDetail.name = this.videoBuffer.name;
    this.videoDetail.type = this.videoBuffer.type;
    this.videoDetail.size = this.videoBuffer.size;
    this.videoDetail.file = this.videoBuffer;

    this.videoMetadataReader(this.videoBuffer, this.videoDetail);

    this.convertToDataUrl(this.videoBuffer, this.videoDetail);
  }

  // Metadata video reader
  videoMetadataReader(buffer: File, storage: VideoDetail) {
    const fileReader = new FileReader();
    const type = this.videoBuffer.type;

    fileReader.onload = () => {
      const blob = new Blob([fileReader.result], {type});

      const url = (URL || webkitURL).createObjectURL(blob);
      const video = document.createElement('video');  // create video element

      video.preload = 'metadata';                     // preload setting
      video.addEventListener('loadedmetadata', () => {
        storage.duration = video.duration;

        storage.videoHeight = video.videoHeight;
        storage.videoWidth = video.videoWidth;
      });


      video.src = url; // start video load

    };
    fileReader.readAsArrayBuffer(buffer);
  }

  // File to dataUrl
  convertToDataUrl(buffer: File, storage: VideoDetail) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const dataUrl = fileReader.result.toString();
      storage.dataUrl = dataUrl;
      this.flag = true;
    };
    fileReader.readAsDataURL(buffer);
  }

}
