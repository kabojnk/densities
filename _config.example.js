exports.sourceDir = "./images";
exports.outputDir = "./res";
exports.defaultQuality = 90;

exports.files = [
	{ 
		file: "ic_launcher.png",
		options: {
			dimensions: [48, 48]
		}
	},
	{ 
		file: "bg_image.jpg", 
		options: {
			sourceDensity: "xxhdpi",
		}
	},
	{ 
		file: "some_svg_file.svg",
		options: {
			dimensions: [400, 231]
		}
	}
];