/*
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

    



} */