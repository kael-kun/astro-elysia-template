# Frontend Agent Guide - Astro Component Library

## Overview

This document guides agents to create consistent, efficient UI features based on existing components in this Astro project with Tailwind CSS.

## Design System

- **Framework:** Astro with Tailwind CSS
- **Color Palette:** Neutral (gray) scale with semantic colors (green, yellow, red, blue)
- **Dark Mode:** Fully supported via `dark:` Tailwind prefix
- **Icons:** Inline SVG only

---

## Component Library

### 1. Button

**Location:** `src/components/ui/Button.astro`

| Prop     | Type                                             | Default   | Description                         |
| -------- | ------------------------------------------------ | --------- | ----------------------------------- |
| variant  | "primary" \| "secondary" \| "outline" \| "ghost" | "primary" | Visual style                        |
| size     | "sm" \| "md" \| "lg"                             | "md"      | Button size                         |
| href     | string                                           | -         | Convert to link button              |
| type     | "button" \| "submit" \| "reset"                  | "button"  | Button type                         |
| disabled | boolean                                          | false     | Disabled state                      |
| onclick  | string                                           | -         | Inline onclick handler              |
| ...rest  | -                                                | -         | Passes data-_ and aria-_ attributes |

**Styling:**

- Modern with `cursor-pointer`, `active:scale-95`
- `hover:shadow-md` for primary, `hover:shadow-sm` for others
- Focus rings with `focus:ring-2`
- Dark mode support

**Usage:**

```astro
<!-- Basic button -->
<Button variant="primary" size="md">Click Me</Button>

<!-- With onclick -->
<Button variant="primary" onclick="doSomething()">Click Me</Button>

<!-- Link button -->
<Button variant="outline" href="/page">Go to Page</Button>

<!-- Small ghost button -->
<Button variant="ghost" size="sm">Small</Button>

<!-- Disabled button -->
<Button variant="primary" disabled>Disabled</Button>
```

---

### 2. Modal

**Location:** `src/components/ui/Modal.astro`

| Prop                | Type                           | Default   | Description                       |
| ------------------- | ------------------------------ | --------- | --------------------------------- |
| id                  | string                         | required  | Unique modal identifier           |
| title               | string                         | -         | Modal header title                |
| size                | "sm" \| "md" \| "lg" \| "full" | "md"      | Modal width                       |
| triggerLabel        | string                         | -         | If provided, shows trigger button |
| triggerVariant      | Button variant                 | "primary" | Trigger button style              |
| triggerSize         | Button size                    | "md"      | Trigger button size               |
| showHeader          | boolean                        | true      | Show/hide header and close button |
| loading             | boolean                        | false     | Show loading spinner              |
| loadingText         | string                         | -         | Text below spinner                |
| display             | boolean                        | false     | true=visible, false=hidden        |
| closeOnOverlayClick | boolean                        | true      | Close when clicking outside       |
| closeOnEscape       | boolean                        | true      | Close on Escape key               |

**Slots:**

- `default` - Modal body content
- `footer` - Action buttons

**Global Functions (available globally):**

```javascript
openModal("modal-id"); // Show modal
closeModal("modal-id"); // Hide modal
```

**Usage:**

```astro
<!-- With trigger button -->
<Modal id="my-modal" title="My Modal" triggerLabel="Open">
  <p>Content here</p>
</Modal>

<!-- Hidden, controlled programmatically -->
<Modal id="loading" display={false} loading={true} loadingText="Processing...">
  <p>Please wait...</p>
</Modal>

<!-- Without header (for loading/processing) -->
<Modal id="processing" display={false} showHeader={false} loading={true} loadingText="Processing...">
  <p>Transaction ID: #12345</p>
</Modal>

<!-- With footer actions -->
<Modal id="confirm" title="Confirm Action" triggerLabel="Confirm">
  <p>Are you sure?</p>
  <Button slot="footer" variant="ghost" data-modal-close="confirm">Cancel</Button>
  <Button slot="footer" variant="primary">Confirm</Button>
</Modal>

<!-- Control via JavaScript -->
<Button onclick="openModal('loading')">Show Loading</Button>
<Button onclick="closeModal('loading')">Hide Loading</Button>
```

---

### 3. Input

**Location:** `src/components/ui/Input.astro`

| Prop        | Type                                                                      | Default | Description                            |
| ----------- | ------------------------------------------------------------------------- | ------- | -------------------------------------- |
| type        | "text" \| "email" \| "password" \| "number" \| "tel" \| "url" \| "search" | "text"  | Input type                             |
| name        | string                                                                    | -       | Input name                             |
| id          | string                                                                    | -       | Input id                               |
| placeholder | string                                                                    | -       | Placeholder text                       |
| value       | string                                                                    | -       | Input value                            |
| required    | boolean                                                                   | false   | Required field                         |
| disabled    | boolean                                                                   | false   | Disabled state                         |
| error       | string                                                                    | -       | Error message to display               |
| invalid     | boolean                                                                   | false   | Invalid state (red border, no message) |

**Features:**

- Error state with red border and icon + message
- Accessibility: aria-invalid, aria-describedby
- Dark mode support

**Usage:**

```astro
<!-- Basic input -->
<Input placeholder="Enter name..." />

<!-- Required field -->
<Input placeholder="Required field" required />

<!-- With error message -->
<Input error="This field is required" placeholder="Enter name..." />

<!-- Email with validation -->
<Input type="email" error="Invalid email format" placeholder="email@example.com" />

<!-- Invalid without message -->
<Input invalid={true} placeholder="Invalid field" />

<!-- Disabled -->
<Input disabled placeholder="Disabled input" />
```

---

### 4. Card

**Location:** `src/components/ui/Card.astro`

| Prop  | Type   | Default | Description        |
| ----- | ------ | ------- | ------------------ |
| class | string | -       | Additional classes |

**Styling:**

- `bg-white` / `dark:bg-neutral-900`
- `rounded-xl`
- `shadow-sm` default, `hover:shadow-md` on hover
- `transition-shadow duration-200`
- `p-6` padding

**Usage:**

```astro
<Card>
  <p>Card content</p>
</Card>

<!-- With additional classes -->
<Card class="mt-4">
  <p>Card with margin</p>
</Card>
```

---

### 5. Badge

**Location:** `src/components/ui/Badge.astro`

| Prop    | Type                                                     | Default   | Description        |
| ------- | -------------------------------------------------------- | --------- | ------------------ |
| variant | "default" \| "success" \| "warning" \| "error" \| "info" | "default" | Color style        |
| class   | string                                                   | -         | Additional classes |

**Colors:**
| Variant | Light Mode | Dark Mode |
|---------|------------|-----------|
| default | bg-neutral-100 text-neutral-800 | bg-neutral-800 text-neutral-200 |
| success | bg-green-100 text-green-800 | bg-green-900/30 text-green-400 |
| warning | bg-yellow-100 text-yellow-800 | bg-yellow-900/30 text-yellow-400 |
| error | bg-red-100 text-red-800 | bg-red-900/30 text-red-400 |
| info | bg-blue-100 text-blue-800 | bg-blue-900/30 text-blue-400 |

**Usage:**

```astro
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
```

---

### 6. Container

**Location:** `src/components/ui/Container.astro`

| Prop  | Type                                   | Default | Description        |
| ----- | -------------------------------------- | ------- | ------------------ |
| size  | "sm" \| "md" \| "lg" \| "xl" \| "full" | "lg"    | Max-width          |
| class | string                                 | -       | Additional classes |

**Sizes:**
| Size | Max Width |
|------|-----------|
| sm | max-w-2xl |
| md | max-w-4xl |
| lg | max-w-6xl |
| xl | max-w-7xl |
| full | max-w-full |

**Usage:**

```astro
<Container>
  <p>Content</p>
</Container>

<Container size="md">
  <p>Narrower content</p>
</Container>
```

---

## Base Components

### Heading

**Location:** `src/components/base/Heading.astro`

| Prop  | Type                                         | Default | Description        |
| ----- | -------------------------------------------- | ------- | ------------------ |
| as    | "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" | "h1"    | Heading level      |
| class | string                                       | -       | Additional classes |

**Usage:**

```astro
<Heading as="h1">Main Title</Heading>
<Heading as="h2" class="mb-4">Section Title</Heading>
```

---

### Text

**Location:** `src/components/base/Text.astro`

| Prop    | Type                         | Default | Description        |
| ------- | ---------------------------- | ------- | ------------------ |
| variant | "small" \| "base" \| "large" | "base"  | Text size          |
| class   | string                       | -       | Additional classes |

**Usage:**

```astro
<Text variant="small">Small text</Text>
<Text variant="base">Base text</Text>
<Text variant="large">Large text</Text>
```

---

### Base

**Location:** `src/components/base/Base.astro`

Wrapper component for page content with consistent styling.

**Usage:**

```astro
<Base>
  <Container>
    <p>Page content</p>
  </Container>
</Base>
```

---

## Component Creation Guidelines

### Always Follow:

1. **Import from ui/** - Use existing Button, Modal, Input components
2. **Tailwind classes** - Use existing color/variant patterns from components
3. **Dark mode** - Always include `dark:` variants
4. **Accessibility** - Use aria-\* attributes appropriately
5. **Slots** - Use `<slot />` for content projection
6. **Props interface** - Define TypeScript interface for type safety

### Avoid:

1. Creating new button/modal/input components - extend existing ones
2. Hardcoding colors - use neutral-\* scale
3. Missing dark: variants
4. Using external icon libraries - use inline SVG

---

## Common Patterns

### Adding new props to existing components:

```astro
---
interface Props {
  variant?: "primary" | "secondary";
  class?: string;
  ...rest  // Capture extra attributes
}

const { variant = "primary", class: className, ...rest } = Astro.props;
---

<button {...rest} class:list={["base-class", className]}>
  <slot />
</button>
```

### Conditional rendering:

```astro
{condition && <Component />}

{condition ? <ComponentA /> : <ComponentB />}
```

### Slots:

```astro
<slot />           // default slot
<slot name="footer" />  // named slot
```

### Passing slot to another component:

```astro
<Modal>
  <Text>Modal content</Text>
  <Button slot="footer" variant="primary">OK</Button>
</Modal>
```

---

## Import Paths

All UI components are in `src/components/ui/`:

```astro
import Button from '../components/ui/Button.astro';
import Modal from '../components/ui/Modal.astro';
import Input from '../components/ui/Input.astro';
import Card from '../components/ui/Card.astro';
import Badge from '../components/ui/Badge.astro';
import Container from '../components/ui/Container.astro';

import Heading from '../components/base/Heading.astro';
import Text from '../components/base/Text.astro';
import Base from '../components/base/Base.astro';
```

---

## Quick Reference

| Component | When to Use                            |
| --------- | -------------------------------------- |
| Button    | All clickable actions                  |
| Modal     | Dialogs, confirmations, loading states |
| Input     | Form fields with validation            |
| Card      | Grouping related content               |
| Badge     | Status indicators, labels              |
| Container | Page layout constraints                |
| Heading   | Section titles                         |
| Text      | Paragraph text                         |
| Base      | Page wrapper                           |

---

## Notes

- All components support dark mode via Tailwind's `dark:` prefix
- Use neutral-\* colors for consistency
- Modal functions (`openModal`, `closeModal`) are globally available
- Button uses `...rest` to pass through data-_ and aria-_ attributes
- Input automatically handles error display and accessibility
