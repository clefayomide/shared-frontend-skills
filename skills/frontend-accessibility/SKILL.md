---
name: frontend-accessibility
description: Standards and guidelines for building, reviewing, and testing accessible frontend applications. Enforce WCAG 2.2 Level AA, semantic HTML, ARIA, keyboard navigation, focus management, accessible forms, screen reader compatibility, and inclusive interaction patterns. Use when building UI components, implementing interactions, reviewing frontend code, or auditing web applications for accessibility.
---

# Frontend Accessibility (a11y) Standards & Guidelines

## 1. Core Accessibility Principles

- **Accessibility by Default**: Treat accessibility as a fundamental engineering requirement, not a final polishing step. Consider accessibility during component design, implementation, testing, and review.
- **WCAG Compliance**: Target WCAG 2.2 Level AA unless the project explicitly requires a higher standard.
- **Inclusive Design**: Ensure interfaces work for people using keyboards, screen readers, magnification, voice control, and other assistive technologies.
- **Perceivable, Operable, Understandable, Robust (POUR)**: Apply the four WCAG principles when evaluating interface behavior and content.
- **Progressive Enhancement**: Prefer native browser capabilities and ensure essential functionality remains available without relying exclusively on JavaScript or visual presentation.
- **No Accessibility Regressions**: Changes to shared components, design systems, and interaction patterns must preserve existing accessibility behavior.

## 2. Semantic HTML & Native Primitives

- **Use Native Elements First**: Prefer native HTML elements such as `<button>`, `<a href="...">`, `<input>`, `<select>`, and `<dialog>` over generic `<div>` or `<span>` elements with custom interaction handlers.
- **Correct Element Semantics**:
  - Use `<button>` for actions and state changes.
  - Use `<a>` for navigation.
  - Use `<nav>` for navigation regions.
  - Use `<main>` for the primary page content.
  - Use `<form>` for user-submitted data.
  - Use `<ul>`, `<ol>`, and `<li>` for lists.
  - Use appropriate table elements for tabular data.
- **Document Structure**: Use meaningful landmarks such as `<header>`, `<nav>`, `<main>`, `<aside>`, and `<footer>` to establish page structure.
- **Heading Hierarchy**: Use headings (`<h1>` to `<h6>`) to communicate logical content structure. Do not select heading levels merely for visual styling. Avoid unnecessary heading-level jumps.
- **Accessible Names**: Every interactive element must have a meaningful accessible name that describes its purpose.
- **Avoid Non-Semantic Interactions**: Do not make static elements interactive unless there is a strong reason and the required keyboard, focus, role, and state behavior can be implemented correctly.

## 3. Keyboard Navigation & Focus Management

- **Keyboard Accessibility**: All interactive functionality must be usable with a keyboard without requiring a mouse or touch input.
- **Logical Focus Order**: Ensure keyboard focus follows a predictable order that corresponds to the page's content and interaction flow.
- **Visible Focus Indicators**: Never remove browser focus outlines without providing an equally visible or better alternative. Use clear `:focus-visible` styles where appropriate.
- **Focus Visibility**: Ensure focused elements are not hidden behind sticky headers, overlays, or other content.
- **Avoid Positive Tab Indexes**: Do not use positive `tabIndex` values to manipulate focus order. Use native document order and `tabIndex={0}` or `tabIndex={-1}` only when appropriate.
- **Focus Management**:
  - Move focus when an interaction requires a new context, such as opening a modal dialog.
  - Restore focus to the appropriate trigger or logical destination when a modal closes.
  - Manage focus after route changes, form submissions, and significant content transitions where necessary.
  - Avoid unexpected focus changes during ordinary rendering.
- **Modal Dialogs**:
  - Move focus into the dialog when it opens.
  - Keep keyboard focus within the modal while it is active.
  - Support Escape to close when appropriate.
  - Make background content unavailable to interaction while the modal is active.
  - Return focus to the triggering element or another logical destination when closed.
  - Prefer native `<dialog>` where its behavior meets the requirements.
- **Custom Widgets**: Implement appropriate keyboard interaction patterns for tabs, menus, comboboxes, listboxes, and other composite widgets. Do not assume every widget should use the same keyboard behavior.

## 4. ARIA & Accessible Interaction Patterns

- **First Rule of ARIA**: Do not use ARIA when native HTML already provides the required semantics and behavior.
- **Correct Roles**: Use ARIA roles only when native HTML cannot adequately express the component's semantics.
- **Accessible Names and Descriptions**: Ensure interactive controls have meaningful accessible names. Use `aria-label`, `aria-labelledby`, and `aria-describedby` appropriately.
- **State Synchronization**: Keep ARIA states synchronized with actual UI state. Examples include:
  - `aria-expanded`
  - `aria-selected`
  - `aria-checked`
  - `aria-pressed`
  - `aria-disabled`
  - `aria-invalid`
- **Relationships**: Use attributes such as `aria-controls` and `aria-describedby` only when they reference valid, relevant elements.
- **Live Regions**: Use `aria-live`, `role="status"`, and `role="alert"` when dynamic updates need to be communicated to assistive technologies.
- **Hidden Content**:
  - Use `aria-hidden="true"` only when content should be excluded from the accessibility tree.
  - Never apply `aria-hidden="true"` to an element containing interactive or focusable descendants that users can still reach.
  - Do not use `display: none` or `visibility: hidden` for content that must remain available to screen readers.
- **Established Patterns**: Follow the WAI-ARIA Authoring Practices Guide for custom widgets instead of inventing interaction patterns.

## 5. Forms & Interactive Inputs

- **Explicit Labels**: Every form control must have an accessible name, preferably through an associated `<label>` using `htmlFor` or a wrapping label.
- **Placeholder Restrictions**: Placeholder text is not a substitute for a label. Do not rely on placeholders as the only source of instructions.
- **Instructions and Requirements**:
  - Clearly communicate required fields and expected input formats.
  - Use appropriate native input types and attributes, including `type`, `required`, `min`, `max`, and `autocomplete`.
  - Do not communicate required or optional fields through color alone.
- **Error Identification**:
  - Clearly identify invalid fields.
  - Use `aria-invalid="true"` when a field contains an error.
  - Associate relevant error messages using `aria-describedby`.
  - Ensure error messages explain what went wrong and how to correct it.
- **Validation Feedback**: Do not rely exclusively on color, icons, or visual styling to communicate validation results.
- **Error Summaries**: For forms with multiple errors, consider providing an error summary with links to the affected fields.
- **Submission Feedback**: Communicate successful submissions, processing states, and failures to assistive technologies where appropriate.
- **Custom Controls**: Custom dropdowns, date pickers, switches, and other controls must preserve accessible names, states, keyboard interaction, and focus behavior.

## 6. Screen Readers & Accessible Content

- **Image Alternatives**:
  - Provide descriptive `alt` text for informative images.
  - Use `alt=""` for purely decorative images.
  - Avoid redundant descriptions when adjacent text already communicates the same information.
  - For complex images such as charts and diagrams, provide an equivalent detailed text explanation.
- **Icon-Only Controls**: Provide accessible names for icon-only buttons and links. Do not assume an icon's visual meaning is sufficient.
- **Link Purpose**: Link text must communicate its destination or purpose. Avoid ambiguous labels such as "click here" when they do not provide sufficient context.
- **Screen Reader-Only Content**: Use established `.sr-only` or `.visually-hidden` utilities for context that should be available to assistive technologies but visually hidden.
- **Dynamic Content**: Announce meaningful asynchronous updates, such as submission results, loading completion, and status changes, without unnecessarily interrupting the user.
- **Language**: Set the document language using the appropriate `lang` attribute. Identify language changes within content where necessary.
- **Abbreviations and Instructions**: Ensure technical abbreviations, symbols, and instructions are understandable in context.

## 7. Visual Accessibility & Responsive Presentation

- **Text Contrast**: Meet WCAG AA contrast requirements:
  - Normal text: minimum 4.5:1.
  - Large text: minimum 3:1.
- **Non-Text Contrast**: Meaningful UI components, graphical objects, and visual states must meet the applicable 3:1 contrast requirement against adjacent colors.
- **Color Independence**: Never rely on color alone to communicate information, errors, status, or interaction states. Combine color with text, icons, patterns, or other visual indicators.
- **Text Resizing**: Support text resizing up to 200% without loss of content or functionality.
- **Reflow**: Ensure content remains usable at narrow viewport widths and high zoom levels without unnecessary horizontal scrolling.
- **Text Spacing**: Avoid fixed-height text containers that clip content when users adjust line height, letter spacing, or word spacing.
- **Responsive Layouts**: Ensure responsive changes do not hide essential content or make controls inaccessible.
- **Touch Targets**: Follow WCAG 2.2 target-size requirements. Aim for at least 24 × 24 CSS pixels for pointer targets, subject to the standard's exceptions; larger targets are preferable for usability.
- **Motion and Animation**:
  - Respect `prefers-reduced-motion`.
  - Avoid unnecessary flashing, excessive movement, and distracting animations.
  - Provide controls to pause, stop, or hide qualifying moving or automatically updating content.
  - Do not communicate essential information exclusively through animation.

## 8. Media, Audio & Video

- **Captions**: Provide synchronized captions for prerecorded video containing meaningful audio.
- **Live Captions**: Provide live captions for live audio content where required.
- **Transcripts**: Provide text alternatives for audio-only content and useful transcripts for multimedia where appropriate.
- **Audio Descriptions**: Ensure meaningful visual information in prerecorded video is available through audio description or an equivalent alternative when required.
- **Media Controls**: Use accessible native media controls or ensure custom controls support keyboard navigation and screen readers.
- **Autoplay**: Avoid automatically playing audio or video with sound. Provide appropriate controls for automatically moving content.

## 9. React & Component Implementation

- **Semantic Components**: Shared React components must preserve native HTML semantics and expose accessible properties through their public APIs.
- **Component Composition**: Ensure accessibility is not lost when components are wrapped, composed, or reused.
- **Refs and Focus**: Use refs to manage focus when necessary, such as focusing an invalid field or moving focus into a dialog.
- **Portals**: Components rendered through React portals must preserve correct focus management, accessible relationships, and modal behavior.
- **Controlled State**: Keep visual state, component behavior, and ARIA attributes synchronized.
- **Conditional Rendering**: Ensure dynamically mounted or removed elements do not leave focus in an invalid or inaccessible location.
- **Event Handling**: Do not rely exclusively on mouse events such as `onClick` attached to non-interactive elements. Prefer native controls and their built-in keyboard behavior.
- **Reusable Components**: Accessibility requirements must be built into shared components rather than repeatedly delegated to consuming pages.
- **Component APIs**: Avoid APIs that make it easy to omit essential accessibility information, such as accessible labels for icon-only controls.

## 10. Accessibility Testing & Validation

- **Automated Testing**: Use accessibility testing tools such as axe-core, jest-axe, or equivalent tooling where appropriate.
- **Component Testing**: Test accessible names, roles, states, relationships, validation messages, and keyboard behavior.
- **Keyboard Testing**: Manually verify navigation using Tab, Shift+Tab, Enter, Space, Escape, and relevant arrow-key interactions.
- **Screen Reader Testing**: Test important user flows with supported screen readers and browsers. Examples include NVDA with Firefox or Chrome, and VoiceOver with Safari.
- **Visual Testing**: Check color contrast, focus indicators, zoom, text resizing, reflow, and reduced-motion behavior.
- **Form Testing**: Verify labels, instructions, error associations, validation feedback, and successful submission announcements.
- **Regression Testing**: Include accessibility checks for shared components and critical user journeys in the test suite.
- **Manual Verification**: Do not treat automated scanner results as proof of WCAG conformance. Automated tools cannot detect every accessibility issue.
- **User-Centered Validation**: Where practical, validate important workflows with people who use assistive technologies.

## 11. Accessibility Review & Reporting

When reviewing frontend code for accessibility:

- Identify the affected component, page, or user flow.
- Explain the accessibility issue and its impact on users.
- Reference the relevant WCAG success criterion when applicable.
- Classify findings by severity:
  - **Critical**: A major barrier that prevents users from accessing essential functionality.
  - **High**: A significant accessibility issue affecting important interactions or content.
  - **Medium**: An issue that creates friction or makes an interaction unnecessarily difficult.
  - **Low**: A minor usability or consistency improvement.
- Provide actionable remediation guidance.
- Distinguish confirmed accessibility failures from potential risks that require manual verification.
- Do not report ARIA attributes as inherently beneficial; evaluate whether they improve or damage the actual accessibility experience.

## 12. Final Accessibility Checklist

Before considering an implementation complete, verify:

- [ ] Native semantic HTML is used wherever possible.
- [ ] Page landmarks and heading structure are logical.
- [ ] Every interactive element has an accessible name and appropriate semantics.
- [ ] All functionality is keyboard accessible.
- [ ] Focus order is predictable and focus indicators are visible.
- [ ] Dialogs and overlays manage focus correctly.
- [ ] ARIA roles, states, and relationships are valid and synchronized.
- [ ] Forms have accessible labels, instructions, and error feedback.
- [ ] Informative images have appropriate text alternatives.
- [ ] Dynamic updates are communicated to assistive technologies where necessary.
- [ ] Text and non-text contrast meet applicable WCAG AA requirements.
- [ ] Content remains usable with zoom, text resizing, and reflow.
- [ ] Motion and animation respect user preferences.
- [ ] Important workflows have been tested with automated and manual accessibility checks.
- [ ] No known critical or high-severity accessibility barriers remain.
