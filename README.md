# densities.js

This command line utility will generate images for the various Android device screen densities. It is meant to do batch processing, but allows for per-file configuration options.  It works with any format supported by [ImageMagick](http://www.imagemagick.org/script/formats.php), and will generate for the following screen densities: mdpi, hdpi, xhdpi, xxhdpi and xxxhdpi.

# Quick Usage

    ./densities.js [source directory] [output directory]

**Example:**

    ./densities.js ./images ./res/


# What densities.js does

* Converts SVG images to PNG format. *Why?* Because of SVG’s spotty performance on the Android platform.  I plan to add a config value that overrides this conversion factor in the future... but if you’re determined to use SVG files, just drop them into your /res/drawables/ directory and pray that everything works.
* Scales images according to aspect-ratio.
* It runs via the command line (if you haven't gathered that by now).

# What densities.js does *not* do

* It does not trim/crop your images. You’re in charge of making sure that your image sizes are in order.
* It isn't some magic tool that upscales low-resolution images well. It's best to start off with images that are big enough to fit xxhdpi, and let the script size-down for each version.
* This is a synchronous app, and is therefore thread-blocking. I wouldn’t run this as a web app.
* It will not work with 9-patch images. This has to do with preserving a 1px border around the images in order to draw the patch lines. I want to add this in the future, however. It will just take some work.

# Requirements

**1. [node.js](http://nodejs.org/)**

This script requires node.js.

**2. [ImageMagick](http://www.imagemagick.org/)**

In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:

    brew install imagemagick

# Installation
Run the following command in the same directory as this readme file:

    npm install

# Config File (_config.js)

There is a file called *_config.example.js* that you can use as a template.  Here is the general format:

**Config file format**

    exports.sourceDir =  ".",
    exports.outputDir = "./res",

    exports.files = [
        {
            file: "image1.png",
            options: {
                dimensions: [400, 100],
                sourceDensity: "xhdpi",
                quality: 90
            }
        },
        {
            file: "image2.png",
            options: {
                dimensions: [100, 100],                
            }
        },
        ...    
    ]

- `sourceDir` — Source directory, can be overriden by command line switch. Default value current directory.
- `outputDir` — Output directory, can be overriden by command line switch. Default value is `./res`.
- `files` — A list of all image files to process
    - `dimensions` — *SVG only* an array, as [width, height]. **This is the intended dimension at mdpi (1x size ratio)**. If unspecified, defaults to the actual image‘s size
    - `sourceDensity` — The density of the source image. If specified, treats the size of the source image as a specific density. E.g. you may have a high-res 1920x1080 image, but you want the mdpi output size to be 640x360... you can put in a source density of "xxhdpi" and it will scale the images accordingly.
    - `quality`: Values range from 0 to 100. This includes PNGs.

**Example files listing**:

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