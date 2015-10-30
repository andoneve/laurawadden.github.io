# Tor hidden services for beginners on MacOSX

## Setup

* Install Tor
* Setup a local server
* Hide stuff about your server
* Enable the hidden services

### Install Tor

There are a few different ways to install Tor and we will do two of them. First we will install Tor from source and second we will install the Tor Browser.

[Install homebrew](http://brew.sh/) by copying and running the first command. Homebrew is an installation helper that makes life on a mac much easier.

Now that you have homebrew installed, run

```
brew install tor
```

You should see something like this:
```
You will find a sample `torrc` file in /usr/local/etc/tor.
It is advisable to edit the sample `torrc` to suit
your own security needs:
  https://www.torproject.org/docs/faq#torrc
After editing the `torrc` you need to restart tor.
```

You'll want to take the torrc.sample and make it your own torrc file.
First navigate to your torrc file using the path that they gave you:

```
cd /usr/local/etc/tor
```

Rename the torrc.sample to torrc so that it starts working as our torrc file:
```
mv torrc.sample torrc
```

Now you have a torrc file! This is your Tor configuration file. That means that everytime you edit the file, you have to restart tor in order for it to take effect.

Start tor to see if everything is working:

```
tor
```

It might take a while to establish your first connection, but after the first time it goes faster.

Now that you have tor running from source, [install the Tor Browser](https://www.torproject.org/projects/torbrowser.html.en). It is basically Firefox with Tor. It is more user-friendly and we will use it later to visit our hidden service. Simply download and follow the installation instructions.

### Setup a local server

We are going to use nginx because it's simple and has some properties that Apache doesn't that makes it easier to hide the server version. This part might get frustrating, but if you stick through it, you are 90% of the way there.

First, install nginx using homebrew:

```
brew install nginx
```

You should see some helpful text that shows where your configuration file (nginx.conf) is:

```
The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.
```

Just for fun, run nginx to see it work already:

```
nginx
```

Go to localhost:8080 in any browser to see it running.

In order to have something to share using our hidden service, we need an index.html in any directory or existing project. If you don't have an existing project, create a new folder and write a simple index.html:

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

Get the location of your index.html file to point nginx to the right place:

```
pwd
```

If you aren't familiar with 'pwd', this command returns the filepath of the directory you are currently in.

Find and open your nginx.conf file. Remember that brew told us where it is:
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

Visit the browser and follow the same instructions above to look at your server response header. Now it should simply say "nginx" and not "nginx/1.1".

Source post for this section:
* [Remove Version from Server Header Banner in nginx](http://geekflare.com/remove-server-header-banner-nginx/)

### Enable the hidden service

Now the fun part.

First create a directory where the information about our hidden service will live. The directory will contain a hostname and our private key (these are created by Tor). After installing the brew package, I used this directory name (substituting your own username for 'username'):

```
/Users/username/tor/hidden_service
```

Open and find the torrc file that you created before. As a reminder, it's probably located in:

```
/usr/local/etc/tor
```

The torrc file is your tor configuration file. Remember! Everytime we edit it we have to restart tor in order for the changes to take effect.

Look for the section about hidden services:

```
############### This section is just for location-hidden services ###
```

This section has all of the configuration stuff for the hidden services. To enable your hidden service, add the following below that line (change directory accordingly):

```
HiddenServiceDir /Users/username/tor/hidden_service
HiddenServicePort 80 127.0.0.1:8080
```

127.0.0.1 refers to your localhost.

Stop and restart tor. Stop with ctrl-C and restart with:

```
tor
```

If tor starts with no problems, go to the directory where you specified the hidden_service information. In the directory, show the hostname:

```
cat hostname
```

This should show you an .onion URL. Enter it into the Tor Browser. If you are new to Tor and .onion URLs, read more about [how Tor works](https://www.torproject.org).

You should see your own index.html appear in the Tor Browser. If so, congrats! You've officially just set up your own hidden service. If you have trouble getting things working feel free to chat me at [@laurawadden](http://www.twitter.com).

More information on this section and more advanced tips:
* [Configuring Tor Hidden Service](https://www.torproject.org/docs/tor-hidden-service.html.en)
