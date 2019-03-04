const invertFilter = 'invert(100%)';
var injectedScript = false;
var observer = null;

var injectScript = function() {
	let isDarkMode = window.location.hostname === 'mastodon.social'; //@TODO Whitelist?

	var applyNode = function (node) {
		if (node.tagName !== undefined) {
			let lowerCaseTagName = node.tagName.toLowerCase();

			if (isDarkMode) {
				if (lowerCaseTagName === 'body') {
					node.style["filter"] = invertFilter;
					return;
				}
			} else {
				if (
					lowerCaseTagName === 'img'
					|| lowerCaseTagName === 'video'
					|| (node.style.backgroundImage && lowerCaseTagName !== 'input')
				) {
                                        var parentNode = node.parentNode;
                                        while (parentNode) {
                                            if (parentNode.style && parentNode.style["filter"] === invertFilter) {
                                                return;
                                            }
                                            parentNode = parentNode.parentNode;
                                        }

					node.style["filter"] = invertFilter;
					return;
				}
			}
		};

		let childNodes = node.childNodes;
		if (childNodes !== undefined) {
			for (let childNode of childNodes) {
				applyNode(childNode);
			}
		}
	};

	applyNode(document.getRootNode());

	//window.setInterval(function() { applyNode(document.getRootNode()); }, 1000);

	observer = new (window.MutationObserver || window.WebKitMutationObserver)(function(mutations, observer) {
		for (let mutation of mutations) {
			if (mutation.type !== 'childList') {
				continue;
			}
			for (let addedNode of mutation.addedNodes) {
				applyNode(addedNode);
			}
		}
	})

	observer.observe(document, {
		subtree: true,
		//attributes: true,
		childList: true,
		//characterData: true,
		//attributeOldValue: true,
		//characterDataOldValue: true
	});
};

var cleanupScript = function () {
	if (observer) {
		observer.disconnect();
	}
}

browser.runtime.onMessage.addListener(request => {
	if (request.state) {
		if (!injectedScript) {
			injectScript();
			injectedScript = true;
		}
	} else {
		if (injectedScript) {
			cleanupScript();
			injectedScript = false;
		}
	}
});
