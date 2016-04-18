# Link Detective

Link Detective is an investigator of potential missing or dead links. He interrogates the links via the _HEAD request_. When he gathers enough evidence on the response, such as the status code, content-type, and content-length, he will be able to solve his case.

### Install the Tools

```sh
$ git clone https://github.com/remarkablemark/link-detective.git
$ cd link-detective
$ npm install
```

### Start the Investigation

```sh
$ npm start
```

Or start with Chrome DevTools opened (for debugging):

```sh
$ npm run dev
```

### License

MIT
