function onUrlChange(callback) {
  let currentUrl = location.href;

  const wrapHistoryMethod = (method) => {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      if (location.href !== currentUrl) {
        currentUrl = location.href;
        callback(currentUrl);
      }
      return result;
    };
  };

  wrapHistoryMethod("pushState");
  wrapHistoryMethod("replaceState");

  window.addEventListener("popstate", () => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      callback(currentUrl);
    }
  });
}

function isOnFeedPage() {
  return location.pathname.startsWith("/feed");
}

function removeAsideElement() {
  document.querySelector(".scaffold-layout__aside")?.remove();
}

function replaceElementWithEmoji(element, emoji = "💩") {
  const emojiDiv = Object.assign(document.createElement("div"), {
    className: "emoji-replacement",
    innerHTML: emoji,
  });
  emojiDiv.style.fontSize = "20px";
  emojiDiv.style.textAlign = "center";
  emojiDiv.style.padding = "4px";
  emojiDiv.style.cursor = "default";
  emojiDiv.title = element.innerText;
  element.replaceWith(emojiDiv);
}

function replaceBadFeedElements() {
  const posts = document.querySelectorAll("div.feed-shared-update-v2");

  posts.forEach((post) => {
    const selectorsToCheck = [
      [".update-components-header__text-view", "suggested"],
      [".update-components-actor__description", "promoted"],
      [".update-components-actor__sub-description", "promoted"],
      [".update-components-header", "recommended for you"],
    ];

    for (const [selector, keyword] of selectorsToCheck) {
      const element = post.querySelector(selector);
      if (element && element.innerText.trim().toLowerCase().includes(keyword)) {
        replaceElementWithEmoji(post);
        return;
      }
    }
  });
}

function cleanupLinkedinFeed() {
  if (!isOnFeedPage()) return;
  console.log("Cleaning Linkedin feed:", newUrl);

  replaceBadFeedElements();
  removeAsideElement();
}

cleanupLinkedinFeed();

new MutationObserver(cleanupLinkedinFeed).observe(document.body, {
  childList: true,
  subtree: true,
});

onUrlChange((newUrl) => {
  if (isOnFeedPage()) {
    console.log("Navigated to feed:", newUrl);
    cleanupLinkedinFeed();
  }
});
