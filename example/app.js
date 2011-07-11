var window = Ti.UI.createWindow({ backgroundColor: 'white' });
var table = Ti.UI.createTableView();
window.add(table);
window.open();

function log() {
	var args = Array.prototype.slice.call(arguments);
	var row = Ti.UI.createTableViewRow({ className: 'log', height: 60 });
	var msg = args.join(' ');
	row.add(Ti.UI.createLabel({ height: 60, text: msg, minimumFontSize: 12, font: { fontSize: 14 } }));
	row.addEventListener('click', function() { alert(msg) });
	table.appendRow(row);
}

function assert(cond, message) {
	if (!cond)
		throw new Error('Assertion failed' + (message ? ': ' + message : ''));
}

function test(name, func) {
	var ok = false;
	try {
		func();
		ok = true;
	} catch (e) {
		log(name + ' FAILED:\n' + e)
	}
	if (ok) 
		log(name + ' OK');
}

var imaging = require('com.spiir.imaging');
log("module is " + imaging);

test('compression quality', function() {
	var original = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'large.jpg');
	assert(original.exists(), 'original exists');
	var originalSize = original.size;
	var originalBlob = original.read();

	var image = imaging.createImageFromBlob(originalBlob);
	image.compressionQuality = 0.1;

	var modified = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'compressionQuality.jpg');
	modified.write(image);

	var modifiedSize = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'output.jpg').size;
	log("Original size: " +  originalSize + "\nModified size: " + modifiedSize + "\nDir: " + Titanium.Filesystem.applicationDataDirectory);
	assert(modifiedSize < originalSize / 2, 'modified smaller than original');	
});

test('scale image', function() {
	var original = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'large.jpg');
	assert(original.exists(), 'original exists');
	var originalBlob = original.read();

	//assert(original.width > 600, 'original width > 600');

	var image = imaging.createImageFromBlob(originalBlob);
	var scaledImage = image.scaleImage(800, 400);
	
	log("Scaled size: " + scaledImage.width + "x" + scaledImage.height);
	
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'compressionQuality.jpg');
	file.write(scaledImage);
	
	assert(scaledImage.width <= 800, 'image width < 800');
	assert(scaledImage.height <= 400, 'image height < 400');
	assert(scaledImage.width > 0, 'image width > 0');
	assert(scaledImage.height > 0, 'image height > 0');
});