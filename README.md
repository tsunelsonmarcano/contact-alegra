## Intro

Se implementa la api de alegra para gestionar contactos, usando Zend Framework 1.12 y Extjs 4.2.


### Obteniendo las credenciales de alegra para utilizar la api

* [Página oficial de alegra](https://www.alegra.com/) Crear una cuenta en alegra
* [Página para visualizar las credenciales ](https://app.alegra.com/configuration/api) Verás el correo y el token

### Consultar la documentación de la api

* [Api de alegra](https://developer.alegra.com/docs/) 

### Corre el proyecto

Para correr el proyecto, tienes que crear un vhost, por ejemplo:
```
<VirtualHost *:80>
   DocumentRoot "D:/apps/quickstart/public"
   ServerName .local

   # This should be omitted in the production environment
   SetEnv APPLICATION_ENV development

   <Directory "D:/apps/quickstart/public">
       Options Indexes MultiViews FollowSymLinks
       AllowOverride All
       Order allow,deny
       Allow from all
   </Directory>

</VirtualHost>
```

Y configurar las crendenciales de alegra, reempla el archivo de ```application/configs/application.ini.example``` por ```application/configs/application.ini``` y coloca el siguiente contenido en el archivo de configuración:
```
alegra.uri = "URL de la api de contactos de alegra"
alegra.username = "example@example.com"
alegra.token = "token"
```