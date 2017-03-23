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
	let dataSentSpan = document.getElementById('data-sent');
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

	/* Back to top link resets scroll position */
	const backToTop = document.getElementById('back-to-top');
	backToTop.onclick = scrollToTop;

	function scrollToTop() {
		window.scrollTo(0,0);
	}

/* --- Deselect third party pie slice on clicking away ---*/
	document.body.addEventListener('click', deselectSlice, true);

	function deselectSlice(e) {
		if (e.target.id.indexOf('chart') === -1) {
			for (let m = 0; m < pathElements.length; m++) {
				pathElements[m].classList.remove('active');
			}
		}
	}

	let closeButton = document.getElementById('close');
	closeButton.onclick = closeSideBar;

	function closeSideBar() {
		sidePanel.classList.add('hidden');
		scrollToTop();
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
			let dataSent = 0;
			for (let j = 0; j < data.length; j++) {
				// source website is index 0 for each ith array in data
				let source = data[j][0];
				// target website is index 1 for each ith array in data
				let target = data[j][1];
				// check if target has a subdomain and remove it e.g. remove x in 'x.cloudfront.net'.
				let arrayOfStrings = target.split('.');
				if (arrayOfStrings.length > 2) {
					arrayOfStrings.splice(0, 1);
					target = arrayOfStrings.join('.');
				}
				// if there's a third-party source
				if (source === currentSite && target !== currentSite) {
					// if third-party site is not yet captured
					if (!visitedSites[currentSite].hasOwnProperty(target)) {
						dataSent += 3;
						visitedSites[currentSite][target] = dataSent;
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
		// update third party value in side panel
		let thirdPartySite = pathElement.textContent;
			thirdPartySpan.innerText = thirdPartySite;
		thirdPartyAboutSpan.innerText = thirdPartySite;
		// get parentElement to pathElement (<svg>)
		let parentSVG = pathElement.nearestViewportElement;
		// then get siblingElement to parentElement (<a>)
		let siblingElement = parentSVG.nextElementSibling;
		// then get the value of the title attribute, which corresponds to the visited site name string
		let visitedSite = siblingElement.getAttribute('title');
		visitedSiteSpan.innerText = visitedSite;
		// update data sent value in side panel
		dataSentSpan.innerText = visitedSites[visitedSite][thirdPartySite];
		pathElement.classList.add('active');
		// on larger screen widths, this has no effect
		// for smaller screen widths, this scrolls to the bottom of the page where the side panel is located
		window.scrollTo(0, 10000);
	}
}

window.onload = lightbeamVis;