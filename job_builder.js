#!/usr/bin/env node
"use strict";

/**
 * This file will search a directory for images and auto-populate a config file
 * for use with the densities.js script.  While this does the bulk of the work, 
 * it would still be a good idea to tweak the config file and confirm that 
 * everything is in working order.
 */

var path      = require("path");
var fs        = require('fs');
var mime      = require('mime');
var sourceDir = __dirname;
var outputDir = path.join(__dirname, "res");
var jobFile   = "job.json";

if (process.argv.length <= 2) {
	var USAGE = [
		"",
		"**************************************",
		"job_builder.js",
		"**************************************",
		"",
		"USAGE:",
		"\tUsage: ./job_builder.js <SEARCH_DIRECTORY> <OUTPUT_DIRECTORY> <OUTPUT_JOB_FILE>",
		"\tExample: ./job_builder.js ../images ../res job2.json",
		""
	].join("\n");
}

if (process.argv.length > 2) {
	sourceDir = process.argv[2];
}
if (process.argv.length > 3) {
	outputDir = process.argv[3];
}
if (process.argv.length > 4) {
	jobFile = process.argv[4];
}

var images = searchForImages();
if (images.length > 0) {
	writeJobFile();
}
console.log("FINISHED!");


/**
 * Does the actual search.  This does NOT recurse into directories.  Since Android's drawables filesystem
 * is flat, it’s best to keep your source directory flat as well, to prevent any overwriting of existing 
 * files with duplicate filenames.
 */
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
				filteredFiles.push({"file": file });
				break;
			default:
				break;
		}
	});
	console.log("Found", filteredFiles.length, "images out of", files.length, "files.");
	return filteredFiles;
}

/**
 * Saves the job file in JSON format.
 */
function writeJobFile() {
	var job = {
		sourceDir: sourceDir,
		outputDir: outputDir,
		files: images
	};

	// If someone's trying to be cute and write to a directory instead of a filename,
	// we'll save it as "_temp_config.js"
	if (fs.existsSync(jobFile)) {
		var stats = fs.statSync(jobFile);
		if (stats.isDirectory()) {
			jobFile = path.join(jobFile, "_temp_config.js");
		}	
	}

	// If someone's trying to be cute and output to a directory that doesn't exist,
	// we'll show them who's boss.
	var jobFileDir = path.dirname(jobFile);
	if (!fs.existsSync(jobFileDir)) {
		var mkdirp = require('mkdirp');		
		mkdirp.sync(jobFileDir);	
	}

	fs.writeFile(jobFile, JSON.stringify(job, null, 2));
	console.log("Config file written at: ", jobFile);
}