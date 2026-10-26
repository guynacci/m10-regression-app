# AI Prompt Log — Module 10 In-Class Activity

**AI tool:** ChatGPT (OpenAI)

This file records the prompts I gave ChatGPT while working on the Module 10 multiple linear regression activity. The prompts below are reproduced from my conversation, with only formatting adjusted for readability.

## Prompt  — Assignment questions

> I have some questions regarding this assignment. I will need you to answer them as I provide them. 

I attached the Module 10 In-Class Activity PDF with this message.

## Prompts

> Can you explain linear regression, random forests, and gradient boosting in simple terms? I get the general idea but I want to understand what each model is actually doing to make a prediction.
> For linear regression, how do the starting average and each variable's contribution add up to the final prediction?
> Why can two decision trees give different predictions for the same person, and why does a random forest average them?
> How is gradient boosting different from a random forest? I'm confused about why it keeps adding corrections instead of just averaging the trees.
> What is validation RMSE, and why would a boosting model stop improving even though more rounds are being added?
> I have three datasets from NHANES: fasting glucose, systolic blood pressure, and lung function. Help me plan a small website that explains the three models using the supplied model outputs.
> I want three sections called Push & Pull, Wisdom of the Forest, and One Correction at a Time. Each one should focus on a different way the model makes predictions.
> Can I have a dropdown to switch between the datasets and another one to select an example person? I want the numbers and explanations to update when I change them.
> For the linear regression section, show the starting prediction and the positive and negative pushes from each variable. I'd like bars so it's easier to see which variables matter for that person.
> Can you help me add editable inputs for the person's characteristics in the linear section? The prediction should change when I change a value, but it should still use the given model coefficients.
> For the random forest section, show what individual trees predicted and what happens when we average more of them. I'd also like to see the decisions that one tree makes for the selected person.
> For the boosting section, show the prediction at round 0 and how it changes as more corrections are added. A slider and a graph would make this easier to understand.
> Can you show training and validation error on the boosting graph and mark the round with the lowest validation RMSE? Explain why the last round isn't always the best one.
> Keep the site simple: HTML, CSS, and JavaScript, without a framework. It should work on GitHub Pages and look okay on a phone too.
> Some of the explanations sound too technical. Can you rewrite them so someone who has only taken an intro data science class can follow along?
> Make it clear that the model's predictions are not the same as the actual measured values, and that these relationships do not prove cause and effect.
> For the lung function example, the linear model seems to give a very high prediction for a child. Is that necessarily a bug, or could it show a limitation of fitting one straight line across different ages?
> Can you explain the difference between trees disagreeing with each other and having a real confidence interval? I don't want the website to imply they are the same thing.
> Help me check the example-person numbers against the supplied outputs for all three datasets. I want to make sure the baseline plus pushes, forest averages, and boosting corrections add up correctly.
> Can you make a short check.md with a few values I can compare to what the page shows?
> Review the JavaScript for problems when someone switches datasets or changes the selected person. Also check that the slider and graphs use the correct data.
> Help me write a README explaining what the website does, how to open it, and how to publish it using GitHub Pages.
> Do I need a GitHub repository link and a live GitHub Pages link, or are those the same thing? Where should I put each one?


