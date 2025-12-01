# Quick View Widget & Persistent Display

**Priority**: P2 (Medium) | **Category**: User Experience | **Estimated Effort**: Medium | **Phase**: 2

## Problem Statement

Currently, users must:
1. Navigate to their card detail page
2. Wait for data to load
3. Click the "Subcaps" button
4. View the overlay

This multi-step process creates friction for users who want to quickly check their progress. Power users check their subcaps frequently throughout the day and find the current UX tedious.

## Proposed Solution

Add a persistent, minimized widget that shows subcap progress on all HeyMax pages:

1. **Mini widget** - Small, always-visible display in corner of page
2. **Quick preview** - Hover to see progress bars without clicking
3. **Expand on click** - Click to open full overlay
4. **Minimize option** - User can collapse widget when not needed
5. **Multi-page** - Widget visible on any HeyMax page, not just card details

## User Stories

### Story 1: Persistent Mini Widget
**As a** frequent HeyMax user  
**I want** a small widget always visible showing my subcap progress  
**So that** I can check my status without navigating and clicking

**Acceptance Criteria:**
- [ ] Mini widget appears in bottom-right corner (configurable position)
- [ ] Shows card icon and percentage (e.g., "PPV: 75%")
- [ ] Color-coded: Green (<80%), Yellow (80-95%), Red (>95%)
- [ ] Visible on all HeyMax pages (cards list, transactions, rewards, etc.)
- [ ] Does not obstruct page content
- [ ] Collapses to icon-only mode if user prefers
- [ ] Smooth fade-in animation on page load
- [ ] Mobile-responsive (smaller on Edge Mobile)
- [ ] Z-index ensures visibility above other elements
- [ ] Persists scroll position (stays in corner when scrolling)

### Story 2: Hover Preview
**As a** user who wants quick info  
**I want** to hover over the mini widget to see progress bars  
**So that** I get details without opening the full overlay

**Acceptance Criteria:**
- [ ] Hover tooltip appears on desktop within 300ms
- [ ] Tooltip shows mini progress bars for each bucket
- [ ] Format: "Contactless: $450 / $600 (75%)" with small bar
- [ ] Includes days until reset (if #04 implemented)
- [ ] Tooltip auto-positions (above/below widget to avoid edge)
- [ ] Touch-equivalent on mobile: Tap widget shows tooltip, tap away closes
- [ ] Tooltip dismisses on mouse leave (desktop) or outside tap (mobile)
- [ ] Smooth fade-in/out animation
- [ ] Tooltip does not interfere with clicking to expand

### Story 3: Quick Expand & Collapse
**As a** user who needs full details  
**I want** to expand the widget to full overlay with one click  
**So that** I can access complete information quickly

**Acceptance Criteria:**
- [ ] Click on mini widget opens full overlay
- [ ] Expand animation: widget smoothly transitions to overlay
- [ ] Overlay content same as current "Subcaps" button overlay
- [ ] Close button in overlay returns to mini widget state
- [ ] Keyboard shortcut: Esc closes overlay, returns to widget
- [ ] Widget remembers state (collapsed vs expanded) between pages
- [ ] Fast transition (<200ms) for responsive feel
- [ ] Works on mobile touch events

### Story 4: Widget Settings & Customization
**As a** user who wants control  
**I want** to customize the widget appearance and behavior  
**So that** it matches my preferences and workflow

**Acceptance Criteria:**
- [ ] Settings accessible via gear icon on widget
- [ ] Position options: Bottom-right, bottom-left, top-right, top-left
- [ ] Size options: Small, medium, large
- [ ] Display mode: Always show, icon-only, auto-hide
- [ ] Auto-hide: Widget fades to edge after 3 seconds idle, expands on hover
- [ ] Color theme: Match HeyMax theme or custom color
- [ ] Multi-card support: Dropdown to switch between cards
- [ ] Opacity adjustment (50%-100%)
- [ ] "Hide on this page" option for specific URLs
- [ ] Settings persist in local storage

### Story 5: Multi-Page Consistency
**As a** user browsing different HeyMax pages  
**I want** the widget to follow me across pages  
**So that** I always have access to my subcap info

**Acceptance Criteria:**
- [ ] Widget appears on all HeyMax pages (not just card details)
- [ ] Widget injects early enough to appear on initial page load
- [ ] Data updates when navigating between pages
- [ ] Widget state (expanded/collapsed) persists across navigation
- [ ] If user has multiple cards, shows currently selected card
- [ ] Smooth transitions when switching cards in widget dropdown
- [ ] No flickering or duplicate widgets during page transitions
- [ ] Performance: Widget adds <50ms to page load time

## Out of Scope

**Not included in this feature:**
- Widget on non-HeyMax websites
- Mobile app version (no app exists)
- Widget sync across multiple browsers/devices
- Widget customization of content (beyond settings)
- Third-party widget integrations
- Widget-based notifications (see #02 Smart Notifications)

## Privacy & Security Considerations

**Privacy-First Approach:**
- ✅ All widget data from local storage (no external requests)
- ✅ Widget appearance stored locally
- ✅ No tracking of widget usage
- ✅ Minimal DOM manipulation (security)
- ✅ No external CSS or JS loaded for widget

## Technical Considerations

### Widget HTML Structure
```html
<div id="heymax-subcaps-widget" class="minimized">
  <div class="widget-header">
    <span class="card-icon">💳</span>
    <span class="progress-text">PPV: 75%</span>
    <button class="settings-btn">⚙️</button>
  </div>
  <div class="widget-tooltip" style="display: none;">
    <!-- Hover preview content -->
  </div>
</div>
```

### CSS for Positioning
```css
#heymax-subcaps-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

#heymax-subcaps-widget.auto-hide {
  right: -60px; /* Slide off screen */
}

#heymax-subcaps-widget.auto-hide:hover {
  right: 20px; /* Slide back */
}
```

### Multi-Page Injection
```javascript
// Inject widget on any HeyMax page
function initWidget() {
  if (window.location.hostname === 'heymax.ai') {
    if (!document.getElementById('heymax-subcaps-widget')) {
      const widget = createWidget();
      document.body.appendChild(widget);
      attachEventListeners();
    }
  }
}

// Re-init on SPA navigation
window.addEventListener('popstate', initWidget);
```

## Risks & Considerations

**Risks:**
- **Page layout interference** - Widget might cover important content
  - *Mitigation*: User-configurable position, auto-hide option, z-index management
- **Performance impact** - Widget on every page could slow load time
  - *Mitigation*: Lazy load, minimal DOM, efficient data access, monitor performance
- **SPA navigation** - HeyMax might use single-page app patterns
  - *Mitigation*: Listen for navigation events, re-inject if needed
- **Design clash** - Widget might look out of place on HeyMax
  - *Mitigation*: Match HeyMax design system, offer themes

**Trade-offs:**
- Visibility vs intrusion - Default to small, offer auto-hide
- Features vs simplicity - MVP focuses on mini display + expand
- Customization vs complexity - Essential settings only

## Dependencies

**Recommended:**
- #02 Smart Notifications - Widget could show notification badges
- #04 Multi-Period Tracking - Widget shows period-aware progress

## Success Metrics

**Adoption:**
- % of users who enable widget (if opt-in)
- Widget position preferences distribution
- Auto-hide vs always-visible preference

**Engagement:**
- Widget interaction rate (hovers, clicks per session)
- Time saved vs opening full overlay
- Pages where widget most frequently used

**Satisfaction:**
- User feedback on widget usefulness
- Widget dismissal rate (users hiding it)
- Comparison: widget users vs overlay-only users

## Implementation Notes

### Phase 1: Basic Mini Widget (MVP)
- Create widget HTML/CSS
- Inject on card details page only
- Show simple percentage display
- Click to open full overlay

### Phase 2: Hover Preview
- Add tooltip on hover
- Show mini progress bars
- Test positioning logic

### Phase 3: Multi-Page Support
- Expand to all HeyMax pages
- Handle SPA navigation
- Test performance impact

### Phase 4: Customization
- Add settings panel
- Implement position options
- Add auto-hide feature
- Add multi-card dropdown

## UI Mockups

### Mini Widget (Minimized)
```
┌─────────────┐
│ 💳 PPV: 75% │
└─────────────┘
```

### Hover Tooltip
```
┌─────────────────────────────┐
│ UOB PPV Subcaps             │
│ ────────────────────────── │
│ Contactless: ████████░░ 75% │
│ $450 / $600                 │
│                             │
│ Online: ██████████░ 53%     │
│ $320 / $600                 │
│                             │
│ 📅 8 days until reset       │
└─────────────────────────────┘
```

### Settings Panel
```
┌─────────────────────────────┐
│ Widget Settings             │
│ ────────────────────────── │
│ Position: [Bottom-right ▾]  │
│ Size: [Medium ▾]            │
│ Display: [Always show ▾]    │
│ Opacity: ████░░░░░░ 80%     │
│                             │
│ [Save]           [Cancel]   │
└─────────────────────────────┘
```

## Related Issues

- Complements: #02 Smart Notifications (badge integration)
- Enhances: #04 Multi-Period Tracking (shows period info)
- Alternative to: Current overlay-only approach

---

**Status**: Proposed  
**Last Updated**: 2025-12-01  
**Author**: Product Manager
