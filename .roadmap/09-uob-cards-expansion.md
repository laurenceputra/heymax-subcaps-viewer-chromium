# Additional UOB Cards Support

**Priority**: P1 (High) | **Category**: Multi-Card | **Estimated Effort**: Medium | **Phase**: 3

## Problem Statement

The script currently supports only UOB PPV and UOB VS cards. UOB offers many other credit cards with spending subcaps that users struggle to track:
- **UOB One Card** - 10X rewards with spending categories
- **UOB PRVI Miles Card** - Foreign currency and online spend bonuses
- **UOB Lady's Card** - Fashion, dining, and spa subcaps
- **UOB Absolute Cashback Card** - Category-based cashback caps

Users with these cards cannot benefit from automated subcap tracking, forcing them to manually track or give up on optimization entirely.

## Proposed Solution

Extend the calculation engine to support additional UOB cards by:

1. **Card detection** - Auto-detect card type from HeyMax data
2. **Flexible rules engine** - Modular system for different subcap structures
3. **Card-specific logic** - Implement rules for each UOB card variant
4. **Multi-card UI** - Display different subcap structures appropriately

## User Stories

### Story 1: UOB One Card Support
**As a** UOB One Card holder  
**I want** to track my 10X rewards categories  
**So that** I can optimize my spending for maximum points

**Acceptance Criteria:**
- [ ] Script detects "UOB ONE" card from HeyMax data
- [ ] Tracks 3 categories: Dining ($600), Shopping ($600), Services ($600)
- [ ] MCCs mapped correctly for each category
- [ ] Shows 10X multiplier indication in UI
- [ ] Displays "$600 limit, 10X points" for each category
- [ ] Color coding: Green (<$600), Red (≥$600)
- [ ] Transaction details show category assignment
- [ ] Base 1X spending not tracked (not subcap-limited)

### Story 2: UOB PRVI Miles Card Support
**As a** UOB PRVI Miles cardholder  
**I want** to track my foreign currency and online subcaps  
**So that** I know when I've maximized my bonus miles

**Acceptance Criteria:**
- [ ] Script detects "UOB PRVI" card from HeyMax data
- [ ] Tracks Foreign Currency bucket ($1,000 limit, 4 mpd)
- [ ] Tracks Online bucket ($1,000 limit, 4 mpd)
- [ ] Excludes blacklisted MCCs per PRVI terms
- [ ] Shows miles-per-dollar rate for each bucket
- [ ] Displays progress toward $1,000 limits
- [ ] Color coding appropriate for $1,000 thresholds
- [ ] Transaction details show currency and online flag

### Story 3: UOB Lady's Card Support
**As a** UOB Lady's Card holder  
**I want** to track my fashion, dining, and spa spending  
**So that** I maximize my 10X UNI$ rewards

**Acceptance Criteria:**
- [ ] Script detects "UOB LADY" card from HeyMax data
- [ ] Tracks Fashion bucket ($500 limit)
- [ ] Tracks Dining bucket ($500 limit)
- [ ] Tracks Spa & Wellness bucket ($500 limit)
- [ ] MCCs mapped for fashion, dining, spa categories
- [ ] Shows 10X UNI$ indication
- [ ] Separate progress bars for each of 3 categories
- [ ] Transaction details categorized correctly

### Story 4: Flexible Card Rules Engine
**As a** developer adding new card support  
**I want** a modular rules system  
**So that** adding new cards doesn't require rewriting core logic

**Acceptance Criteria:**
- [ ] Card detection abstracted into config
- [ ] Each card has config object: name, limits, buckets, MCCs, rules
- [ ] Calculation engine accepts card config parameter
- [ ] UI renders dynamically based on number of buckets
- [ ] Easy to add new cards by adding config object
- [ ] Unit tests cover config validation
- [ ] Documentation explains how to add new cards
- [ ] Backward compatible with existing PPV and VS logic

## Out of Scope

**Not included in this feature:**
- Non-UOB cards (DBS, OCBC, Citi - see separate roadmap items)
- Cards without clear subcap structures
- Business/corporate cards
- Discontinued or legacy cards
- Cards not available through HeyMax
- Automatic card benefit recommendations

## Privacy & Security Considerations

**Privacy-First Approach:**
- ✅ Card detection uses only HeyMax API data (no external lookups)
- ✅ Card configurations stored in script code (not transmitted)
- ✅ No card-specific data sent to external services
- ✅ Transaction categorization happens locally

## Technical Considerations

### Card Configuration Structure
```javascript
const cardConfigs = {
  'UOB PPV': {
    displayName: 'UOB Preferred Platinum Visa',
    buckets: [
      {
        name: 'Contactless',
        limit: 600,
        rules: {
          paymentTag: 'contactless',
          rounding: 'down-to-5'
        }
      },
      {
        name: 'Online',
        limit: 600,
        rules: {
          paymentTag: 'online',
          eligibleMCCs: [/* shopping, dining, entertainment */],
          rounding: 'down-to-5'
        }
      }
    ],
    blacklist: {
      mccs: [/* blacklisted MCCs */],
      merchantPrefixes: [/* blacklisted merchants */]
    }
  },
  'UOB ONE': {
    displayName: 'UOB One Card',
    buckets: [
      {
        name: 'Dining',
        limit: 600,
        multiplier: '10X',
        rules: {
          eligibleMCCs: [5811, 5812, 5814, /* etc */]
        }
      },
      {
        name: 'Shopping',
        limit: 600,
        multiplier: '10X',
        rules: {
          eligibleMCCs: [5311, 5611, /* etc */]
        }
      },
      {
        name: 'Services',
        limit: 600,
        multiplier: '10X',
        rules: {
          eligibleMCCs: [4121, 7523, /* etc */]
        }
      }
    ]
  }
  // Additional cards...
};
```

### Dynamic UI Rendering
```javascript
function renderBuckets(buckets) {
  return buckets.map(bucket => `
    <div class="bucket-card">
      <h3>${bucket.name} ${bucket.multiplier || ''}</h3>
      <p>${bucket.current} / ${bucket.limit}</p>
      <progress value="${bucket.current}" max="${bucket.limit}"></progress>
    </div>
  `).join('');
}
```

## Risks & Considerations

**Risks:**
- **MCC mapping accuracy** - Card benefits documentation may be outdated
  - *Mitigation*: Research official UOB terms, allow community contributions
- **Maintenance burden** - More cards = more rules to maintain
  - *Mitigation*: Modular architecture, clear documentation, unit tests
- **UI complexity** - Different cards have different numbers of buckets
  - *Mitigation*: Responsive UI, max 3-4 buckets per card for clarity
- **Testing coverage** - Need test data for each card variant
  - *Mitigation*: Synthetic test transactions, community testing

**Trade-offs:**
- Comprehensive support vs maintenance - Start with most popular cards
- Automatic detection vs manual selection - Both (auto with manual override)
- UI flexibility vs consistency - Balance card-specific needs with UX consistency

## Dependencies

**Optional:**
- #13 Custom Rules Engine - Power users could define their own cards
- #15 Card Comparison Tool - Compare benefits across supported cards

## Success Metrics

**Adoption:**
- % of users with newly supported cards
- Distribution of card types among users
- Feature requests for additional card support

**Accuracy:**
- Correct card detection rate
- MCC mapping accuracy per card
- User-reported calculation errors

## Implementation Notes

### Phase 1: Refactor to Config System
- Extract PPV and VS rules into config objects
- Refactor calculation engine to accept config
- Test backward compatibility

### Phase 2: Add UOB One Card
- Research UOB One Card terms and MCCs
- Create config object
- Test with synthetic transactions
- Update UI for 3-bucket display

### Phase 3: Add PRVI Miles Card
- Research PRVI terms
- Create config
- Test foreign currency detection
- Update UI messaging

### Phase 4: Add Lady's Card
- Research Lady's Card terms
- Create config with fashion/dining/spa MCCs
- Test categorization
- Update UI for category-specific icons

## Card Research Checklist

For each new card, research:
- [ ] Official subcap limits
- [ ] Eligible MCCs per category
- [ ] Blacklisted MCCs or merchants
- [ ] Rounding rules (if any)
- [ ] Minimum spend requirements
- [ ] Bonus rate or multiplier
- [ ] Statement period behavior
- [ ] Exclusions or special conditions

## UI Examples

### UOB One Card Display
```
┌──────────────────────────────────────┐
│ UOB One Card Subcaps                 │
├──────────────────────────────────────┤
│ Dining (10X) ████░░░░░░ $420 / $600  │
│ Shopping (10X) ██████░░░░ $540 / $600│
│ Services (10X) ███░░░░░░░ $280 / $600│
└──────────────────────────────────────┘
```

### UOB PRVI Miles Display
```
┌──────────────────────────────────────┐
│ UOB PRVI Miles Subcaps               │
├──────────────────────────────────────┤
│ Foreign Currency (4 mpd)             │
│ ██████████ $1,000 / $1,000 ✓         │
│                                      │
│ Online (4 mpd)                       │
│ ████████░░ $850 / $1,000             │
└──────────────────────────────────────┘
```

## Related Issues

- Foundation for: #10 DBS/POSB Cards
- Foundation for: #11 OCBC Cards
- Complements: #15 Card Comparison Tool

---

**Status**: Proposed  
**Last Updated**: 2025-12-01  
**Author**: Product Manager
