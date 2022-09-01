import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../../_models/member';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm')
  editForm!: NgForm;
  member!: Member;
  user: User|any;
  @HostListener('window:beforeunload',['$event']) unloadNotification($event: any){
    if(this.editForm.dirty){
      $event.returnValue=true;
    }
  }
  
  constructor(public accountService: AccountService, private memberService: MembersService, 
    private toastr: ToastrService,private route: ActivatedRoute) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user=user
      })
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member = member;
    })
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(()=>{
      this.toastr.success('Profile updated successfully');
      this.editForm.reset(this.member);
    })
    
  }
}
