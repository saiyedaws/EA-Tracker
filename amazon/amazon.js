let bg_port = chrome.runtime.connect({ name: "amazon" });

if (document.title === "Robot Check") {
    console.log("Robot Check Doc Found");

    var captchaImgUrl = document.querySelectorAll(".a-text-center.a-row")[1].querySelectorAll("img")[0].getAttribute("src");
    bg_port.postMessage({ type: 'amazon_captcha_found', captchaImgUrl: captchaImgUrl });


    bg_port.onMessage.addListener((request) => {

        if (request.type === 'amazon_captcha_solved') {
            console.log("code: " + request.captchaKey)

            var typeCaptchaTextBox = document.getElementById("captchacharacters");
            typeCaptchaTextBox.value = request.captchaKey;

            setTimeout(() => {
                document.querySelectorAll('button[type="submit"]')[0].click();
            }, 2000);


        }



    });





} else {

    
    scrapeAmazon();


}






async function scrapeAmazon() 
{

    await checkIfPriceExists();


    var amazonItemData =
    {
        isPageCorrectlyOpened: IsPageCorrectlyOpened(),
        isItemAvailable: IsItemAvailable(),
        isEligibleForPrime: IsEligibleForPrime(),
        availabilityMessage: GetAvailabilityMessage(),
        isItemDeliveryExtended: isItemDeliveryExtended(),
        deliveryTimeMessage: getDeliveryTimeMessage(),
        amazonItemUrl: getCurrentUrl(),
        price: getAmazonPrice()

    }

    console.log(amazonItemData);


    chrome.runtime.sendMessage({
        type: 'from_amazon',
        command:"fetched_data",
        amazonItemData: amazonItemData

    });



}


function checkIfPriceExists(){
    return new Promise(resolve =>
    {

        try {
            if(!IsItemAvailable())
            {
                resolve();
            
            }

            if(IsItemAvailable())
            {
                var priceElement = getPriceElement();

                priceString = priceElement.innerText.replace("CDN$ ","");
            
               

                resolve();
            
            }
        } catch (error) 
        {
            console.log(error);

            setTimeout(() => {
                location.reload();
            }, 60000);
            
        }

    });





}

function getPriceElement()
{

    var priceElement = 
                document.getElementById("price_inside_buybox") ||
                document.getElementById("newBuyBoxPrice") ||
                document.getElementById("priceblock_ourprice") ||
                document.getElementById("priceblock_saleprice") ||
                document.getElementById("buyNewSection") ||
                document.getElementById("buyNew_noncbb") ||
                document.getElementById("priceblock_dealprice")
                ;

    return priceElement;

}



function getAmazonPrice()
{
    var priceString = "-1";


            if(IsItemAvailable())
        {
            var priceElement = getPriceElement();

            ;
        
            priceString = priceElement.innerText.replace("CDN$ ","");
        
        }
   


  

    return Number(priceString);

}


function getElementByXPath(element, xPath){
    
    var headings = document.evaluate(xPath, element, null, XPathResult.ANY_TYPE, null );
    var thisHeading = headings.iterateNext();

    return thisHeading;
}






function getCurrentUrl() {

    return window.location.href;
}

function IsEligibleForPrime() {
    //Looking for:
    //sold by anboer and fulfilled by amazon.
    //ships from and sold by amazon.ca

    var isItemFullfilledByAmazon = false;
    var doesMerchantInfoElementExist = document.querySelectorAll("#merchant-info").length;

    if (doesMerchantInfoElementExist) {
        var amazonMerchantInfo = document.querySelectorAll("#merchant-info")[0].innerText.toLowerCase();
        var isItemFullfilledByAmazon = amazonMerchantInfo.includes("amazon");
    }


    return isItemFullfilledByAmazon;
}



//Unavailable Message: B01HLYKBOM :available from these sellers. Fix this
function IsItemAvailable() {
    var isItemAvailable = false;
    var doesAvailabilityElementExist = document.querySelectorAll("#availability").length || false;

    if (doesAvailabilityElementExist) {
        var availability = GetAvailabilityMessage();


        console.log(availability)

        if
            (
            availability === "in stock." ||
            availability === "only 3 left in stock." ||
            availability === "only 4 left in stock." ||
            availability === "only 5 left in stock." ||
            availability === "only 6 left in stock." ||
            availability === "only 7 left in stock." ||
            availability === "only 8 left in stock." ||
            availability === "only 9 left in stock." ||
            availability === "only 10 left in stock." ||
            availability === "only 3 left in stock (more on the way)." ||
            availability === "only 4 left in stock (more on the way)." ||
            availability === "only 5 left in stock (more on the way)." ||
            availability === "only 6 left in stock (more on the way)." ||
            availability === "only 7 left in stock (more on the way)." ||
            availability === "only 8 left in stock (more on the way)." ||
            availability === "only 9 left in stock (more on the way)." ||
            availability === "only 10 left in stock (more on the way)." ||
            availability === "available to ship in 1-2 days." ||
            availability === "usually ships within 2 to 3 days."

        ) {
            isItemAvailable = true;
        }


    }


    return isItemAvailable;
}



function GetAvailabilityMessage() {
    var availability = "Not Yet Defined."
    var doesAvailabilityElementExist = document.querySelectorAll("#availability").length || false;


    if (doesAvailabilityElementExist) {
        availability = document.querySelectorAll("#availability")[0].innerText.toLowerCase();
        availability = availability.replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    }


    return availability;
}


function IsPageCorrectlyOpened() {
    //Returns False if their is no amazon image Block Holder
    return !!document.querySelectorAll('#imageBlock').length;
}


function isItemDeliveryExtended() {

    var isItemDeliveryExtended = false;


    if (document.body.innerText.indexOf("Extended delivery time") > -1) {

        isItemDeliveryExtended = true;

    } else {

        isItemDeliveryExtended = false;

    }


    return isItemDeliveryExtended;
}


function getDeliveryTimeMessage() {
    var deliveryTimeMessage = "No Delivery Message";


    if (document.querySelectorAll("#delivery-message").length) {
        deliveryTimeMessage = document.getElementById("delivery-message").innerText.replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    }

    return deliveryTimeMessage;
}