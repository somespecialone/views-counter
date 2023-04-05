# <p align="center">Views Counter</p>

[![Views](https://vc.somespecial.one/views-counter-repo/badge?label=repo+views+%F0%9F%91%80&gradient=pink-F78642)](https://github.com/somespecialone/views-counter)
[![Made in Ukraine](https://img.shields.io/badge/made_in-ukraine-ffd700.svg?labelColor=0057b7)](https://stand-with-ukraine.pp.ua)
[![license](https://img.shields.io/github/license/somespecialone/views-counter)](https://github.com/somespecialone/views-counter/blob/master/LICENSE)
[![Tests](https://github.com/somespecialone/views-counter/actions/workflows/tests.yml/badge.svg)](https://github.com/somespecialone/views-counter/actions/workflows/tests.yml)
[![codecov](https://codecov.io/gh/somespecialone/views-counter/branch/master/graph/badge.svg?token=GM6IQU4U2K)](https://codecov.io/gh/somespecialone/views-counter)
[![CodeFactor](https://www.codefactor.io/repository/github/somespecialone/views-counter/badge)](https://www.codefactor.io/repository/github/somespecialone/views-counter)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

---

[![Install on Space](https://deta.space/buttons/dark.svg)](https://deta.space/discovery/r/togg6mql5wyr7tax)

---

Deta `micro` app that counts page hits(views). Can generate `badge` or json response with counter.

Badge need to be generated each time when page with link is loaded, so caching is omitted.
Due to this, app `NOT USE` redirects to [badgen.net](https://badgen.net/), but instead create badge by herself.

> ⚡ Single deta micro may have rate-limit, so if You want to heavily use counter, please, [deploy](#deployment-) it
> to [Deta Space](https://deta.space/) by yourself with button above. ⚡

## Usage

### Badge endpoint

> url /:key/badge?***label***=...&***labelColor***=...&***color***=...&***style***
> =...&***noIncrement***=...

| Param name    |          | Description                                                     | Default value |
|---------------|----------|-----------------------------------------------------------------|---------------|
| `key`         | Required | Unique key for this counter. Path param.                        | -             |
| `label`       | Optional | [badgen](https://github.com/badgen/badgen#usage)                | "views"       |
| `labelColor`  | Optional | [badgen](https://github.com/badgen/badgen#usage)                | "#555"        |
| `color`       | Optional | [badgen](https://github.com/badgen/badgen#usage)                | "blue"        |
| `style`       | Optional | [badgen](https://github.com/badgen/badgen#usage)                | "classic"     |
| `icon`        | Optional | [badgen](https://github.com/badgen/badgen#usage)                | -             |
| `iconWidth`   | Optional | [badgen](https://github.com/badgen/badgen#usage)                | 13            |
| `scale`       | Optional | [badgen](https://github.com/badgen/badgen#usage)                | 1             |
| `gradient`    | Optional | [gradient-badge](https://github.com/bokub/gradient-badge#usage) | -             |
| `noIncrement` | Optional | To [not increment](#fetch-counter) counter.                     | `false`       |

### JSON endpoint

> url /:key?***noIncrement***=...

Have only two params: `key` and `noIncrement`.

Response:

```json5
{
  counter: 123
}
```

### Fetch counter

⚠ `noIncrement` may be needed when You just want to fetch counter without incrementing it,
so You can implement logic on front-end of your app to catch only unique visitors.

## Deployment 🛠

Deploy to [deta.space](https://deta.space) with button above.

## Testing 🧪

* `DETA_PROJECT_KEY` - Your project from Deta web settings.
* `DETA_BASE_NAME` - Optional. Name of `Deta Base`.

## TODO 📑

- [x] Gradient badges from [bokub/gradient-badge](https://github.com/bokub/gradient-badge)
- [x] Icons
- [ ] ~~TypeScript~~
