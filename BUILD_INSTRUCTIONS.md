# 🏗️ Build Instructions - Pharmacy POS System

Complete guide to building Windows standalone executables for the Pharmacy POS System.

---

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)

   - Download: https://nodejs.org/
   - Verify: `node --version`
   - Should show: v18.x.x or higher

2. **npm** (comes with Node.js)

   - Verify: `npm --version`
   - Should show: v9.x.x or higher

3. **Git** (for version control)

   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **MySQL** (v8.0+)
   - Required for database
   - Download: https://dev.mysql.com/downloads/mysql/

### System Requirements

- **Operating System**: Windows 10 or higher (64-bit)
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk Space**: 2 GB free space for build process
- **Internet**: Required for initial `npm install` only

---

## 🚀 Quick Build Guide

### Method 1: Using PowerShell Script (Recommended)

**Step 1:** Open PowerShell in project directory

```powershell
# Right-click on folder → "Open in Terminal"
# Or navigate manually:
cd C:\path\to\pharmacy-standalone-pos
```

**Step 2:** Run the build script

```powershell
.\build-windows.ps1
```

**Step 3:** Follow the prompts

- Choose build type (1, 2, or 3)
- Wait for build to complete (5-10 minutes)

**Step 4:** Find your executables

- Location: `dist-electron\`
- Files:
  - `Pharmacy POS System-1.0.0-x64.exe` (Installer)
  - `Pharmacy POS System-1.0.0-Portable.exe` (Portable)

---

### Method 2: Using Batch Script

**Step 1:** Double-click `build-windows.bat`

**Step 2:** Follow the on-screen instructions

**Step 3:** Choose build type when prompted

**Step 4:** Collect built files from `dist-electron\` folder

---

### Method 3: Manual Build (For Developers)

**Step 1: Install Dependencies**

```powershell
npm install
```

_This installs all required packages (takes 2-5 minutes)_

**Step 2: Build Vue Application**

```powershell
npm run build
```

_This compiles the frontend (takes 30 seconds - 1 minute)_

**Step 3: Build Electron Application**

**Option A: Build Both (Installer + Portable)**

```powershell
npm run electron:build
```

**Option B: Build Windows Installer Only**

```powershell
npm run electron:build:win
```

**Option C: Build Portable Version Only**

```powershell
npm run electron:build:portable
```

**Step 4: Verify Build**

- Check `dist-electron\` folder
- File sizes should be ~100-150 MB each

---

## 📦 Build Output Details

### File Types Produced

#### 1. **NSIS Installer** (`Pharmacy POS System-1.0.0-x64.exe`)

**What it is:**

- Traditional Windows installer
- Installs to Program Files
- Creates desktop and start menu shortcuts
- Includes uninstaller
- Administrator privileges required for installation

**When to use:**

- Distributing to end-users
- Professional deployment
- Permanent installation on computer

**Installation Process:**

1. User double-clicks installer
2. Wizard guides through installation
3. Choose installation directory
4. Creates shortcuts automatically
5. Application ready to use

**Size:** ~100-120 MB

---

#### 2. **Portable Version** (`Pharmacy POS System-1.0.0-Portable.exe`)

**What it is:**

- Single executable file
- No installation required
- Run from any location (USB drive, Downloads, etc.)
- No administrator privileges needed
- All dependencies bundled

**When to use:**

- Testing on multiple computers
- USB drive deployment
- Temporary usage
- Environments without admin rights

**Usage:**

1. Copy .exe file anywhere
2. Double-click to run
3. Creates temporary files in same folder
4. No registry entries
5. Delete to uninstall

**Size:** ~120-150 MB

---

## 🎨 Customizing Build

### Changing Application Icon

**Current:** Using PNG icon (works but not ideal)

**Recommended:** Use multi-resolution ICO file

**Steps:**

1. Create or convert your icon to `.ico` format

   - Online tool: https://convertio.co/png-ico/
   - Include sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256

2. Save as `build/icon.ico`

3. Update `package.json`:

```json
"win": {
  "icon": "build/icon.ico",  // Change from .png to .ico
  ...
}
```

4. Rebuild application

---

### Changing Version Number

**Edit `package.json`:**

```json
{
  "version": "1.0.0",  // Change this (e.g., "1.0.1", "1.1.0")
  ...
}
```

**Version Format:** MAJOR.MINOR.PATCH

- MAJOR: Breaking changes (1.x.x → 2.0.0)
- MINOR: New features (1.0.x → 1.1.0)
- PATCH: Bug fixes (1.0.0 → 1.0.1)

**Output files will reflect new version:**

- `Pharmacy POS System-1.1.0-x64.exe`

---

### Changing Application Name

**Edit `package.json`:**

```json
"build": {
  "productName": "Pharmacy POS System",  // Change this
  ...
}
```

**Note:** Keep it under 30 characters for best compatibility

---

### Adding Company Information

**Edit `package.json`:**

```json
"build": {
  "copyright": "Copyright © 2025 Your Company Name",
  ...
  "win": {
    ...
    "publisherName": "Your Company Name"
  }
}
```

---

## 🔧 Build Configuration Deep Dive

### Understanding `package.json` Build Section

```json
"build": {
  "appId": "com.pharmacy.pos",           // Unique app identifier
  "productName": "Pharmacy POS System",   // Display name
  "copyright": "Copyright © 2025",        // Copyright notice
  "electronVersion": "28.3.3",           // Electron version
  "npmRebuild": false,                   // Skip native rebuild (faster)
  "buildDependenciesFromSource": false,  // Use prebuilt binaries

  "directories": {
    "output": "dist-electron",           // Where to put builds
    "buildResources": "build"            // Icon, license location
  },

  "files": [                             // What to include in build
    "dist/**/*",                         // Compiled Vue app
    "electron/**/*",                     // Electron main process
    "!electron/database/pharmacy_pos.sqlite",  // Exclude SQLite (not used)
    "package.json"                       // Package info
  ],

  "extraResources": [                    // Extra files to bundle
    {
      "from": "electron/database",
      "to": "database",
      "filter": ["*.js"]                 // Only JS files
    }
  ],

  "win": {
    "target": [                          // What to build for Windows
      {
        "target": "nsis",                // Installer
        "arch": ["x64"]                  // 64-bit only
      },
      {
        "target": "portable",            // Portable exe
        "arch": ["x64"]
      }
    ],
    "icon": "build/icon.png",            // App icon
    "artifactName": "${productName}-${version}-${arch}.${ext}",  // Output filename format
    "publisherName": "Pharmacy POS"      // Publisher name (shown in Windows)
  },

  "nsis": {                              // Installer options
    "oneClick": false,                   // Show installation wizard
    "allowToChangeInstallationDirectory": true,  // Let user choose install location
    "allowElevation": true,              // Allow admin privileges request
    "createDesktopShortcut": true,       // Create desktop icon
    "createStartMenuShortcut": true,     // Create start menu entry
    "shortcutName": "Pharmacy POS",      // Shortcut name
    "installerIcon": "build/icon.png",   // Installer icon
    "uninstallerIcon": "build/icon.png", // Uninstaller icon
    "installerHeaderIcon": "build/icon.png",  // Header image
    "license": "LICENSE.txt"             // License agreement
  },

  "portable": {
    "artifactName": "${productName}-${version}-Portable.${ext}"  // Portable filename
  }
}
```

---

## 🐛 Troubleshooting Build Issues

### Issue 1: "npm install" fails

**Symptoms:**

```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solution:**

- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again
- Ensure stable internet connection

---

### Issue 2: "electron-builder not found"

**Symptoms:**

```
'electron-builder' is not recognized as an internal or external command
```

**Solution:**

```powershell
# Install electron-builder globally
npm install -g electron-builder

# Or use npx (recommended)
npx electron-builder --win
```

---

### Issue 3: Build fails with "icon not found"

**Symptoms:**

```
Error: Cannot find icon at build/icon.ico
```

**Solution:**

- Ensure `build/icon.png` exists
- Or create `build/icon.ico` (recommended)
- Verify file path is correct
- Check file permissions

---

### Issue 4: Build succeeds but app won't run

**Symptoms:**

- Exe builds successfully
- Double-click does nothing
- Or app crashes immediately

**Solution:**

```powershell
# Test in development first
npm run electron:dev

# Check console for errors
# Verify database connection
# Ensure MySQL is running
# Check .env file settings
```

---

### Issue 5: Large file size (>200 MB)

**Symptoms:**

- Exe files are unexpectedly large
- Portable version over 300 MB

**Solution:**

- Check `node_modules` isn't included
- Verify `files` in package.json excludes unnecessary items
- Remove dev dependencies from production build
- Use `npm prune --production` before building

---

### Issue 6: "npm run build" fails

**Symptoms:**

```
ERROR: Vite build failed
```

**Solution:**

```powershell
# Clear Vite cache
rm -r node_modules/.vite

# Reinstall dependencies
npm install

# Try build again
npm run build
```

---

## 🧪 Testing Your Build

### Before Distribution

**1. Install Test**

```
✓ Run installer on clean Windows machine
✓ Verify all shortcuts created
✓ Verify application launches
✓ Check start menu entry
✓ Check desktop shortcut
```

**2. Portable Test**

```
✓ Copy portable exe to USB drive
✓ Run from USB on different computer
✓ Verify no installation needed
✓ Check it creates necessary folders
✓ Verify uninstall (just delete exe)
```

**3. Functional Test**

```
✓ Login with default credentials (admin/admin123)
✓ Create test product
✓ Create test supplier
✓ Create stock receipt
✓ Make test sale
✓ View reports
✓ All features working as expected
```

**4. Database Test**

```
✓ MySQL connection works
✓ Database auto-created if missing
✓ Seed data loads correctly
✓ Data persists after closing app
```

**5. Performance Test**

```
✓ App starts in under 5 seconds
✓ No lag during normal operations
✓ Memory usage stable (<500 MB)
✓ No crashes during extended use
```

---

## 📤 Distribution Guide

### Preparing for Distribution

**1. Final Build Checklist**

- [ ] Version number updated
- [ ] LICENSE.txt reviewed and accurate
- [ ] Icon finalized and looks professional
- [ ] All features tested thoroughly
- [ ] Known bugs documented
- [ ] USER_GUIDE.md up to date
- [ ] README.md has installation instructions

**2. Package Your Distribution**

Create a distribution folder with:

```
Pharmacy-POS-v1.0.0/
├── Pharmacy POS System-1.0.0-x64.exe (Installer)
├── Pharmacy POS System-1.0.0-Portable.exe (Portable)
├── README.txt (Quick start instructions)
├── USER_GUIDE.pdf (Full user manual)
├── LICENSE.txt (Software license)
└── MySQL-Setup-Guide.pdf (Database installation guide)
```

**3. Create README.txt for users**

```txt
Pharmacy POS System v1.0.0
============================

QUICK START:
1. Install MySQL 8.0+ (see MySQL-Setup-Guide.pdf)
2. Run "Pharmacy POS System-1.0.0-x64.exe"
3. Follow installation wizard
4. Launch application
5. Login: username "admin", password "admin123"

For detailed instructions, see USER_GUIDE.pdf

Support: your-email@domain.com
Website: www.yourwebsite.com
```

**4. Compress for Download**

```powershell
# Create ZIP archive
Compress-Archive -Path "Pharmacy-POS-v1.0.0" -DestinationPath "Pharmacy-POS-v1.0.0-Windows.zip"
```

---

## 🔐 Code Signing (Optional but Recommended)

### Why Code Sign?

**Without signing:**

- Windows SmartScreen warning appears
- Users see "Unknown publisher"
- Some antivirus flag it as suspicious
- Less professional appearance

**With signing:**

- No SmartScreen warnings
- Shows your company name
- Trusted by Windows
- Professional appearance

### How to Code Sign

**1. Get a Code Signing Certificate**

- Purchase from: DigiCert, Sectigo, GlobalSign
- Cost: $100-$500/year
- Requires company verification

**2. Configure in package.json**

```json
"win": {
  "certificateFile": "path/to/certificate.pfx",
  "certificatePassword": "your-password",
  "signingHashAlgorithms": ["sha256"],
  "sign": "./customSign.js"  // Optional: custom signing
}
```

**3. Build with Signing**

```powershell
# Set environment variable for password
$env:CSC_KEY_PASSWORD="your-cert-password"

# Build with signing
npm run electron:build:win
```

**Note:** For MVP/testing, unsigned is acceptable. For production distribution, signing is highly recommended.

---

## 📊 Build Performance Tips

### Faster Builds

**1. Use SSD for build directory**

- Significantly faster than HDD
- Reduces build time by 30-50%

**2. Exclude antivirus scanning**

- Add project folder to exclusions
- Add `node_modules` to exclusions
- Add `dist` and `dist-electron` to exclusions

**3. Close unnecessary applications**

- Free up RAM
- Reduce CPU usage
- Faster build completion

**4. Use build cache**

```json
// In package.json
"build": {
  "buildDependenciesFromSource": false,  // Use prebuilt binaries
  "npmRebuild": false  // Skip rebuild
}
```

### Typical Build Times

| Step                | Time         | Notes                       |
| ------------------- | ------------ | --------------------------- |
| npm install         | 2-5 min      | First time only             |
| npm run build       | 30-60 sec    | Vite build (Vue app)        |
| electron-builder    | 3-7 min      | Creating executables        |
| **Total (first)**   | **6-13 min** | Includes dependency install |
| **Total (rebuild)** | **4-8 min**  | No dependency install       |

---

## 🎯 Advanced Build Options

### Multi-Platform Builds (Future)

**Build for Multiple Platforms** (requires respective OS):

```json
"build": {
  "mac": {
    "target": ["dmg", "zip"],
    "category": "public.app-category.medical"
  },
  "linux": {
    "target": ["AppImage", "deb"],
    "category": "Office"
  }
}
```

**Cross-platform build** (limited support):

```powershell
# Windows can build for Linux (limited)
electron-builder --linux --x64

# macOS requires Mac hardware
```

---

### Auto-Update Configuration (Future Enhancement)

```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "your-github-username",
    "repo": "pharmacy-pos"
  }
}
```

---

### Custom Build Scripts

Create `scripts/build.js` for complex build workflows:

```javascript
const builder = require('electron-builder');

builder
  .build({
    targets: builder.Platform.WINDOWS.createTarget(),
    config: {
      // Custom configuration
    },
  })
  .then(() => {
    console.log('Build complete!');
  })
  .catch((error) => {
    console.error('Build failed:', error);
  });
```

---

## 📝 Build Logs

### Viewing Build Logs

**During Build:**

- All output printed to console
- Errors shown in red
- Warnings in yellow

**After Build:**

- Check `dist-electron/builder-debug.yml`
- Contains build configuration used
- Useful for troubleshooting

**Enable Verbose Logging:**

```powershell
# Set debug environment variable
$env:DEBUG="electron-builder"

# Run build
npm run electron:build
```

---

## ✅ Final Checklist

Before considering build complete:

- [ ] Both installer and portable versions built successfully
- [ ] Executables launch without errors
- [ ] Application connects to database
- [ ] All features tested and working
- [ ] Icon displays correctly (not default Electron icon)
- [ ] Version number is correct
- [ ] File sizes are reasonable (~100-150 MB)
- [ ] Tested on clean Windows machine
- [ ] No console errors during normal use
- [ ] README and documentation updated
- [ ] Distribution package created
- [ ] Backup of build files created

---

## 🆘 Getting Help

### Support Resources

**Documentation:**

- `README.md` - Main project documentation
- `USER_GUIDE.md` - End-user instructions
- `DEVELOPMENT_STANDARDS.md` - Development guidelines
- `PROJECT_PLAN.md` - Project roadmap

**Common Issues:**

- Check GitHub Issues: [your-repo-url]/issues
- electron-builder docs: https://www.electron.build/
- Electron docs: https://www.electronjs.org/docs

**Contact:**

- Email: support@yourdomain.com
- GitHub: [your-github-url]

---

## 🎉 Success!

If you've followed this guide successfully:

- ✅ You have working Windows installer
- ✅ You have portable executable
- ✅ Application tested and verified
- ✅ Ready for distribution

**Congratulations! Your Pharmacy POS System is ready to deploy!** 🚀

---

**Document Version:** 1.0  
**Last Updated:** November 23, 2025  
**Compatibility:** Windows 10/11 (64-bit)
