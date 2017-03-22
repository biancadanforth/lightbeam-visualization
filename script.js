// This script imports and interprets lightbeamData.json

/* LOAD DATA */
// resource: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript

// The lightbeamData.json file is an array of Connection objects (also arrays) output by Lightbeam's 'Save Data' option. Each array element is of the form:
//   var theLog = [
//     Connection.source (string),
//     Connection.target (string),
//     Connection.timestamp.valueOf() (number),
//     Connection.contentType (string),
//     Connection.cookie (boolean),
//     Connection.sourceVisited (boolean),
//     Connection.secure (boolean),
//     Connection.sourcePathDepth (number),
//     Connection.sourceQueryDepth (number),
//     Connection.sourceSubdomain (string),
//     Connection.targetSubdomain (string),
//     Connection.method (string),
//     Connection.statusCode (number),
//     Connection.cacheable (boolean),
//     Connection._sourceTab.isPrivate (boolean)
//   ];
// see: https://github.com/mozilla/lightbeam/issues/710 for more info.

// Constants for indexes of properties in array format
// Connection.SOURCE = 0;
// Connection.TARGET = 1;
// Connection.TIMESTAMP = 2;
// Connection.CONTENT_TYPE = 3;
// Connection.COOKIE = 4;
// Connection.SOURCE_VISITED = 5;
// Connection.SECURE = 6;
// Connection.SOURCE_PATH_DEPTH = 7;
// Connection.SOURCE_QUERY_DEPTH = 8;
// Connection.SOURCE_SUB = 9;
// Connection.TARGET_SUB = 10;
// Connection.METHOD = 11;
// Connection.STATUS = 12;
// Connection.CACHEABLE = 13;
// Connection.FROM_PRIVATE_MODE = 14;

let siteData = init();
console.log(siteData);

function init() {
	loadJSON(function(response) {
		// Parse JSON string into object
		var data = JSON.parse(response);
		
		let visitedSites = {
			'google.com': {},
			'amazon.com': {},
			'facebook.com': {},
			'youtube.com': {},
		};

		// populate visitedSites from JSON data
		// each element in each array is a unique third-party site linked to by the visited site key.
		for (let currentSite in visitedSites) {
			for (let j = 0; j < data.length; j++) {
				// source website is index 0 for each ith array in data
				let source = data[j][0];
				// target website is index 1 for each ith array in data
				let target = data[j][1];
				// if there's a third-party source
				if (source === currentSite && target !== currentSite) {
					// if third-party site is not yet captured
					if (!visitedSites[currentSite].hasOwnProperty(target)) {
						visitedSites[currentSite][target] = {};
					}
				}
			}
		}

		console.log('Third party sites by visited site: ', visitedSites);

		// get path element from DOM based on title attribute
		let pathElements = [];

		let pathSVGElements = document.getElementsByClassName('site');
		console.log(pathSVGElements);

		for (let k = 0; k < pathSVGElements.length; k++) {
			pathElements.push(pathSVGElements[k].getElementsByTagName('path'));
		}

		//convert array of HTML collection objects into a single array of path elements
		pathElements = pathElements.reduce(function(a, b) {return [...a, ...b];
}, []);

		for (let l = 0; l < pathElements.length; l++) {
			pathElements[l].addEventListener('click', function() {
					updateSideBar(pathElements[l]);
				}
			);
		}

		let thirdPartySpan = document.getElementById("third-party-site");
		let thirdPartyAboutSpan = document.getElementById("third-party-site-about");
		let visitedSiteSpan = document.getElementById("visited-site");
		let prevPathElement;

		function updateSideBar(pathElement) {
			if (!prevPathElement) {
				prevPathElement = pathElement;
			} else if (prevPathElement !== pathElement) {
				prevPathElement.classList.remove('active');
				prevPathElement = pathElement;
			}
				thirdPartySpan.innerText = pathElement.textContent;
			thirdPartyAboutSpan.innerText = pathElement.textContent;
			// get parentElement to pathElement (<svg>)
			let parentSVG = pathElement.nearestViewportElement;
			// then get siblingElement to parentElement (<a>)
			let siblingElement = parentSVG.nextElementSibling;
			// then get the value of the title attribute
			visitedSiteSpan.innerText = siblingElement.getAttribute('title');
			pathElement.classList.add('active');
		}
	});
}

function loadJSON(callback) {   
	var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'lightbeamData.json', true);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}


