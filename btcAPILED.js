var Gdax = require('gdax');
var btcClient = new Gdax.PublicClient();

var Gpio = require('onoff').Gpio;
var LEDRed = new Gpio(26,'out');
var LEDGreen = new Gpio(27, 'out');

var APICALL = setInterval(getBitcoinInformation, 10000);


// API STUFF START ________________________________________________________________________________________________



async function getBitcoinInformation() {

    await btcClient.getProduct24HrStats('BTC-USD', function(err, response, data) {
        try {
            if (err) {
                console.log('first', err);
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
            console.log('error 1', error);
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


// LED STUFF START________________________________________________________________________________________________

function calcpercent(openCandleCurrent, openCandleOneHour) {
    var btcPercentChange = ((openCandleCurrent - openCandleOneHour) / openCandleOneHour) * 100;
    console.log('BTC CURRENT PRICE: ', openCandleCurrent);
    console.log('BTC 24 hours ago price ', openCandleOneHour);
    console.log('BTC HAS CHANGED : ' + btcPercentChange + '%');

    if (btcPercentChange >= 5) {
        if (openCandleCurrent > openCandleOneHour) {
            
            LEDGreenFlash();
        } else {
           
            LEDRedFlash();
        };
    } else {
        if (openCandleCurrent > openCandleOneHour) {
            
            LEDGreenOn();
        } else {
          
            LEDRedOn();
        };
    }

};
