# Tor hidden services for beginners on MacOSX

Here I describe how to setup a Tor hidden service on MacOSX in a beginner-friendly way.

The basic steps are:

* Install Tor
* Setup a local server
* Hide stuff about your server
* Enable the hidden services

If you feel comfortable about the first 3 of the above steps, this post might not be for you. I recommend trying Tor's Guide: [Configuring Tor Hidden Service](https://www.torproject.org/docs/tor-hidden-service.html.en). To read more about how Hidden Services work, I recommend the [Tor Project site](https://www.torproject.org).

### Install Tor

We will install the Tor Project in two different ways. The first is **from source** because it is easier to run the hidden service from this instance of Tor and second is the **Tor Browser**, which I find useful and easy for browsing.

[Install Homebrew](http://brew.sh/) by copying and running the first command. It's an installation helper that makes life on a mac easier.

With homebrew installed, run:

```
brew install tor
```

You should see something like:
```
You will find a sample `torrc` file in /usr/local/etc/tor.
It is advisable to edit the sample `torrc` to suit
your own security needs:
  https://www.torproject.org/docs/faq#torrc
After editing the `torrc` you need to restart tor.
```

As it says, we now have a torrc sample file. You want to take the torrc.sample and make it your own torrc file.

First navigate to your torrc file using the path that they gave you:

```
cd /usr/local/etc/tor
```

Rename the torrc.sample to torrc so that it starts working as our torrc file (note you can also make a copy here):
```
mv torrc.sample torrc
```

Now you have a torrc file! This is your Tor configuration file. That means that everytime you edit the file, you have to restart tor in order for any changes to take effect.

Start tor to see if everything is working:

```
tor
```

It might take a while to establish your first connection, but after the first time it goes faster.

Now that you have tor running from source, [install the Tor Browser](https://www.torproject.org/projects/torbrowser.html.en). It is basically Firefox with Tor. It is more user-friendly and we will use it later to visit our hidden service. Simply download and follow the installation instructions.

### Setup a local server

We are going to use nginx because it's simple and lightweight. Warning! This part might get frustrating, but if you stick through it, you are 90% of the way there.

First, install nginx with homebrew:

```
brew install nginx
```

You should see some helpful text that shows where your configuration file (**nginx.conf**) is:

```
The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.
```

Just for fun, run nginx to see it work already:

```
nginx
```

Go to localhost:8080 in any browser to see it running.

In order to have something to share using our hidden service, we need an index.html in any directory or you can use existing project. If you don't have an existing project, create a new folder and write a simple index.html:

```
mkdir [name]
cd [name]
touch index.html
```

Open your index.html and insert some content. Here is a standard HTML header:

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
  Insert your content here
</body>
</html>
```

Get the location of the index.html file you just created (or the existing project you will use):

```
pwd
```

If you aren't familiar with 'pwd', this command returns the filepath of the directory you are currently in. It is helpful for copying filepaths into configuration files because typos are inevitable and are harder to find.

Find and open your **nginx.conf** file. Remember that brew told us where it is:
```
/usr/local/etc/nginx/nginx.conf
```

In nginx.conf, find the server section:

```
http {
  # blah blah blah
  ...

  server {
    listen       8080;
    server_name  localhost;
    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        root   [your filepath will go here];
        index  index.html index.htm;
    }

    # blah blah blah
    ...
  }
}
```

Where it says 'root', add your own directory path that you copied earlier using the 'pwd' command.

Should look like:

```
server {
    listen       8080;
    server_name  localhost;
    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        root   [your filepath here];
        index  index.html index.htm;
    }
```

Save the nginx.conf file and restart nginx:

```
nginx -s reload
```

Visit localhost:8080 in the browser and voila! You should see your index.html.

If you have problems, here are the sources I used for this section:
* [Installing Nginx in Mac OS X Mountain Lion With Homebrew](http://learnaholic.me/2012/10/10/installing-nginx-in-mac-os-x-mountain-lion/)
* [Beginner's guide to installing Nginx](http://nginx.org/en/docs/beginners_guide.html)

### Configure the local server to hide information about you

Even though the hidden service allows us to hide our IP address, we don't want to reveal any information about the server that we are using. For example, it's easier to trace a server to a person if the server also shows which version it is using. This information is usually found in the server header.

##### What is a server header?
Go to localhost:8080 where our nginx server is running. Open up the developer tools (usualy ctrl shift i) and open the Network tab. Refresh the browser and click on the response. Under 'Headers' you can open the 'Response headers' section. Look for 'Server'. Next to that you should see "nginx/1.1" or something similar. In this case, 1.1 is the nginx version and reveals information about who you are.

To change that, go back to your nginx.conf file and add the following line in the server section:

```
server_tokens off;
```

It should look like:

```
server {
    listen       8080;
    server_name  localhost;
    server_tokens off;
    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        root   [your filepath here];
        index  index.html index.htm;
    }
```

Save and restart nginx:
```
nginx -s reload
```

Visit the browser and follow the same instructions above to look at your server response header. Now it should simply say "nginx" and not "nginx/1.1". There are more things we can hide but this is a great start.

If you have trouble, here is the source I used for this section:
* [Remove Version from Server Header Banner in nginx](http://geekflare.com/remove-server-header-banner-nginx/)

### Enable the hidden service

Now the fun part.

First create a directory where the information about our hidden service will live. The directory will contain a hostname and our private key (these are created by Tor). After installing the brew package, I used this directory name (substituting your own username for 'username'):

```
/Users/username/tor/hidden_service
```

Open and find the **torrc** file that you created before. As a reminder, it's probably located in:

```
/usr/local/etc/tor
```

The **torrc** file is your tor configuration file. Remember! Everytime we edit it we have to restart tor in order for the changes to take effect.

In the **torrc**, look for the section about hidden services:

```
############### This section is just for location-hidden services ###
```

This section contains all of the configurations for the hidden services. To enable your hidden service, add the following below that line (change directory accordingly):

```
HiddenServiceDir /Users/username/tor/hidden_service  [use your own filepath here]
HiddenServicePort 80 127.0.0.1:8080
```

Note: 127.0.0.1 refers to your localhost and the port is telling Tor the location of the local server we want to point to.

Stop and restart tor. Stop with ctrl-C and restart with:

```
tor
```

If tor starts with no problems, yuhu! If not, try to read the error message and follow the instructions in the error message. Double-check the directory filepath, port name, check that all your changes are saved, and that things are in the correct place in the torrc file.

When you get tor working, go to the directory where you specified the hidden_service information.

In the hidden service directory, show the hostname:

```
cat hostname
```

This should show you an .onion URL. Enter it into the Tor Browser. If you are new to Tor and .onion URLs, read more about [how Tor works](https://www.torproject.org).

You should see your own index.html appear in the Tor Browser. If so, congrats! You've officially just set up your own hidden service. If you have trouble getting things working at this point feel free to chat me at [@laurawadden](http://www.twitter.com).

More information on this section and more advanced tips:
* [Configuring Tor Hidden Service](https://www.torproject.org/docs/tor-hidden-service.html.en)
