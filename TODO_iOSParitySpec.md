# Bridge Up Android - iOS Parity Specification

## 1. API Endpoints & Data Structures

### Endpoints

| Endpoint                         | Type      | Purpose                           |
|----------------------------------|-----------|-----------------------------------|
| https://api.bridgeup.app/bridges | HTTP GET  | Initial data load                 |
| wss://api.bridgeup.app/ws        | WebSocket | Real-time updates                 |
| https://api.bridgeup.app/boats   | HTTP GET  | Vessel positions (poll every 30s) |

### JSON Response Structure

```kotlin
// Bridge Response (HTTP & WebSocket)
data class BridgeResponse(
    @SerialName("last_updated") val lastUpdated: String?,
    @SerialName("available_bridges") val availableBridges: List<AvailableBridge>,
    val bridges: Map<String, BridgeData>
)

data class AvailableBridge(
    val id: String,
    val name: String,
    val region: String,
    @SerialName("region_short") val regionShort: String
)

data class BridgeData(
    @SerialName("static") val staticData: StaticBridgeData,
    @SerialName("live") val liveData: LiveBridgeData
)

data class StaticBridgeData(
    val name: String,
    val region: String,
    @SerialName("region_short") val regionShort: String,
    val coordinates: Coordinates,
    val statistics: Statistics
)

data class Coordinates(
    val lat: Double,
    val lng: Double
)

data class LiveBridgeData(
    val status: String,  // "open", "closed", "closing soon", "closing", "opening", "construction", "unknown"
    @SerialName("last_updated") val lastUpdated: Instant,
    @SerialName("upcoming_closures") val upcomingClosures: List<UpcomingClosure>?,
    val predicted: PredictedTime?,
    @SerialName("responsible_vessel_mmsi") val responsibleVesselMmsi: Int?
)

data class PredictedTime(
    val lower: Instant,
    val upper: Instant
)

data class UpcomingClosure(
    val type: String,  // "Commercial Vessel", "Pleasure Craft", "Next Arrival", "Construction"
    val time: Instant,
    val longer: Boolean,
    @SerialName("end_time") val endTime: Instant?,
    @SerialName("expected_duration_minutes") val expectedDurationMinutes: Int?
)

data class Statistics(
    @SerialName("average_closure_duration") val averageClosureDuration: Int?,
    @SerialName("closure_ci") val closureCI: ConfidenceInterval?,
    @SerialName("average_raising_soon") val averageRaisingSoon: Int?,
    @SerialName("raising_soon_ci") val raisingSoonCI: ConfidenceInterval?,
    @SerialName("closure_durations") val closureDurations: ClosureDurations?,
    @SerialName("total_entries") val totalEntries: Int?
)

data class ConfidenceInterval(
    val lower: Int,
    val upper: Int
)

data class ClosureDurations(
    @SerialName("under_9m") val under9m: Int,
    @SerialName("10_15m") val from10to15m: Int,
    @SerialName("16_30m") val from16to30m: Int,
    @SerialName("31_60m") val from31to60m: Int,
    @SerialName("over_60m") val over60m: Int
)
```

### Vessel/Boat Response

```kotlin
data class BoatsResponse(
    @SerialName("last_updated") val lastUpdated: Instant,
    @SerialName("vessel_count") val vesselCount: Int,
    val vessels: List<Vessel>
)

data class Vessel(
    val mmsi: Int,
    val name: String?,
    @SerialName("type_name") val typeName: String,
    @SerialName("type_category") val typeCategory: String,
    val position: VesselPosition,
    val heading: Int?,
    val course: Double?,
    @SerialName("speed_knots") val speedKnots: Double,
    val destination: String?,
    val dimensions: VesselDimensions?,
    @SerialName("last_seen") val lastSeen: Instant,
    val source: String,
    val region: String  // "welland" or "montreal"
)

data class VesselPosition(
    val lat: Double,
    val lon: Double
)

data class VesselDimensions(
    val length: Int,
    val width: Int
)
```

---

## 2. Status Values & Color Mappings

### Bridge Status Enum

```kotlin
enum class BridgeStatus(val apiValue: String) {
    OPEN("open"),
    CLOSED("closed"),
    CLOSING_SOON("closing soon"),
    CLOSING("closing"),
    OPENING("opening"),
    CONSTRUCTION("construction"),
    UNKNOWN("unknown");

    companion object {
        fun fromApi(value: String): BridgeStatus {
            return entries.find { it.apiValue.equals(value, ignoreCase = true) } ?: UNKNOWN
        }
    }
}
```

### Status Colors (EXACT values from iOS)

```kotlin
object StatusColors {
    // Light Mode Colors
    val OPEN = Color(0xFF30D158)           // systemGreen
    val CLOSED = Color(0xFFFF3B30)         // systemRed
    val CLOSING_SOON = Color(0xFF30D158)   // systemGreen (primary), with orange/yellow badge
    val CLOSING = Color(0xFFFF3B30)        // systemRed
    val OPENING_LIGHT = Color(0xFFFF9500)  // systemOrange in light mode
    val OPENING_DARK = Color(0xFFFFD60A)   // systemYellow in dark mode
    val CONSTRUCTION = Color(0xFFFF3B30)   // systemRed
    val UNKNOWN = Color(0xFF8E8E93)        // systemGray (brown on iOS for icon)

    // Closing Soon Badge Colors
    val CLOSING_SOON_BADGE_LIGHT = Color(0xFFFF9500)  // systemOrange
    val CLOSING_SOON_BADGE_DARK = Color(0xFFFFD60A)   // systemYellow

    fun statusColor(status: BridgeStatus, isDarkMode: Boolean): Color {
        return when (status) {
            BridgeStatus.OPEN, BridgeStatus.CLOSING_SOON -> OPEN  // Green
            BridgeStatus.CLOSED, BridgeStatus.CLOSING, BridgeStatus.CONSTRUCTION -> CLOSED  // Red
            BridgeStatus.OPENING -> if (isDarkMode) OPENING_DARK else OPENING_LIGHT
            BridgeStatus.UNKNOWN -> UNKNOWN
        }
    }
}
```

### Status Icons (SF Symbol -> Material Icon mapping)

| iOS SF Symbol                                  | Android Material Icon        | Status          |
|------------------------------------------------|------------------------------|-----------------|
| checkmark.circle                               | check_circle                 | open            |
| checkmark.circle.trianglebadge.exclamationmark | check_circle + warning badge | closing soon    |
| xmark.circle                                   | cancel                       | closed, closing |
| clock.arrow.2.circlepath                       | update or restore            | opening         |
| hammer.circle                                  | construction                 | construction    |
| questionmark.circle                            | help                         | unknown         |

---

## 3. Localization Strings (English)

### Status Display Text

```kotlin
object StatusStrings {
    val STATUS_OPEN = "Open now"
    val STATUS_CLOSED = "Closed now"
    val STATUS_CLOSING_SOON = "Closing soon"
    val STATUS_CLOSING = "Closing..."
    val STATUS_OPENING = "Opening..."
    val STATUS_CONSTRUCTION = "Construction"
    val STATUS_UNKNOWN = "Unknown"
}
```

### Closure Type Display Names

```kotlin
object ClosureTypeStrings {
    val COMMERCIAL_VESSEL = "Commercial"
    val PLEASURE_CRAFT = "Personal"
    val NEXT_ARRIVAL = "Boat"
    val CONSTRUCTION = "Construction"
    val A_BOAT = "a boat"  // Used in info text: "closing for a boat"
}
```

### Info Text Templates (CRITICAL - match exactly)

```kotlin
// Open status
"Opened %s"                                     // "Opened 5:30pm"
"Open, closing for %s in about %dm"             // "Open, closing for a boat in about 10m"
"Open, but construction was scheduled for %s"   // When construction is overdue

// Closing Soon status
"Closing soon for %s in about %dm"              // "Closing soon for a boat in about 5m"
"Closing soon for %s (was expected at %s)"      // When closure is overdue
"Closing soon in %d - %dm"                      // "Closing soon in 3 - 7m" (from prediction)
"Closing soon (longer than usual)"              // When prediction is 0-0
"Closing soon"                                  // Fallback

// Closing status
"Just missed it, the bridge is closing"

// Closed status
"Closed, opens in ~%dm"                         // When lower == upper
"Closed, opens in %d - %dm"                     // "Closed, opens in 10 - 20m"
"Closed %s (longer than usual)"                 // "Closed 5:30pm (longer than usual)"

// Construction status
"Closed for construction, opens in %dd"         // Days
"Closed for construction, opens in %dh %dm"     // Hours and minutes
"Closed for construction, opens in %dm"         // Minutes only
"Closed for unscheduled construction, unknown opening"

// Opening status
"Will be open in a few moments"

// Unknown status
"Bridge status is unknown or unavailable"
```

### UI Labels

```kotlin
object UIStrings {
    // Navigation
    val MY_BRIDGES = "My Bridges"
    val SETTINGS = "Settings"
    val MAP = "Map"
    val BRIDGES = "Bridges"
    val LIST = "List"

    // Settings
    val GENERAL_DISPLAY = "General display"
    val SORT_LIST_BY = "Sort list by"
    val FOCUS_MAP_ON = "Focus map on"
    val NAVIGATION_APP = "Navigation app"
    val SHOW_BOATS_ON_MAP = "Show boats on map"
    val YOUR_LOCATION_USED = "Your location is used to map nearby bridges."

    // Sort options
    val SORT_NAME_ASC = "Bridge name (A to Z)"
    val SORT_NAME_DESC = "Bridge name (Z to A)"
    val SORT_DISTANCE = "Distance to me"
    val SORT_STATUS = "Open status"

    // Map display options
    val MAP_MY_LOCATION = "My location"
    val MAP_ALL_BRIDGES = "All bridges"
    val MAP_NEARBY_BRIDGES = "Nearby bridges"

    // Detail view
    val CLOSED_FOR = "Closed for"
    val CLOSING_SOON_DURATION = "Closing soon"
    val CHANGED_AT = "Changed at"
    val NAVIGATE_TO_BRIDGE = "Navigate to bridge"
    val UPCOMING_CLOSURES = "Upcoming closures"
    val NO_UPCOMING_CLOSURES = "No upcoming closures"
    val CLOSED_FOR_DURATIONS = "Closed for durations"
    val CONFIDENCE_INTERVALS = "Confidence intervals (95% CI)"
    val STATISTICS_FOOTER = "Statistics calculated using %d closure and closing soon events."

    // Time formats
    val DRIVING_LESS_THAN_1_MIN = "< 1 min"
    val DRIVING_1_MIN = "1 min"
    val DRIVING_MINUTES = "%d min"
    val AVG_MINUTES = "%dm avg"
    val DURATION_RANGE = "%d-%dm"

    // Vessel
    val SPEED = "Speed"
    val HEADING = "Heading"
    val SIZE = "Size"
    val STATIONARY = "Stationary"
    val UNKNOWN_VESSEL = "Unknown Vessel"
    val UPDATED_AGO = "Updated %ds ago from %s"
    val LOCAL_ANTENNA = "Local Antenna"
    val CLOSE = "Close"

    // Closure types
    val LONGER_CLOSURE = "Longer Closure"
    val EXPECTED_ARRIVAL_AT = "Expected arrival at %s"
    val DURATION_LABEL = "Duration: %s"
    val TODAY = "Today"
    val TOMORROW = "Tomorrow"

    // CarPlay / Android Auto
    val LOADING_BRIDGES = "Loading bridges..."
    val NO_BRIDGES_SELECTED = "No Bridges Selected"
    val SELECT_BRIDGES_IN_PHONE = "Select bridges in the phone app"
    val CONNECTION_ERROR = "Connection Error"
    val NEARBY_BRIDGES_TITLE = "Nearby Bridges"
    val STATUS = "Status"
    val INFO = "Info"

    // Links
    val WEBSITE = "Website"
    val PRIVACY_POLICY = "Privacy policy"
    val TERMS = "Terms and conditions"
    val COPYRIGHT = "© 2025 Bridge Up. All rights reserved."

    // Location permission
    val LOCATION_NEEDED = "We need your location to show nearby bridges on the map."
    val REQUEST_LOCATION = "Request Location Access"
    val LOCATION_ERROR = "There was a problem getting your location. Please enable location in settings or if you've already done that restart the app."
    val OPEN_APP_SETTINGS = "Open App Settings"
}
```

---

## 4. Region Mapping

### Region Codes & Full Names

```kotlin
enum class Region(val code: String, val fullName: String) {
    ST_CATHARINES("SCT", "St. Catharines"),
    PORT_COLBORNE("PC", "Port Colborne"),
    MONTREAL_SOUTH_SHORE("MSS", "Montreal South Shore"),
    SOUTH_BEAUHARNOIS("SBS", "South Beauharnois"),
    KAHNAWAKE("K", "Kahnawake");
}

// Display order in settings
val REGION_DISPLAY_ORDER = listOf("SCT", "PC", "MSS", "SBS", "K")
```

### Bridge ID to Region Mapping

```kotlin
fun getRegionFromBridgeId(bridgeId: String): String? {
    return when {
        bridgeId.startsWith("SCT_") -> "SCT"
        bridgeId.startsWith("PC_") -> "PC"
        bridgeId.startsWith("MSS_") -> "MSS"
        bridgeId.startsWith("SBS_") -> "SBS"
        bridgeId.startsWith("K_") -> "K"
        else -> null
    }
}
```

### Bridge to Vessel Region Mapping

```kotlin
fun getVesselRegion(bridgeId: String): String? {
    return when {
        bridgeId.startsWith("SCT_") || bridgeId.startsWith("PC_") -> "welland"
        bridgeId.startsWith("MSS_") || bridgeId.startsWith("SBS_") || bridgeId.startsWith("K_") -> "montreal"
        else -> null
    }
}

// Filter vessels by user's selected bridge regions
fun filterVesselsForSelectedBridges(
    vessels: List<Vessel>,
    selectedBridgeIds: Set<String>
): List<Vessel> {
    val activeRegions = selectedBridgeIds.mapNotNull { getVesselRegion(it) }.toSet()
    return vessels.filter { it.region in activeRegions }
}
```

---

## 5. Default Settings & Persistence

### UserDefaults Keys (-> DataStore keys)

```kotlin
object PreferenceKeys {
    val SELECTED_BRIDGES = stringSetPreferencesKey("SelectedBridges")
    val SORT_MODE = stringPreferencesKey("SortMode")
    val MAP_DISPLAY_MODE = stringPreferencesKey("MapDisplayMode")
    val PREFERRED_NAVIGATION_APP = stringPreferencesKey("PreferredNavigationApp")
    val SHOW_BOATS = booleanPreferencesKey("ShowBoats")
    val LAST_KNOWN_LATITUDE = doublePreferencesKey("lastKnownLatitude")
    val LAST_KNOWN_LONGITUDE = doublePreferencesKey("lastKnownLongitude")
}
```

### Default Values

```kotlin
// Default selected bridges (St. Catharines only)
val DEFAULT_SELECTED_BRIDGES = setOf(
    "SCT_Highway",
    "SCT_GlendaleAve",
    "SCT_QueenstonSt",
    "SCT_LakeshoreRd",
    "SCT_CarltonSt"
)

val DEFAULT_SORT_MODE = "name"
val DEFAULT_MAP_DISPLAY_MODE = "allBridges"
val DEFAULT_NAVIGATION_APP = "google_maps"  // Android default
val DEFAULT_SHOW_BOATS = true
```

---

## 6. WebSocket Connection Logic

### Reconnection Parameters

```kotlin
object WebSocketConfig {
    const val URL = "wss://api.bridgeup.app/ws"
    const val PING_INTERVAL_MS = 30_000L        // 30 seconds
    const val MAX_RECONNECT_ATTEMPTS = 10
    const val MAX_RECONNECT_DELAY_MS = 60_000L  // 60 seconds
    const val INITIAL_RECONNECT_DELAY_MS = 1_000L  // 1 second

    // Exponential backoff: delay = min(2^(attempt-1) * 1000, 60000)
    fun calculateReconnectDelay(attempt: Int): Long {
        val delay = (1L shl (attempt - 1)) * INITIAL_RECONNECT_DELAY_MS
        return minOf(delay, MAX_RECONNECT_DELAY_MS)
    }
}
```

### Connection Lifecycle

- Connect WebSocket when app is in foreground
- Disconnect when app goes to background
- HTTP fallback for initial data load (faster startup)
- JSON date format: ISO8601 with fractional seconds

---

## 7. Info Text Generation Logic (CRITICAL)

```kotlin
fun generateInfoText(bridge: Bridge, currentDate: Instant): String {
    val live = bridge.liveData

    return when (live.status.lowercase()) {
        "open" -> {
            // Check for upcoming closure within 1 hour
            val nextClosure = live.upcomingClosures?.firstOrNull()
            if (nextClosure != null && nextClosure.time < currentDate.plus(1.hours)) {
                if (nextClosure.type.lowercase() == "construction" && nextClosure.time < currentDate) {
                    // Construction scheduled but hasn't started
                    "Open, but construction was scheduled for ${formatTime(nextClosure.time)}"
                } else {
                    val minutes = maxOf(1, Duration.between(currentDate, nextClosure.time).toMinutes().toInt())
                    val displayType = formatClosureTypeForSentence(nextClosure.type)
                    "Open, closing for $displayType in about ${minutes}m"
                }
            } else {
                // No upcoming closure - show when it opened
                val openedTime = formatTimeOrDate(live.lastUpdated, currentDate)
                "Opened $openedTime"
            }
        }

        "closing soon" -> {
            val closure = live.upcomingClosures?.firstOrNull()
            if (closure != null) {
                if (closure.time < currentDate) {
                    // Closure is late
                    val displayType = formatClosureTypeForSentence(closure.type)
                    "Closing soon for $displayType (was expected at ${formatTime(closure.time)})"
                } else {
                    val minutes = Duration.between(currentDate, closure.time).toMinutes().toInt()
                    if (minutes < 60) {
                        val displayType = formatClosureTypeForSentence(closure.type)
                        "Closing soon for $displayType in about ${maxOf(1, minutes)}m"
                    } else null
                }
            } else null
            ?: run {
                // Fall back to prediction
                live.predicted?.let { predicted ->
                    val lower = maxOf(0, Duration.between(currentDate, predicted.lower).toMinutes().toInt())
                    val upper = maxOf(0, Duration.between(currentDate, predicted.upper).toMinutes().toInt())
                    if (lower == 0 && upper == 0) {
                        "Closing soon (longer than usual)"
                    } else {
                        "Closing soon in $lower - ${upper}m"
                    }
                } ?: "Closing soon"
            }
        }

        "closing" -> "Just missed it, the bridge is closing"

        "closed" -> {
            live.predicted?.let { predicted ->
                val lower = maxOf(0, Duration.between(currentDate, predicted.lower).toMinutes().toInt())
                val upper = maxOf(0, Duration.between(currentDate, predicted.upper).toMinutes().toInt())
                if (lower == 0 && upper == 0) {
                    val closedTime = formatTimeOrDate(live.lastUpdated, currentDate)
                    "Closed $closedTime (longer than usual)"
                } else if (lower == upper) {
                    "Closed, opens in ~${lower}m"
                } else {
                    "Closed, opens in $lower - ${upper}m"
                }
            } ?: run {
                val closedTime = formatTimeOrDate(live.lastUpdated, currentDate)
                "Closed $closedTime (longer than usual)"
            }
        }

        "construction" -> {
            live.predicted?.let { predicted ->
                val totalMinutes = Duration.between(currentDate, predicted.lower).toMinutes().toInt()
                when {
                    totalMinutes > 24 * 60 -> {
                        val days = totalMinutes / (24 * 60)
                        "Closed for construction, opens in ${days}d"
                    }
                    totalMinutes / 60 > 0 -> {
                        val hours = totalMinutes / 60
                        val minutes = totalMinutes % 60
                        "Closed for construction, opens in ${hours}h ${minutes}m"
                    }
                    else -> "Closed for construction, opens in ${totalMinutes}m"
                }
            } ?: "Closed for unscheduled construction, unknown opening"
        }

        "opening" -> "Will be open in a few moments"

        else -> "Bridge status is unknown or unavailable"
    }
}

private fun formatClosureTypeForSentence(type: String): String {
    return when (type.lowercase()) {
        "commercial vessel", "pleasure craft", "next arrival" -> "a boat"
        "construction" -> "construction"
        else -> type.lowercase()
    }
}

private fun formatTimeOrDate(date: Instant, currentDate: Instant): String {
    return if (date.toLocalDate() == currentDate.toLocalDate()) {
        formatTime(date)  // "5:30pm"
    } else {
        formatDate(date)  // "Dec 25, 5:30pm"
    }
}
```

---

## 8. Distance & Sorting Logic

### Distance Formatting

```kotlin
fun formatDistance(meters: Double): String {
    return when {
        meters < 1000 -> "${meters.roundToInt()} m"
        meters < 10000 -> String.format("%.1f km", meters / 1000)
        else -> "${(meters / 1000).roundToInt()} km"
    }
}
```

### Nearby Bridge Threshold

```kotlin
// Threshold: 4km OR 150% of closest bridge distance
fun nearbyBridges(bridges: List<Bridge>, userLocation: Location): List<Bridge> {
    val sorted = bridges.sortedBy { it.distanceTo(userLocation) }
    val firstDistance = sorted.firstOrNull()?.distanceTo(userLocation) ?: return emptyList()
    val threshold = maxOf(4000.0, firstDistance * 1.5)
    return sorted.filter { it.distanceTo(userLocation) <= threshold }
}
```

### Status Sort Order

```kotlin
val STATUS_SORT_ORDER = listOf(
    "open",
    "closing soon",
    "opening",
    "closing",
    "closed",
    "construction",
    "unknown"
)
```

---

## 9. Vessel Display Logic

### Speed States

```kotlin
enum class VesselSpeedState(
    val wakeDotCount: Int,
    val opacity: Float,
    val scale: Float
) {
    STATIONARY(0, 0.7f, 0.85f),   // < 0.5 knots
    SLOW(1, 1.0f, 1.0f),          // 0.5 - 2 knots
    MODERATE(2, 1.0f, 1.0f),      // 2 - 4 knots
    FAST(3, 1.0f, 1.0f);          // 4+ knots

    companion object {
        fun fromSpeed(knots: Double): VesselSpeedState {
            return when {
                knots < 0.5 -> STATIONARY
                knots < 2.0 -> SLOW
                knots < 4.0 -> MODERATE
                else -> FAST
            }
        }
    }
}
```

### Vessel Emoji by Type

```kotlin
fun vesselEmoji(typeCategory: String): String {
    val category = typeCategory.lowercase()
    return when {
        category.contains("sail") -> "⛵"
        listOf("passenger", "ferry", "cruise").any { category.contains(it) } -> "⛴️"
        category.contains("tanker") -> "🛳️"
        listOf("cargo", "bulk", "container", "freighter").any { category.contains(it) } -> "🚢"
        else -> "🛥️"
    }
}
```

### Vessel Heading Logic

```kotlin
// Prefer heading, fall back to course when moving
fun effectiveHeading(vessel: Vessel): Int? {
    vessel.heading?.let { return it }
    if (vessel.course != null && vessel.speedKnots >= 0.5) {
        return vessel.course.roundToInt() % 360
    }
    return null
}
```

### Responsible Vessel Highlighting

```kotlin
// Border colors for vessels responsible for bridge closures
object VesselBorderColors {
    val NORMAL = Color.White.copy(alpha = 0.15f)           // 1px solid
    val CLOSING_SOON = Color(0xFFFBBF24)                   // #FBBF24 - 1px dashed yellow
    val CLOSED = Color(0xFFEF4444)                          // #EF4444 - 1px dashed red
}
```

### Wake Animation Colors

```kotlin
val WAKE_COLOR = Color(0xFF78B4FF)  // Light blue (#78B4FF)
```

---

## 10. Navigation App Integration

### URL Schemes

```kotlin
enum class NavigationApp(val id: String, val displayName: String) {
    GOOGLE_MAPS("google_maps", "Google Maps"),
    WAZE("waze", "Waze");

    fun navigationUrl(lat: Double, lon: Double): String {
        return when (this) {
            GOOGLE_MAPS -> "google.navigation:q=$lat,$lon&mode=d"
            WAZE -> "waze://?ll=$lat,$lon&navigate=yes"
        }
    }

    fun isInstalled(context: Context): Boolean {
        val intent = when (this) {
            GOOGLE_MAPS -> Intent(Intent.ACTION_VIEW, Uri.parse("google.navigation:q=0,0"))
            WAZE -> Intent(Intent.ACTION_VIEW, Uri.parse("waze://"))
        }
        return intent.resolveActivity(context.packageManager) != null
    }
}

// Fallback to Google Maps navigation Intent if preferred app fails
fun openNavigation(context: Context, lat: Double, lon: Double, preferredApp: NavigationApp) {
    try {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(preferredApp.navigationUrl(lat, lon)))
        context.startActivity(intent)
    } catch (e: Exception) {
        // Fallback to Google Maps web
        val fallbackUrl = "https://www.google.com/maps/dir/?api=1&destination=$lat,$lon&travelmode=driving"
        context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl)))
    }
}
```

---

## 11. Date/Time Formatting

```kotlin
object DateFormatters {
    // Time only: "5:30pm"
    val TIME_FORMAT = SimpleDateFormat("h:mma", Locale.US).apply {
        // Use lowercase am/pm
    }

    // Date + time: "Dec 25, 5:30pm"
    val DATE_TIME_FORMAT = SimpleDateFormat("MMM d, h:mma", Locale.US)

    // Day + date + time: "Wed, Dec 25 5:30pm"
    val FULL_DATE_FORMAT = SimpleDateFormat("EEE, MMM d h:mma", Locale.US)

    fun formatTime(instant: Instant): String {
        return TIME_FORMAT.format(Date.from(instant)).lowercase()
    }

    fun formatDateTime(instant: Instant): String {
        return DATE_TIME_FORMAT.format(Date.from(instant)).lowercase().replace("am", "am").replace("pm", "pm")
    }
}
```

---

## 12. Android Auto Specifics

### Constraints (same as CarPlay)

| Constraint       | Limit                 |
|------------------|-----------------------|
| List items       | 6 max                 |
| Row text         | 2 lines               |
| Actions per pane | 2 max                 |
| Custom UI        | None (templates only) |
| POI markers      | 4 max                 |

### Throttling

- List updates: 10 seconds minimum between updates
- POI updates: 60 seconds minimum between updates
- ETA refresh: 2.5 minutes (not on every list update)

### ETA Calculation

- Use Google Directions API (or Maps SDK) to calculate real driving ETA
- Only calculate ETA for the closest open bridge
- Format: "status • Xm drive • distance" when ETA available

---

## 13. UI Specifications

### List Row Layout

```
┌────────────────────────────────────────────────────────────┐
│ [Status Icon]  Bridge Name                           [>]   │
│   26pt          .title3.semibold                    16pt   │
│                 STATUS TEXT                                │
│                 10pt .heavy .uppercase .statusColor        │
│                 Info text here...                          │
│                 11pt .medium .secondary                    │
│                 [Closure Tags...]                          │
│                 8pt .bold                                  │
└────────────────────────────────────────────────────────────┘
```

### Detail Sheet Height

- Bridge detail: 600pt presentation detent
- Boat detail: 265pt presentation detent

### Map Marker Sizes

- Bridge marker: 38pt x 38pt circle with 28pt icon
- Boat marker: 22pt x 22pt circle with 11pt emoji

### Card Styling

```kotlin
// Card background
val cardBackground = MaterialTheme.colorScheme.surfaceVariant  // ~systemGray6
val cardBorder = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
val cardCornerRadius = 12.dp
val cardPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp)
```

### Closure Duration Bar Colors

```kotlin
val DURATION_BAR_COLORS = mapOf(
    "1-9m" to Color.Green,
    "10-15m" to Color.Green,
    "16-30m" to Color(0xFF30B0C7),  // Teal
    "31-60m" to Color(0xFFFF9500),  // Orange
    "60m+" to Color.Red
)
```

---

## 14. Closure Type Icons

```kotlin
fun closureTypeIcon(type: String): ImageVector {
    return when (type.lowercase()) {
        "commercial vessel", "next arrival" -> Icons.Filled.DirectionsBoat  // ferry.fill
        "pleasure craft" -> Icons.Filled.Sailing  // sailboat.fill
        "construction" -> Icons.Filled.Construction  // hammer.fill
        else -> Icons.Filled.DirectionsBoat
    }
}
```

### Closure Type Emoji (for tags)

```kotlin
fun closureTypeEmoji(type: String): String {
    return when (type.lowercase()) {
        "commercial vessel" -> "🚢"
        "pleasure craft" -> "⛵️"
        "next arrival" -> "⛴️"
        "construction" -> "🚧"
        else -> ""
    }
}
```

---

## 15. External URLs

```kotlin
object AppUrls {
    const val WEBSITE = "https://www.bridgeup.app"
    const val PRIVACY = "https://www.bridgeup.app/privacy"
    const val TERMS = "https://www.bridgeup.app/terms"
}
```

---

## Summary of Critical Logic to Match

1. **Info text generation** - Must match iOS exactly (see section 7)
2. **Status colors** - Green for open/closing soon, Red for closed/closing/construction, Orange/Yellow for opening
3. **Closure type display** - "a boat" for vessel types, "construction" for construction
4. **Time highlighting** - Highlight time values (e.g., "10m", "3-7m") in orange (light) / yellow (dark)
5. **Prediction display** - Range format "X - Ym" with highlighted numbers
6. **Nearby threshold** - 4km OR 150% of closest bridge
7. **Vessel filtering** - Only show vessels in regions matching selected bridges
8. **Responsible vessel** - Yellow dashed border for closing soon, Red dashed for closed
9. **WebSocket reconnect** - Exponential backoff 1s->60s, max 10 attempts
10. **Android Auto throttling** - 10s list, 60s POI, 2.5m ETA refresh
