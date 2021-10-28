import { Component, HostListener, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { GlobalVarsService } from "../global-vars.service";
import { Router, ActivatedRoute } from "@angular/router";
import { BackendApiService } from "../backend-api.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-page",
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"],
})
export class PageComponent implements OnInit {
  @Input() hideSidebar: string;
  @Input() showPostButton = false;
  @Input() inTutorial: boolean = false;

  @Input() settings = true
  @Input() creatorDashboard = true
  @Input() backToSigma = true
  @Input() channel = true
  followedStreamersList
  followedUsernameStreamersList = []
  profilePicCounter = 0
  @Input() streamerProfile = { PublicKeyBase58Check: "" } // might be problematic -- check the html
  @Output() accountChanged = new EventEmitter()
  mobile = false;
  @Output() streamChanged = new EventEmitter()

  @HostListener("window:resize") onResize() {
    this.setMobileBasedOnViewport();
  }

  destroy() {
    this.followedStreamersList = []
    this.followedStreamersList = []
    this.profilePicCounter = 0
  }

  onAccountChange() {
    this.destroy()
    this.followedStreamers()
    this.accountChanged.emit()
  }

  constructor(private http: HttpClient, public globalVars: GlobalVarsService, private router: Router, private backendApi: BackendApiService, private route: ActivatedRoute) {
    this.destroy()
   }

  ngOnInit() {
    this.destroy()
    this.setMobileBasedOnViewport();
    this.followedStreamers()
  }

  followedStreamers() {
    this.backendApi.jwtGet(`${environment.apiURL}`, '/following', this.globalVars.loggedInUser.PublicKeyBase58Check).subscribe((data) => {
      this.followedStreamersList = data
      for (let i = 0; i < 10 && i < this.followedStreamersList.following.length; i++) {
        this.backendApi.GetSingleProfile(this.globalVars.localNode, this.followedStreamersList.following[i], "").subscribe((data) => {
          this.followedUsernameStreamersList.push({ username: data.Profile.Username, publicKey: this.followedStreamersList.following[i] })
          this.backendApi.GetSingleProfilePicture(this.globalVars.localNode,
            this.followedStreamersList.following[i]).subscribe((res) => {
              console.log("username list:",this.followedUsernameStreamersList)
              this._readImageFileToProfilePicInput(res)
            })
        })
      }

    })
  }

  goToMessages() {
    this.router.navigate(['/inbox'])
  }

  redirectToHomePage() {
    this.router.navigate(['/'])
  }

  goToNotification() {
    this.router.navigate(['/user', this.globalVars.RouteNames.NOTIFICATIONS])
  }

  changeStream(newStreamerPublicKey) {
    this.destroy()
    this.streamChanged.emit()
    this.router.navigate([newStreamerPublicKey])
    this.followedStreamers()
  }

  setMobileBasedOnViewport() {
    this.mobile = this.globalVars.isMobile();
  }

  _readImageFileToProfilePicInput(file: Blob | File) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) => {
      const base64Image = btoa(event.target.result);
      try {
        console.log("base64:", base64Image)
        this.followedUsernameStreamersList[this.profilePicCounter].profilePicture = `data:${file.type};base64,${base64Image}`;
        this.profilePicCounter++
      } catch (err) {
        console.log("error:", err)
      }
      console.log("followed", this.followedUsernameStreamersList)
      console.log(this.profilePicCounter)
      
    };
  }

}
