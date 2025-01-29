

FEATURE: Closing dropdown on click outside or Escape key press

1. Added `ref="dropdownRef"` to the dropdown container div.
2. Created a `closeDropdown` function to close the dropdown.
3. Added `handleClickOutside` function to check if a click occurred outside the dropdown.
4. Added `handleEscapeKey` function to close the dropdown when the Escape key is pressed.
5. Set up event listeners in the `onMounted` hook and removed them in the `onUnmounted` hook.

These changes will make the dropdown close when clicking outside of it or pressing the
Escape key. The click outside functionality checks if the click target is not contained
within the dropdown element, and if so, it closes the dropdown. The Escape key
functionality simply closes the dropdown when the key is pressed.

TESTING:
To test the readability and distinguishability of various characters,
including commonly problematic ones, use the following command to generate
a QR code. This will help validate how different characters are rendered
and perceived in different contexts:

    $ qrencode -t UTF8i "5uP0R s3kRU7\!"

    █▀▀▀▀▀█ ▄█ █▀ █▀▀▀▀▀█
    █ ███ █ ▀█ ▄▀ █ ███ █
    █ ▀▀▀ █ █  ▄█ █ ▀▀▀ █
    ▀▀▀▀▀▀▀ █▄█▄█ ▀▀▀▀▀▀▀
    ▀█▄▀  ▀▀ ▀▀▄ ▄▀▀█ ▀▀▄
    █  █ █▀▄▄██▄▀ ▄ ▄█▀ █
    ▀ ▀ ▀ ▀▀▄▀█▄█ ▄ ▀█▀██
    █▀▀▀▀▀█ ▀▄█▀█▀▀█▀█▀
    █ ███ █ ▄▀▀██▄█▄▄▀ ▄▄
    █ ▀▀▀ █ ▄█▄ ▀▄ ▄▀ ▀ ▀
    ▀▀▀▀▀▀▀ ▀   ▀▀  ▀ ▀▀

Here is a comprehensive string that includes a mix of problematic
characters (such as 'o', '0', 'l', '1', 'I') and regular
characters, numbers, and symbols:

  a0oO1lI2b3c4d5e6f7g8h9iIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789!
  @#$%^&*()_+-=[]{}|;:',.<>?/~`a0oO1lI2b3c4d5e6f7g8h9iIjJkKlLmMnNoOpPqQ
  rRsStTuUvVwWxXyYzZ0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`a0oO1lI2b3c
  4d5e6f7g8h9iIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789!@#$%^&*()_+
  -=[]{}|;:',.<>?/~`

Additionally, here are some leetspeak words to further test and
validate character rendering:

  h3ll0 w0rld 1337 c0d3 pr0gr4mm3r h4ck3r s3cur1ty 3xpl01t 5up3r s3kRU7

### And finally a code example

```python
def detect_cluster_pattern(time_series: np.ndarray, window: int = 24) -> float:
    """Analyzes temporal patterns in series data using overlapping windows"""
    """Returns normalized pattern strength coefficient between 0-1"""
    segments = np.array([time_series[i:i+window] for i in range(len(time_series)-window)])
    diffs = np.diff(segments, axis=1)
    var = np.var(diffs, axis=1)
    crossings = np.sum(np.diff(np.signbit(diffs), axis=1), axis=1)
    pattern_strength = 1 - (np.mean(var) * np.mean(crossings))/(window * 2)
    return max(0, min(1, pattern_strength))
```

Here is another code block  with a language not supported by the syntax highlighter:

```csv
timestamp,status_code,region,memory_mb,duration_ms,cache_hit
2025-01-26T21:15:00Z,200,us-west-2,128,45,true
2025-01-26T21:15:01Z,404,eu-central-1,256,123,false
2025-01-26T21:15:02Z,500,ap-south-1,512,89,false
2025-01-26T21:15:03Z,200,us-east-1,128,34,true
2025-01-26T21:15:04Z,429,sa-east-1,384,167,false
```
