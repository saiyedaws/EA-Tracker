
echo ---------------------INSTALLING  CHROME EXTENSION-----------------------------

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



echo ---------------------INSTALLING CAPTCHA SOLVER TO DOCKER-----------------------------

echo stop all docker containers
docker stop $(docker ps -aq)

echo remove all docker containers
docker rm $(docker ps -aq)

docker pull tensorflow/serving

cd --
cd Documents
cd ChromeExtensions
cd EA-Tracker
cd captcha_solver_api_docker

echo pwd is relative path


docker run -p 8501:8501 \
 --name captcha_solver --mount type=bind,\source=`pwd`/resnet,target=/models/resnet \
-e MODEL_NAME=resnet -t tensorflow/serving &

echo to have captcha solver always running enter code below and replace containerID
echo docker update --restart=always 4362fa682ffb

docker update --restart=always captcha_solver



echo NOTE FOR LOW RAM DESKTOPS, less then 4gb , must right click icon tray for docker -- > settings --> advanced settings, and use ram as 1gb!

echo sometimes wont work because space in name, so move to dir without space
echo docker run -p 8501:8501 \
echo --name captcha_solver --mount type=bind,source=/c/Users/resnet,target=/models/resnet \
echo -e MODEL_NAME=resnet -t tensorflow/serving &