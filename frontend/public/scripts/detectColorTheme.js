function detectColorTheme() {
  if (document.cookie.includes("show_dark")) return;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.cookie = "show_dark=1";
    const html = document.getElementsByTagName("html")[0];
    html.classList.add("dark");
  } else {
    document.cookie = "show_dark=0";
  }
}

detectColorTheme();
