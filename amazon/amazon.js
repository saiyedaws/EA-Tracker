let bg_port = chrome.runtime.connect({ name: "amazon" });

if(document.title === "Robot Check")
{
    console.log("Robot Check Doc Found");

    var captchaImgUrl = document.querySelectorAll(".a-text-center.a-row")[1].querySelectorAll("img")[0].getAttribute("src");
    bg_port.postMessage({ type: 'amazon_captcha_found', captchaImgUrl: captchaImgUrl});


    bg_port.onMessage.addListener((request) => 
{

    if(request.type === 'amazon_captcha_solved') 
    {
        console.log("code: "+request.captchaKey)

        var typeCaptchaTextBox = document.getElementById("captchacharacters");
        typeCaptchaTextBox.value = request.captchaKey;

        setTimeout(() => {
            document.querySelectorAll('button[type="submit"]')[0].click();
        }, 2000);
        

    }



});

    



}else{


    var amazonItemData = 
    {
        type: 'amazon_data',
        isPageCorrectlyOpened: IsPageCorrectlyOpened(),
        isItemAvailable: IsItemAvailable(),
        isEligibleForPrime: IsEligibleForPrime(),
        availabilityMessage: GetAvailabilityMessage(),
        isItemDeliveryExtended: isItemDeliveryExtended(),
        deliveryTimeMessage: getDeliveryTimeMessage(),
        amazonItemUrl: getCurrentUrl()
        
    }

console.log(amazonItemData);
try {
scrapeAmazon();
} catch (error) {

}


}







/*    
if(typeof checkThisProduct !== 'undefined' && checkThisProduct) 
{
    console.log("Amazon Scrape Iniated.");

    chrome.runtime.sendMessage({
        type: 'amazon_data',
        isPageCorrectlyOpened: IsPageCorrectlyOpened(),
        isItemAvailable: IsItemAvailable(),
        isEligibleForPrime: IsEligibleForPrime(),
        availabilityMessage: GetAvailabilityMessage(),
        isItemDeliveryExtended: isItemDeliveryExtended(),
        deliveryTimeMessage: getDeliveryTimeMessage(),
        amazonItemUrl: getCurrentUrl()
       
  
    });

} */


function scrapeAmazon()
{

    console.log("Amazon Scrape Iniated.");

    chrome.runtime.sendMessage({
        type: 'amazon_data',
        isPageCorrectlyOpened: IsPageCorrectlyOpened(),
        isItemAvailable: IsItemAvailable(),
        isEligibleForPrime: IsEligibleForPrime(),
        availabilityMessage: GetAvailabilityMessage(),
        isItemDeliveryExtended: isItemDeliveryExtended(),
        deliveryTimeMessage: getDeliveryTimeMessage(),
        amazonItemUrl: getCurrentUrl()
       
  
    });

}




function getCurrentUrl(){

    return window.location.href;
}

function IsEligibleForPrime() 
{
    //Looking for:
    //sold by anboer and fulfilled by amazon.
    //ships from and sold by amazon.ca

    var isItemFullfilledByAmazon = false;
    var doesMerchantInfoElementExist = document.querySelectorAll("#merchant-info").length;

    if(doesMerchantInfoElementExist)
    {
        var amazonMerchantInfo = document.querySelectorAll("#merchant-info")[0].innerText.toLowerCase();
        var isItemFullfilledByAmazon = amazonMerchantInfo.includes("amazon");
    }


    return isItemFullfilledByAmazon;
}



//Unavailable Message: B01HLYKBOM :available from these sellers. Fix this
function IsItemAvailable() 
{
    var isItemAvailable = false;
    var doesAvailabilityElementExist = document.querySelectorAll("#availability").length || false;

    if(doesAvailabilityElementExist)
    {
        var availability = GetAvailabilityMessage();


        console.log(availability)
        
        if
        (
            availability === "in stock."||
            availability === "only 3 left in stock."||
            availability === "only 4 left in stock."||
            availability === "only 5 left in stock."||
            availability === "only 6 left in stock."||
            availability === "only 7 left in stock."||
            availability === "only 8 left in stock."||
            availability === "only 9 left in stock."||
            availability === "only 10 left in stock."||
            availability === "only 3 left in stock (more on the way)."||
            availability === "only 4 left in stock (more on the way)."||
            availability === "only 5 left in stock (more on the way)."||
            availability === "only 6 left in stock (more on the way)."||
            availability === "only 7 left in stock (more on the way)."||
            availability === "only 8 left in stock (more on the way)."||
            availability === "only 9 left in stock (more on the way)."||
            availability === "only 10 left in stock (more on the way)."||
            availability === "available to ship in 1-2 days."||
            availability === "usually ships within 2 to 3 days."
            
        )
        {
            isItemAvailable = true;
        }


    } 


    return isItemAvailable;
}



function GetAvailabilityMessage()
{
    var availability = "Not Yet Defined."
    var doesAvailabilityElementExist = document.querySelectorAll("#availability").length || false;


    if(doesAvailabilityElementExist)
    {
        availability = document.querySelectorAll("#availability")[0].innerText.toLowerCase();
        availability = availability.replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    } 


    return availability;
}


function IsPageCorrectlyOpened() 
{
    //Returns False if their is no amazon image Block Holder
    return !!document.querySelectorAll('#imageBlock').length;
}


function isItemDeliveryExtended()
{

    var isItemDeliveryExtended = false;


    if(document.body.innerText.indexOf("Extended delivery time") > -1)
    {

        isItemDeliveryExtended = true;

    }else{

        isItemDeliveryExtended = false;

    }
    

    return isItemDeliveryExtended;
}


function getDeliveryTimeMessage(){
    var deliveryTimeMessage = "No Delivery Message";


    if(document.querySelectorAll("#delivery-message").length)
    {
        deliveryTimeMessage = document.getElementById("delivery-message").innerText.replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    }
    
    return deliveryTimeMessage;
}