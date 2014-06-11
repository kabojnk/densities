#!/usr/bin/env node
"use strict";

/**
 * This file will search a directory for images and auto-populate a config file
 * for use with the densities.js script.  While this does the bulk of the work, 
 * it would still be a good idea to tweak the config file and confirm that 
 * everything is in working order.
 */

var path = require("path");
var exec = require('child_process').exec;
var fs = require('fs');
var mime = require('mime');
var sourceDir = __dirname;
var outFile = "temp_config.js";

var USAGE = [
	"find_images.js",
	"   Usage: ./find_images.js SEARCH_DIRECTORY OUTFILE",
	""
].join("\n");

if (process.argv.length < 4) {
	console.log(USAGE);
	return;
} else {
	sourceDir = process.argv[2];
	outFile = process.argv[3];
}

var images = searchForImages();

function searchForImages() {	
	console.log("Searching for images in:", path.resolve(sourceDir) + "...");	

	if (!fs.existsSync(sourceDir)) {
		console.log(sourceDir, "does not exist!\nStopping.");
		return;
	}

	var stats = fs.statSync(sourceDir);	
	if (!stats.isDirectory()) {
		console.log(sourceDir, "is not a directory!\nStopping.");
		return;
	}	

	var files = fs.readdirSync(sourceDir);
	var filteredFiles = [];
	if (!files.length) {
		console.log("No files found.");
		return;
	}
	files.forEach(function(file, index){
		console.log("Processing file #" + index + " ("+file+")...");

		// Ignore all dot-files
		if (file[0] === ".") {
			return;
		}

		// Detect MIME type
		var mimeType = mime.lookup(file);		

		switch (mimeType) {
			case 'image/jpeg':
			case 'image/svg+xml':
			case 'image/png':
				filteredFiles.push(file);
				break;
			default:
				console.log("NOT AN IMAGE. Ignoring...")
				break;
		}
	});
	console.log("Image files found:", filteredFiles);
}

function writeConfigFile() {

}