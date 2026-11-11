# The Vignelli Canon: A Workbook

An interactive study companion to *The Vignelli Canon* by Massimo Vignelli. It has thirty plates, one per chapter, each with the same three parts:

1. **Principle**: the chapter summarised, with one short line of Vignelli's.
2. **Practice**: a hands-on exercise. You strip a poster of decoration, set a letterhead on its grid, fold an A4 into a square, weight the rules of a form, sequence the spreads of a book, and so on.
3. **Proof**: your precision score next to the canonical answer and why it is right.

A plate counts as mastered at 80 or above. **Review five** serves the five plates that are weakest or longest unseen. **Your Canon** sets your record as a poster. Press `G`, or tap **Grid**, to show the twelve-column grid the whole interface is built on.

The interface follows the book's own rules: one grid, two typefaces (a grotesque for labels, Bodoni for text), two sizes per screen, flush left, type hanging from rules, and black, white and red, with red used only to signal.

## Devices

The workbook is built for touch first.

- **Phone**: the principle and the exercise are two pages that turn.
- **Tablet, portrait**: the principle sits above the exercise.
- **Tablet, landscape, and desktop**: the two sit side by side as an open spread.

## Run

```sh
npm install
npm run dev        # development server, reachable on your network
npm run build      # static site in dist/
npm run artifact   # one self-contained HTML file in dist-single/
```

Progress is saved in the browser's local storage.

All diagrams are drawn for this workbook and the principles are paraphrased. No images or long passages from the book are reproduced.
