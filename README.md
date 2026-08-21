# IntelliQuest

IntelliQuest is a client-side technical assessment platform for evaluating software engineering knowledge across modern development domains. It presents scenario-based questions, gives immediate explanations, calculates a competency scorecard, and provides a themed feedback experience for learners.

The project is intentionally lightweight: it uses standard HTML, CSS, and JavaScript without a build system, framework, backend, database, or package manager.

## Project Goals

IntelliQuest is designed to:

- Provide structured technical assessment tracks.
- Evaluate conceptual understanding through scenario-based questions.
- Give immediate feedback after each answer.
- Calculate a final score and competency summary.
- Keep the complete assessment flow in the browser.
- Offer light and dark visual themes.
- Provide a responsive interface for desktop, tablet, and mobile screens.
- Collect learner feedback without sending data to a server.

## Technology Stack

- **HTML5**: Semantic page structure, forms, navigation, assessment views, and accessibility attributes.
- **CSS3**: Layout, design tokens, responsive breakpoints, transitions, cards, buttons, score displays, and theme styling.
- **Modern JavaScript**: Quiz data, DOM rendering, application state, event handling, answer validation, score calculation, theme persistence, and feedback behavior.
- **Google Fonts**: Plus Jakarta Sans for interface text and JetBrains Mono for code-like content.
- **Font Awesome 6**: Navigation, assessment, status, rating, and action icons.
- **Browser Local Storage**: Persists the selected light or dark theme.

## Directory Structure

```text
IntelliQuest/
├── index.html     # Complete page structure and semantic UI markup
├── style.css      # Design system, layout, themes, responsive rules, and states
├── script.js      # Quiz data, state, rendering, interactions, scoring, and feedback logic
└── README.md      # Project documentation
```

There are no required `node_modules`, build artifacts, environment files, or server-side files.

## Running the Project

### Option 1: Open the HTML file

Open `index.html` directly in a modern browser. The project is written to run as a static page.

### Option 2: Use VS Code Live Server

If the Live Server extension is installed:

1. Open the IntelliQuest folder in VS Code.
2. Right-click `index.html`.
3. Select **Open with Live Server**.
4. The page will open at a local development URL.

A local server is useful when testing browser behavior, navigation, external assets, or stricter browser security rules.

## Application Structure

The page is organized into these main areas:

1. **Navbar**
   - IntelliQuest brand mark.
   - Section navigation links.
   - Light/dark theme toggle.
   - Assessment Track call-to-action.
   - Mobile navigation toggle.

2. **Hero Section**
   - Platform positioning statement.
   - Assessment track call-to-action buttons.
   - Platform statistics.
   - A visual terminal-style diagnostic panel.

3. **Assessment Track Hub**
   - Dynamically generated track cards.
   - Track category, description, icon, image, and question count.
   - Entry point into the assessment application.

4. **Instruction View**
   - Selected track title and category.
   - Assessment guidelines.
   - Question count and evaluation details.
   - Switch-track and begin-assessment actions.

5. **Question View**
   - Current track name.
   - Question counter and progress bar.
   - Scenario prompt.
   - Answer options.
   - Immediate explanation after an answer is committed.
   - Next-question navigation.

6. **Result View**
   - Percentage score.
   - Correct and incorrect counts.
   - Accuracy rating.
   - Competency tier.
   - Performance grade.
   - Attestation date and summary.
   - Retake and return-to-hub actions.

7. **Platform Information Sections**
   - Evaluation standards.
   - Diagnostic workflow.
   - Curriculum architecture.
   - Technical learning pillars.

8. **Feedback Section**
   - Student name and optional email.
   - Assessment track selection.
   - Feedback message.
   - Five-star rating.
   - Dynamic rating helper text.
   - Animated metric values based on rating and metric stage.
   - Client-side validation and status messages.

9. **Footer**
   - Platform description.
   - Assessment track links.
   - Platform links.
   - Social links for LinkedIn, GitHub, and Instagram.
   - Copyright and author information.

## `index.html`

`index.html` contains the complete application shell. It does not contain the individual assessment cards or questions because those are rendered by JavaScript from `QUIZ_DATA`.

### Important HTML responsibilities

- Loads external fonts and Font Awesome.
- Defines the navigation and theme toggle controls.
- Provides the static containers that JavaScript updates.
- Defines the three quiz views:
  - `instruction-view`
  - `question-view`
  - `result-view`
- Defines the feedback form fields and validation targets.
- Uses IDs as integration points for JavaScript.
- Uses labels, `aria-label`, `aria-live`, `aria-invalid`, and focusable controls for accessibility.

### Important DOM IDs

| ID | Purpose |
|---|---|
| `theme-toggle` | Toggles between light and dark themes. |
| `theme-icon` | Displays the moon or sun icon. |
| `quiz-grid` | Receives dynamically generated assessment cards. |
| `quiz-app-container` | Wraps the active assessment experience. |
| `instruction-view` | Displays track instructions before the quiz. |
| `question-view` | Displays one question and its answer choices. |
| `result-view` | Displays the completed scorecard. |
| `feedback-form` | Feedback form submitted by the learner. |
| `rating-helper-text` | Displays the selected or hovered rating description. |
| `learning-gain-value` | Displays the feedback learning-gain metric. |
| `learning-position-value` | Displays the learning-position metric. |
| `performance-rate-value` | Displays the performance-rate metric. |

### Feedback form layout

The feedback form uses a balanced grid:

```text
Row 1: Student Name | Email
Row 2: Select a Track across the full width
Row 3: Feedback textarea across the full width
Row 4: Overall Rating and full-width Submit Feedback action
```

The inner card heading was intentionally removed so the page-level section header remains the single primary heading for the feedback area.

## `script.js`

`script.js` is the application controller. It contains the source data, mutable state, DOM references, render functions, event handlers, validation, theme management, and scorecard logic.

### 1. Quiz data: `QUIZ_DATA`

`QUIZ_DATA` is the source of truth for the assessment tracks. Each track object contains values similar to:

```javascript
{
  id: "js-mastery",
  title: "JavaScript Mastery",
  category: "V8 & RUNTIME INTERNALS",
  icon: "fa-brands fa-js",
  description: "...",
  image: "https://...",
  questions: [
    {
      question: "...",
      options: ["...", "...", "...", "..."],
      correctIndex: 1,
      explanation: "..."
    }
  ]
}
```

Each question uses a zero-based `correctIndex`. For example, `correctIndex: 1` means the second option is correct.

To add a new track:

1. Add another track object to `QUIZ_DATA`.
2. Give it a unique `id`.
3. Add a title, category, icon, description, and image.
4. Add one or more question objects.
5. Ensure each `correctIndex` points to the correct option.
6. Add the track to the feedback select list if learners should be able to reference it there.

### 2. DOM references

The script caches frequently used elements near the top of the application logic. This keeps later functions readable and avoids repeatedly searching the document for the same node.

Examples include:

- Quiz grid and assessment container.
- Instruction, question, and result views.
- Progress bar and question counter.
- Score and competency elements.
- Theme toggle and icon.
- Feedback form controls.

### 3. Application state: `appState`

The `appState` object controls the current assessment session:

```javascript
{
  currentTrack: null,
  currentQuestionIndex: 0,
  userScore: 0,
  userAnswers: [],
  hasAnsweredCurrent: false
}
```

The state means:

- `currentTrack`: The selected track object.
- `currentQuestionIndex`: Index of the question currently shown.
- `userScore`: Number of correct answers.
- `userAnswers`: Answers selected by the learner.
- `hasAnsweredCurrent`: Prevents a question from being committed more than once.

### 4. Theme management

The theme system uses the `data-theme` attribute on the root `<html>` element:

```html
<html data-theme="light">
```

The main functions are:

- `applyTheme(themeName)`: Resolves the requested theme, updates `data-theme`, saves it to Local Storage, and updates the icon and accessible label.
- `initializeTheme()`: Reads the saved theme. If none exists, it uses the operating system preference.

The theme key is:

```text
intelliquest-theme
```

The icon behavior is:

- Light mode: moon icon, indicating the available switch to dark mode.
- Dark mode: sun icon, indicating the available switch to light mode.

### 5. Track rendering and selection

`renderTrackCards()` loops over `QUIZ_DATA` and creates the assessment cards inside `#quiz-grid`.

`selectAssessmentTrack(trackId)` finds the chosen track, stores it in `appState`, and fills the instruction view with the selected track metadata.

`startAssessmentSession()` resets the question index, score, answers, and answer-lock state before showing the first question.

### 6. Question rendering

`renderActiveScenario()` reads the current track and question from `appState`, then updates:

- Active track name.
- Question number.
- Progress bar width.
- Scenario question text.
- Answer option buttons.
- Explanation visibility.
- Next button state.

The answer buttons are rendered from the question's `options` array. This keeps the HTML static and the assessment content data-driven.

### 7. Answer handling

`handleOptionCommit(selectedIndex)` performs the answer transaction:

1. Checks whether the current question has already been answered.
2. Marks the question as answered.
3. Compares `selectedIndex` with `correctIndex`.
4. Updates the score when the answer is correct.
5. Applies correct, incorrect, and selected visual classes.
6. Displays the question explanation.
7. Enables the next-question button.

### 8. Moving through the assessment

`handleNextScenario()` advances to the next question when one exists. After the final question, it calls `compileAssessmentScorecard()` instead of rendering another question.

`returnToTrackHub()` hides the assessment container, restores the track hub, and clears the active assessment context.

`retakeActiveTrack()` starts the same track again from question one.

### 9. Scorecard generation

`compileAssessmentScorecard()` calculates and displays:

- Total score percentage.
- Correct answer count.
- Incorrect answer count.
- Accuracy rating.
- Performance grade.
- Competency tier.
- Attestation date.
- Selected track title.

The score is calculated entirely in memory and is not uploaded or persisted.

## Feedback System

The feedback form is a client-side interaction layer. It does not send responses to an API or save them to a database.

### Validation

`handleFeedbackFormSubmit(event)` validates:

- Student name is present.
- Email is valid when supplied.
- A track is selected.
- A rating is selected.
- Feedback text is present.

`setFieldError(fieldId, message)` updates both the inline error text and the field's `aria-invalid` attribute.

`validateEmail(email)` checks the optional email against a basic email pattern.

`showFormStatus(form, type, message)` displays a success or error message in the form's live status region.

### Rating behavior

The five radio inputs provide a keyboard-accessible rating control. The JavaScript then highlights every star up to the selected value.

`updateFeedbackStarState(selectedValue)`:

- Adds or removes the active state from each star.
- Updates `aria-checked` on each rating option.
- Updates the helper label.
- Refreshes the metric display.

`updateRatingHelperText(value)` maps rating values to helper labels:

| Rating | Helper text |
|---:|---|
| 1 | Poor |
| 2 | Fair |
| 3 | Good |
| 4 | Excellent |
| 5 | Outstanding |

The helper responds to selection, focus, and pointer hover.

### Dynamic feedback metrics

The feedback panel includes learning gain, learning position, and performance rate values. These values are derived from the selected rating and rotate through low, medium, and high stages every five seconds.

`feedbackRatingProfiles` contains the metric ranges for each rating. `updateFeedbackMetricDisplay()` chooses the current stage and updates the visible metric elements.

`startFeedbackMetricCycle()` starts the five-second interval when the page initializes.

These metrics are visual feedback only. They do not represent server-side analytics or persistent user tracking.

## `style.css`

`style.css` is organized into numbered sections:

1. Design tokens and theme variables.
2. Reset and base typography.
3. Outlined button architecture.
4. Navbar and theme switcher.
5. Hero and terminal card.
6. Assessment track cards.
7. Interactive quiz UI.
8. Scorecard and attestation.
9. Features, workflow, and curriculum.
10. Footer and responsive rules.
11. Feedback-specific layout and controls.

### Theme variables

Light-mode values are defined in `:root`. Dark-mode overrides are defined in `[data-theme="dark"]`.

The feedback section uses variables such as:

- `--feedback-card-surface`
- `--feedback-card-text`
- `--feedback-card-muted`
- `--feedback-card-border`
- `--feedback-card-input-bg`
- `--feedback-card-input-border`
- `--feedback-card-star`
- `--feedback-card-star-active`
- `--feedback-card-btn-border`
- `--feedback-card-btn-text`
- `--feedback-card-shadow`

Because the feedback controls use these variables instead of fixed dark-only values, they adapt when the theme toggle changes.

### Feedback grid rules

The feedback grid uses two equal columns by default. The `.field-full` class makes a field span both columns. At smaller screen widths, a media query changes the grid to one column so labels and controls remain readable.

### Accessibility and focus states

The CSS provides visible focus rings for inputs, selects, textareas, buttons, and rating inputs. It also preserves readable contrast for inactive stars, active gold stars, labels, placeholders, and error messages in both themes.

### Responsive design

Responsive rules adjust:

- Navigation and mobile menu behavior.
- Hero grid and terminal layout.
- Assessment card columns.
- Quiz instruction and result layouts.
- Feedback form columns.
- Footer columns.
- Button and action alignment.

## User Flow

```text
Open page
  |
  v
Choose Assessment Track
  |
  v
Read Instructions
  |
  v
Begin Evaluation
  |
  v
Answer Scenario
  |
  v
Read Explanation
  |
  v
Continue Until Complete
  |
  v
View Scorecard
  |
  +--> Retake Track
  |
  +--> Return to Track Hub
  |
  v
Submit Optional Feedback
```

## Design and Interaction Principles

- The application remains focused on assessment rather than gamification.
- Assessment content is data-driven instead of duplicated in HTML.
- Immediate explanations reinforce learning after each answer.
- Outlined controls preserve a technical, engineering-oriented visual language.
- Theme variables keep light and dark modes consistent.
- Motion is restrained and used for feedback, focus, hover, and state changes.
- The feedback form keeps the primary section heading at the page level and avoids redundant inner headings.
- Forms remain usable with keyboard navigation and screen readers.

## Data and Privacy Notes

This project currently has no backend. Therefore:

- Quiz questions are bundled in `script.js`.
- Quiz scores exist only during the current browser session.
- Feedback is validated and acknowledged locally.
- Feedback is not transmitted to a server.
- The selected theme is the only application preference saved in Local Storage.
- External fonts, icons, and assessment images are loaded from third-party URLs.

If production persistence is required, the feedback submit handler would need to be connected to a backend endpoint or form service. That change should include server-side validation, consent messaging, secure transport, rate limiting, and a privacy policy.

## Customization Guide

### Change branding

Update the logo text and related classes in `index.html`. Adjust brand colors through the accent variables in `style.css`.

### Change navigation

Edit the links inside `.nav-menu` in `index.html`. Each link should point to a matching section ID.

### Add or edit assessment content

Modify `QUIZ_DATA` in `script.js`. Keep every question's option order synchronized with its `correctIndex`.

### Change scoring language

Update the grade and competency logic in `compileAssessmentScorecard()`.

### Change feedback metrics

Update `feedbackRatingProfiles` in `script.js`. Each rating supports `low`, `medium`, and `high` arrays in this order:

```text
[learning gain, learning position, performance rate]
```

### Change theme colors

Edit the values in `:root` for light mode and `[data-theme="dark"]` for dark mode. Prefer changing shared variables instead of adding isolated color declarations.

### Change responsive breakpoints

Update the media queries in `style.css`. The feedback grid currently collapses to one column at a narrow viewport width.

## Testing Checklist

Because this is a static browser project, test it manually in a modern browser:

- Open the page with no console errors.
- Toggle light and dark themes.
- Refresh and confirm the selected theme persists.
- Open the mobile navigation.
- Select each assessment track.
- Begin a track and answer every question.
- Confirm correct and incorrect answer states.
- Confirm explanations appear after answering.
- Confirm the progress bar updates.
- Confirm the scorecard totals and percentage.
- Retake an assessment.
- Return to the track hub.
- Submit the feedback form with missing fields.
- Submit with an invalid email.
- Select each star rating and verify helper text.
- Confirm inactive stars remain visible in dark mode.
- Confirm feedback metric values update.
- Confirm the form collapses cleanly on mobile.
- Confirm keyboard focus is visible on all controls.

## Known Limitations

- There is no backend or permanent feedback storage.
- There is no authentication or user account system.
- Assessment content is public because it is embedded in browser JavaScript.
- External assets require network access unless replaced with local files.
- The application does not currently include automated browser tests.
- Client-side score calculation should not be treated as a secure certification authority.

## Future Improvements

Potential next steps include:

- Add a backend API for feedback and assessment result storage.
- Add server-side validation and anti-spam protection.
- Add automated browser tests for the quiz flow.
- Move assessment data into JSON or a content management workflow.
- Add result export as PDF or downloadable JSON.
- Add localization support.
- Add a persistent user profile and assessment history.
- Self-host fonts and images for offline operation.
- Add stronger content management and question versioning.

## License and Ownership

This project is part of the IntelliQuest work created for the Ezitech Software House internship program. Add a formal license file before distributing the source publicly.
