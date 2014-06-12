#!/usr/bin/env node
"use strict";

// ============================================================================
// Starting up...
// ============================================================================

var path = require("path");
var exec = require('child_process').exec;
var fs = require('fs');
var im = require('imagemagick-native');
var mime = require('mime');
var mmm = require('mmmagic');
var Magic = mmm.Magic;
var sourceDir = __dirname;
var outputDir = path.join(__dirname, "res");
var config = require("./_config.js");
var values = require("./_values.js");

var mode = "job";

var USAGE = [
	"",
	"**************************************",
	"densities.js",
	"**************************************",
	"",
	"USAGE:",
	"1) Generate a job file to run:",
	"",
	"\t./job_builder.js <SOURE IMAGES DIRECTORY> <IMAGES OUTPUT DIRECTORY> <OUTPUT JOB FILE>",
	"",
	"2) Make any tweaks to job file prior to running the job.",
	"",
	"3) Then run the job file:",
	"\t./densities.js <JOB FILE>",
	"",
	// "X) Feeling reckless? Want to use it on-the-fly? Do this:",
	// "\t./densities.js <SOURCE DIRECTORY> <OUTPUT DIRECTORY>",
	//"",
	"All output files will go into a <output dir>/<density>/filename.jpg pattern.",
	"E.g.:",
	"/res/drawable-mdpi/filename.png",
	"/res/drawable-hdpi/filename.png",
	"/res/drawable-xhdpi/filename.png",
	"/res/drawable-xxhdpi/filename.png",
	"/res/drawable-xxxhdpi/filename.png",
	""
].join("\n");

console.log(USAGE);
return;

// Setup source and output directories
setupDirectories();





// ============================================================================
// Running the application...
// ============================================================================

if (!(typeof config.files === "undefined") && config.files.length > 0) {
	config.files.forEach(function(item) {		
		processImage2(item, path.join(sourceDir, item.file));	
	});	
} else {
	var message = [
		"",
		"",
		"************************************************************",
		"No files to process!",
		"Please check _config.js and make sure you have files listed!",
		"************************************************************",
		"",
		"",
	].join("\n");
	console.log(message)
	return;
}






// ============================================================================
// Utility/Functions...
// ============================================================================

/**
 * Processes an actual image file.
 */
function processImage(item, filepath) {
	var image = fs.readFileSync(filepath);
	var identify = im.identify({srcData: image, ignoreWarnings: 1});
	var width = identify.width;
	var height = identify.height;
	var quality = 90;

	// Work with any options being set...
	if (fileHasOptions(item)) {
		// If we have specified output dimensions
		if (optionExists("dimensions", item.options)) {
			width = item.options.dimensions[0];
			height = item.options.dimensions[1];
		}
		// If the intended density of the source image has been set
		if (optionExists("sourceDensity", item.options)) {
			for (var density in values.densities) {
				if (density == item.options.sourceDensity.toLowerCase()) {
					width /= values.densities[density];
					height /= values.densities[density];
				}
			}
		}
		// By default the quality is 90, unless specified in the config file
		if (optionExists("quality", item.options)) {
			quality = item.options.quality;
		}
	}

	// Do a little sanitization to the filenames. Also, if the original file
	// is in SVG format, change the file extension to PNG (since we convert)
	// all SVGs to PNG.
	var newFormat = identify.format;	
	var outputFilename = item.file.replace(/([\-]|\s+)/, "_");
	if (newFormat == "SVG" || newFormat == "MVG") {
		newFormat = "PNG24";
		outputFilename = outputFilename.replace(path.extname(outputFilename), ".png");
	}

	// Loop through the densities and output the appropriate files...
	for (var density in values.densities) {
		console.log("Generating ", density, "...");
		var newDims = scaleDimensions([width, height], values.densities[density]);
		console.log("Dimensions: ", newDims);
		var convertData = {
			srcData: image,
			width: newDims[0],
			height: newDims[1],
			quality: quality,
			format: newFormat,
			ignoreWarnings: 1
		};
		var resizedImage = im.convert(convertData);
		var outputFile = path.join(outputDir, density, outputFilename);
		console.log("Writing ", outputFile, "...");
		fs.writeFileSync(outputFile, resizedImage, 'binary');		
	}
}

/**
 * Checks for source/destination directories and creates the output directories if necessary.
 */
function setupDirectories() {
	if (process.argv.length > 2) {
		var tmpSourcDir = process.argv[2];
		if (fs.existsSync(tmpSourcDir)) {
			sourceDir = tmpSourcDir;
		} else {
			if (!fs.existsSync(sourceDir)) {
				sourceDir = __dirname;
			}
			console.log("ERROR! Specified source directory does not exist! Defaulting to " + __dirname);
		}
	}
	if (process.argv.length > 3) {
		var outputDir = process.argv[3];	
	}	
	if (!outputDirectoriesExist(outputDir)) {		
		var mkdirp = require('mkdirp');
		console.log("Creating output directory structure in: " + outputDir);
		mkdirp.sync(outputDir);
		for (var density in values.densities) {
			fs.mkdirSync(path.join(outputDir, "drawable-"+density), "0777");
		}		
	}
}

/**
 * Scales dimensions and returns matrix [width, height] of the new sizes.
 */
function scaleDimensions(dims, scale) {
	var newDims = dims;
	newDims[0] = parseInt(dims[0] * scale);
	newDims[1] = parseInt(dims[1] * scale);
	return newDims;
}

/**
 * Returns whether or not all output directories have been created or not
 */
function outputDirectoriesExist(outputDir) {
	if (!fs.existsSync(outputDir)) {
		return false;
	}
	for (var density in values.densities) {
		if (!fs.existsSync(path.join(outputDir, "drawable-"+density))) {
			return false;
		}
	}
	return true;
}

/**
 * Returns whether the file has any options set.
 */
function fileHasOptions(file) {
	if (typeof file !== "undefined") {
		return file.hasOwnProperty("options");
	}
	return false;
}

/**
 * Checks if a particular option exists within a file's array of options.
 */
function optionExists(property, options) {
	if (typeof options !== "undefined" && options.hasOwnProperty(property)) {
		return true;
	}
	return false;
}

/**
 * Returns whether or not the file should be "trimmed" prior to processing.
 */
function optionsHaveTrim(options) {
	if (typeof options !== "undefined") {
		return options.hasOwnProperty("trim");
	}
}