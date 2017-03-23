/* This script imports and utilizes lightbeamData.json to make a prototype Lightbeam visualization application | see: https://github.com/mozilla/lightbeam/issues/710 for more information.*/

function lightbeamVis() {
	
	let visitedSites = {
		'google.com': {},
		'amazon.com': {},
		'facebook.com': {},
		'youtube.com': {},
	};

	let thirdPartySpan = document.getElementById("third-party-site");
	let thirdPartyAboutSpan = document.getElementById("third-party-site-about");
	let visitedSiteSpan = document.getElementById("visited-site");
	let prevPathElement;
	let sidePanel = document.getElementById('side-panel');

		// get <path> element from DOM based on title attribute
	let pathElements = [];
	let pathSVGElements = document.getElementsByClassName('site');
	for (let k = 0; k < pathSVGElements.length; k++) {
		pathElements.push(pathSVGElements[k].getElementsByTagName('path'));
	}
	//convert array of HTML collection objects into a single array of path elements
	pathElements = pathElements.reduce(function(a, b) {return [...a, ...b];
		}, []);

	// add click event to each third party pie section (pathElement)
	for (let l = 0; l < pathElements.length; l++) {
		pathElements[l].addEventListener('click', function() {
				updateSideBar(pathElements[l]);
			}
		);
	}

	/* -------- LOAD DATA ---------- */

	loadJSON();

	function loadJSON() {   
		var xobj = new XMLHttpRequest();
	  xobj.overrideMimeType("application/json");
	  xobj.open('GET', 'lightbeamData.json', true);
	  xobj.onreadystatechange = function () {
	        if (xobj.readyState == 4 && xobj.status == "200") {
	          init(xobj.responseText);
	        }
	  };
	  xobj.send(null);  
	}

	function init(response) {
		
		// Parse JSON string into object
		var data = JSON.parse(response);
		
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
						visitedSites[currentSite][target] = [];
					}
				}
			}
		}

		console.log('Third party sites by visited site: ', visitedSites);
	}

	function updateSideBar(pathElement) {
		if (sidePanel.classList.contains('hidden')) {
			sidePanel.classList.remove('hidden');
		}
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
}

window.onload = lightbeamVis;