# S-Cart — Demo shopping cart web app written in AngularJS.

On a mac to load: (Other OS will have different setup)
1. Clone this repository to your machine.
2. Add the following to your apache vhosts file (Please note the document root pointing to the "app" subfolder.)
note: "/mnt/httpd2/htdocs/" would be replaced with your web server htdocs path. 

example:

```
<VirtualHost *:80>
        ServerAdmin webmaster@scart.local
        ServerName scart.local
        DocumentRoot "/mnt/httpd2/htdocs/s-cart/app" 

        <Directory /mnt/httpd2/htdocs/s-cart/app>
        AllowOverride All
        Options +Indexes
        </Directory>
</VirtualHost>
```

3. Add the following line to your hosts.etc file. 
```
scart.local   127.0.0.1
```

4. Restart Apache.


Tested in Chrome, FF and Safari. 
Unit tests can be run by running scripts/test.sh in terminal from the project root folder. Node & Karma required.