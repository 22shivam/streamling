import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendApiService } from '../backend-api.service';
import { GlobalVarsService } from '../global-vars.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from '../app-routing.module';
@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
  AppRoutingModule = AppRoutingModule;
  loadingFirstPage
  constructor(private route: ActivatedRoute, private backendApi: BackendApiService, private globalVars: GlobalVarsService, private http: HttpClient) { }
  targetUsername
  targetProfile
  targetPublicKey
  appData = this.globalVars
  ngOnInit(): void {
    this.loadingFirstPage = true
    this.route.params.subscribe((params) => {
      this.targetUsername = params.username;
      this.backendApi.GetSingleProfile(this.globalVars.localNode, "", this.targetUsername).subscribe((data) => {
        this.targetProfile = data.Profile
        this.targetPublicKey = this.targetProfile.PublicKeyBase58Check
        this.getFollowingProfiles()
      })
    })
  }

  followingPublicKeys
  followingProfiles = []
  followingCount 

  async getFollowingProfiles() {
    this.followingPublicKeys = await this.http.get(`${environment.apiURL}/following`, { headers: { 'publickeybase58check': this.targetPublicKey } }).toPromise()
    this.followingPublicKeys = this.followingPublicKeys.following
    this.followingCount = this.followingPublicKeys.length
    console.log(this.followingPublicKeys)

    for (let i = 0; i < this.followingPublicKeys.length && i < 20; i++) {
      try {
        console.log("here")
        this.backendApi.GetSingleProfile(this.globalVars.localNode, this.followingPublicKeys[i], "").subscribe((data) => {
          console.log(data)
          this.followingProfiles.splice(i, 0, data.Profile)
          console.log(this.followingProfiles[i])
        })
        this.backendApi.GetSingleProfilePicture(this.globalVars.localNode, this.followingPublicKeys[i], "").subscribe((data) => {
          this._readImageFileToProfilePicInput(data, i)
          console.log(data)
        })
      } catch (error) {
        console.log(error)
      }

      console.log(this.followingProfiles[i])
      this.loadingFirstPage = false
    }

    console.log(this.followingProfiles)
  }

  _readImageFileToProfilePicInput(file: Blob | File, i) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) => {
      const base64Image = btoa(event.target.result);
      this.followingProfiles[i].ProfilePicture = `data:${file.type};base64,${base64Image}`;
      console.log(this.followingProfiles[i].ProfilePicture)
    };
  }

}
