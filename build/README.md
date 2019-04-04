# Build Scripts

For help you can write `npm run build -- --help`.

## Scripts

Scripts are combined with `bach`, to make a script that works with this the only needed things is that it's a acync functions. This can be the following:


### Promise 

```
export default function() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 2000);
    });
}
```

### Callbacks

```
export default function(done) {
    done()
}
```

### Streams

```
export default function() {
    return gulp.src(...)
        .pipe(...);
}
```

And more, see the bach docs.