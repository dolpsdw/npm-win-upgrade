# npm-win-upgrade
Npm tool for upgrade Windows npm node installation.

## Installation

Install the package as global.

```bash
npm install -g npm-win-upgrade
```

## Usage

This command will uninstall your global npm package (if installed).

And update the local Program Files\nodejs npm package (if required).
```bash
npm-win-upgrade
```
This operation requires admin privileges to write in Program Files\nodejs, so you will be asked for UAC.
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)