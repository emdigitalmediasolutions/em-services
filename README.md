# em-services

em-services is a WordPress plugin that allows you to create post of a custom `service` type, which can then be used with the added services block. The block allows you to customise how your services are displayed with a number of options.

## Build Commands

Create a production build of the plugin.

```sh
npm run build
```

---

Deploy any changes to the test path specified in the .env file.

```sh
gulp deployTest
```

---

Watch for any changes and deploy to the test path specified in the .env file.

```sh
gulp watchTest
```

---

Create a zip bundle in the `dist/` directory.

```sh
gulp bundle
```
