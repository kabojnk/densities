# THIS UTILITY IS DEPRECATED.  I wrote this _years_ ago, back when Sketch was still a new thing, and Adobe batch export processes were not something that designers typically cared to do in small-scale shops.  Now there are tools like Zeplin that are way better. If your company isn't using Zeplin in its pipeline, you're doing things wrong.

# densities.js

This command line utility will generate images for the various Android device screen densities. It is meant to do batch processing, but allows for per-file configuration options.  It works with any format supported by [ImageMagick](http://www.imagemagick.org/script/formats.php), and will generate for the following screen densities: mdpi, hdpi, xhdpi, xxhdpi and xxxhdpi.

densities.js addresses a problem unique to Android development, due to the overwhleming variety of Android devices out there boasting different screen sizes and pixel densities.  For more information, check out the Android article (Supporting multiple screens)[http://developer.android.com/guide/practices/screens_support.html].

# Quick Usage

    ./job_builder.js [source directory] [output directory] [output job file]
    ./densities.js [job file]

**Example:**

    ./job_builder.js ./images ./res job1.json
    ./densities.js job1.json


# Requirements

- [node.js](http://nodejs.org/)
- [ImageMagick](http://www.imagemagick.org/)

In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do: `brew install imagemagick`

# Installation
Run the following command in the same directory as this readme file:

    npm install

# Using the utility
densities.js is usually a two-step process:

1. Use `job_builder.js` to generate a job file (by scanning a directory for images and creates a manifest JSON file).  Ideally, the job file would be edited afterwards to make any necessary tweaks to filesize options.
2. Use `densities.js` to run the job file and perform the batch operation.

# Job file structure

The job file **must** be in JSON format, and it must follow this structure:

    "sourceDir" =  ".",
    "outputDir" = "./res",
    "files": [
        {
            "file": "image1.png",
            "options": {
                dimensions: [400, 100],
                "quality": 90
            }
        },
        {
            "file": "image2.png",
            "options": {
                "dimensions": [100, 100],                
            }
        },
        ...    
    ]

- `sourceDir` — Source directory, can be overriden by command line switch. Default value current directory.
- `outputDir` — Output directory, can be overriden by command line switch. Default value is `./res`.
- `files` — A list of all image files to process
    - `dimensions` — *SVG only* an array, as [width, height]. **This is the intended dimension at mdpi (1x size ratio)**. If unspecified, defaults to the actual image‘s size
    - `sourceDensity` — The density of the source image. This is a great way to avoid having specify `dimensions` and having everything automatically resize.  By default, it is assumed that the source density is `mdpi` (a scale of 1x), so by specifying a value like `xxhdpi` will assume the image is already at 3x scale, making the operation work flawlessly.
    - `quality`: Values range from 0 to 100. This value does impact PNG files.

`job_builder.js` will autogenerate a job file for you, but if you're creating one manually, I recommend using `jobfile.json.sample` as a boilerplate.

# What densities.js does

* Converts SVG images to PNG format. *Why?* Because of SVG’s spotty performance on the Android platform.  I plan to add a config value that overrides this conversion factor in the future... but if you’re determined to use SVG files, just drop them into your /res/drawables/ directory and pray that everything works.
* Scales images according to aspect-ratio.
* It runs via the command line (if you haven't gathered that by now).

# What densities.js does *not* do

* It does not trim/crop your images. You’re in charge of making sure that your image sizes are in order.
* It isn't some magic tool that upscales low-resolution images well. It's best to start off with images that are big enough to fit xxhdpi, and let the script size-down for each version.
* This is a synchronous app, and is therefore thread-blocking. I wouldn’t run this as a web app.
* It will not work with 9-patch images. This has to do with preserving a 1px border around the images in order to draw the patch lines. I want to add this in the future, however. It will just take some work.
