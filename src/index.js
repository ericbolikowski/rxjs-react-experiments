import { Observable } from 'rxjs';
import React from 'react';
import ReactDOM from 'react-dom';
import { mapPropsStream, compose, createEventHandler, setObservableConfig } from 'recompose';
import rxjsConfig from 'recompose/rxjsObservableConfig'
setObservableConfig(rxjsConfig);

const incrementDecrementHandler = mapPropsStream($props => {
  const { stream: clkIncrement$, handler: clkIncrement } = createEventHandler();
  const { stream: clkDecrement$, handler: clkDecrement } = createEventHandler();
  return $props.switchMap(
      () => Observable
          .merge(
              clkIncrement$.mapTo(1),
              clkDecrement$.mapTo(-1),
          )
          .startWith(0)
          .scan((acc, curr) => acc + curr)
          .do(x => console.log(x)),
      (props, count) => ({ ...props, count, clkIncrement, clkDecrement })
  )
})

const Counter = ({ count, clkDecrement, clkIncrement, }) => (
    <React.Fragment>
      Counter: {count}<br/>
      <button onClick={() => clkDecrement()}>-</button>
      <button onClick={() => clkIncrement()}>+</button>
    </React.Fragment>
);

const enhance = compose(incrementDecrementHandler);
const CounterComp = enhance(Counter);

ReactDOM.render(<CounterComp/>, document.getElementById('root'));
