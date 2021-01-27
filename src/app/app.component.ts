import { Component,OnDestroy,OnInit } from '@angular/core';
import { Router , Event, NavigationEnd} from '@angular/router';
import { ToggleAppComponentButtonService } from './service/toggle-app-component-button.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit ,OnDestroy {
  title = 'paymentTest';
  showButton: boolean;

  private toggleServiceSubs:Subscription;
  private routePipesSubs:Subscription;

  constructor(
    private  toggleService:ToggleAppComponentButtonService,
    private router: Router,
    ) { }

  setToggleState(){
    this.toggleService.toggleState(false);
  }

  ngOnInit(): void {

   this.toggleServiceSubs=this.toggleService.getToggleState.subscribe((res:boolean)=>{
      this.showButton=res;
    })

   this.routePipesSubs=this.router.events.pipe(
      filter((event:Event) => event instanceof NavigationEnd))
      .subscribe((res:NavigationEnd)=>{
        res.url==='/home' && ( this.toggleService.toggleState(false));
    })

  }

  ngOnDestroy(){
    this.toggleServiceSubs.unsubscribe();
    this.routePipesSubs.unsubscribe();
  }



}

