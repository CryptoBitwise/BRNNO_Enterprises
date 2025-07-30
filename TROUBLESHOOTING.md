# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 🚨 White Screen / Build Errors

If you see a white screen or build errors, try these steps in order:

#### **Quick Fix (Windows)**

```powershell
# Run the PowerShell cleanup script
.\scripts\cleanup.ps1

# Then restart
npm install
npm run dev
```

#### **Quick Fix (All Platforms)**

```bash
# Use the npm script
npm run clean:all
```

#### **Manual Cleanup**

```bash
# Stop all Node processes
taskkill /f /im node.exe

# Delete build directories
rm -rf .next
rm -rf out
rm -rf build
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Start dev server
npm run dev
```

### 🔄 When to Clean

Clean your build cache when you experience:

- ❌ White screen
- ❌ "ENOENT: no such file or directory" errors
- ❌ Stale build artifacts
- ❌ Port conflicts
- ❌ Component not updating

### 🛠️ Available Scripts

```bash
# Clean build artifacts
npm run clean

# Clean + reinstall + start dev
npm run clean:all

# Clean + reinstall + build
npm run reset
```

### 🚀 Best Practices

1. **Always stop the dev server** before cleaning
2. **Use the cleanup scripts** instead of manual deletion
3. **Check for port conflicts** if dev server won't start
4. **Keep Node.js updated** to avoid compatibility issues

### 📝 Common Error Messages

| Error | Solution |
|-------|----------|
| `ENOENT: no such file or directory` | Run `npm run clean` |
| `Port 3000 is in use` | Kill Node processes or use `npm run dev:3001` |
| `Module not found` | Run `npm install` |
| `Build failed` | Run `npm run reset` |

### 🔍 Debug Steps

1. **Check console errors** in browser DevTools
2. **Check terminal output** for build errors
3. **Verify .env.local** exists and is configured
4. **Check Firebase configuration** if using auth
