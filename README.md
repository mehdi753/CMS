Run the following commands to deploy the content manager on docker in swarm mode (watch mode)
 - docker swarm init (if node is not already part of swarm)
 - mv docker-compose
 - docker stack deploy --compose-file docker-compose.yml cm
After the stack has been deployed, access the cm_app terminal and run the following command
 - node dist/src/cli.js migrate
Finally, login to the application using the following credentials
 - email: admin@hcm.com
 - password: admin123456