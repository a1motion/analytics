# Analytics

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fa1motion%2Fanalytics.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fa1motion%2Fanalytics?ref=badge_shield)

Use Google Analytics without the huge overhead

## Install

```
yarn add @a1motion/analytics
```

## Usage

```
import analytics from '@a1motion/analytics`

# Only call once
analytics('UA-XXXXXXXXX-X')

# Send events
analytics.event('Videos', 'play', 'Fall Campaign')
```

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fa1motion%2Fanalytics.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fa1motion%2Fanalytics?ref=badge_large)
