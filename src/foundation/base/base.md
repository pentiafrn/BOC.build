if your component extends `BaseBehaviour` you can now do:


```javascript
class MyComponent extends BaseBehaviour {
  constructor(el) {
    super(el);
    this.publishBreakpointOnResize(400);
    this.subscribe('SITE.BREAKPOINT', this.doSomethingOnNewBreakPoint);
  }

  doSomethingOnNewBreakPoint(breakpoint) {
      console.log(breakpoint) // "sm"
  }
}
```

If you want to use it anywhere else, simply import the `getBreakpoint` function from `screenSize.js`