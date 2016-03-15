var styleTemplate = document.createElement("div");
styleTemplate.innerHTML = "<div class='style-name'></div>";

chrome.tabs.getSelected(null, function(tab) {
	chrome.runtime.sendMessage({method: "getStyles", matchUrl: tab.url}, showStyles);
	document.querySelector("#esifind-styles a").href = "http://userstyles.org/styles/browse/all/" + encodeURIComponent(tab.url)+"%20esi";
});
chrome.tabs.getSelected(null, function(tab) {
	chrome.runtime.sendMessage({method: "getStyles", matchUrl: tab.url});
	document.querySelector("#find-styles a").href = "http://userstyles.org/styles/browse/all/" + encodeURIComponent(tab.url);
});
chrome.tabs.getSelected(null, function(tab) {
	document.querySelector("#esihelp a").href = "http://dreamject.org/dreamjects/esi/support/";
});

function showStyles(styles) {
	var installed = document.getElementById("installed");
	if (styles.length == 0) {
		installed.innerHTML = "<div class='entry' id='no-styles'>" + t('noStylesForSite') + "</div>";
	}
	styles.map(createStyleElement).forEach(function(e) {
		installed.appendChild(e);
	});
}

function createStyleElement(style) {
	var e = styleTemplate.cloneNode(true);
	e.setAttribute("class", "entry " + (style.enabled == "true" ? "enabled" : "disabled"));
	e.setAttribute("style-id", style.id);
	var styleName = e.querySelector(".style-name");
	var styleN = document.createElement("div");
	styleN.setAttribute("class", "style-title");
	styleN.appendChild(document.createTextNode(style.name));
	if (style.url) {
		var homepage = document.createElement("a");
		homepage.setAttribute("href", style.url);
		homepage.setAttribute("target", "_blank");
		var homepageImg = document.createElement("img");
		homepageImg.src = "world_go.png";
		homepageImg.alt = "*";
		homepage.appendChild(homepageImg);
		styleN.appendChild(document.createTextNode(" " ));
		styleN.appendChild(homepage);
		var actions = document.createElement("div");
		actions.setAttribute("class", "actions");
		actions.innerHTML = "<a href='#' class='delete'></a> <a class='style-edit-link' href='edit.html?id='></a> <a href='#' class='enable'></a> <a href='#' class='disable'></a>";
		styleName.appendChild(styleN);
		styleName.appendChild(actions);
	}
	var editLink = e.querySelector(".style-edit-link");
	editLink.setAttribute("href", editLink.getAttribute("href") + style.id);
	editLink.addEventListener("click", openLink, false);
	e.querySelector(".enable").addEventListener("click", function() { enable(event, true); }, false);
	e.querySelector(".disable").addEventListener("click", function() { enable(event, false); }, false);
	e.querySelector(".delete").addEventListener("click", function() { doDelete(event, false); }, false);
	return e;
}

function enable(event, enabled) {
	var id = getId(event);
	enableStyle(id, enabled);
}

function doDelete() {
	// Opera can't do confirms in popups
	if (getBrowser() != "Opera") {
		if (!confirm(t('deleteStyleConfirm'))) {
			return;
		}
	}
	var id = getId(event);
	deleteStyle(id);
}

function getBrowser() {
	if (navigator.userAgent.indexOf("OPR") > -1) {
		return "Opera";
	}
	return "Chrome";
}

function getId(event) {
	var e = event.target;
	while (e) {
		if (e.hasAttribute("style-id")) {
			return e.getAttribute("style-id");
		}
		e = e.parentNode;
	}
	return null;
}

function openLink(event) {
	event.preventDefault();
	chrome.tabs.create({url: event.target.href});
	//return false;
}

function handleUpdate(style) {
	var installed = document.getElementById("installed");
	installed.replaceChild(createStyleElement(style), installed.querySelector("[style-id='" + style.id + "']"));
}

function handleDelete(id) {
	var installed = document.getElementById("installed");
	installed.removeChild(installed.querySelector("[style-id='" + id + "']"));
}

tE("open-manage-link", "openManage");
tE("find-styles-link", "findStylesForSite");
tE("esifind-styles-link", "esifindStylesForSite");
tE("esihelp-link", "esihelp");

document.getElementById("find-styles-link").addEventListener("click", openLink, false);
document.getElementById("esifind-styles-link").addEventListener("click", openLink, false);
document.getElementById("open-manage-link").addEventListener("click", openLink, false);
document.getElementById("esihelp-link").addEventListener("click", openLink, false);

