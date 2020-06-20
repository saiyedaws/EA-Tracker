
echo Download Git Bash at: https://git-scm.com/downloads

echo for windows , download chrome canary
echo download chome canary https://www.google.com/intl/en/chrome/canary/thank-you.html?statcb=0&installdataindex=empty&defaultbrowser=0

echo for linux install chromium 
echo sudo apt-get install chromium-browser -y

echo ubuntu  | sudo -S -k apt-get install chromium-browser -y


echo copy and paste into terminal or into gitbash
echo Official Project at:  https://github.com/saiyedaws/EA-Tracker

echo installing orderfinder4 begins

echo ubuntu  | sudo -S -k apt install git -y
echo Updating Chrome Extensions

cd --
cd Documents
mkdir ChromeExtensions
cd ChromeExtensions
rm -rf EA-Tracker
git clone https://github.com/saiyedaws/EA-Tracker

echo done Updating/Downloading EA-Tracker

echo to have captcha solver always running enter code below and replace containerID
echo docker update --restart=always 4362fa682ffb