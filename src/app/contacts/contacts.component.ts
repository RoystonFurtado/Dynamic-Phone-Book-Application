import { Component, Directive, OnInit, Output, EventEmitter, HostListener, ElementRef, ViewChild, Pipe, PipeTransform, ChangeDetectionStrategy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Directive({
  selector:'[disappear]'
})
export class DisappearDirective {
  @Output() disappear = new EventEmitter<MouseEvent>();
  constructor(private elementRef:ElementRef) {}
  @HostListener('document:click',['$event']) onClickOutside(event:MouseEvent) {
    const targetElement=event.target as HTMLElement;
    const addbtn=document.getElementsByClassName('add-contact-btn')[0];
    const editbtn=document.getElementsByClassName('contacts-container')[0];
    const closebtn=document.getElementsByClassName('close-btn')[0];
    const cancelbtn=document.getElementsByClassName('cancel-btn')[0];
    //When clicked anywhere outside add contact box, addcontactbutton and edit contact button(to avoid first click), emit disappear event
    if( (!(this.elementRef.nativeElement.contains(targetElement)) && !(addbtn.contains(targetElement)) && !(editbtn.contains(targetElement))) || (closebtn.contains(targetElement)) || (cancelbtn.contains(targetElement)) )
      this.disappear.emit(event);
  }
}
//Pipe to implement search logic
@Pipe({ name:'appFilter',
        pure:false
      })
export class FilterPipe implements PipeTransform {
  transform(items:any[],searchText:string):any[] {
    if(!items)
      return [];
    if(!searchText)
      return items;
    return items.filter(item=> {
      return ( (item.firstName.toLowerCase().includes(searchText.toLowerCase())) || (item.lastName.toLowerCase().includes(searchText.toLowerCase())) || (item.mobileNo.toLowerCase().includes(searchText.toLowerCase())) );
    });
    
  }
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush //Change detection strategy set to OnPush so that the pipe is evaluated not only on search text change but also on contacts array change
})
export class ContactsComponent implements OnInit {
  meta:Meta;
  addContactBox:boolean;
  contacts:Contact[]=Array();
  newContact:Contact=new Contact(undefined,undefined,undefined);
  firstNameError:boolean;
  lastNameError:boolean;
  mobileNoError:boolean;
  namePattern:RegExp=new RegExp("^[A-Za-z'-]+$");
  mobileNoPattern:RegExp=new RegExp("^([0-9]{10})$");
  searchText:string;
  popupHeader:string;
  currentContact:Contact;
  editContact:boolean;
  toggleBtn:string;
  
  constructor(
    private titleService: Title,
    private metaTagService: Meta
  ) {}
  
  ngOnInit() {
    this.titleService.setTitle("Phone Book App");
    this.metaTagService.addTag({name:'viewport', content:'width=device-width, initial-scale=1.0'});
  }

  showContactBox() {
    this.popupHeader="New Contact";
    this.addContactBox=true;
    this.toggleBtn="Create";
    this.editContact=false;
  }

  editContactBox(contactObj:Contact) {
    this.popupHeader="Edit Contact";
    this.addContactBox=true;
    this.toggleBtn="Update";
    this.newContact={firstName:contactObj.firstName,lastName:contactObj.lastName,mobileNo:contactObj.mobileNo};
    this.currentContact=contactObj;
    this.editContact=true;
  }

  hideContactBox() {
    this.addContactBox=false;
    this.newContact={firstName:undefined,lastName:undefined,mobileNo:undefined};
    this.firstNameError=true;
    this.lastNameError=true;
    this.mobileNoError=true;
  }

  sort(value:string) {
    if(value==="sortByName") {
      this.contacts.sort((c1,c2)=> {
        if(c1.firstName.toUpperCase()<c2.firstName.toUpperCase())
          return -1;
        else if(c1.firstName.toUpperCase()>c2.firstName.toUpperCase())
          return 1;
        else {
          if(c1.lastName.toUpperCase()<c2.lastName.toUpperCase())
            return -1;
          else if(c1.lastName.toUpperCase()>c2.lastName.toUpperCase())
            return 1;
          else
            return 0;
        }
      });
    }
    else if(value=="sortByMobileNo") {
      this.contacts.sort((c1,c2)=> {
        if(c1.mobileNo<c2.mobileNo)
          return -1;
        else if(c1.mobileNo>c2.mobileNo)
          return 1;
        else
          return 0;
      });
      console.log(this.contacts);
    }
  }

  deleteContact(contactObj:Contact) {
    this.contacts.splice(this.contacts.indexOf(contactObj),1);
  }

  addContact() {
    this.firstNameError=(this.newContact.firstName!==undefined) && (this.namePattern.test(this.newContact.firstName));
    this.lastNameError=(this.newContact.lastName!==undefined) && (this.namePattern.test(this.newContact.lastName));
    this.mobileNoError=(this.newContact.mobileNo!==undefined) && (this.mobileNoPattern.test(this.newContact.mobileNo));
    if(this.firstNameError && this.lastNameError && this.mobileNoError) {
      if(this.editContact!==true) {
        this.contacts.push(new Contact(this.newContact.firstName,this.newContact.lastName,this.newContact.mobileNo));
        this.clearData();
        this.hideContactBox();
      }
      else {
        this.currentContact.firstName=this.newContact.firstName;
        this.currentContact.lastName=this.newContact.lastName;
        this.currentContact.mobileNo=this.newContact.mobileNo;
        this.clearData();
        this.hideContactBox();
      }
    }
  }

  clearData() {
    this.newContact={firstName:undefined,lastName:undefined,mobileNo:undefined};
  }

}

export class Contact {
  constructor(
    public firstName:string,
    public lastName:string,
    public mobileNo:string
    ){}
}
