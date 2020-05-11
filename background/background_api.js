var amazon_captcha_port;


chrome.extension.onConnect.addListener(port => {

    // Checks the connection source
    if(port.name === 'popup') 
    {

        popup_port = port;

        // Begins to listen messages from popup
        popup_port.onMessage.addListener(request => {

 
            if(request.type === 'captcha') 
            {
                var imgUrl = "https://images-na.ssl-images-amazon.com/captcha/bcxmjlko/Captcha_ftrsgxbmvh.jpg";
                console.log("Captcha Solver Start");
                getSolvedCaptcha(imgUrl);
                

            }


        });

        popup_port.onDisconnect.addListener(() => popup_port = null );
    }




        // Checks the connection source
        if(port.name === 'amazon') 
        {
    
          amazon_captcha_port = port;
    
            // Begins to listen messages from popup
            amazon_captcha_port.onMessage.addListener(request => {
    
     
                if(request.type === 'amazon_captcha_found') 
                {
                    console.log("amazon_captcha_found");


                    //var imgUrl = "https://images-na.ssl-images-amazon.com/captcha/bcxmjlko/Captcha_ftrsgxbmvh.jpg";
                    getSolvedCaptcha(request.captchaImgUrl);
                    
                }
    
    
            });
    
            amazon_captcha_port.onDisconnect.addListener(() => amazon_captcha_port = null );
        }





});



async function getSolvedCaptcha(imgUrl)
{

  console.log("Getting Solved Captcha")
  var captchaKey = await solveCaptcha(imgUrl);
  console.log("Solved Captcha: "+captchaKey);


  amazon_captcha_port.postMessage({ type: 'amazon_captcha_solved', captchaKey: captchaKey});

}




function getB64Image(imgUrl)
{

  console.log();
  return new Promise(resolve =>{

    toDataURL(imgUrl, async function(dataUrl) 
    {
      var imgb64 = dataUrl.replace("data:image/jpeg;base64,","");
      resolve(imgb64);

    });

  });

}


function toDataURL(url, callback) 
{
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }




async function solveCaptcha(imgUrl)
{
 
console.log("Solve Cpatcha Starterd: ");

var b64 = await getB64Image(imgUrl);

 var obj = {
    "signature_name":"serving_default",
    "inputs":{
       "input":{
          "b64":b64
       }
    }
 };



return new Promise(resolve =>{

    fetch('http://localhost:8501/v1/models/resnet:predict', {
        method: 'POST',
        body: JSON.stringify(obj), 
        headers: {
            'cache-control': 'no-cache',
            'content-type' : 'application/json'
        }
    }).then(resp => resp.json()).then(data => {
    
        var outputs = data.outputs;
        captchaKey = outputs.output;

        console.log(captchaKey);
        resolve(captchaKey);
    

})

 


})



}

