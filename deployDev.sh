echo "This will stop and remove backend container, then remove backend image and create and run new image"

echo "Stoping docker for backend...."
docker stop  backend-service

echo "Removing docker for backend...."
docker rm  backend-service

echo "Removing docker image for backend...."
docker image rm  backend-services-image:latest


echo "Building docker image for backend...."
docker build -t backend-services-image:latest .


echo "Running docker image for backend...."
docker run -d --name backend-service --restart=always -p 8000:8000 -e NODE_ENV=development -v /home/upload:/home/upload backend-services-image:latest