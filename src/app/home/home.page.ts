import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

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
  @ViewChild('videoCtrl', {static: false}) videoCtrl: ElementRef;

  videoBuffer: File;
  videoDetail: VideoDetail = {};

  flag = false;
  vPause = false;
  vMute = false;
  ctrlBar = false;

  constructor(private loadingCtrl: LoadingController) {}

  onPickVideo() {
    this.filePickerRef.nativeElement.click();
  }


  onFileChosen(ev: Event) {

    this.loadingCtrl
    .create({ keyboardClose: true, message: 'Loading video...' })
    .then(loadingEl => {
      loadingEl.present();

      const files: FileList = (ev.target as HTMLInputElement).files;

      this.videoBuffer = files[0];

      this.videoDetail.name = this.videoBuffer.name;
      this.videoDetail.type = this.videoBuffer.type;
      this.videoDetail.size = this.videoBuffer.size;
      this.videoDetail.dataFile = this.videoBuffer;


      this.convertToDataString(this.videoBuffer, this.videoDetail);
      this.videoMetadataReader(this.videoBuffer, this.videoDetail);
      loadingEl.dismiss();
    });
  }

  // Metadata video reader
  videoMetadataReader(buffer: File, detail: VideoDetail) {
    const fileReader = new FileReader();
    const type = this.videoBuffer.type;

    fileReader.onload = () => {
      const blob = new Blob([fileReader.result], {type});

      const url = (URL || webkitURL).createObjectURL(blob);
      const video = document.createElement('video');  // create video element

      video.preload = 'auto';                     // preload setting
      video.addEventListener('loadeddata', () => {
        detail.duration = video.duration;

        detail.videoHeight = video.videoHeight;
        detail.videoWidth = video.videoWidth;

        this.getFrame(video, detail);
      });

      video.src = url; // start video load

    };
    fileReader.readAsArrayBuffer(buffer);
  }

  getFrame(videoBuffer: HTMLVideoElement, info: VideoDetail) {
    // get first video frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();


    canvas.height = info.videoHeight;
    canvas.width = info.videoWidth;

    ctx.drawImage(videoBuffer, 0, 0, canvas.width, canvas.height);

    img.src = canvas.toDataURL();
    info.videoFrame = img.src;
  }

  // File to string
  convertToDataString(buffer: File, detail: VideoDetail) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const dataString = fileReader.result.toString();
      detail.dataString = dataString;
      this.flag = true;
    };
    fileReader.readAsDataURL(buffer);
  }

  onVideo() {
    if (!this.vPause) {
    const play = this.videoCtrl.nativeElement.play();
    play.then( () => {
      this.vPause = true;
    });
    } else {

      this.videoCtrl.nativeElement.pause();
      this.vPause = false;
    }

  }

  onAudio() {
    const mute: boolean = this.videoCtrl.nativeElement.muted;

    if (this.vMute) {
      this.videoCtrl.nativeElement.muted = false;
      this.vMute = false;
    } else {
      this.videoCtrl.nativeElement.muted = true;
      this.vMute = true;
    }

  }

  onMouseOver(ev: boolean) {
    this.ctrlBar = ev;
  }

  onMouseLeave(ev: boolean) {
    this.ctrlBar = ev;
  }

}
