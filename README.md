# Inside the Prediction

[Open the app](https://guynacci.github.io/m10-regression-app/)

This app explains how linear regression, random forests, and gradient boosting make predictions. You can switch between fasting glucose, blood pressure, and lung function datasets and choose one of five example people.

## Model sections

- [Push & Pull](https://guynacci.github.io/m10-regression-app/#linear): see how the starting prediction and each feature's positive or negative push add up. You can edit the inputs to see how the linear prediction changes.
- [Wisdom of the Forest](https://guynacci.github.io/m10-regression-app/#forest): compare individual tree predictions and watch the average change as more trees are included.
- [One Correction at a Time](https://guynacci.github.io/m10-regression-app/#boosting): follow the corrections added each round and compare training and validation error to choose a stopping round.

## What I want the viewer to understand

- **Linear regression:** My viewer should walk away knowing that a prediction starts at the training-average baseline, then adds one signed push per feature. A coefficient is the change per feature unit; a person's push also depends on how far their value is from the training average.
- **Random forest:** My viewer should walk away knowing that different trees make different predictions and the forest averages them. Disagreement between trees is not a confidence or prediction interval.
- **Gradient boosting:** My viewer should walk away knowing that each new tree adds a correction based on training residuals. The round with the lowest validation RMSE guides the stopping choice; it is not an independent test result.

## Run locally

Download the repository and open `index.html` in a browser. The page includes its data, JavaScript, and styles, so it works offline without installing anything.

Editable source files are also included as `app.js`, `m10.js`, and `style.css`. Changes to these files need to be reflected in the embedded code in `index.html` to update the published page.

## Data and sources

The app uses the course's supplied model outputs and CDC/NCHS NHANES public-use data:

- Fasting glucose and blood pressure: NHANES 2017–2018.
- Lung function: NHANES 2011–2012.

Dataset descriptions are in `data/README.md`, and preparation details are in `data/manifest.json`. These results describe the survey sample and do not establish cause and effect.

Course starter: https://github.com/snsie/regression-activity

## Checks and prompt log

`check.md` lists reference values. Run `node verify.mjs` to check the supplied predictions, forest averages, boosting corrections, and validation minima. Node.js is needed for this check, but not to use the app.

The AI prompt log is in `prompts.md`.
