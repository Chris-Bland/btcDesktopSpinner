
//GDAX Require and create a new client
var Gdax = require('gdax');
var btcClient = new Gdax.PublicClient();
console.log('Created GDAX Bitcoin Client');
 
//Set Up LED Ring configs and globals
var ws281x = require('rpi-ws281x');
var offset = 0;
config = {leds:16,gpio:21,brightness: 180};
ws281x.configure(config);
var redColor = 0x00FF00;
var greenColor = 0xFF0000;
var color = 0x0000FF;
var isSolid = false;
 
//Set Up Stepper Motor
var stepperWiringPi = require("stepper-wiringpi");
var pinIN1 = 5;
var pinIN2 = 6;
var pinIN3 = 13;
var pinIN4 = 16;
 
var motor = stepperWiringPi.setup(100, pinIN1, pinIN2, pinIN3, pinIN4);
motor.setSpeed(0);
console.log('Established Stepper Motor GPIO Layout and setup');
 
//Call Gdax API
console.log('API call in 10 seconds');
var APICALL = setInterval(getBitcoinInformation, 60000);
 
//start LED Ring
var pixels = new Uint32Array(config.leds);
var LEDHANDLER = setInterval(ledLoop, 60);

 
// API STUFF START ________________________________________________________________________________________________
 
async function getBitcoinInformation() {
    console.log('Making API Call');
    await btcClient.getProduct24HrStats('BTC-USD', function(err, response, data) {
        try {
            if (err) {
                console.log('Error after making API Call: ', err);
                return;
            } else {;
                var btcHistoric = data;
 
                if (btcHistoric.open === undefined) {
                    console.log('API Limit Reached.');
                    return;
                }
                var openCandleCurrent = btcHistoric.last;
                var openCandleOneHour = btcHistoric.open;
                console.log('BTC Data received');
                calcpercent(openCandleCurrent, openCandleOneHour);
            }
        } catch (error) {
            console.log('Error making API Call: ', error);
        }
 
    });
};
// API STUFF END ________________________________________________________________________________________________
 
// Calculate Percentage and Turn motor/set LED________________________________________________________________________________________________
 
function calcpercent(openCandleCurrent, openCandleOneHour) {
    var btcPercentChange = ((openCandleCurrent - openCandleOneHour) / openCandleOneHour) * 100;
    console.log('Bitcoin Current Price: ', openCandleCurrent);
    console.log('Bitcoin Price 24 Hours Ago:  ', openCandleOneHour);
    console.log('Bitcoin has moved ' + btcPercentChange + '% in 24 hours' );
 
    if (Math.abs(btcPercentChange) >= 5) {
        if (openCandleCurrent > openCandleOneHour) {
            motor.setSpeed(80);
            motor.forward();
            color = greenColor;
            isSolid = false;
        } else {
            motor.setSpeed(80);
            motor.backward();
            color = redColor;
            isSolid = false;
        };
    } else {
 
        if (openCandleCurrent > openCandleOneHour) {
            motor.setSpeed(40);
            motor.forward();
            color = greenColor;
            isSolid = true;
        } else {
            motor.setSpeed(40);
            motor.backward();
            color = redColor;
            isSolid = true;
        };
    }
};
// Calculate Percentage and Turn motor/set LED END________________________________________________________________________________________________

// LED STUFF START________________________________________________________________________________________________

function ledLoop(){
    if (isSolid == true){
                for (var i = 0; i < config.leds; i++)
                   pixels[i] = color;
           offset =0;
 
    } else {
                pixels[offset] = color;
 
        if(color == 0xFF0000){
                  offset = (offset + 1) % config.leds;
        } else{
          offset = ((offset - 1) + config.leds) % config.leds;
        };
    };
        ws281x.render(pixels);
};
// API STUFF END ________________________________________________________________________________________________
