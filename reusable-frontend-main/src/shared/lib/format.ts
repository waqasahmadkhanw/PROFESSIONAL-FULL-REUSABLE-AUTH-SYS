export function formatCurrency(
  amount:number,
  currency="USD"
){

 return new Intl.NumberFormat(
    "en-US",
    {
      style:"currency",
      currency
    }
 ).format(amount);

}



export function formatNumber(
 value:number
){
 return new Intl.NumberFormat(
   "en-US"
 ).format(value);
}