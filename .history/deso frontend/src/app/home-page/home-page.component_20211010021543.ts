import { Component, OnInit } from '@angular/core';
import { GlobalVarsService } from '../global-vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BackendApiService } from '../backend-api.service';

declare var p2pml: any;
declare var Clappr: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(public globalVars: GlobalVarsService, private router: Router, private http: HttpClient, private route: ActivatedRoute, private backendApi: BackendApiService) { }
  followedStreamersList
  streamTitle
  streamDescription
  streamCategory
  streamer // from our backend -- gives stream url so we can play in the video player
  streamerProfile // taken from get-single-profile
  streamerUsername // taken from url
  streamerProfilePicture // taken from get-single-profile-picture
  player
  anyoneLive = false
  streamNumber
  categories
  ngOnInit(): void {
    this.followedStreamers();
    this.getCategories
  }

  changeStream(newStreamerPublicKey) {
    this.backendApi.GetSingleProfile(this.globalVars.localNode, newStreamerPublicKey, "").subscribe(
      (res) => {
        if (this.player) {
          this.player.destroy()
        }
        this.router.navigate([res.Profile.Username], { relativeTo: this.route })
      })
  }


  goLive() {
    this.router.navigate([`dashboard`, this.globalVars.loggedInUser.ProfileEntryResponse.Username])
  }

  followedStreamers() {
    this.http.get(`http://149.159.16.161:3123/streams/live/one`).subscribe((data: { stream }) => {
      if (data.stream) {
        this.anyoneLive = true
      }
      if (this.anyoneLive) {
        this.streamCategory = data.stream.category
        this.streamTitle = data.stream.title
        this.streamDescription = data.stream.description
        this.backendApi.GetSingleProfile(this.globalVars.localNode, data.stream.publicKey, "").subscribe(
          (res) => {
            this.streamerProfile = res.Profile;
            console.log(this.streamerProfile)
            this.backendApi.GetSingleProfilePicture(
              this.globalVars.localNode,
              this.streamerProfile.PublicKeyBase58Check,
              this.globalVars.profileUpdateTimestamp ? `?${this.globalVars.profileUpdateTimestamp}` : ""
            )
              .subscribe((res) => {
                this._readImageFileToProfilePicInput(res);
                if (p2pml.hlsjs.Engine.isSupported()) {
                  var engine = new p2pml.hlsjs.Engine();
                  var loader = engine.createLoaderClass();
                } else {
                  // var loader = XHRLoader;
                }
                console.log(this.streamer.stream._id)
                var engine = new p2pml.hlsjs.Engine();
                this.player = new Clappr.Player({
                  parentId: "#video",
                  source: `http://149.159.16.161:8082/live/${this.streamer.stream._id}/index.m3u8`,
                  width: "100%",
                  height: "100%",
                  playback: {
                    hlsjsConfig: {
                      liveSyncDurationCount: 7,
                      loader: loader
                    }
                  }
                });
                if (p2pml.hlsjs.Engine.isSupported()) p2pml.hlsjs.initClapprPlayer(this.player);
                this.player.play(true);
              });

          })
      }

      // // get creators - creator coin value and username -- work here
      // this.streamer = {
      //   streams: [
      //     {
      //       _id: "615e20379a87aee1a0d381e5",
      //       publicKey: "BC1YLj4aFMVM1g44wBgibYq8dFQ1NxTCpQFyJnNMqGqmyUt9zDVjZ5L",
      //       username: "shivamgarg",
      //       __v: 0
      //     }
      //   ]
      // }


    })

  }

  getCategories() {
    this.http.get('http://149.159.16.161:3123/categories').subscribe((data: { categories }) => {
      this.categories = data.categories
      for (let category of this.categories){
        console.log(category)
      }
    })
  }


  destroy() {
    if (this.player) {
      this.player.destroy()
    }
  }


  onAccountChange() {
    // this.destroy()
    this.destroy()
    this.followedStreamers()
  }

  _readImageFileToProfilePicInput(file: Blob | File) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) => {
      const base64Image = btoa(event.target.result);
      this.streamerProfilePicture = `data:${file.type};base64,${base64Image}`;
    };
  }


}
