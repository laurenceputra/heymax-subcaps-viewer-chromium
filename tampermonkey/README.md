# Tampermonkey Directory - DO NOT REMOVE

## ⚠️ Important: Backward Compatibility

**This directory MUST be maintained for backward compatibility.**

Many users have installed the script from this location before we reorganized to use `/src/` as the canonical source. Removing this directory would break auto-updates for existing users.

## Directory Purpose

This directory contains a **copy** of the main userscript for backward compatibility with users who installed from:
```
https://github.com/laurenceputra/heymax-subcaps-viewer-chromium/raw/refs/heads/main/tampermonkey/heymax-subcaps-viewer.user.js
```

## Maintenance Guidelines

### DO:
- ✅ Keep this directory and file in place
- ✅ Keep the script synchronized with `/src/heymax-subcaps-viewer.user.js`
- ✅ Include the migration notice at the top of the file
- ✅ Update both files when making changes (until all users migrate)

### DO NOT:
- ❌ Remove this directory
- ❌ Remove the migration notice
- ❌ Let this file diverge from the main `/src/` version
- ❌ Change the @updateURL or @downloadURL (they point to `/src/`)

## How to Update Both Files

When making changes to the userscript:

1. Make changes to `/src/heymax-subcaps-viewer.user.js` (canonical source)
2. Copy the entire file to `/tampermonkey/heymax-subcaps-viewer.user.js`
3. Ensure the migration notice block is present in the tampermonkey version
4. Commit both files together

**Script to sync:**
```bash
# From repository root
cp src/heymax-subcaps-viewer.user.js tampermonkey/heymax-subcaps-viewer.user.js
# Migration notice should already be in the tampermonkey version
git add src/heymax-subcaps-viewer.user.js tampermonkey/heymax-subcaps-viewer.user.js
git commit -m "Sync userscript files"
```

## Auto-Update Mechanism

Both files contain:
```javascript
// @updateURL    https://github.com/.../main/src/heymax-subcaps-viewer.user.js
// @downloadURL  https://github.com/.../main/src/heymax-subcaps-viewer.user.js
```

This ensures users who installed from `/tampermonkey/` will automatically migrate to `/src/` on their next update check.

## Migration Timeline

- **v1.2.0**: Added migration notice and updated URLs
- **Target**: All users should migrate to `/src/` via auto-update
- **Eventually**: Once usage from `/tampermonkey/` drops to near-zero, we can deprecate (but not remove) this directory

## For Future Developers

If you see this directory and wonder why it exists: **Please read this document before making changes.** Removing this directory would break auto-updates for existing users.

The `@updateURL` mechanism will eventually migrate all users to `/src/`, but we need to keep this directory until that migration is complete.

## File Differences

The only difference between `/src/` and `/tampermonkey/` versions should be:

- **Tampermonkey version**: Has migration notice block after metadata
- **Src version**: Clean implementation without migration notice

Both versions have identical:
- @updateURL and @downloadURL (pointing to `/src/`)
- Version numbers
- Functionality

## Questions?

If you have questions about this directory structure, see:
- `.github/copilot-instructions.md` - Overall project workflow
- `docs/TECHNICAL_DESIGN.md` - Technical architecture
- `README.md` - User documentation

---

**Last Updated**: 2025-11-30  
**Status**: Active (required for backward compatibility)
