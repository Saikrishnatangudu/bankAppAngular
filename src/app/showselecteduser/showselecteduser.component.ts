import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'BankingApp/src/app/services/user.service';
import { Transactions } from '../classes/transactions';
import { User } from '../classes/User';
import { TransactionsService } from '../services/transactions.service';

@Component({
  selector: 'app-showselecteduser',
  templateUrl: './showselecteduser.component.html',
  styleUrls: ['./showselecteduser.component.css']
})
export class ShowselecteduserComponent implements OnInit {
  constructor(private us: UserService, private route: ActivatedRoute, private router: Router, 
    private transactionService:TransactionsService,private userService:UserService) {  

      this.userda=  JSON.parse(localStorage.getItem("selectedUser"));

  }

  userda;
  ngOnInit(): void {
    this.getone();


  };

  id;
  getone() {
    this.route.queryParams.subscribe(res => {
      console.log(res.id + "id")
      this.id = res.id;
      this.us.getUserById(this.id).subscribe(r => {
       
        localStorage.setItem("selectedUser",JSON.stringify(r))
        this.userda = JSON.parse(localStorage.getItem("selectedUser"));

        console.log(r)
        console.log(this.userda)


      })
    })

  }
  ammount;

  fudTransfer() {
    this.route.queryParams.subscribe(res => {
      console.log(res.id + "id")
      this.id = res.id;
      this.us.getUserById(this.id).subscribe(r => {
        this.userda = r


      });

    });
   // this.transaction(966969965,this.userda.account.AccNo,this.ammount)
    let fromAccNo=966969965
    let toAccNo=this.userda.account.AccNo

      let touser = new User();
      let fromUser = new User();
     let Ammount=this.ammount
  
     this.userService.getByAccNo(fromAccNo).subscribe(res => {
  
      fromUser = res[0];

      console.log("------Currentuserdetails---------"); console.log(fromUser);

      if (fromUser.account.balance > Ammount) {
        console.log("Userbalance "+fromUser.account.balance)

        fromUser.account.balance = fromUser.account.balance - Ammount
        console.log("updatedUserBalance "+fromUser.account.balance)
        //alert('user account found')

        this.userService.updateUser(fromUser.id, fromUser).subscribe(res =>
           { console.log("------UpdatedCurrentuserdetails---------");
         console.log(res) 
        });
        
        
        
        alert('update account found')
        localStorage.setItem('currentUser', JSON.stringify(fromUser));

        this.userService.getByAccNo(toAccNo).subscribe(res => {
        //  alert('user account found')

          console.log("------Recipientuserdetails---------"); console.log(res);

          touser = res[0];
          console.log("Recipientbalance "+touser.account.balance)

          touser.account.balance = touser.account.balance + Ammount
          console.log("updatedrecipientbalance "+touser.account.balance)

          this.userService.updateUser(touser.id, touser).subscribe(res => 
            { console.log("------UpdatedRecipientuserdetails---------"); console.log(res) 
            localStorage.setItem("selectedUser",JSON.stringify(res))

            this.userda = JSON.parse(localStorage.getItem("selectedUser"));

          });
         // alert('update account found')

          this.transactionService.getTrans().subscribe(ind => {
            alert('Transaction is processing')

            let trans = new Transactions();
            trans.fromAccNo = fromAccNo;
            trans.toAccNo = toAccNo;
            trans.transactionAmmount = Ammount;
            trans.transactionDate = new Date();
            trans.transactionRemarks = "sucessfull"
            trans.BalanceOnDate = fromUser.account.balance;
            trans.transactionId = ind.length + 1


            this.transactionService.saveTransaction(trans).subscribe(res => { console.log("-----Transaction details---------"); console.log(res) });
            alert("Transaction was sucessfull");
            this.ammount='';
            this.router.navigate(['view']);
          });

        })
      }
      else {

        alert("InsufficientFunds")
       // this.router.navigate(['users'])


      }

    });

  }

  enableuser(){

    this.userda.accstatus="active"
    localStorage.setItem("selectedUser",JSON.stringify(this.userda))
    console.log(this.userda.id + "id")

    console.log(this.userda)

    this.userService.updateUser(this.userda.id,this.userda).subscribe();
    this.router.navigate(['view']);
    this.userda=  JSON.parse(localStorage.getItem("selectedUser"));



  }

  diableuser(){

    this.userda.accstatus="inactive"
    localStorage.setItem("selectedUser",JSON.stringify(this.userda))
    console.log(this.userda.id + "id")

    console.log(this.userda)

    this.userService.updateUser(this.userda.id,this.userda).subscribe();
    this.router.navigate(['view']);
    this.userda=  JSON.parse(localStorage.getItem("selectedUser"));



  }

    

  

  goback() {
    localStorage.removeItem("selectedUser");

    this.router.navigate(['admin']);
  }

}
