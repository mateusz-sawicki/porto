# Individual Tooth Vertical Positioning

This implementation allows you to position each tooth individually by setting a vertical offset value.

## Mock Data Configuration

Vertical positioning is now configured in the mock data. Offsets are optional and can be set in the initial tooth data:

```typescript
// In getInitialPermanentTeeth() or getInitialPediatricTeeth()
{ number: '17', toothProcedures: [], schemaProcedures: [], verticalOffset: -10 }, // Move up 10px
{ number: '15', toothProcedures: [], schemaProcedures: [], verticalOffset: 15 },  // Move down 15px  
{ number: '16', toothProcedures: [], schemaProcedures: [] }, // No offset (default position)
```

## Programmatic Usage

You can still programmatically adjust offsets:

```typescript
// In your component or composable
const odontogram = useOdontogram()

// Set individual vertical offset for specific teeth
// Positive values move the tooth down, negative values move it up
odontogram.setToothVerticalOffset('11', -20) // Move tooth 11 up by 20px
odontogram.setToothVerticalOffset('21', 15)  // Move tooth 21 down by 15px

// Reset vertical offset
odontogram.resetToothVerticalOffset('11') // Remove custom offset for tooth 11
```

## How it works

1. **Data Structure**: Added `verticalOffset?: number` property to the `ToothData` interface
2. **Positioning Logic**: The `ToothContainer.vue` component applies the vertical offset using CSS transforms
3. **Management Functions**: The `useOdontogram` composable provides helper functions to set and reset offsets

## Features

- **Individual Control**: Each tooth can have its own vertical position
- **Positive/Negative Values**: Positive values move down, negative values move up
- **Affects All Components**: Both the tooth and schematic elements move together
- **Persistent**: The offset is stored in the tooth data structure
- **Resetable**: Can be reset to default positioning

## Technical Implementation

The vertical offset is applied to:
- The main tooth components wrapper (`tooth-components-wrapper`)
- The schematic component for both top and bottom directions
- Uses CSS `transform: translateY()` for smooth positioning
- Works alongside existing impacted tooth positioning logic