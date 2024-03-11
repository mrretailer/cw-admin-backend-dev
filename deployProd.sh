echo "This will stop and remove admin container, then remove wallet image and create and run new image"

echo "Stoping docker for admin...."
docker stop  admin-service

echo "Removing docker for admin...."
docker rm  admin-service

echo "Removing docker image for admin...."
docker image rm  admin-services-image:latest


echo "Building docker image for admin...."
docker build -t admin-services-image:latest .


echo "Running docker image for admin...."
docker run -d --name admin-service --restart=always -p 3001:3001 -e NODE_ENV=production admin-services-image:latest

# docker run -d --name cluster-service -v --restart=always -p 2700:2700 -e NODE_ENV=production cluster-services-image:latest