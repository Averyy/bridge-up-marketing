# Bridge Up Android - Implementation Plan

## Summary

| Platform | Stack | Car Support | Status |
|----------|-------|-------------|--------|
| iOS | Swift + SwiftUI | CarPlay | ✅ Done |
| Android | Kotlin + Compose | Android Auto | 📋 This plan |

**Effort**: 80-110 hours | **Cost**: $25 one-time Play Store fee

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  PRESENTATION                                        │
│  ┌─────────────────┐    ┌─────────────────────┐     │
│  │   Phone UI      │    │   Android Auto      │     │
│  │   (Compose)     │    │   (Car App Library) │     │
│  │ MapScreen       │    │ MainCarScreen       │     │
│  │ ListScreen      │    │ DetailCarScreen     │     │
│  │ SettingsScreen  │    │                     │     │
│  └────────┬────────┘    └──────────┬──────────┘     │
│           └──────────┬─────────────┘                │
│                      ▼                              │
│           ┌──────────────────┐                      │
│           │    ViewModels    │                      │
│           └────────┬─────────┘                      │
├────────────────────┼────────────────────────────────┤
│  DATA              ▼                                │
│  ┌────────────────────────────────────────────┐    │
│  │ Repositories                                │    │
│  │ • BridgeRepository (REST + WebSocket)      │    │
│  │ • VesselRepository (REST polling 30s)      │    │
│  │ • SettingsRepository (DataStore)           │    │
│  │ • LocationRepository (GPS)                 │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  Models: Bridge, Vessel, BridgeStatus, Region      │
├─────────────────────────────────────────────────────┤
│  CORE: Hilt DI • Constants • DistanceCalculator    │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Language | Kotlin 2.0 | Primary language |
| Min SDK | API 26 (Android 8.0+) | Target audience |
| Target SDK | API 35 | Latest stable |
| UI (Phone) | Jetpack Compose | Declarative UI |
| UI (Car) | Car App Library 1.4 | Android Auto |
| DI | Hilt | Dependency injection |
| Networking | Ktor | HTTP + WebSocket |
| JSON | Kotlinx Serialization | Parsing |
| Storage | DataStore | User preferences |
| Location | Play Services | GPS |
| Maps | Mapbox SDK | Map rendering |

---

## File Checklist (~57 files)

### Phase 1: Project Setup (4-6 hrs)

- [ ] Create project: `app.bridgeup.android`, API 26, Compose template
- [ ] `build.gradle.kts` - Dependencies + ProGuard/R8 minification enabled
- [ ] `local.properties` - Add `MAPBOX_TOKEN`
- [ ] `AndroidManifest.xml` - Permissions, Activity, CarAppService, deep links
- [ ] `BridgeUpApplication.kt` - Hilt entry point, Timber init (debug only)
- [ ] `proguard-rules.pro` - Keep rules for Ktor, Serialization

### Phase 2: Data Layer (12-16 hrs)

**Models** (`data/model/`)
- [ ] `Bridge.kt` - id, name, region, regionShort, lat/lng, status, prediction, statistics, upcomingClosures
- [ ] `BridgeStatus.kt` - Enum with colors (light/dark aware), `fromApi()` mapper
- [ ] `Region.kt` - Enum with codes (SCT, PC, MSS, SBS, K) and full names
- [ ] `Vessel.kt` - mmsi, name, typeCategory, lat/lng, heading, course, speedKnots, region
- [ ] `AppSettings.kt` - selectedBridges, sortMode, mapDisplayMode, navApp, showBoats
- [ ] `Statistics.kt` - averageClosureDuration, closureCI, closureDurations
- [ ] `UpcomingClosure.kt` - type, time, longer, endTime, expectedDurationMinutes

**DTOs** (`data/dto/`)
- [ ] `BridgeResponseDto.kt` - Full API response with availableBridges + bridges map
- [ ] `VesselResponseDto.kt` - API response with vessels list

**API** (`data/api/`)
- [ ] `BridgeApi.kt` - GET /bridges, GET /boats via Ktor
- [ ] `WebSocketManager.kt` - Connect, ping every 30s, exponential backoff reconnect (1s→60s, max 10 attempts)

**Repositories** (`data/repository/`)
- [ ] `BridgeRepository.kt` - bridges StateFlow, availableBridges, isLoading, error, filterBySelected()
- [ ] `VesselRepository.kt` - vessels StateFlow, poll every 30s, filterByRegions()
- [ ] `SettingsRepository.kt` - DataStore for all preferences (see Section 5 of parity spec)
- [ ] `LocationRepository.kt` - FusedLocationProvider, permission check, lastKnownLocation cache

### Phase 3: Phone UI (24-32 hrs)

**Theme** (`ui/theme/`)
- [ ] `Color.kt` - Status colors with light/dark variants (see parity spec section 2)
- [ ] `Theme.kt` - BridgeUpTheme with light AND dark schemes

**Components** (`ui/components/`)
- [ ] `BridgeStatusIcon.kt` - Icon + color based on status, closing soon uses overlay composite
- [ ] `BridgeListItem.kt` - Icon, name, status text (uppercase), info text, closure tags
- [ ] `BridgeInfoText.kt` - Generated info text with highlighted time values (orange/yellow)
- [ ] `ClosureTag.kt` - Emoji + type label for upcoming closures
- [ ] `VesselMarker.kt` - Emoji in circle, responsible vessel border, wake animation
- [ ] `WakeAnimation.kt` - 0-3 animated dots based on speed (stationary/slow/moderate/fast)
- [ ] `BridgeDetailSheet.kt` - Full detail with statistics, upcoming closures, navigate button
- [ ] `StatisticsChart.kt` - Simple horizontal bar chart for closure durations (no library needed)
- [ ] `LoadingState.kt` - Centered spinner
- [ ] `ErrorState.kt` - Error message with retry button
- [ ] `EmptyBridgesState.kt` - "No Bridges Selected" card with Settings button

**Phone Screens** (`ui/phone/`)
- [ ] `MainActivity.kt` - Hilt entry, splash, deep link, permission request
- [ ] `Navigation.kt` - BottomNav (Map/List/Settings), NavHost

**Map** (`ui/phone/map/`)
- [ ] `MapScreen.kt` - MapboxMap, bridge markers, vessel markers, floating action buttons
- [ ] `MapViewModel.kt` - bridges, vessels, selectedBridge, mapDisplayMode
- [ ] `MapFloatingButtons.kt` - 3 buttons: My Location, Nearby, All Bridges

**List** (`ui/phone/list/`)
- [ ] `ListScreen.kt` - LazyColumn grouped by region, pull-to-refresh, empty state
- [ ] `ListViewModel.kt` - filteredBridges, sortMode, triggerRefresh()

**Settings** (`ui/phone/settings/`)
- [ ] `SettingsScreen.kt` - Full settings with bridge selection by region
- [ ] `SettingsViewModel.kt` - all preferences, toggle bridge selection
- [ ] `BridgeSelectionSection.kt` - Region header + toggle for each bridge

**Settings Layout:**
```
├── General display (section)
│   ├── Sort list by (Picker: Name A-Z, Name Z-A, Distance, Status)
│   ├── Focus map on (Picker: My Location, All Bridges, Nearby)
│   ├── Navigation app (Picker: Google Maps, Waze)
│   └── Show boats on map (Toggle)
├── St. Catharines (section)
│   ├── ☑ Carlton St (Toggle)
│   ├── ☑ Glendale Ave (Toggle)
│   └── ... (alphabetical)
├── Port Colborne (section)
├── Montreal South Shore (section)
├── South Beauharnois (section)
├── Kahnawake (section)
├── Links (section)
│   ├── Website → bridgeup.app
│   ├── Privacy policy → bridgeup.app/privacy
│   └── Terms → bridgeup.app/terms
└── Footer: "© 2025 Bridge Up..."
```

**Permission Flow**
- [ ] Request `ACCESS_FINE_LOCATION` on first launch or settings toggle
- [ ] Handle denied/permanently denied states gracefully

**Haptic Feedback**
- [ ] Bridge row tap: light impact
- [ ] Button tap: medium impact
- [ ] Picker change: selection feedback

### Phase 4: Android Auto (16-22 hrs)

**Car Screens** (`ui/car/`)
- [ ] `BridgeCarAppService.kt` - CarAppService, creates Session
- [ ] `BridgeCarSession.kt` - Session, lifecycle observer, MainCarScreen
- [ ] `MainCarScreen.kt` - PlaceListMapTemplate, 6 bridges max, throttled updates (10s min)
- [ ] `BridgeDetailCarScreen.kt` - PaneTemplate, Navigate action
- [ ] `CarServiceLocator.kt` - Static repository access (Hilt workaround)
- [ ] `CarThrottler.kt` - Enforces 10s list / 60s POI / 2.5m ETA update intervals
- [ ] `EtaCalculator.kt` - Google Maps SDK Distance Matrix for closest open bridge ETA

**Resources**
- [ ] `res/xml/automotive_app_desc.xml` - POI capability declaration

**Car-Specific Requirements**
- [ ] Observe repository updates, call `invalidate()` with throttling
- [ ] Support light/dark via `CarContext.isDarkMode`
- [ ] Max 5 screens in navigation stack
- [ ] Format: "Status • Xm drive • distance" (ETA for closest open bridge only)
- [ ] ETA refresh every 2.5 minutes (not on every list update)

### Phase 5: Deep Linking (2-3 hrs)

- [ ] URL scheme: `bridgeup://bridge/{bridge_id}`
- [ ] Handle in MainActivity.onCreate via intent.data
- [ ] Handle onNewIntent for when app is already running
- [ ] Pass bridgeId to MapScreen, auto-select bridge

### Phase 6: Localization (4-6 hrs)

- [ ] `res/values/strings.xml` - English (copy from parity spec)
- [ ] `res/values-fr-rCA/strings.xml` - French Canadian (~60% from iOS, rest needs translation)
- [ ] `res/values-es-r419/strings.xml` - Latin American Spanish (~60% from iOS, rest needs translation)

**Already translated (copy from iOS):**
- Status strings (Open now, Closed now, etc.)
- Statistics footer

**Needs translation:**
- Info text templates
- Settings labels
- Error messages
- Navigation strings

### Phase 7: Testing & Release (6-8 hrs)

**Test Matrix**

| Feature | Phone | Auto |
|---------|-------|------|
| App launches < 10s | ☐ | ☐ |
| Content loads < 10s | ☐ | ☐ |
| Button response < 2s | ☐ | ☐ |
| List shows selected bridges | ☐ | ☐ |
| Map + markers | ☐ | — |
| Vessel markers | ☐ | — |
| Bridge detail + statistics | ☐ | ☐ |
| WebSocket live updates | ☐ | ☐ |
| Sort modes work | ☐ | — |
| Location sorting | ☐ | ☐ |
| Bridge selection persists | ☐ | — |
| Deep link opens bridge | ☐ | — |
| Pull-to-refresh | ☐ | — |
| Navigate action | ☐ | ☐ |
| EN/FR/ES | ☐ | ☐ |
| Light mode | ☐ | ☐ |
| Dark mode | ☐ | ☐ |
| Empty state (no bridges) | ☐ | ☐ |
| Error state (no network) | ☐ | ☐ |

**Android Auto Testing**
```bash
# Desktop Head Unit: SDK Manager → SDK Tools → Android Auto DHU
~/Library/Android/sdk/extras/google/auto/desktop-head-unit
```

**Release Checklist**
- [ ] Build release AAB (not APK)
- [ ] Enroll in Play App Signing
- [ ] Timber logs disabled in release build
- [ ] ProGuard/R8 minification enabled
- [ ] Test release build on physical device
- [ ] Version code incremented
- [ ] **New accounts only**: 20 testers, 14-day closed test

**Play Store Assets**
- [ ] App icon 512x512
- [ ] Feature graphic 1024x500
- [ ] Screenshots: Phone (Map, List, Settings, Detail) + Android Auto
- [ ] Short description (80 chars)
- [ ] Full description
- [ ] Privacy policy URL

---

## Key Patterns

### API Endpoints
```
GET  https://api.bridgeup.app/bridges
GET  https://api.bridgeup.app/boats
WSS  wss://api.bridgeup.app/ws
```

### Status Colors (Light / Dark)
```kotlin
OPEN          → 0xFF30D158 / 0xFF30D158 (green)
CLOSED        → 0xFFFF3B30 / 0xFFFF3B30 (red)
CLOSING_SOON  → 0xFF30D158 / 0xFF30D158 (green, with orange/yellow badge)
CLOSING       → 0xFFFF3B30 / 0xFFFF3B30 (red)
OPENING       → 0xFFFF9500 / 0xFFFFD60A (orange / yellow)
CONSTRUCTION  → 0xFFFF3B30 / 0xFFFF3B30 (red)
UNKNOWN       → 0xFF8E8E93 / 0xFF8E8E93 (gray)
```

### Info Text Highlighting
Time values like "10m", "3 - 7m" should be highlighted:
- Light mode: Orange (0xFFFF9500)
- Dark mode: Yellow (0xFFFFD60A)

### UI State Pattern
```kotlin
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
    object Empty : UiState<Nothing>()  // No bridges selected
}
```

### Nearby Bridge Threshold
```kotlin
// 4km OR 150% of closest bridge distance
fun nearbyBridges(bridges: List<Bridge>, location: Location): List<Bridge> {
    val sorted = bridges.sortedBy { it.distanceTo(location) }
    val threshold = maxOf(4000.0, sorted.first().distanceTo(location) * 1.5)
    return sorted.filter { it.distanceTo(location) <= threshold }
}
```

### Vessel Region Filtering
```kotlin
// Only show vessels in regions matching selected bridges
fun getVesselRegion(bridgeId: String) = when {
    bridgeId.startsWith("SCT_") || bridgeId.startsWith("PC_") -> "welland"
    else -> "montreal"
}
```

### Android Auto Constraints
| Constraint | Limit |
|------------|-------|
| List items | 6 max |
| Screen stack | 5 max |
| Row text | 2 lines |
| Actions per pane | 2 max |
| POI markers | 4 max |
| List update throttle | 10s min |
| POI update throttle | 60s min |

### Default Settings
```kotlin
val DEFAULT_SELECTED_BRIDGES = setOf(
    "SCT_Highway", "SCT_GlendaleAve", "SCT_QueenstonSt",
    "SCT_LakeshoreRd", "SCT_CarltonSt"
)
val DEFAULT_SORT_MODE = "name"
val DEFAULT_MAP_DISPLAY_MODE = "allBridges"
val DEFAULT_NAVIGATION_APP = "google_maps"
val DEFAULT_SHOW_BOATS = true
```

---

## V1 Scope Decisions

| Feature | V1 | Notes |
|---------|-----|-------|
| Bridge selection | ✅ | Core feature |
| Light + dark mode | ✅ | Required for parity |
| Statistics chart | ✅ | Simple bar chart |
| Android Auto ETA | ✅ | Google Maps SDK Distance Matrix, closest open bridge only |
| Wake animation | ✅ | 0-3 animated dots based on vessel speed |
| Responsible vessel borders | ✅ | Yellow dashed (closing soon), red dashed (closed) |

---

## Timeline

| Phase | Hours |
|-------|-------|
| 1. Project Setup | 4-6 |
| 2. Data Layer | 12-16 |
| 3. Phone UI | 24-32 |
| 4. Android Auto | 16-22 |
| 5. Deep Linking | 2-3 |
| 6. Localization | 4-6 |
| 7. Testing & Release | 6-8 |
| **Total** | **80-110** |

*Added ~4 hrs for wake animation, ~6 hrs for Android Auto ETA*

---

## References

- [iOS Parity Spec](./iOS_PARITY_SPEC.md) - Detailed iOS implementation reference
- [Android Auto Quality Guidelines](https://developer.android.com/docs/quality-guidelines/car-app-quality)
- [Car App Library Training](https://developer.android.com/training/cars/apps)
- [Car Samples GitHub](https://github.com/android/car-samples)
- [App Architecture Guide](https://developer.android.com/topic/architecture)
