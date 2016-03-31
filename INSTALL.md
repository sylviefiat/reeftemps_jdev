# Installation de l'environnement Docker sur Windows

## Installer [Babun](http://babun.github.io)
- coper et dézipper en local le zip I:\Infrastructures\BASD\Applications\docker\babun-1.2.0-dist.zip (téléchargée [ici](http://projects.reficio.org/babun/download))
- lancer l'installation

## Configurer Babun
- Editer le fichier de configuration Babun ```vim ~/.babunrc```
- Ajouter les variables d'environnement de proxy ```export http_proxy=http://proxy.recif.nc:80
export https_proxy=$http_proxy
export ftp_proxy=$http_proxy
export no_proxy=localhost```
- Modifier les user agent
```export USER_AGENT="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36"```
- Charger la configuration ```source ~/.babunrc```
- Vérifier l'installation ```babun check```
- Mettre à jour Babun ```babun update```
  
## Installer [Docker Toolbox](https://www.docker.com/products/docker-toolbox)
- Lancer l'utilitaire d'installation I:\Infrastructures\BASD\Applications\docker\DockerToolbox-1.10.3.exe (téléchargée [ici](https://github.com/docker/toolbox/releases/download/v1.10.3/DockerToolbox-1.10.3.exe))
- Activer au besoin l'installation de virtualbox (doit être en version 5)
  
## Créer un Docker Host avec docker machine
- Lancer la commande : 
    ```docker-machine create -d virtualbox --engine-env HTTP_PROXY=http://proxy.recif.nc:80 --engine-env HTTPS_PROXY=http://proxy.recif.nc:80 dockerbirthday```
- Afficher les docker hosts 
    ```docker-machine ls```
- Afficher les variables d'environnement à positionner pour communiquer avec le default host
    ```docker-machine env (default)```
- Positionner les variables d'environnement pour communiquer avec l'engine de default host
    ```eval $(docker-machine env)```
- Ajouter la variable NO_PROXY pour exclure l'IP du docker host
    ```export NO_PROXY=$(echo $DOCKER_HOST | sed 's/tcp:\/\/\([^:]*\).*/\1/')```
