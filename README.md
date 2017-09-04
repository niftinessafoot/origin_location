# originLocation
A JavaScript widget appending crosshairs to an existing web page, marking an element’s coordinates for the CSS `transform-origin`. Designed for use multiple times on a page, instances can be grouped via multiple class names or individualized as needed.

## Usage
Include the script in your source code. Invoke in-code or on the command line:

```js
originLocation('#foo');
```

*foo* can be a string or a DOM node.
```js
originLocation(document.getElementById('foo'));
```

Strings are converted by running `document.querySelector`; any valid CSS selector should work.

Crosshairs are designed to be styleable. The generated stylesheet is injected at the top of `<head>` so the specified class can be easily cascaded with your own styles. ID-based selectors reserved for critical functionality/overrides to avoid `!important` statements.

### Output
In addition to generating crosshairs, running `originLocation` returns an array of x/y pixel coordinates of the `transform-origin` property.

```js
var x = originLocation('#foo');
//returns ["50px","50px"]
console.log(x);
```

### Clearing
Running an empty instance of `originLocation` removes all crosshair nodes and the injected stylesheet.
```js
originLocation();
```

## Configuration
Second argument in `originLocation` is a object literal with a variety of configuration options:
```js
originLocation('#foo', {
  className : 'originLocation',
  linePrefix : 'originLocation',
  stylesheetId : 'originLocationStyles',
  defaultLineColor: '#fff',
  defaultFontColor: '#fff',
  lineColor : null,
  fontColor : null
})
```

Default options highlighted above.

### className
Specifies the class name of this instance of crosshairs. Multiple class names can be styled individually.
### linePrefix
Each crosshair generates it’s own timestamp-based ID. The default can be modified to any string.
### stylesheetId
The generated stylesheet is referenced for appending/removal based on the stylesheet ID. This ID can be modified.
### defaultLineColor
Sets a class-wide line color preference in event you don't want to create a separate selector in your stylesheets. Only needs to be called once/grouping.
### defaultFontColor
Sets a class-wide font color preference in event you don't want to create a separate selector in your stylesheets. Only needs to be called once/grouping.
### lineColor
Sets a one-time line color style when you need to highlight a particular instance of same-class elements. Injects an ID-based selector, so must be overridden in the stylesheet if necessary.
### fontColor
Sets a one-time font color style when you need to highlight a particular instance of same-class elements. Injects an ID-based selector, so must be overridden in the stylesheet if necessary.