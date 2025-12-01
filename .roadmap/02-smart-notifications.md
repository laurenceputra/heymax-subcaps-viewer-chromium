# Smart Notifications & Progress Alerts

**Priority**: P1 (High) | **Category**: User Experience | **Estimated Effort**: Medium | **Phase**: 1

## Problem Statement

Users currently have to manually check the subcaps overlay to know their spending progress. They miss opportunities to:
- **Optimize spending** - Don't know when they're close to subcap limits
- **Avoid wasted rewards** - Exceed limits without realizing, missing bonus miles
- **Plan purchases** - Can't proactively manage remaining subcap capacity
- **Catch milestones** - Miss important thresholds (e.g., UOB VS $1,000 minimum)

This passive approach means users either over-check (wasting time) or under-check (missing optimization opportunities).

## Proposed Solution

Add non-intrusive notifications that alert users to important subcap milestones:

1. **Visual badge on button** - Show progress indicator without opening overlay
2. **Browser notifications** - Optional desktop/mobile notifications for key thresholds
3. **In-page alerts** - Subtle banners on HeyMax when important events occur
4. **Customizable thresholds** - Let users set their own alert preferences

## User Stories

### Story 1: Visual Progress Indicator on Button
**As a** user browsing HeyMax  
**I want** to see my subcap progress at a glance  
**So that** I don't have to open the overlay every time

**Acceptance Criteria:**
- [ ] Subcaps button shows colored progress ring/badge
- [ ] Colors match existing scheme: Green (<80%), Yellow (80-100%), Red (>100%)
- [ ] For UOB VS, yellow indicates below $1,000 threshold
- [ ] Percentage or fraction displayed on hover (e.g., "$450 / $600")
- [ ] Updates automatically when transaction data refreshes
- [ ] Works on mobile (Edge Mobile) with appropriate sizing
- [ ] Badge does not obstruct "Subcaps" button text
- [ ] Smooth color transitions (no jarring changes)

### Story 2: Browser Notification System
**As a** user managing multiple cards and expenses  
**I want** to receive notifications when I hit important thresholds  
**So that** I can optimize my spending without constantly checking

**Acceptance Criteria:**
- [ ] Opt-in notification permission request (not automatic)
- [ ] Notification triggers at: 50%, 75%, 90%, 100% of subcap limit
- [ ] UOB VS: Special notification at $1,000 threshold
- [ ] Notifications include: Card type, bucket name, current amount, limit
- [ ] User can enable/disable notifications in settings
- [ ] User can customize threshold percentages
- [ ] Notification sounds optional (default: silent)
- [ ] Notifications work on desktop browsers
- [ ] Notifications work on Edge Mobile (if supported)
- [ ] "Snooze for today" option to avoid spam
- [ ] Maximum 1 notification per threshold per day

### Story 3: In-Page Progress Banners
**As a** user viewing my card details on HeyMax  
**I want** to see important subcap alerts inline  
**So that** I'm informed without leaving the page

**Acceptance Criteria:**
- [ ] Banner appears at top of card details page
- [ ] Shows most urgent alert (prioritized by importance)
- [ ] Banner types: Info (milestone reached), Warning (approaching limit), Alert (exceeded limit)
- [ ] Dismissible with "X" button
- [ ] Reappears on next page load if still relevant
- [ ] Does not block critical page content
- [ ] Responsive design works on mobile
- [ ] Banner examples:
  - "🎉 Milestone: You've reached $500 in contactless spending!"
  - "⚠️ Alert: You're at 90% of your online subcap ($540 / $600)"
  - "🚨 Limit Reached: Your contactless bucket is full at $600"
  - "📊 UOB VS Update: Spend $200 more to unlock bonus miles"

### Story 4: Notification Settings
**As a** power user who wants control  
**I want** to customize when and how I'm notified  
**So that** notifications match my preferences

**Acceptance Criteria:**
- [ ] Settings panel accessible from subcaps overlay
- [ ] Toggle: Enable/disable browser notifications
- [ ] Toggle: Enable/disable in-page banners
- [ ] Toggle: Enable/disable button badge
- [ ] Threshold customization: Set percentages for each alert level
- [ ] Per-bucket settings: Customize alerts for contactless vs online/foreign
- [ ] Notification frequency: Limit to once per day per threshold
- [ ] "Quiet hours" - disable notifications during specific times
- [ ] Settings persist in local storage
- [ ] Reset to defaults button
- [ ] Settings work independently for multiple cards

## Out of Scope

**Not included in this feature:**
- Email or SMS notifications (requires external service, privacy violation)
- Push notifications via mobile app (no app exists)
- Notification history log (future enhancement)
- Predictive notifications ("you'll hit limit by Friday") - see #05 Spending Projections
- Social sharing of milestones
- Integration with calendar or task management apps

## Privacy & Security Considerations

**Privacy-First Approach:**
- ✅ All notification logic runs locally in browser
- ✅ No external notification services or APIs
- ✅ Browser notifications use native API only
- ✅ No data transmitted to external servers
- ✅ Settings stored locally (GM_setValue)
- ✅ User must opt-in to browser notifications
- ✅ Notifications do not include sensitive merchant details

**Security:**
- ✅ Notification permission requested explicitly
- ✅ Notifications cannot execute code or scripts
- ✅ No persistent notification badges that leak info

## Technical Considerations

### Browser Notification API
```javascript
// Request permission
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    new Notification('HeyMax SubCaps', {
      body: 'You've reached 75% of your contactless limit',
      icon: '/favicon.ico',
      tag: 'subcaps-alert'
    });
  }
});
```

### Progress Badge Implementation
- Use CSS for circular progress indicator
- SVG for scalable graphics
- Update via DOM manipulation when data changes

### Settings Storage Structure
```javascript
{
  notifications: {
    enabled: true,
    thresholds: [50, 75, 90, 100],
    quietHours: { start: '22:00', end: '08:00' },
    frequency: 'once-per-day',
    perBucket: {
      contactless: { enabled: true },
      online: { enabled: true },
      foreignCurrency: { enabled: true }
    }
  }
}
```

## Risks & Considerations

**Risks:**
- **Notification fatigue** - Too many alerts annoy users
  - *Mitigation*: Default to important thresholds only, once per day max
- **Browser compatibility** - Notification API support varies
  - *Mitigation*: Feature detection, graceful degradation, fallback to in-page alerts
- **Mobile limitations** - Edge Mobile notification behavior may differ
  - *Mitigation*: Test thoroughly, provide alternative (button badge)
- **Timing accuracy** - Notifications depend on when user visits HeyMax
  - *Mitigation*: Set expectations that notifications appear when browsing, not real-time

**Trade-offs:**
- Notification frequency vs user annoyance - Chose conservative defaults
- Feature complexity vs simplicity - Phased approach (MVP → Advanced settings)

## Dependencies

**Optional but complementary:**
- #01 Data Export & History - Historical data helps determine notification timing
- #04 Multi-Period Tracking - Notifications could reference statement period progress

## Success Metrics

**Adoption:**
- % of users who enable browser notifications
- % of users who customize threshold settings
- % of users who dismiss vs interact with in-page banners

**Engagement:**
- Average time between notification and overlay view
- Correlation between notifications and spending optimization
- Notification opt-out rate

**Effectiveness:**
- % of users who reach but don't exceed subcap limits (optimal usage)
- Reduction in subcap limit overage
- User feedback on notification usefulness

## Implementation Notes

### Phase 1: Visual Progress Indicator (MVP)
- Add progress badge to subcaps button
- Implement color coding logic
- Test on desktop and mobile

### Phase 2: Browser Notifications
- Request notification permission
- Implement threshold detection logic
- Add notification triggers
- Test cross-browser compatibility

### Phase 3: In-Page Banners
- Create banner component
- Implement dismissal logic
- Add banner prioritization
- Test responsive design

### Phase 4: Settings Panel
- Create settings UI
- Implement threshold customization
- Add quiet hours logic
- Add per-bucket toggle

## UI Mockups

### Button with Progress Badge
```
┌─────────────────┐
│   Subcaps    [●]│  ← Green dot badge
└─────────────────┘

┌─────────────────┐
│   Subcaps   [80%]│  ← Yellow percentage
└─────────────────┘
```

### In-Page Banner
```
┌────────────────────────────────────────────┐
│ ⚠️ Alert: You're at 90% of your online    [X]│
│    subcap ($540 / $600)                      │
└────────────────────────────────────────────┘
```

### Notification Example
```
┌─────────────────────────────────┐
│ HeyMax SubCaps                  │
│                                 │
│ 🎉 Milestone Reached!           │
│ You've hit $1,000 in contactless│
│ spending on your UOB VS card.   │
│ Bonus miles activated!          │
└─────────────────────────────────┘
```

## Related Issues

- Complements: #01 Data Export & History
- Enables better: #04 Multi-Period Tracking
- Sets foundation for: #05 Spending Projections

---

**Status**: Proposed  
**Last Updated**: 2025-12-01  
**Author**: Product Manager
