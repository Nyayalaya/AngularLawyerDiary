# LDMS Professional Color Theme & Design Guide

## 🎨 Color Palette

### Primary Colors
```css
/* Indigo/Purple Gradient */
--primary-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
--primary: #6366f1;
--primary-light: #818cf8;
--primary-dark: #4f46e5;
```

### Background Colors
```css
--bg-dark-primary: rgba(17, 24, 39, 0.98);    /* #111827 */
--bg-dark-secondary: rgba(10, 15, 25, 0.98);  /* #0a0f19 */
--bg-card: rgba(30, 41, 59, 0.95);            /* #1e2938 */
--bg-hover: rgba(51, 65, 85, 0.5);            /* #334155 */
--bg-subtle: rgba(99, 102, 241, 0.1);         /* Indigo tint */
```

### Text Colors
```css
--text-primary: #f3f4f6;      /* Light gray - primary text */
--text-secondary: #9ca3af;    /* Gray - secondary text */
--text-muted: #6b7280;        /* Dark gray - muted text */
```

### Status Colors
```css
--success: #10b981;           /* Emerald green */
--error: #ef4444;             /* Red */
--warning: #f59e0b;           /* Amber */
--info: #3b82f6;              /* Blue */
```

### Border & Accent
```css
--border: rgba(99, 102, 241, 0.15);  /* Subtle indigo border */
--border-hover: rgba(99, 102, 241, 0.3);  /* Slightly more visible */
```

---

## 🎯 Component Color Usage

### Navbar
- **Background**: Dark gradient (#111827 to #0a0f19)
- **Search Bar Border**: Indigo accent (#6366f1)
- **Icons**: Light indigo (#a5b4fc)
- **Profile Avatar**: Indigo gradient

### Sidebar
- **Background**: Dark gradient with subtle blue border
- **Active Menu**: Indigo gradient with left border indicator
- **Hover State**: Subtle indigo background
- **Brand Title**: Indigo gradient text

### Dashboard Cards
- **Stat Cards**: Dark background with indigo borders
- **Icon Wrappers**: Various gradients (Indigo, Blue, Green, Orange)
- **Hover Effect**: Elevation with indigo glow

### Activity Section
- **Activity Icons**: Indigo gradient
- **Item Borders**: Subtle indigo
- **Hover**: Increased indigo opacity

---

## 📐 Spacing & Layout Standards

### Card Padding
```css
--card-padding-large: 2rem;    /* Dashboard cards */
--card-padding-medium: 1.5rem; /* Standard elements */
--card-padding-small: 0.875rem; /* Compact elements */
```

### Border Radius
```css
--radius-lg: 18px;  /* Cards, major components */
--radius-md: 14px;  /* Medium elements */
--radius-sm: 10px;  /* Small buttons */
--radius-full: 50%; /* Avatars, circles */
```

### Gaps & Margins
```css
--gap-lg: 1.75rem;  /* Major sections */
--gap-md: 1.5rem;   /* Standard gap */
--gap-sm: 1rem;     /* Small gap */
```

---

## ✨ Animation & Effects

### Transitions
```css
--duration-fast: 0.2s ease-out;     /* Quick interactions */
--duration-standard: 0.3s ease;     /* Standard animations */
--duration-slower: 0.5s ease-in-out; /* Emphasis effects */
```

### Effects
- **Blur**: backdrop-filter: blur(20px)
- **Shadow**: 0 12px 48px rgba(0, 0, 0, 0.4)
- **Glow**: box-shadow with indigo color
- **Animation**: Subtle slide-down, fade-in, slide-in

---

## 🎭 Interactive States

### Buttons & Links
```css
/* Default */
background: rgba(99, 102, 241, 0.1);
border: 1px solid rgba(99, 102, 241, 0.15);

/* Hover */
background: rgba(99, 102, 241, 0.15);
border-color: rgba(99, 102, 241, 0.3);

/* Active*/
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
color: white;
```

### Dropdown Menu
```css
/* Opening animation */
animation: slideDown 0.2s ease-out;

/* Item hover */
background: rgba(99, 102, 241, 0.15);
color: #e0e7ff;
```

---

## 📱 Responsive Breakpoints

```css
/* Tablet & Down */
@media (max-width: 768px) {
  /* Sidebar becomes fixed overlay */
  /* Reduced padding on cards */
  /* Single column layouts */
}

/* Small Devices */
@media (max-width: 480px) {
  /* Minimal padding */
  /* Stack all elements vertically */
  /* Larger touch targets */
}
```

---

## 🔍 Component-Specific Guidelines

### Stat Cards
- **Icon Size**: 36px
- **Icon Wrapper**: 70px × 70px
- **Value Font**: 2.25rem, weight 800
- **Title Font**: 0.9rem, weight 500
- **Trend**: Small caps, color based on direction

### Menu Items
- **Active Indicator**: 3px left border
- **Padding**: 0.875rem 1rem
- **Font Size**: 0.95rem
- **Submenu Dots**: 4px diameter

### Activity Items
- **Icon**: 50px circle
- **Padding**: 1.25rem
- **Title Font**: 0.95rem, weight 600
- **Subtitle Font**: 0.85rem

---

## 🎨 Gradient Combinations

### Primary Gradients (Used Across App)
```css
/* Indigo to Violet */
linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)

/* Blue to Cyan */
linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)

/* Green */
linear-gradient(135deg, #10b981 0%, #059669 100%)

/* Orange/Amber */
linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)
```

---

## ♿ Accessibility

- **Color Contrast**: All text meets WCAG AA standards
- **Focus States**: Visible outline with 2px border
- **ARIA Labels**: Proper role attributes on interactive elements
- **Keyboard Navigation**: All elements keyboard accessible

---

## 🚀 Best Practices for Future Development

1. **Use consistent indigo (#6366f1)** for primary actions
2. **Maintain dark theme** for professional appearance
3. **Always include hover states** with indigo highlights
4. **Use subtle animations** (0.2s-0.3s) for interactions
5. **Keep cards with 18px radius** for consistency
6. **Maintain 2rem padding** on major cards
7. **Use gradient backgrounds** for visual depth
8. **Include backdrop blur** on modals and overlays

---

## 📝 File References

### CSS Files Updated
- `src/app/features/navbar/navbar.css`
- `src/app/features/sidebar/sidebar/sidebar.css`
- `src/app/features/dashboard/dashboard.css`

### Component Files Updated
- `src/app/features/navbar/navbar.ts`
- `src/app/features/navbar/navbar.html`

---

**Theme Version**: 1.0 Professional Edition
**Last Updated**: March 2, 2026
**Status**: Ready for Production ✅
