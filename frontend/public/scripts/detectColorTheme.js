function detectColorTheme() {
  if (document.cookie.includes("show_dark_theme")) return;
  const cookieExpirationDate = new Date(Date.now() + 2628e9).toUTCString();
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.cookie = "show_dark_theme=1; expires=" + cookieExpirationDate;
    const html = document.getElementsByTagName("html")[0];
    html.classList.add("dark");
  } else {
    document.cookie = "show_dark_theme=0; expires=" + cookieExpirationDate;
  }
}

detectColorTheme();
