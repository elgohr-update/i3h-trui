import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../global.service";
import { DataService } from "../data.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  @Input() torrents: any;
  checkedAll: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private dataService: DataService
  ) {}

  translateStatusCode() {
    for (let i = 0; i < this.torrents.length; i++) {
      if (this.torrents[i].status == 0) {
        this.torrents[i].status = "Stopped";
      } else if (this.torrents[i].status == 1) {
        this.torrents[i].status = "Queued to check";
      } else if (this.torrents[i].status == 2) {
        this.torrents[i].status = "Checking";
      } else if (this.torrents[i].status == 3) {
        this.torrents[i].status = "Queued to download";
      } else if (this.torrents[i].status == 4) {
        this.torrents[i].status = "Downloading";
      } else if (this.torrents[i].status == 5) {
        this.torrents[i].status = "Queued to seed";
      } else if (this.torrents[i].status == 6) {
        this.torrents[i].status = "Seeding";
      }
    }
  }

  addUnit(num) {
    if (num > 1000000000) {
      return (num / 1000000000).toFixed(2).toString() + " GB";
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(2).toString() + " MB";
    } else if (num > 1000) {
      return (num / 1000).toFixed(2).toString() + " KB";
    } else {
      return num.toString() + " B";
    }
  }

  translateTotalSize() {
    for (let i = 0; i < this.torrents.length; i++) {
      this.torrents[i].totalSize = this.addUnit(this.torrents[i].totalSize);
    }
  }

  translateDownloadedEver() {
    for (let i = 0; i < this.torrents.length; i++) {
      this.torrents[i].downloadedEver = this.addUnit(
        this.torrents[i].downloadedEver
      );
      this.torrents[i].downloadedEver += " / ";
      this.torrents[i].downloadedEver += this.addUnit(
        this.torrents[i].totalSize
      );
      this.torrents[i].downloadedEver += " (";
      this.torrents[i].downloadedEver += this.torrents[i].completedRatio;
      this.torrents[i].downloadedEver += ")";
    }
  }

  translateUploadedEver() {
    for (let i = 0; i < this.torrents.length; i++) {
      this.torrents[i].uploadedEver = this.addUnit(
        this.torrents[i].uploadedEver
      );
    }
  }

  calCompletedRatio() {
    for (let i = 0; i < this.torrents.length; i++) {
      this.torrents[i].completedRatio =
        (
          (this.torrents[i].downloadedEver / this.torrents[i].downloadedEver) *
          100
        )
          .toFixed(2)
          .toString() + "%";
    }
  }

  calUploadRatio() {
    for (let i = 0; i < this.torrents.length; i++) {
      this.torrents[i].uploadRatio = this.torrents[i].uploadRatio
        .toFixed(2)
        .toString();
    }
  }

  refreshTorrents() {
    this.translateStatusCode();
    this.calCompletedRatio();
    this.translateTotalSize();
    this.translateDownloadedEver();
    this.translateUploadedEver();
    this.calUploadRatio();
  }

  clickTorrent(el: any) {
    if (el.checked) {
      el.checked = false;
    } else {
      el.checked = true;
    }
  }

  checkAll() {
    if (this.checkedAll) {
      for (let i = 0; i < this.torrents.length; i++) {
        this.torrents[i].checked = false;
      }
    } else {
      for (let i = 0; i < this.torrents.length; i++) {
        this.torrents[i].checked = true;
      }
    }
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes["torrents"] && typeof this.torrents !== "undefined") {
      this.refreshTorrents();
    }
  }
}
