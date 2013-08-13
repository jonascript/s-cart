# S-Cart — Demo shopping cart web app written in AngularJS.

To load, clone this repository to your computer ad the following to your apache vhosts file and restart apache. Please note the document root pointing to the "app" subfolder.

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

Tested in Chrome, FF and Safari. 
Unit tests can be run by running scripts/test.sh in terminal. Node & Karma need to be installed.