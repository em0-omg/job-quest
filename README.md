# jq

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### その他

icons

- https://iconify.design/icon-sets/mdi/
  firebase.json 修正前
- Mac "npm --prefix \"\$RESOURCE_DIR\" run lint"
- windows "npm --prefix \"\$RESOURCE_DIR\" run lint"
- firebase init functions で解決
  rules_version = '2';
  service firebase.storage {
  match /b/{bucket}/o {
  match /{allPaths=\*\*} {
  allow read, write: if request.auth != null;
  }
  }
  }
