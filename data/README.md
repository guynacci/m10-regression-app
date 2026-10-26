# The data

My app uses three health datasets: fasting glucose, blood pressure, and lung function. They come from the CDC's National Health and Nutrition Examination Survey (NHANES). Each row represents one person.

A few things to know before looking at the files:

- `row_id` is the row number.
- `split` tells you whether a row is in the training set or validation set. The models learn from the training rows (80%). The validation rows (20%) are used to check performance and choose when boosting should stop.
- The results describe the people in this sample. They should not be treated as representing the entire US population.

## Fasting glucose

`glucose.csv` includes 2,397 adults from NHANES 2017–2018. The target is fasting glucose, meaning blood sugar measured after fasting.

| Column | Meaning | Units |
|---|---|---|
| `hba1c` | HbA1c, a measure of average blood sugar over about 3 months | % |
| `age` | Age; 80 means 80 or older | years |
| `bmi` | Body mass index | kg/m² |
| `waist_cm` | Waist circumference | cm |
| `female` | 1 = female, 0 = male | 0/1 |
| `fasting_glucose` | Target: blood sugar after fasting | mg/dL |

## Blood pressure

`sbp.csv` includes 4,370 adults from NHANES 2017–2018. The target is systolic blood pressure, calculated as the mean of up to three readings.

| Column | Meaning | Units |
|---|---|---|
| `age` | Age; 80 means 80 or older | years |
| `bmi` | Body mass index | kg/m² |
| `waist_cm` | Waist circumference | cm |
| `female` | 1 = female, 0 = male | 0/1 |
| `income_poverty_ratio` | Family income divided by the poverty line; 5 means 5 or more | ratio |
| `eth_mexican_american`, `eth_other_hispanic`, `eth_nh_black`, `eth_nh_asian`, `eth_other_multiracial` | Race/ethnicity stored as 0/1 columns. All zeros means Non-Hispanic White, the reference group | 0/1 |
| `systolic_bp` | Target: systolic blood pressure, mean of up to 3 readings | mmHg |

## Lung function

`fev1.csv` includes 5,820 people ages 6–79 from NHANES 2011–2012. The target is FEV1, the amount of air a person blows out in the first second of a forced breath.

| Column | Meaning | Units |
|---|---|---|
| `age` | Age | years |
| `female` | 1 = female, 0 = male | 0/1 |
| `bmi` | Body mass index | kg/m² |
| `income_poverty_ratio` | Family income divided by the poverty line; 5 means 5 or more | ratio |
| `fev1` | Target: FEV1, air blown out in the first second | mL |

Height was left out of the supplied dataset on purpose. The models have to use age and the other available features to predict lung function, including the pattern of growth and decline with age.

## Where the data came from

- CDC/NCHS, NHANES 2017–2018 and 2011–2012 public-use files.
- These prepared datasets and their descriptions came from the course starter. They were prepared using the regression-app's `pipeline/datasets.py`.
- `manifest.json` records the source commit, package versions, and row counts.
