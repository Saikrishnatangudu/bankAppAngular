import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'BankingApp/src/app/classes/User';
import { AdminviewComponent } from '../adminview/adminview.component';
import { AuthenticationService } from '../services/authentication.service';
import { TransactionsService } from '../services/transactions.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router, 
    private adm: AdminviewComponent, private usrservice: UserService,private transactionservice:TransactionsService) { }

  ngOnInit(): void {
    this.getTransactionsbyfromAcc();


  }
  userlist = null;

  trasactionlist=[]

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }



  getbyrole() {

    this.usrservice.getUserByrole().subscribe(res => {

      this.userlist = []

      res.forEach((t, index) => {

        this.userlist.push(t);
        // console.log(JSON.stringify(this.trasactionlist))

      });

    })

  }


  getbystatus() {

    this.usrservice.getUserBystatus().subscribe(res => {

      this.userlist = []

      res.forEach((t, index) => {

        this.userlist.push(t);
        // console.log(JSON.stringify(this.trasactionlist))

      });

    })
  }


  getTransactionsbyfromAcc() {
    let cuser: User = JSON.parse(localStorage.getItem('currentUser'));

    this.trasactionlist = [];
    this.transactionservice.getTransactionsByfromAccNo(cuser.account.AccNo).subscribe(res => {

      res.forEach((t, index) => {
        console.log(this.trasactionlist)

        this.trasactionlist.push(t);

      });
    });
  }

  printToExcel(){

    let  fileName= 'transactions.xlsx';  
    
    this.transactionservice.exportexcel(this.trasactionlist,fileName);
    
    }

}
