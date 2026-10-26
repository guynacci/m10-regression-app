# Website checks

I used Example person 1 for each dataset to check that the website shows the supplied model outputs correctly.

| Dataset | Model | What I checked | Expected result |
|---|---|---|---|
| Glucose | Linear regression | Starting value and final prediction | 113.8 → 99.4 mg/dL |
| Glucose | Random forest | Average of 100 trees; first tree | 108.6 mg/dL; 110.0 mg/dL |
| Glucose | Gradient boosting | Starting value and prediction after 500 rounds | 113.8 → 102.5 mg/dL |
| Glucose | Boosting validation | Lowest validation RMSE | 20.4 mg/dL at round 21 |
| Blood pressure | Linear regression | Starting value and final prediction | 125.9 → 123.3 mmHg |
| Blood pressure | Random forest | Average of 100 trees; first tree | 119.6 mmHg; 131.3 mmHg |
| Blood pressure | Gradient boosting | Starting value and prediction after 500 rounds | 125.9 → 127.1 mmHg |
| Blood pressure | Boosting validation | Lowest validation RMSE | 16.1 mmHg at round 38 |
| Lung function (FEV1) | Linear regression | Starting value and final prediction | 2878.6 → 3217.9 mL |
| Lung function (FEV1) | Random forest | Average of 100 trees; first tree | 1982.5 mL; 2003.0 mL |
| Lung function (FEV1) | Gradient boosting | Starting value and prediction after 500 rounds | 2878.6 → 1831.8 mL |
| Lung function (FEV1) | Boosting validation | Lowest validation RMSE | 537.7 mL at round 79 |

## Things I noticed

For the lung function example, the linear regression prediction is much higher than the forest prediction. The example person is only 9 years old, so a straight-line model may not capture how lung function changes with age very well.

The feature contributions in the linear regression section are calculated relative to the training-data averages. That explains why the sex and ethnicity categories can still have a contribution even when someone is in the reference category.

These are the expected values from the provided outputs, not results from retraining the models.
