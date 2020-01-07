import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  videoBuffer: File;

  constructor() {}


  onFileChosen(videoFile: any) {

    this.videoBuffer = videoFile.target.files[0] as File;
    console.log('Video Buffer : ', this.videoBuffer);
    const type = this.videoBuffer.type;
    console.log('Type : ', type);

    const fileReader = new FileReader();


    fileReader.onload = (ev) => {
      // const blob = new Blob([ev.target.result], {type});
      const blob = new Blob([fileReader.result], {type});
      console.log('Blob :', blob);

      const url = (URL || webkitURL).createObjectURL(blob);
      const video = document.createElement('video');  // create video element
      console.log('video document :', video);

      video.preload = 'metadata';                     // preload setting
      video.addEventListener('loadedmetadata', () => {
        console.log('duration :', video.duration);
        console.log('height : ', video.height);
      });

    };

    fileReader.readAsArrayBuffer(this.videoBuffer);

  }

}
