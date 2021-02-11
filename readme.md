# Vadzim Churun
##### Test task - Software Developer, Scandiweb

Welcome to Vadzim Churun's carousel component!

#### Structure
The 2 folders - 'carousel' and 'client' - separate the carousel implementation from the sample project using it.
* 'carousel' is the actual implementation. It is reusable.
* 'client' is the sample project, which demonstrates the component work.

#### Installation
To run the project, NodeJS with yalc extension and a browser are needed.
1. Install (if haven't yet) yalc:  
  `npm install -g yalc`
1. First compile the carousel. In 'carousel' folder:  
  `npm install`  
  `npm run build`
1. Publish the compiled package. In 'carousel/build' folder:  
  `yalc publish`
1. Use the published package in the sample project. In 'client' folder:  
  `yalc add churun-carousel`  
  `npm install`
1. Run the project on your local network:  
  `npm start`
1. Test on PC. In your favourite browser, go to:  
  `localhost:8080`
1. Test on a mobile device. Connect the device to the same LAN as your PC. Then open a browser and go to:  
  `{PcIp}:8080`  
where `{PcIp}` is your computer's IP address (can be obtained via `ipconfig` on Windows and `ifconfig` on UNIX systems).

#### Features
Vadzim Churun's carousel supports:
* Infinite scroll.
* Switch to a specified slide.
* Multiple slides on the screen.
Note: the carousel allows to disable switch, however, in the sample project it is always enabled.

#### Support
If you have any questions, please contact me at `vadim.churun.emp@gmail.com`.  
Enjoy!