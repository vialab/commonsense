# commonsense
Common Sense web interface, created and maintained by Chris Kim (chris.kim@uoit.ca)

## License
Under further notice, this work is currently under exclusive copyright of UOIT and Vialab. You may download, copy, and modify for personal use, but cannot distribute original or derivative work without permission. UOIT is currently in the process of choosing a license, and this section will be updated upon reaching internal agreement.

## Live Example
The most up-to-date version of the interface is available at http://commonsense.ckprototype.com/.

## Server Requirement(s)
 - Ubuntu (16.04 LTS)
 - Apache
 - PHP 7
- MySQL 

We recommend using **tasksel** (refer to this [Linode tutorial](https://www.linode.com/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04/)) to install all of the above. If you are looking to set this up on Windows or macOS, you may use [WAMP](http://www.wampserver.com/en/) or [MAMP](https://www.mamp.info/en/) installers.

## Client Requirement(s)
 - HTML5-complaint browser (Google Chrome)

## Server Configuration Notes
### PHP (php.ini)
- Short tags must be enabled (https://stackoverflow.com/questions/2185320/how-to-enable-php-short-tags)
- If you plan to upload large files, upload limit must be disabled (https://stackoverflow.com/questions/2184513/change-the-maximum-upload-file-size)
### Directory
- `/cache` and `/assets` folder must be writable by PHP

If there are any other issues, you should be able to self-diagnose by investigating the Apache error logs.

## Instructions

 1. Load the Apache server (ex. `/var/www`) with the latest copy of the interface
 2. Upload the provided table schema and accompanying sample data to MySQL database
 3. Launch the browser and access the root directory

## Sample Data

The interface contains the following starter layout data:

 - **DEMOPLAIN** (Demo - Plain Graph)
 - **DEMOTEXT** (Demo - Text Processing)
 - **DEMOMGVIDEO** (Demo - MovieGraph + Video)
 - **DEMOVIDEO** (Demo - Video)

The latter two layouts also feature a sample MP4 video.

## Contact Information
Found any bugs? Please report any issues via Github's **Issues** feature. For private inquiry, please reach out to chris.kim@uoit.ca or chris.kim@sri.com (exclusive to SRI personnel).