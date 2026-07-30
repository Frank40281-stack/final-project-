# Web Design Preference: Modern Science Simulator Theme (現代 PhET 扁平擬真風格)

This document outlines the user's layout and style preferences for clean, modern, and interactive educational simulator web applications in this workspace. All future AI agents modifying or creating simulators **MUST** follow these guidelines by default.

---

## 🎨 1. Core Color System (核心配色系統)

Always design with a **crisp light-gray/pure-white** background and **vibrant primary blue, active green, and accent orange** buttons. This creates a modern, high-contrast, and highly accessible user interface modeled after the PhET Colorado simulator aesthetic.

| Variable (CSS Token) | Light White Value | Color Description (色彩說明) |
| :--- | :--- | :--- |
| `--bg-dark-gray` | `#f8f9fa` | Main background: Clean light slate/gray (乾淨現代淺灰背景) |
| `--bg-deep-ink` | `#ffffff` | Component background: Pure white (純白板塊) |
| `--bg-card` | `#ffffff` | Card background: Solid card white (純白卡片) |
| `--text-primary` | `#1e293b` | Body typography: Dark slate gray (深石板灰) |
| `--text-secondary` | `#475569;` | Muted typography: Medium slate gray (中石板灰) |
| `--text-gold` | `#0056cc` | Accent text: Primary PhET blue (經典藍) |
| `--vermilion` | `#0056cc` | Primary buttons: Simulator blue (經典藍) |
| `--gold-primary` | `#0a84ff` | Interactive borders: Active bright blue (高亮藍色) |
| `--gold-border` | `#cbd5e1` | Card borders: Medium light gray border (簡約淺灰邊框) |
| `--phet-orange` | `#df5c00` | Secondary buttons / Warnings: PhET orange (橙色) |
| `--phet-green` | `#28a745` | Play state / Submits: Success green (實驗綠色) |

---

## 🛠️ 2. CSS Snippets (CSS 程式碼範例)

Include these styling conventions in the main stylesheet (`styles.css`):

```css
/* 1. Base root variables */
:root {
    --bg-dark-gray: #f8f9fa;
    --bg-deep-ink: #ffffff;
    --bg-card: #ffffff;
    --bg-glass: rgba(255, 255, 255, 0.95);
    --text-primary: #1e293b;
    --text-secondary: #475569;
    --text-gold: #0056cc;
    --vermilion: #0056cc;
    --vermilion-glow: rgba(0, 86, 204, 0.1);
    --gold-primary: #0a84ff;
    --gold-dark: #0048ab;
    --gold-glow: rgba(10, 132, 255, 0.05);
    --gold-border: #cbd5e1;
    --phet-orange: #df5c00;
    --phet-green: #28a745;
    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    --border-radius: 10px;
    --transition: all 0.2s ease-in-out;
}

/* 2. Interactive Canvas Grid (網格坐標紙背景) */
#clustering-canvas {
    display: block;
    width: 100%;
    height: auto;
    cursor: crosshair;
    background-color: #ffffff;
    background-image: linear-gradient(#f0f4f8 1px, transparent 1px),
                      linear-gradient(90deg, #f0f4f8 1px, transparent 1px);
    background-size: 25px 25px;
}

/* 3. PhET-style Navigation Tabs */
.tabs {
    display: inline-flex;
    background: #e2e8f0;
    border: 1px solid #cbd5e1;
    padding: 4px;
    border-radius: 8px;
}

.tab-btn {
    background: transparent;
    border: none;
    padding: 8px 20px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 6px;
    transition: var(--transition);
}

.tab-btn.active {
    background: #ffffff;
    color: var(--vermilion);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
```

---

## 🗂️ 3. Portfolio Card Integration (作品集卡片微調)

When adding a project link with light-white backgrounds in `app.js` of the portfolio:
* **Background Gradient Overlay**: Set the gradient overlay of the card to be bright and semi-transparent.
* **Text Contrast**: Apply the `.card-img-placeholder.project-id` override to guarantee that text/icon elements are styled with `#1f1f1f` dark slate for readability.

**`app.js` Configuration:**
```javascript
{
    id: 'my-project-id',
    nameZh: '扁平專案名稱',
    color: '#9e2a2b',
    bgStyle: {
        background: 'linear-gradient(135deg, #fdfcf7 0%, #f5f0e3 100%)'
    }
}
```

**Portfolio `styles.css` Class Overrides:**
```css
/* Color icons and text dark dynamically for light white/gray cards in the gallery */
.card-img-placeholder.my-project-id {
    color: #1f1f1f;
}
.card-img-placeholder.my-project-id i,
.card-img-placeholder.my-project-id span {
    color: #1f1f1f;
}
```

---

*Use these guidelines to create modern, highly interactive, accessible, and clean science-simulator applications automatically.*
