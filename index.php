<?php
ob_start();
session_start();

// Set the directory of the index.php as the BASEDIR
define('BASEDIR', realpath(__DIR__));

// Require the config file
require_once BASEDIR . '/inc/config.php';

// Require the autoloader
require_once BASEDIR . '/autoloader.php';

// Make a new object from the ApplicationController class
new ApplicationController();
