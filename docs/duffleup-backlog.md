# duffleup-web Backlog

## Codebase rules

- Tailwind cn() ordering rule: inside cn() calls, always place
  leading-* (line-height) AFTER any text-* size class.
  tailwind-merge treats font-size classes as overriding
  line-height when the project's fontSize tokens carry
  line-heights (as this project's do — h1: [96px,
  {lineHeight: '1'}], etc.). Leading placed before a size class
  silently vanishes. No build-time or lint-time error catches
  this — only DOM inspection does. See StickerMoodCard.tsx for
  the reference pattern and inline comment.
