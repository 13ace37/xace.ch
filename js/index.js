/* Theme General Logic */
if (!gConfig.currentTheme) gConfig.currentTheme = localStorage.getItem(gConfig.themeItem) || gConfig.defaultTheme;
let gCurrentThemeIndex = Object.keys(gConfig.themes).indexOf(gConfig.currentTheme);
let gNextThemeIndex = Object.keys(gConfig.themes).length == gCurrentThemeIndex + 1 ? 0 : gCurrentThemeIndex + 1;

let gSwitchingActive = false;
let gLastTheme = gConfig.currentTheme;

/* Theme Pickers */
let themePickers = [...document.getElementsByClassName("ace-theme-picker")]

/* Theme Icon Change Function */
let changeThemePickerIcons = (theme = gConfig.defaultTheme, isInitial = false) => {
	if (Object.keys(gConfig.themes).indexOf(theme) === -1) theme = gConfig.defaultTheme;
	themePickers.forEach(themePickerElement => {
		let textElement = themePickerElement.querySelector("span");
		let iconElement = themePickerElement.querySelector("i");
		let nextThemeName = Object.keys(gConfig.themes)[gNextThemeIndex];
		let nextTheme = gConfig.themes[nextThemeName];
		let currentTheme = gConfig.themes[gConfig.currentTheme];
		if (textElement) textElement.innerText = isInitial ? currentTheme.name : nextTheme.name;
		if (iconElement) iconElement.className = isInitial ? currentTheme.icon : nextTheme.icon;
	});

};

/* Theme Change Function */
let setTheme = (theme = gConfig.defaultTheme, isInitial = false) => {
	gSwitchingActive = true;
	if (Object.keys(gConfig.themes).indexOf(theme) === -1) theme = gConfig.defaultTheme;
	document.querySelector("html").setAttribute(gConfig.themeAttribute, theme);
	localStorage.setItem(gConfig.themeItem, theme);
	gConfig.currentTheme = theme;
	gCurrentThemeIndex = Object.keys(gConfig.themes).indexOf(gConfig.currentTheme);
	gNextThemeIndex = Object.keys(gConfig.themes).length == gCurrentThemeIndex + 1 ? 0 : gCurrentThemeIndex + 1;
	changeThemePickerIcons(theme, isInitial);
	gSwitchingActive = false;
	gLastTheme = gConfig.currentTheme;
};

/* Theme Initial Apply */
setTheme(gConfig.currentTheme, true);

/* Theme Cycle Function */
let cycleTheme = () => {
	let nextThemeName = Object.keys(gConfig.themes)[gNextThemeIndex];
	setTheme(nextThemeName);
};

/* Apply Logic to theme Pickers */
themePickers.forEach(themePickerElement => {
	/* Click cycle trough themes */
	themePickerElement.addEventListener("click", cycleTheme);

	/* Hover enter change current to next theme */
	themePickerElement.addEventListener("mouseenter", () => {
		let textElement = themePickerElement.querySelector("span");
		let iconElement = themePickerElement.querySelector("i");
		let nextThemeName = Object.keys(gConfig.themes)[gNextThemeIndex];
		let nextTheme = gConfig.themes[nextThemeName];
		if (textElement) textElement.innerText = nextTheme.name;
		if (iconElement) iconElement.className = nextTheme.icon;
	});

	/* Hover leave change next to current theme */
	themePickerElement.addEventListener("mouseleave", () => {
		let textElement = themePickerElement.querySelector("span");
		let iconElement = themePickerElement.querySelector("i");
		let currentTheme = gConfig.themes[gConfig.currentTheme];
		if (textElement) textElement.innerText = currentTheme.name;
		if (iconElement) iconElement.className = currentTheme.icon;
	});
});


/* Monitor Local Storage */
window.setInterval(() => {
	if (gSwitchingActive) return;
	let currentTheme = localStorage.getItem(gConfig.themeItem);
	if (!currentTheme) localStorage.setItem(gConfig.themeItem, gConfig.defaultTheme);
	if (currentTheme != gLastTheme) setTheme(currentTheme, true);
	gLastTheme = currentTheme;
}, 500);

/* Add hash open to nav tabs */
document.addEventListener("DOMContentLoaded", () => {
	let activateTabFromHash = () => {
		let { hash } = window.location;
		if (hash) {
			let tabButton = document.querySelector(`button[data-bs-target="${hash}"]`);
			if (tabButton) new bootstrap.Tab(tabButton).show();
		}
	};

	let updateHashOnTabChange = () => {
		document.querySelectorAll(".nav-link").forEach(tab => {
			tab.addEventListener("shown.bs.tab", (event) => {
				let newHash = event.target.getAttribute("data-bs-target");
				history.replaceState(null, null, newHash);
			});
		});
	};

	/* Also make sure to apply changes that some1 made manually to the hash */
	window.addEventListener("hashchange", activateTabFromHash);

	activateTabFromHash();
	updateHashOnTabChange();
});
