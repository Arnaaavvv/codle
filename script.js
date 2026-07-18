const targetWords = [
  "abort", "admin", "alert", "align", "alloc", "alpha", "apple", "arity", "array", "arrow",
  "ascii", "async", "audio", "audit", "auths", "await", "axios", "basic", "batch",
  "begin", "binds", "bitop", "blink", "blobs", "block", "board", "boole", "boost", "bound",
  "brace", "break", "btree", "build", "bytes", "cache", "camel", "cargo", "catch",
  "chain", "chars", "child", "chunk", "class", "clean", "clear", "click",
  "clock", "clone", "close", "cloud","coder", "codes","color",
  "comma", "conda", "conio", "const", "cores", "count", "crash", "crate", "cross", "crypt",
  "curry", "cyber", "cycle", "datum", "debug", "delay", "delta", "digit", "docks",
  "drive", "drush", "dummy", "dumps", "eager", "earth", "edges", "eject", "elisp",
  "email", "empty", "enums", "epoch", "eprom", "error", "event", "excel", "execs",
  "exist", "exits", "extra", "false", "fault", "fetch", "fgrep",
  "field", "files", "final", "finds", "first", "flags", "flash", "flask", "float", "flock",
  "floor", "flush", "focus", "fonts", "force", "forks", "forms", "forth", "frame", "fseek",
  "fstat", "fsync", "funcs", "gamma",
  "graph", "greps", "grids", "group", "guard", "hacks", "hangs", "heads",
  "heaps", "hexes", "hints", "hooks", "hosts", "https", "icons", "idles",
  "image", "inbox", "index", "infer", "infix", "inits", "inode", "input", "inset", "intel",
  "items", "iters", "javac", "joins", "julia", "jumps", "kafka",
  "kbyte", "keras", "knots", "known", "label", "langs", "latch", "latex", "layer",
  "leaks", "least", "leave", "lefts", "level", "lexer", "lgrep",
  "links", "linux", "lists", "local", "locks", "logic", "login", "loops", "lower", "macos",
  "macro", "magic", "maker", "makes", "match", "maths", "menus", "merge", "micro",
  "mkdir", "mocks", "modal", "model", "modes", "mongo", "mount",
  "mouse", "mutex", "mysql", "named", "names", "nanos", "newly", "nexus", 
  "nodal", "nodes", "noise", "nulls", "numpy", "oauth",
  "omega", "opens", "order", "outer", "owner", "paged", "pages",
  "panel", "panic", "param", "parse", "parts", "paste", "patch", "paths", "point", "prime",
  "print", "props", "proxy", "query", "queue", "range", "react", "recur",
  "redis", "redux", "regex", "reset", "retry", "route", "scala", "scope", "setup",
  "shell", "shift", "slice", "solve", "space", "spawn", "stack", "stash", "state", "style",
  "super", "table", "throw", "timer", "token", "trace", "trait", "trees", "tuple",
  "typed", "types", "union", "unset", "until", "unzip", "views", "while", "write", "yield"
];

const dictionary = targetWords

const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
const offsetFromDate = new Date(2026, 0, 1)
const msOffset = Date.now() - offsetFromDate
const dayOffset = msOffset / 1000 / 60 / 60 / 24

const dayIndex =
  ((Math.floor(dayOffset) % targetWords.length) + targetWords.length) %
  targetWords.length
const targetWord = targetWords[dayIndex]

startInteraction()

function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.length === 1 && /^[a-z]$/i.test(e.key)) {
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORD_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "")

  if (!dictionary.includes(guess)) {
    showAlert("Not in word list")
    shakeTiles(activeTiles)
    return
  }

  stopInteraction()
  const states = getGuessStates(guess, targetWord)
  activeTiles.forEach((tile, index, array) =>
    flipTile(tile, index, array, guess, states)
  )
}

function getGuessStates(guess, target) {
  const states = Array(WORD_LENGTH).fill("wrong")
  const remainingCounts = {}

  for (const letter of target) {
    remainingCounts[letter] = (remainingCounts[letter] || 0) + 1
  }

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      states[i] = "correct"
      remainingCounts[guess[i]]--
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (states[i] === "correct") continue
    const letter = guess[i]
    if (remainingCounts[letter] > 0) {
      states[i] = "wrong-location"
      remainingCounts[letter]--
    }
  }

  return states
}

function flipTile(tile, index, array, guess, states) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip")
      const state = states[index]
      tile.dataset.state = state
      key.classList.add(state)

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            checkWinLose(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}

function checkWinLose(guess, tiles) {
  if (guess === targetWord) {
    showAlert("You Win", 5000)
    danceTiles(tiles)
    stopInteraction()
    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}