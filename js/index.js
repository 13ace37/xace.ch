/* Theme General Logic */
if (!gConfig.currentTheme) gConfig.currentTheme = localStorage.getItem(gConfig.themeItem) || gConfig.defaultTheme;
let gCurrentThemeIndex = Object.keys(gConfig.themes).indexOf(gConfig.currentTheme);
let gNextThemeIndex = Object.keys(gConfig.themes).length == gCurrentThemeIndex + 1 ? 0 : gCurrentThemeIndex + 1;

let gSwitchingActive = false;
let gLastTheme = gConfig.currentTheme;

/* Theme Pickers */
let themePickers = [...document.getElementsByClassName("ace-theme-picker")]
let themeDropdown = document.querySelector(".ace-theme-dropdown");

/* Initialize Theme Dropdown */
let initializeThemeDropdown = () => {
	if (!themeDropdown) return;

	// Clear existing items
	themeDropdown.innerHTML = "";

	// Add theme options
	Object.keys(gConfig.themes).forEach(themeKey => {
		let theme = gConfig.themes[themeKey];
		let li = document.createElement("li");
		let a = document.createElement("a");
		a.className = "dropdown-item d-flex align-items-center";
		a.href = "#";
		a.dataset.theme = themeKey;

		let icon = document.createElement("i");
		icon.className = theme.icon + " me-2 flex-shrink-0";
		icon.style.width = "1.25rem";

		let span = document.createElement("span");
		span.textContent = theme.name;
		span.className = "flex-grow-1";

		a.appendChild(icon);
		a.appendChild(span);

		// Add active indicator
		if (themeKey === gConfig.currentTheme) {
			a.classList.add("active");
			let checkIcon = document.createElement("i");
			checkIcon.className = "bi bi-check ms-2 flex-shrink-0";
			a.appendChild(checkIcon);
		}

		li.appendChild(a);
		themeDropdown.appendChild(li);
	});

	// Add click event listeners to dropdown items
	themeDropdown.querySelectorAll(".dropdown-item").forEach(item => {
		item.addEventListener("click", (e) => {
			e.preventDefault();
			let selectedTheme = item.dataset.theme;
			setTheme(selectedTheme);
		});
	});
};

/* Theme Icon Change Function */
let changeThemePickerIcons = (theme = gConfig.defaultTheme, isInitial = false) => {
	if (Object.keys(gConfig.themes).indexOf(theme) === -1) theme = gConfig.defaultTheme;

	// Update main theme picker button
	themePickers.forEach(themePickerElement => {
		let textElement = themePickerElement.querySelector("span");
		let iconElement = themePickerElement.querySelector("i");
		let currentTheme = gConfig.themes[gConfig.currentTheme];
		if (textElement) textElement.innerText = currentTheme.name;
		if (iconElement) iconElement.className = currentTheme.icon + " me-2";
	});
	// Update dropdown active state
	if (themeDropdown) {
		themeDropdown.querySelectorAll(".dropdown-item").forEach(item => {
			item.classList.remove("active");
			let checkIcon = item.querySelector(".bi-check");
			if (checkIcon) checkIcon.remove();

			if (item.dataset.theme === gConfig.currentTheme) {
				item.classList.add("active");
				let checkIcon = document.createElement("i");
				checkIcon.className = "bi bi-check ms-2 flex-shrink-0";
				item.appendChild(checkIcon);
			}
		});
	}
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

/* Initialize theme dropdown when DOM is loaded */
document.addEventListener("DOMContentLoaded", () => {
	initializeThemeDropdown();
});

/* Theme Cycle Function - kept for backward compatibility */
let cycleTheme = () => {
	let nextThemeName = Object.keys(gConfig.themes)[gNextThemeIndex];
	setTheme(nextThemeName);
};

/* Apply Logic to theme Pickers - Updated for new dropdown */
themePickers.forEach(themePickerElement => {
	// Only add click listener if it"s not a dropdown toggle
	if (!themePickerElement.hasAttribute("data-bs-toggle")) {
		/* Click cycle through themes */
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
	}
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
let activateTabFromHash = () => {
	let { hash } = window.location;
	if (hash) {
		let tabButton = document.querySelector(`button[data-bs-target="${hash.replace("#", "#nav-")}"]`);
		if (tabButton) new bootstrap.Tab(tabButton).show();
	}
};

let updateHashOnTabChange = () => {
	document.querySelectorAll(".nav-link").forEach(tab => {
		tab.addEventListener("shown.bs.tab", (event) => {
			let newHash = event.target.getAttribute("data-bs-target").replace("nav-", "");
			history.replaceState(null, null, newHash);
		});
	});
};
document.addEventListener("DOMContentLoaded", () => {

	/* Also make sure to apply changes that some1 made manually to the hash */
	window.addEventListener("hashchange", activateTabFromHash);

	activateTabFromHash();
	updateHashOnTabChange();
});

/* Check for configured navigation */
document.addEventListener("DOMContentLoaded", () => {

	let { pathname } = window.location;
	pathname = pathname.replace(/\/$/, ""); // replace tailing /

	if (!(pathname in gConfig.navLinks)) return;

	history.replaceState(null, null, gConfig.navLinks[pathname]);
	activateTabFromHash();

});

/* Devicon Coloring */
[...document.querySelectorAll("[class*=devicon]")].forEach(devIcon => {
	devIcon.addEventListener("mouseenter", () => devIcon.classList.add("colored"));
	devIcon.addEventListener("mouseleave", () => devIcon.classList.remove("colored"));
	new bootstrap.Tooltip(devIcon);
});

/* Helper function to fetch and parse json data */
const fetchJSONData = async (url) => {
	try {
		const response = await fetch(url);
		const data = response.ok ? await response.json() : null;
		return data;
	} catch (error) {
		return null;
	}
};

/* Helper function get nested value in object by string */
const getNestedValue = (obj, path, defaultValue = "N/A") => path.split(".").reduce((acc, key) => acc && acc[key], obj) || defaultValue;

/* Apply repo data */
document.addEventListener("DOMContentLoaded", async () => {

	let repoData = await fetchJSONData("/_repoData.json");
	if (!repoData) return;

	[...document.getElementsByClassName("api-repoData")].forEach(x => x[x.getAttribute("data-bind-attribute") || "innerText"] = getNestedValue(repoData, x.getAttribute("data-bind-value")));

});

