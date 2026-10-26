# Inside the Prediction

Public app link: **Pending GitHub connection and publication.**


## Direct section links

- [Push & Pull](./index.html#linear)
- [Wisdom of the Forest](./index.html#forest)
- [One Correction at a Time](./index.html#boosting)

## My viewer should walk away knowing…

- Linear: the training-average baseline plus coefficient × distance from the training average for each feature reconstructs a prediction; one person's push differs from overall feature importance.
- Forest: diverse trees are averaged, a partial forest uses only the first selected trees, and their disagreement is not a calibrated uncertainty interval.
- Boosting: each new tree corrects training residuals, and the validation-error minimum guides a stopping choice without constituting an independent test result.

## Run

Double-click `index.html`. It contains the supplied bundles, styles and JavaScript, works offline, and needs no build, external library or server. Editable source modules are included in `app.js`, `m10.js` and `style.css`. The deployed page is the self-contained `index.html`; source changes must also be reflected in its embedded script and styles.

## Provenance

Course starter: https://github.com/snsie/regression-activity
Data: CDC/NCHS NHANES public-use files; see data/README.md and data/manifest.json. The competition uses real NHANES data and fixed supplied models; the separate 500-row lung-function notebook uses simulated data in liters. They are different datasets.

All fixed-output checks are in `check.md`. Additional numerical checks can be run with `node verify.mjs`. No passwords, API keys or private participant data are included.
