import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Transactions } from '../classes/transactions';
import { User } from '../classes/User';
import { AuthenticationService } from '../services/authentication.service';
import { TransactionsService } from '../services/transactions.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'make-transaction',
  templateUrl: './make-transaction.component.html',
  styleUrls: ['./make-transaction.component.css']
})
export class MakeTransactionComponent implements OnInit {
  currentUser: User;

  constructor(private router: Router, private userService: UserService, private authservice: AuthenticationService, private transactionService: TransactionsService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

  }
  ngOnInit(): void {
    //this.userService.getUserById();


  }

  form = new FormGroup({
    // fromaccno: new FormControl(t),
    toaccno: new FormControl(''),
    ammount: new FormControl('')
  });


  loading: boolean;

  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.loading = true;

    if(this.currentUser.account.AccNo===this.form.value.toaccno){

      this.error="self transfer is not possible"
      alert("enter a differnt account number");
      this.loading=false;
      return;
      

    }
this.error='';
    this.transaction(this.currentUser.account.AccNo, this.form.value.toaccno, this.form.value.ammount);
    

    this.loading = false;

  }

  error = ''
  sucess=''


  transaction(fromAccNo: number, toAccNo: number, Ammount: number) {

    let touser = new User();
    let fromUser = new User();


    this.userService.getByAccNo(fromAccNo).subscribe(res => {

      fromUser = res[0];
        


      console.log("------Currentuserdetails---------"); console.log(fromUser);

      if (fromUser.account.balance > Ammount) {


        if (fromUser.accstatus == "inactive") {
          this.error = 'your account was deactivated please consult to bank'
          alert(" you are not authorized to make transactions")
          this.loading = false
        }

        console.log("Userbalance " + fromUser.account.balance)

        fromUser.account.balance = fromUser.account.balance - Ammount
        console.log("updatedUserBalance " + fromUser.account.balance)
        //alert('user account found')



        this.userService.getByAccNo(toAccNo).subscribe(res => {

          //  alert('user account found')
          touser = res[0];

          if (touser.accstatus === "inactive") {
            this.error = 'Recipient Account  was deactivated  you cannot able to make Transactions'
            alert(" Recipient Account is authorized to make transactions")
            this.loading = false
            return;
          }
          this.userService.updateUser(fromUser.id, fromUser).subscribe(res => { console.log("------UpdatedCurrentuserdetails---------"); console.log(res) });
          alert('update account found')
          localStorage.setItem('currentUser', JSON.stringify(fromUser));

          console.log("------Recipientuserdetails---------"); console.log(res);

          
          console.log("Recipientbalance " + touser.account.balance)

          touser.account.balance = touser.account.balance + Ammount
          console.log("updatedrecipientbalance " + touser.account.balance)

          this.userService.updateUser(touser.id, touser).subscribe(res => { console.log("------UpdatedRecipientuserdetails---------"); console.log(res) });
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
            this.sucess="Transaction is Sucessfull Thankyou!!!!"

            
          });

        })
      }
      else {

        alert("InsufficientFunds")
        this.router.navigate(['users'])


      }

    });



  }


  goback() {

    this.router.navigate(['users'])
  }


}
