# Multi-Statement Period Support

**Priority**: P1 (High) | **Category**: Data & Insights | **Estimated Effort**: High | **Phase**: 1

## Problem Statement

Currently, the script tracks all transactions without respecting credit card statement periods. Users face these issues:
- **Confusing calculations** - Transactions span multiple statement periods
- **Can't track monthly progress** - No way to see current month vs previous month
- **Incorrect limits** - Subcaps reset monthly but the script shows cumulative totals
- **Planning difficulties** - Can't see how much subcap remains for current statement period
- **Comparison impossible** - Can't compare spending patterns across different months

This fundamental limitation makes the tool less useful for real-world subcap management, where limits reset monthly.

## Proposed Solution

Add statement period awareness to transaction calculations and display:

1. **Detect statement periods** - Extract or infer statement cycle dates from transaction data
2. **Filter by period** - Calculate subcaps for current period only (not all-time)
3. **Period selector** - Let users view different statement periods
4. **Period comparison** - Compare current period vs previous periods
5. **Reset awareness** - Show days remaining until subcap reset

## User Stories

### Story 1: Automatic Statement Period Detection
**As a** user with transactions spanning multiple months  
**I want** the script to automatically detect my statement periods  
**So that** I see accurate subcap calculations for the current period only

**Acceptance Criteria:**
- [ ] Script detects statement cycle start/end dates from transaction timestamps
- [ ] Algorithm: Find recurring ~30-day gaps in transaction dates (statement cycle)
- [ ] Default: Use calendar month if detection fails
- [ ] Manual override: User can set custom statement dates in settings
- [ ] Period detection works for both UOB PPV and UOB VS
- [ ] Detection handles irregular statement cycles (28-31 days)
- [ ] Period information stored per card (multiple cards supported)
- [ ] First-time users see current calendar month by default
- [ ] Detection re-runs when new transactions loaded

### Story 2: Current Period Calculation
**As a** user checking my subcap progress  
**I want** to see calculations for only my current statement period  
**So that** the numbers match my actual subcap limits that reset monthly

**Acceptance Criteria:**
- [ ] Subcap overlay shows "Current Period" by default
- [ ] Calculations include only transactions from current statement period
- [ ] Period dates displayed prominently (e.g., "Nov 15 - Dec 14, 2025")
- [ ] Days remaining until period end shown
- [ ] Clear indication if approaching period end (e.g., "3 days left")
- [ ] Previous period's final totals cached for comparison
- [ ] Period boundaries highlighted in transaction details view
- [ ] Works correctly across period boundaries (midnight transitions)

### Story 3: Statement Period Selector
**As a** user who wants to review past spending  
**I want** to view subcap calculations for previous statement periods  
**So that** I can analyze my spending patterns over time

**Acceptance Criteria:**
- [ ] Period selector dropdown in subcaps overlay
- [ ] Options: "Current Period", "Last Period", "2 Periods Ago", etc.
- [ ] Shows last 12 statement periods (1 year of history)
- [ ] Each period labeled with date range (e.g., "Oct 15 - Nov 14, 2025")
- [ ] Calculations update when period selected
- [ ] Transaction details filtered to selected period
- [ ] Indicator shows which period is selected
- [ ] Fast switching between periods (no page reload)
- [ ] Mobile-friendly dropdown (works on Edge Mobile)

### Story 4: Period-over-Period Comparison
**As a** user analyzing spending trends  
**I want** to see how my current period compares to previous periods  
**So that** I can understand if I'm spending more or less than usual

**Acceptance Criteria:**
- [ ] "Comparison" view in subcaps overlay
- [ ] Shows current period vs last period side-by-side
- [ ] Difference calculated (e.g., "+$50 vs last month")
- [ ] Percentage change shown (e.g., "↑ 15% from last period")
- [ ] Visual indicators: green (decreased), red (increased), gray (similar)
- [ ] Comparison available for each bucket (contactless, online, foreign currency)
- [ ] Option to compare vs average of last 3 periods
- [ ] Chart showing trend over last 6 periods (optional)
- [ ] "Similar spending" indicator if within 10% of previous period

### Story 5: Days Until Reset Display
**As a** user planning my spending  
**I want** to see how many days until my subcaps reset  
**So that** I can optimize my remaining spending capacity

**Acceptance Criteria:**
- [ ] "Days until reset" prominently displayed in overlay
- [ ] Countdown updates daily
- [ ] Visual urgency indicator:
  - Green: >14 days (plenty of time)
  - Yellow: 7-14 days (mid-period)
  - Orange: 3-6 days (running out)
  - Red: <3 days (final days)
- [ ] Shows exact reset date (e.g., "Resets on Dec 15, 2025")
- [ ] Remaining capacity shown (e.g., "$120 left in contactless for 5 more days")
- [ ] Average daily spending rate suggested (optional, e.g., "You can spend $24/day")

## Out of Scope

**Not included in this feature:**
- Automatic alerts for period end (see #02 Smart Notifications)
- Predictive "will you hit limit" calculations (see #05 Spending Projections)
- Export of period comparison data (see #01 Data Export)
- Period-based budgeting or goals (see #14 Goal Tracking)
- Integration with bank statements or PDF import
- Automatic statement date sync via bank API (privacy violation)

## Privacy & Security Considerations

**Privacy-First Approach:**
- ✅ All period detection runs locally
- ✅ No external calendar or date sync services
- ✅ Statement dates stored locally only
- ✅ No transmission of period information to external servers
- ✅ Manual period override for privacy-conscious users (no auto-detection)

**Security:**
- ✅ No sensitive date information in external requests
- ✅ Period data encrypted in browser storage alongside transactions

## Technical Considerations

### Period Detection Algorithm
```javascript
function detectStatementPeriod(transactions) {
  // Sort transactions by date
  const sorted = transactions.sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  // Find ~30-day gaps (likely statement boundaries)
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    const daysDiff = daysBetween(sorted[i-1].date, sorted[i].date);
    if (daysDiff > 25) { // Likely month boundary
      gaps.push({
        start: sorted[i-1].date,
        end: sorted[i].date,
        days: daysDiff
      });
    }
  }
  
  // Determine most common cycle length
  const avgCycle = Math.round(
    gaps.reduce((sum, g) => sum + g.days, 0) / gaps.length
  );
  
  // Infer current period based on cycle
  return {
    cycleLength: avgCycle,
    currentPeriodStart: /* calculated */,
    currentPeriodEnd: /* calculated */
  };
}
```

### Storage Structure
```javascript
{
  cardData: {
    "card-id": {
      statementPeriod: {
        cycleLength: 30,
        manualOverride: false,
        customStart: null,
        detectedPeriods: [
          {
            start: "2025-11-15",
            end: "2025-12-14",
            contactless: 450.50,
            online: 320.00,
            transactionCount: 42
          }
        ]
      },
      // existing transaction data...
    }
  }
}
```

### Period Filtering
```javascript
function filterByPeriod(transactions, periodStart, periodEnd) {
  return transactions.filter(txn => {
    const txnDate = new Date(txn.date);
    return txnDate >= periodStart && txnDate <= periodEnd;
  });
}
```

## Risks & Considerations

**Risks:**
- **Detection accuracy** - May incorrectly infer statement dates for new users
  - *Mitigation*: Allow manual override, default to calendar month if uncertain
- **Edge cases** - Statement cycles can be irregular (28-31 days)
  - *Mitigation*: Flexible detection algorithm, user can correct
- **Data sparsity** - Not enough transactions to detect pattern
  - *Mitigation*: Fallback to calendar month, guide user to set manually
- **Multiple cards** - Different cards may have different statement cycles
  - *Mitigation*: Per-card period storage and detection

**Trade-offs:**
- Automatic detection vs manual setup - Both supported (auto with manual override)
- Calendar month vs actual statement cycle - Prioritize statement cycle accuracy
- Comparison complexity vs simplicity - Start simple (current vs last), expand later

## Dependencies

**Strongly recommended:**
- #01 Data Export & History - Period data enhances historical exports
- #02 Smart Notifications - Period-aware notifications more useful

**Nice to have:**
- #05 Spending Projections - Projections make more sense within statement periods

## Success Metrics

**Accuracy:**
- % of users with correctly detected statement periods
- Rate of manual period overrides (target: <20%)

**Adoption:**
- % of users who use period selector
- % of users who view period comparisons
- Average number of periods viewed per session

**Impact:**
- Reduction in user confusion about subcap totals
- Improved subcap limit optimization (users hitting but not exceeding limits)

## Implementation Notes

### Phase 1: Statement Period Detection (MVP)
- Implement detection algorithm
- Add manual override UI
- Default to calendar month
- Test with various transaction patterns

### Phase 2: Period Filtering
- Filter transactions by period
- Update calculations for current period
- Display period dates
- Show days until reset

### Phase 3: Period Selector
- Add dropdown for period selection
- Implement period switching
- Cache period calculations
- Test performance

### Phase 4: Period Comparison
- Build comparison view
- Calculate differences and percentages
- Add trend indicators
- Optimize for mobile

## UI Mockups

### Period Selector
```
┌─────────────────────────────────────┐
│ Statement Period: [Current ▾]       │
│ Nov 15 - Dec 14, 2025               │
│ 🕐 8 days remaining                 │
└─────────────────────────────────────┘
```

### Period Comparison View
```
┌──────────────────────────────────────┐
│ Current Period   vs   Last Period    │
│ Nov 15 - Dec 14      Oct 15 - Nov 14 │
├──────────────────────────────────────┤
│ Contactless                          │
│ $450 / $600        $520 / $600       │
│ ↓ 13% (Decreased)                    │
├──────────────────────────────────────┤
│ Online                               │
│ $320 / $600        $280 / $600       │
│ ↑ 14% (Increased)                    │
└──────────────────────────────────────┘
```

## Related Issues

- Enables: #05 Spending Projections (period-based forecasts)
- Complements: #01 Data Export (period-based exports)
- Foundation for: #14 Goal Tracking (period-based goals)

---

**Status**: Proposed  
**Last Updated**: 2025-12-01  
**Author**: Product Manager
