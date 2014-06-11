// These are the baseline pixel dimensions for the different types of 
// Android icons.
exports.baselineDimensions = {
	icons: {
		launcher: { width: 48, height: 48 },
		actionBar: { width: 32, height: 32 },
		contextual: { width: 16, height: 16 },
		notifications: { width: 24, height: 24 },
	},
};

// These are the various scales used for Android screen densities, with the
// text identifiers.  The labels for each density below is reflected in the
// directory name. E.g. images scaled at "hdpi" will end up in /res/drawable-hdpi/
exports.densities = { 
	mdpi: 1,
	hdpi: 1.5,
	xhdpi: 2,
	xxhdpi: 3,
	xxxhdpi: 4,
};