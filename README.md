SimpleSynth
===========

Create a simple web synth using react


## Interesting resources

- http://blog.chrislowis.co.uk/2013/06/10/playing-multiple-notes-web-audio-api.html (and other articles from this blog... Thanks Chris !)
- https://codepen.io/njmcode/pen/PwaXwB a drum pattern sequencer
- https://patternsketch.com/ (another one)
- http://www.oliphaunts.com/pianoroll-js/ well... a piano roll
- https://musiclab.chromeexperiments.com/Experiments
- https://tonejs.github.io/
- https://github.com/joshjg/react-canvas-knob (just use the comp file)
- https://youtu.be/jif1RcaR7Cc interresting video ! (not too much to learn but good ideas ;-))
- http://fuczak.github.io/RumcaJS/ handle filter and filter envelope

## known issues
- for hot reload to work on every js file change I had to follow this : https://github.com/webpack/docs/wiki/troubleshooting#not-enough-watchers
- it seems like firefox has a problem with something that results in an `InvalidStateError: An attempt was made to use an object that is not, or is no longer, usable` message
- It seems quite difficult to style input[type="range"] consistently across browsers... https://developer.mozilla.org/fr/docs/Web/HTML/Element/Input/range
- canvas "layers" ... the layer 2 does not take the whole height... why ??
- when window is resized coordinates are not up to date...
