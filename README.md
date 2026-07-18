# Codle

Wordle, but every answer is a word you've typed a hundred times while debugging at 2am.

Guess the 5-letter programming/tech word in 6 tries. Green means right letter, right spot. Yellow means right letter, wrong spot. Gray means 'why did you even try that letter.' You get a new word every day : same rules as regular Wordle, just with more `async`.

## Clone it

```bash
git clone https://github.com/Arnaaavvv/codle.git
cd codle
```

## Play it locally

Open `index.html` in a browser. That's it. No build step, no `npm install`, no 40 dependencies to render a 5x6 grid of squares.

## Deployment

Live at: [Link](https://codle-two.vercel.app/)

Deployed on Vercel, it's static HTML/CSS/JS, so there's nothing to configure. 

- Type letters on your keyboard, or click the on-screen keyboard
- `Enter` to submit a guess
- `Backspace` / `Delete` to undo a letter

## How the daily word works

The word is picked deterministically from the date, so everyone playing on the same day gets the same word:

```js
const dayIndex = daysSince(Jan 1, 2026) % targetWords.length
```

It wraps around once the list runs out, so the words repeat eventually. 

## The word list

Curated 5-letter words living in `scripts.js`, covering:

- Core CS vocab
- Language/runtime stuff
- Tools & frameworks you've definitely `npm install`'d
- Everyday dev verbs

## Files

```
index.html   
style.css     
script.js    
```

## License

Do whatever you want with it. Add words, break the CSS, rename the files. Sometimes guessing can get hard :)