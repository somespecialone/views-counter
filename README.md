# <p align="center">Views counter</p>

[![Views](https://views-counter.deta.dev/views-counter-repo/badge?label=repo+views+%F0%9F%91%80&color=lightblue)](https://github.com/somespecialone/views-counter)
[![Made in Ukraine](https://img.shields.io/badge/made_in-ukraine-ffd700.svg?labelColor=0057b7)](https://stand-with-ukraine.pp.ua)
[![license](https://img.shields.io/github/license/somespecialone/views-counter)](https://github.com/somespecialone/views-counter/blob/master/LICENSE)
[![Tests](https://github.com/somespecialone/views-counter/actions/workflows/tests.yml/badge.svg)](https://github.com/somespecialone/views-counter/actions/workflows/tests.yml)
[![Deploy](https://github.com/somespecialone/views-counter/actions/workflows/deploy.yml/badge.svg)](https://github.com/somespecialone/views-counter/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/somespecialone/views-counter/branch/master/graph/badge.svg?token=GM6IQU4U2K)](https://codecov.io/gh/somespecialone/views-counter)
[![CodeFactor](https://www.codefactor.io/repository/github/somespecialone/views-counter/badge)](https://www.codefactor.io/repository/github/somespecialone/views-counter)

---

[![Deta deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy?repo=https://github.com/somespecialone/views-counter.git)

---

Deta `micro` app that counts page hits(views). Can generate `badge` or json response with counter.

Badge need to be generated each time when page with link is loaded, so caching is omitted.
Due to this, app `NOT USE` redirects to [shields.io](https://shields.io/), but instead create badge by herself.

> ⚡ Single deta micro may have rate-limit, so if You want to heavily use counter, please, [deploy](#deployment-) it
> to [Deta](https://www.deta.sh/) by yourself with button above. ⚡

## Usage

### Badge endpoint

> https://views-counter.deta.dev/ ***key*** /badge?***label***=...&***labelColor***=...&***color***=...&***style***
> =...&***noIncrement***=...

| Param name    |          | Description                                 | Default value |
|---------------|----------|---------------------------------------------|---------------|
| `key`         | Required | Unique key for this counter.                | -             |
| `label`       | Optional | Label(right) text.                          | "views"       |
| `labelColor`  | Optional | badge-maker color.                          | "#555"        |
| `color`       | Optional | badge-maker color.                          | "#4c1"        |
| `style`       | Optional | badge-maker style.                          | "flat"        |
| `noIncrement` | Optional | To [not increment](#fetch-counter) counter. | `false`       |

> [badge-maker color and style args](https://www.npmjs.com/package/badge-maker)

### JSON endpoint

> https://views-counter.deta.dev/ ***key*** ?***noIncrement***=...

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

Deploy to Deta with button above, clone micro from Deta to local machine and
update `env's` on your deta micro if you want. [Deta CLI](https://docs.deta.sh/docs/cli/commands).

Environment variables:

* `DETA_PROJECT_KEY` - Optional([only](https://docs.deta.sh/docs/base/sdk#instantiating) for local development). Key of
  your project from Deta web settings.
* `DETA_BASE_NAME` - Optional. Name of [Deta Base](https://docs.deta.sh/docs/base/about).

## Testing 🧪

Same `evn's` requirements as [deployment](#deployment-)

## TODO 📑

- [ ] Gradient badges from [bokub/gradient-badge](https://github.com/bokub/gradient-badge)
- [ ] Icons
- [ ] ~~TypeScript~~
