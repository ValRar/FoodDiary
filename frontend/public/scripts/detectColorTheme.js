function detectColorTheme() {
  if (document.cookie.includes("show_dark_theme")) return;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.cookie = "show_dark_theme=1";
    const html = document.getElementsByTagName("html")[0];
    html.classList.add("dark");
  } else {
    let cookieExpirationDate = new Date(Date.now() + 2628e9);
    document.cookie =
      "show_dark_theme=0; expires=" + cookieExpirationDate.toUTCString();
  }
}

detectColorTheme();
