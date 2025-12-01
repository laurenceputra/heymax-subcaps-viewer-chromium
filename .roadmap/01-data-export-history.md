# Data Export & History Tracking

**Priority**: P1 (High) | **Category**: User Experience | **Estimated Effort**: Medium | **Phase**: 1

## Problem Statement

Currently, users can only view their subcap progress in the current moment through the overlay. They have no way to:
- **Track historical progress** - See how their spending patterns evolved over time
- **Export data for records** - Keep personal records outside the browser
- **Analyze trends** - Understand monthly/weekly spending patterns
- **Share with advisors** - Provide data to financial advisors or family members
- **Recover from data loss** - If browser storage is cleared, all history is lost

This creates anxiety for power users who want to maintain detailed records and understand their spending behavior over time.

## Proposed Solution

Add export functionality and basic historical tracking to the existing overlay:

1. **Export current data** - Button to download current subcap calculations as JSON or CSV
2. **Historical snapshots** - Automatically save daily/weekly snapshots of subcap progress
3. **History view** - Show progress charts over time periods (7 days, 30 days, statement period)
4. **Export formats** - Support CSV (for Excel), JSON (for backup), and human-readable summary

## User Stories

### Story 1: Export Current Subcap Data
**As a** UOB cardholder tracking my subcaps  
**I want** to export my current subcap calculations  
**So that** I can keep personal records and share with my financial advisor

**Acceptance Criteria:**
- [ ] "Export" button appears in subcaps overlay
- [ ] User can choose format: CSV, JSON, or Text Summary
- [ ] CSV format includes: Date, Card Type, Bucket Name, Amount, Limit, Percentage
- [ ] JSON format includes full transaction details for backup
- [ ] Text summary is human-readable with formatting
- [ ] Filename includes timestamp and card type (e.g., `UOB-PPV-Subcaps-2025-12-01.csv`)
- [ ] Download works on all supported browsers (desktop + Edge Mobile)
- [ ] Export includes transaction count and last sync timestamp

### Story 2: Automatic Historical Snapshots
**As a** user who wants to track trends  
**I want** the script to automatically save snapshots of my subcap progress  
**So that** I can see how my spending evolved over time

**Acceptance Criteria:**
- [ ] Script automatically saves snapshot once per day
- [ ] Snapshots include: date, contactless total, online/foreign currency total, transaction count
- [ ] Maximum 90 days of history retained (storage optimization)
- [ ] Older snapshots automatically pruned
- [ ] Snapshots stored per card (multiple cards supported)
- [ ] Storage impact minimal (estimated <100KB per card for 90 days)
- [ ] No performance impact during normal browsing

### Story 3: View Historical Progress
**As a** user tracking my spending patterns  
**I want** to see my subcap progress over time  
**So that** I can understand my spending behavior and plan better

**Acceptance Criteria:**
- [ ] "History" tab added to subcaps overlay
- [ ] Chart shows contactless and online/foreign currency buckets over time
- [ ] Time period selector: 7 days, 30 days, 60 days, 90 days
- [ ] Chart clearly shows subcap limits as horizontal lines
- [ ] Hover tooltip shows exact values for each date
- [ ] Visual indication when subcap limit was reached
- [ ] Works on mobile (Edge Mobile) with touch interaction
- [ ] Chart is responsive and adapts to overlay size

### Story 4: Export Historical Data
**As a** power user maintaining financial records  
**I want** to export my historical subcap data  
**So that** I can analyze trends in Excel or keep long-term archives

**Acceptance Criteria:**
- [ ] "Export History" option in History tab
- [ ] CSV export includes all snapshot data with date ranges
- [ ] Columns: Date, Card, Contactless, Online/Foreign, Transaction Count
- [ ] Date range selector (e.g., last 30 days, last 60 days, all time)
- [ ] Export includes metadata: export date, card details, date range
- [ ] File format compatible with Excel and Google Sheets

## Out of Scope

**Not included in this feature:**
- Cloud sync or backup (privacy violation - all data stays local)
- Automatic email reports (requires external service)
- Sharing via social media or messaging apps
- Integration with budgeting apps or external services
- Advanced analytics or AI-powered insights
- Real-time sync across multiple devices

## Privacy & Security Considerations

**Privacy-First Approach:**
- ✅ All historical data stored locally using Tampermonkey GM storage
- ✅ No external API calls or data transmission
- ✅ Export files saved to user's Downloads folder only
- ✅ User controls what data to export and when
- ✅ Historical snapshots automatically pruned (90-day limit)
- ✅ Export formats use generic filenames (no sensitive merchant data in filename)

**Security:**
- ✅ Export data does not include sensitive card numbers or CVV
- ✅ Files saved with user-controlled permissions
- ✅ No automatic uploads or cloud backups

## Technical Considerations

### Storage Structure
```javascript
{
  cardData: {
    "card-id": {
      snapshots: {
        "2025-12-01": {
          contactless: 250.50,
          online: 180.00,
          transactionCount: 25,
          timestamp: "2025-12-01T12:00:00Z"
        },
        "2025-12-02": { /* ... */ }
      },
      // existing transaction data...
    }
  }
}
```

### Chart Library
- Consider lightweight charting library (Chart.js or similar)
- Fallback to HTML/CSS bars if library adds too much bloat
- Priority: performance and mobile compatibility

### Export Implementation
- Use `Blob` and `URL.createObjectURL` for downloads
- CSV generation: simple string concatenation (no external library)
- JSON export: `JSON.stringify` with formatting
- Text summary: formatted template strings

## Risks & Considerations

**Risks:**
- **Storage growth** - Historical snapshots could grow large over time
  - *Mitigation*: 90-day automatic pruning, lightweight snapshot format
- **Performance** - Chart rendering could be slow on mobile
  - *Mitigation*: Lazy-load chart library, limit data points, use canvas rendering
- **Browser compatibility** - Export download may behave differently across browsers
  - *Mitigation*: Test on all supported browsers, provide fallback methods

**Trade-offs:**
- Snapshot frequency (daily vs hourly) - Daily chosen for storage efficiency
- History retention (90 days vs unlimited) - 90 days balances utility and storage
- Chart library (full-featured vs lightweight) - Lightweight prioritized for performance

## Dependencies

**No hard dependencies**, but complements:
- Data Backup & Restore (#08) - Export can be used for manual backups
- Multi-Statement Period Support (#04) - Historical data enables period comparison

## Success Metrics

**Adoption:**
- % of users who export data at least once
- Export format preferences (CSV vs JSON vs Text)

**Engagement:**
- % of users who view historical charts
- Average history view time period selected

**Retention:**
- Storage size per user (target: <100KB for 90 days)
- Performance impact on page load (target: <50ms)

## Implementation Notes

### Phase 1: Export Current Data (MVP)
- Add "Export" button to overlay
- Implement CSV and JSON export
- Test cross-browser download behavior

### Phase 2: Historical Snapshots
- Create snapshot capture logic
- Implement daily snapshot trigger
- Add 90-day pruning mechanism

### Phase 3: History Visualization
- Add History tab to overlay
- Implement simple chart (HTML/CSS or lightweight library)
- Add time period selector

### Phase 4: Export History
- Add "Export History" to History tab
- Implement date range selection
- Test with large datasets

## Related Issues

- Complements: #08 Data Backup & Restore
- Enables: #05 Spending Projections (needs historical data)
- Enables: #06 Transaction Categorization (trend analysis)

---

**Status**: Proposed  
**Last Updated**: 2025-12-01  
**Author**: Product Manager
