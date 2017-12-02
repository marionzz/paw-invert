function isSupportedProtocol(urlString) {
	var supportedProtocols = ["https:", "http:", "file:"];
	var url = document.createElement('a');
	url.href = urlString;
	return supportedProtocols.indexOf(url.protocol) != -1;
}

var enabled = true;

browser.browserAction.onClicked.addListener(function () {
	enabled = !enabled;
	updateIcon();
	updateState();
});

var updateIcon = function() {
	let state = enabled ? 'active' : 'inactive';

	browser.browserAction.setIcon({
		"path": {
			"16": '../../data/icons/' + state + '/16.png',
			"32": '../../data/icons/' + state + '/32.png',
			"48": '../../data/icons/' + state + '/48.png',
			"64": '../../data/icons/' + state + '/64.png'
		}
	});

	browser.browserAction.setTitle({
		title: 'Current State: ' + state.toUpperCase()
	});

};
updateIcon();

var updateState = function() {
	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(
		function (tabs) {
			for (let tab of tabs) {
				if (isSupportedProtocol(tab.url)) {
					browser.tabs.sendMessage(
						tab.id,
						{state: enabled}
					).catch(function(){});
			  }
			}
		}
	).catch(function(){});
}

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateState);

// listen to tab switching
browser.tabs.onActivated.addListener(updateState);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateState);

updateState();
