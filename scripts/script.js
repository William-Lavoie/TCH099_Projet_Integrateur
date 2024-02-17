document.addEventListener('DOMContentLoaded', function () {
    var toggleButton = document.getElementById('collapseBtn');
    var aside = document.querySelector('aside');
    var content = document.querySelector('content');

    toggleButton.addEventListener('click', function () {
        var isCollapsed = aside.classList.toggle('collapsed');
        content.classList.toggle('collapsed');

        toggleButton.innerText = isCollapsed ? '➕' : '➖';
    });
});



//color toggle function
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("themeToggle");

    const elementsToToggle = [
        document.querySelector("body"),
        document.querySelector("header"),
        document.querySelector("nav"),
        document.querySelector("content"),
        document.querySelector("footer"),
        document.querySelector("#themeToggle"),
        document.querySelector("#signinbtn"),
        document.querySelector("#signUpbtn"),
        document.querySelector("#headerTitle"),
        ...document.querySelectorAll('.btn')
    ];

    const aside = document.querySelector("aside");
    const collapseBtn = document.querySelector("#collapseBtn");

    // verifying that aside and collapseBtn are in the page so that  
    // the script doesn't break for pages without those elements
    if (aside != null && collapseBtn != null) {
        elementsToToggle.push(
            aside,
            collapseBtn
        );
    }

    const blackLogo = document.querySelector(".blackLogo");
    const whiteLogo = document.querySelector(".whiteLogo");

    // Retrieve theme from localStorage
    const savedTheme = localStorage.getItem("theme");

    function applyTheme(theme) {
        elementsToToggle.forEach(el => el.classList.toggle("light", theme === "light"));
        toggleImageSrc(blackLogo, theme === "light");
        toggleImageSrc(whiteLogo, theme !== "light");
        toggleButton.innerText = theme === "light" ? '☀️' : '🌑';
    }

    //local storage for theme
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    toggleButton.addEventListener("click", function () {
        const isLightMode = document.body.classList.toggle("light");

        // Save theme to localStorage
        localStorage.setItem("theme", isLightMode ? "light" : "dark");

        applyTheme(isLightMode ? "light" : "dark");
    });

    function toggleImageSrc(imageElement, isLightMode) {
        const newSrc = isLightMode ? "/images/plain_logo_white.png" : "/images/plain_logo.png";
        imageElement.setAttribute("src", newSrc);
    }
});





//contact form count display
function updateCharCount(textarea) {
    var maxLength = 250;
    var currentLength = textarea.value.length;
    var remainingLength = maxLength - currentLength;

    var charCountElement = document.getElementById('charCount');
    charCountElement.textContent = 'Characters remaining: ' + remainingLength;
}