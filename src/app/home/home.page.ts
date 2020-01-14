import { Component, ViewChild, ElementRef } from '@angular/core';

export interface VideoDetail {
  name?: string;
  type?: string;
  duration?: number;
  size?: number;
  videoHeight?: number;
  videoWidth?: number;
  videoFrame?: string;
  dataFile?: File;
  dataString?: string;
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
    this.videoDetail.dataFile = this.videoBuffer;
    

    this.convertToDataString(this.videoBuffer, this.videoDetail);
    this.videoMetadataReader(this.videoBuffer, this.videoDetail);
  }

  // Metadata video reader
  videoMetadataReader(buffer: File, detail: VideoDetail) {
    const fileReader = new FileReader();
    const type = this.videoBuffer.type;

    fileReader.onload = () => {
      const blob = new Blob([fileReader.result], {type});

      const url = (URL || webkitURL).createObjectURL(blob);
      const video = document.createElement('video');  // create video element


      video.preload = 'metadata';                     // preload setting
      video.addEventListener('loadedmetadata', () => {
        detail.duration = video.duration;


        detail.videoHeight = video.videoHeight;
        detail.videoWidth = video.videoWidth;


        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
 
        img.src = canvas.toDataURL();
        detail.videoFrame = img.src;


        console.log('img :', img);
      });



      video.src = url; // start video load

    };
    fileReader.readAsArrayBuffer(buffer);
  }

  // File to dataUrl
  convertToDataString(buffer: File, detail: VideoDetail) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const dataString = fileReader.result.toString();
      detail.dataString = dataString;
      this.flag = true;
    };
    fileReader.readAsDataURL(buffer);
  }
}
