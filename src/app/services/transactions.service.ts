import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transactions } from '../classes/transactions';
import { User } from '../classes/User';
import * as XLSX from 'xlsx'; 


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:3000/transactions';


  saveTransaction(trans: Transactions): Observable<Object> {
    return this.http.post(this.baseUrl, trans);
  }

  getTrans() {

    return this.http.get(this.baseUrl)
      .pipe(
        map(responseData => {
          //console.log(responseData);
          const transactions = [];
          for (const key in responseData) {

            //  console.log(responseData[key].transactionDate+"keyvalue")
            if (responseData.hasOwnProperty(key)) {


              transactions.push({ ...responseData[key], id: key });
            }
          }
          return transactions;
        })

      )
  }
  getBydate(sd: Date, ed: Date) {

    /* console.log(sd)
    console.log(ed+typeof(ed)) */

    let p = new Date();
    //console.log(p)


    return this.http
      .get(this.baseUrl)
      .pipe(
        map(responseData => {
          //console.log(responseData);
          const transactions = [];
          for (const key in responseData) {
            // console.log(responseData[key].date)
            let a = responseData[key].transactionDate;
            console.log(a)
            let k = new Date(a);
            console.log(k);
            console.log(k.getDate());
            console.log(k > sd)
            console.log(k <= ed)
            console.log(k > sd && k < ed)

            if (k >= sd && k <= ed) {
              transactions.push({ ...responseData[key], id: key });
            }
          }
          console.log(transactions)
          return transactions;
        })

      )

  }



  getTransactionsByAmmount(ammount: number) {


    return this.http.get(this.baseUrl + "?transactionAmmount=" + ammount).pipe(
      map(responseData => {
        console.log(responseData);
        const transactions = [];
        for (const key in responseData) {

          //console.log(key+"keyvalue")
          if (responseData.hasOwnProperty(key)) {


            transactions.push({ ...responseData[key], id: key });
          }
        }
        return transactions;
      })

    );


  }

  getTransactionsByAccNo(accNo) {


    return this.http.get(this.baseUrl + "?toAccNo=" + accNo).pipe(
      map(responseData => {
        console.log(responseData);
        const transactions = [];
        for (const key in responseData) {

          //console.log(key+"keyvalue")
          if (responseData.hasOwnProperty(key)) {


            transactions.push({ ...responseData[key], id: key });
          }
        }
        return transactions;
      })

    );



  }


  getTransactionsByfromAccNo(accNo) {

    return this.http.get(this.baseUrl + "?fromAccNo=" + accNo).pipe(
      map(responseData => {
        //  console.log(responseData);
        const transactions = [];
        for (const key in responseData) {

          //console.log(key+"keyvalue")
          if (responseData.hasOwnProperty(key)) {


            transactions.push({ ...responseData[key], id: key });
          }
        }
        return transactions;
      })

    );

  }

  exportexcel(list,filename): void 
  {
     /* table id is passed over here */   
   //  let element = document.getElementById('excel-table'); 
     const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(list);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb,filename);
    
  }

}