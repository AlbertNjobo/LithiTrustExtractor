# LithiTrust Blockchain Traceability Platform - Design Guidelines

## Design Approach
**System-Based Approach**: Carbon Design System principles for enterprise blockchain applications, adapted for sustainability and transparency focus. This platform serves government regulators, miners, processors, and international buyers - trust, data clarity, and professional credibility are paramount.

## Typography System

**Font Families** (Google Fonts):
- Primary: Inter (400, 500, 600, 700) - UI text, data tables, forms
- Display: Space Grotesk (600, 700) - Headlines, statistics, emphasis
- Monospace: JetBrains Mono (400, 500) - Blockchain hashes, batch IDs, technical data

**Hierarchy**:
- Hero Headlines: Space Grotesk 700, 3.5rem (desktop), 2rem (mobile)
- Page Titles: Space Grotesk 600, 2rem
- Section Headers: Inter 600, 1.5rem
- Card Titles: Inter 600, 1.125rem
- Body Text: Inter 400, 1rem, leading-relaxed
- Captions/Metadata: Inter 400, 0.875rem, text-gray-600
- Technical Data: JetBrains Mono 400, 0.875rem

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-8, mt-12)

**Grid Structure**:
- Dashboard: 12-column grid with 16px gutters
- Max container width: max-w-7xl for main content
- Sidebar navigation: Fixed 280px width (desktop), collapsible (mobile)
- Card grids: 3 columns (lg), 2 columns (md), 1 column (sm)

**Vertical Rhythm**: py-16 for major sections, py-8 for cards/components, py-4 for dense data areas

## Component Library

### Navigation & Layout
- **Top Bar**: Fixed header with logo, global search, notifications, user profile. Height: h-16, backdrop-blur-lg with border-b
- **Sidebar Navigation**: Collapsible menu with icons + labels, active state indicators, grouped by role (Miner, Processor, Regulator views)
- **Breadcrumbs**: Show current location in supply chain hierarchy

### Data Display
- **Batch Cards**: Elevated cards (shadow-md) showing batch ID, status badge, origin mine, current stage, QR code thumbnail. Grid layout with hover lift effect
- **Status Badges**: Pill-shaped with icon prefixes (Mining, Processing, Export, Verified). Size: px-3 py-1, rounded-full
- **Data Tables**: Striped rows, sticky headers, sortable columns, pagination footer. Dense mode for regulators
- **Timeline Component**: Vertical supply chain journey with checkpoints, timestamps, stakeholder signatures

### Forms & Input
- **Batch Registration Form**: Multi-step wizard (Mine Details → ESG Data → Verification). Progress indicator at top
- **File Uploads**: Drag-drop zones for ESG documents (PDFs, images), preview thumbnails
- **Location Picker**: Map integration for mine coordinates with autocomplete address
- **Dropdown Selects**: Searchable for long lists (mining companies, processors)

### Verification & Security
- **QR Code Display**: Large, scannable code (256x256px minimum) with download/print buttons
- **Blockchain Hash Display**: Monospace text in bordered container, copy-to-clipboard button
- **Verification Badge**: Shield icon with checkmark, green accent, tooltip explaining verification
- **Chain of Custody Viewer**: Interactive flowchart showing all handoffs with signatures

### Dashboards & Analytics
- **Stats Cards**: Large numbers with trend indicators (↑ 12% from last month), icons representing metric type
- **ESG Compliance Gauge**: Circular progress indicators for environmental, social, governance scores
- **Supply Chain Map**: Geographic visualization of batch origins to destinations
- **Activity Feed**: Real-time updates of new batches, stage transitions, verifications

### Overlays & Modals
- **Batch Detail Modal**: Full-screen overlay with tabs (Overview, ESG Data, Documents, History)
- **QR Scanner**: Camera access interface for mobile verification
- **Alert Notifications**: Toast messages for successful operations (batch registered, verified, etc.)

## Images

**Hero Section**: Large hero image (min-height: 70vh) showing Zimbabwe lithium mining operations - artisanal miners working with ore, solar panels in background representing green energy future. Overlay with semi-transparent dark gradient (from bottom). Place main CTA and value proposition text over blurred background panels.

**Additional Images**:
- Dashboard background: Subtle lithium crystal texture pattern, very low opacity
- Empty states: Illustrations of mining equipment, blockchain nodes, or supply chain diagrams
- ESG section: Photos of community development projects, environmental rehabilitation
- About/Mission section: Team working with miners in rural Zimbabwe

## Animations

**Minimal, Purposeful Only**:
- Card hover: Subtle lift (translateY -2px) with shadow increase, 200ms ease
- Status badge transitions: Fade between states when batch moves through supply chain
- Loading states: Skeleton screens for data tables, pulsing for cards
- QR code generation: Brief fade-in when generated
- NO scroll animations, NO parallax, NO decorative motion

## Design Principles

1. **Transparency First**: Every data point should be easily verifiable, traceable, and understandable
2. **Professional Credibility**: Enterprise-grade polish that inspires trust from international buyers and regulators
3. **Accessibility for All Users**: Works for artisanal miners with basic smartphones AND corporate buyers with high-end devices
4. **Data Density Balance**: Dense information where needed (regulator dashboards) with spacious, guided flows for miners
5. **Sustainability Visual Language**: Green accents represent eco-friendly practices, but avoid heavy-handed "eco" clichés