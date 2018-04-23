# BTC Desktop Spinner/Chart project built on Raspberry Pi and Node.js

A Raspberry Pi project which will combine a live BTC chart, with GDAX API to determine price and change LEDs and a stepper motor accordingly. 


- Uses a Raspberry Pi 3+ to run the LCD screen, LEDs, and Stepper motor
- Built with Node.js
- Uses the Node.js 'onoff' library to control GPIO output for LEDs
- Uses the GDAX API to recieve BTC historical and current price action

# Concept: This project will provide a visual alert of current BTC price action

# Roadmap: 
- Live working BTC Chart (Tradeview, hourly)
- Integrate GDAX API to query current and historical price data every 10 seconds
- Depending on price change of BTC for a given time period (currently 24 hours) onoff will dictate what color the LEDs will be (red for negative, green for positive) and if they will be solid (0-5%) or flashing (>5%)
- Depending on price change of BTC for a given time period GPIO controllers will dictate the speed of the Stepper motor turning a 1.5" Bitcoin. 0-5% positive will spin slowly clockwise. 0-5% negative will spin slowly counterclockwise. >5% will spin faster.

# To run: 
- npm i onoff gdax
- node btcAPILED.js
