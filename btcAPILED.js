var Gdax = require('gdax');
var btcClient = new Gdax.PublicClient();
console.log('Created GDAX Bitcoin Client');
 
var Gpio = require('onoff').Gpio;
var LEDRed = new Gpio(13,'out');
var LEDGreen = new Gpio(20, 'out');
var LEDRed2 = new Gpio(19,'out');
var LEDGreen2 = new Gpio(21, 'out');
console.log('Established LED GPIO Layout');
 
var stepperWiringPi = require("stepper-wiringpi");
var pinIN1 = 5;
var pinIN2 = 6;
var pinIN3 = 13;
var pinIN4 = 16;
 
var motor = stepperWiringPi.setup(200, pinIN1, pinIN2, pinIN3, pinIN4);
motor.setSpeed(0);
console.log('Established Stepper Motor GPIO Layout and setup');
 
console.log('API call in 10 seconds');
var APICALL = setInterval(getBitcoinInformation, 10000);
 
 
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
 
    /* ONE HOUR
        await btcClient.getProductHistoricRates('BTC-USD', {
            granularity: 60
        }, function(err, response) {
            try {
                if (err) {
                    console.log('first', err);
                    return;
                } else {;
                    var btcHistoric = JSON.parse(response.body);
 
                    if (btcHistoric[0] === undefined) {
                        console.log('API Limit Reached.');
                        return;
                    }
                    var openCandleCurrent = btcHistoric[1][4];
                    var openCandleOneHour = btcHistoric[60][4];
                    console.log('BTC Data received');
                    calcpercent(openCandleCurrent, openCandleOneHour);
                }
            } catch (error) {
                console.log('error 1', error);
            }
        });
    */
 
};
 
// API STUFF END ________________________________________________________________________________________________
 
 
// Calculate Percentage and Turn motor/Turn on LED________________________________________________________________________________________________
 
function calcpercent(openCandleCurrent, openCandleOneHour) {
    var btcPercentChange = ((openCandleCurrent - openCandleOneHour) / openCandleOneHour) * 100;
    console.log('Bitcoin Current Price: ', openCandleCurrent);
    console.log('Bitcoin Price 24 Hours Ago:  ', openCandleOneHour);
    console.log('Bitcoin has moved ' + btcPercentChange + '% in 24 hours' );
 
    if (btcPercentChange >= 5) {
        if (openCandleCurrent > openCandleOneHour) {
            motor.forward();
            motor.setSpeed(200);
            LEDGreenFlash();
        } else {
            motor.backward();
            motor.setSpeed(200);
            LEDRedFlash();
        };
    } else {
        if (openCandleCurrent > openCandleOneHour) {
            motor.forward();
            motor.setSpeed(100);
            LEDGreenOn();
        } else {
            motor.forward();
            motor.setSpeed(100);
            LEDRedOn();
        };
    }
 
};
 
// Calculate Percentage and Turn motor/Turn on LED END________________________________________________________________________________________________
 
 
// LED FLASH BY COLOR ________________________________________________________________________________________________
 
function LEDGreenFlash(){
    console.log('BTC is Over 5% Up');
    if (LEDGreen.readSync() === 1 | LEDGreen2.readSync() === 1){return} 
    var blinkInterval = setInterval(blinkLEDGreen, 250);
};
 
function LEDRedFlash(){
    console.log('BTC is Over 5% Down');
    if (LEDRed.readSync() === 1 | LEDRed2.readSync() === 1){return}
    var blinkInterval = setInterval(blinkLEDRed, 250); 
};
 
// LED FLASH BY COLOR ________________________________________________________________________________________________
 
// LED FUNCTIONS ________________________________________________________________________________________________
 
function LEDGreenOn(){
    LEDGreen.writeSync(1);
    LEDRed.writeSync(0);
    LEDGreen2.writeSync(1);
    LEDRed2.writeSync(0);
    console.log('BTC is 1-5% Up')
};
 
function LEDRedOn(){
    LEDGreen.writeSync(0);
    LEDRed.writeSync(1);
    LEDGreen2.writeSync(0);
    LEDRed2.writeSync(1);
    console.log('BTC is 1-5% Down')
};

function blinkLEDGreen() {
    if (LEDGreen.readSync() === 0) {
        LEDGreen.writeSync(1);
        LEDGreen2.writeSync(0);
    } else {
        LEDGreen.writeSync(0);
        LEDGreen2.writeSync(1);
    }
};

function blinkLEDRed() {
    if (LEDRed.readSync() === 0) {
        LEDRed.writeSync(1);
    } else {
        LEDRed.writeSync(0);
    }
    if (LEDRed2.readSync() === 0) {
        LEDRed2.writeSync(1);
    } else {
        LEDRed2.writeSync(0);
    }
};
 
// LED FUNCTIONS ________________________________________________________________________________________________
 