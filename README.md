# Expressio Community Edition

Expressio Community Edition is a lightning-fast i18n tool that automates the entire translation
workflow for your application. It leverages [Enola](https://codeberg.org/garage44/packages/enola)
to connect with various translation providers like [DeepL](https://www.deepl.com/) and
[Anthropic Claude](https://www.anthropic.com/), while adding crucial workflow automation,
synchronization, and development tools on top.

Built with [Bun](https://bun.sh/) and [I18Next](https://www.i18next.com/).

## Quick start

Getting started with the Community Edition is quick and easy:

```bash
bunx --bun @expressio/expressio-ce start
# login with admin/admin (change password in ~.expressiorc for now)
```

## Editions

- **Community Edition** (this package): Free and open-source core translation features
    - 🚀 Instant machine translation
    - 🔄 Automatic sync of all translations when source text changes
    - 🌍 Support for extensive language coverage (ISO 639-1 and ISO 639-2)
    - 🎯 Access to less common languages typically overlooked by traditional services
    - 🔌 Service-agnostic design with extensible translation backends

- **Professional Edition**: Additional features for teams and enterprises (coming later)
    - 🔧 Advanced workflow automation
    - 👥 Team collaboration tools
    - 🔌 Enterprise integrations
    - 🛠️ Priority support

## Development

```bash
# Clone the workspace
git clone https://codeberg.org/garage44/garage44.git
cd garage44
bun i
cd packages/expressio
bun run dev
```

## License
[AGPLv3](LICENSE.md)