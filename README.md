# Koha App

[![Node.js CI](https://github.com/koha-app/koha/actions/workflows/node.js.yml/badge.svg)](https://github.com/koha-app/koha/actions/workflows/node.js.yml)

**Dev instructions:**

Make sure normal things are installed (read: `node`, `npm` etc.)

1. Install Expo with `npm install --global expo-cli`
2. `expo login` (`expo register` first if you haven't made an account)
3. `expo start` in the project directory to run the server
4. use the GUI to manage flow (log in on *Expo Go* with Android/iOS)

**Build instructions:**

*WIP*

**Recommendations:**
- use *VS Code* + *React Native tools* + *Expo tools*
- commit your code (with cli, Git client, *Github Desktop* or *VS Code*, whatever, just do it)

**Troubleshooting:**
- Fix bundler cache issues with `expo r -c`
- Make sure to `npm i` after pulling to fix any updated dependencies
- Expo Go does not work with FB Auth on non-authorised Expo accounts ([see here](https://github.com/koha-app/koha/pull/18#issuecomment-901666014))