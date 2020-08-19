var doesMerchantInfoElementExist = document.querySelectorAll("#buybox-tabular").length;



var elmClass = elm.getElementsByClassName("a-truncate-full a-offscreen")[0];


var amazonMerchantInfo = document.querySelectorAll("#merchant-info")[0].innerText.toLowerCase();
isItemFullfilledByAmazon = amazonMerchantInfo.includes("amazon");




var isItemFullfilledByAmazon = false;
var doesMerchantInfoElementExist = document.querySelectorAll("#buybox-tabular").length;


if (doesMerchantInfoElementExist) {
    var amazonMerchantInfo = document.querySelectorAll("#buybox-tabular")[0];

    var elmClass = amazonMerchantInfo.getElementsByClassName("a-truncate-full a-offscreen")[0].innerText.toLowerCase();
    isItemFullfilledByAmazon = elmClass.includes("amazon");
}

console.log(isItemFullfilledByAmazon);


var elm = document.querySelector("#buybox-tabular .a-truncate-full.a-offscreen");
console.log(elm);