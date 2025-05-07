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
  replaceBadFeedElements();
  removeAsideElement();
}

cleanupLinkedinFeed();

new MutationObserver(cleanupLinkedinFeed).observe(document.body, {
  childList: true,
  subtree: true,
});
