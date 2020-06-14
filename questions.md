1. _What is the difference between Component and PureComponent? give an
   example where it might break my app._

PureComponent implements `shouldComponentUpdate()` and performs comparison of state and props values.

_Example of problem:_ If you pass props values into PureComponent it may not be re-rendered

_Example of problem:_ If you put non-pure component as a child of PureComponent the child will not be re-rendered even on state changes

P.S. PureComponent is outdated technology. Function components with memoizing is better :)

2. _Context + ShouldComponentUpdate might be dangerous. Can think of
   why is that?_

- `Context` is global state API since 16.3 or even earlier.
- `shouldComponentUpdate()` is a component life-cycle method that almost nobody use :)

Don't see any "dangerous" if correctly use providers/consumers. Using of "correct" context (it is nearest by default) is a must.

3. _Describe 3 ways to pass information from a component to its PARENT._

- Parent passes callback/setter function to the Child as prop. Child use this function to send/change data for Parent
- Render Props methodology (Parent rendering is tuned up in a Child)
- Using a shared/upper context or a global state

Note: Observers, global variables, browser store(s) and other "simple" methodologies are not popular in React community :)

4. _Give 2 ways to prevent components from re-rendering._

- `shouldComponentUpdate()` returns false (actually PureComponent works this way)
- Change state directly, without using `setState()`, it is not recommended, but works :)

5.  _What is a fragment and why do we need it? Give an example where it
    might break my app._

It is JSX syntax `<>...</>` or `<React.Fragment>...</React.Fragment>`
Fragments don't render wrapping <div>

It may brake styling, but useful for inline rendering and FlexBox elements.

Note: Some controls (menus, popups) doesn't allow Children as `React.Fragment`

6.  _Give 3 examples of the HOC pattern._

3 in one line :)

```
export default connect(someSelector, someActions)(
	withRouter(
		withTranslation(
			SuperComponent
		)
	)
)
```

Note: Better use only 1 hoc per line or `compose()`

7.  _What's the difference in handling exceptions in promises, callbacks and
    async...await._

- Promise "eats" exceptions by providing own `.catch()`
- Callback sometimes executed outside the `try..except` block, so additional internal `try..except` could be required
- `async...await` is a sugar syntax around Promises, but only this syntax allows write C#/Java styled "bulletproof business logic"

```
console.time(`actionXyz`);
let result;
try {
    result = await ... // Some long async code, like API call

    console.log(`actionXyz - successful, result:`, result);
    return result;
} catch (error) {
	console.error(`actionXyz -`, error);
} finally {
	console.timeEnd(`actionXyz`);
}
```

8.  _How many arguments does setState take and why is it async._

`setState()` accept 2 parameters:

- updateObject - to merge with current State
- callbackAfter - called after State has been mutated

It is "async" because changes/mutations of the component State are delayed. It allows to update several changes at once.

Note: `setState()` is not really "async", the React has own "scheduler" to update states and to fire registered callbacks

9.  _List the steps needed to migrate a Class to Function Component._

- Don't do it if possible :)
- Never do it if any logic depends on prev/next values of props/state (function components has access to current props/state only)
- Create `[field, setField] = useState(prop.value || defaultValue)` for every field in the state
- Replace life-cycle methods with `useEffects()`, `useCallback()` and so on
- If `defaultProps` are used, put them into props destruction `const { prop1 = defaultProp1, prop1 = defaultProp2 } = props`
- Add `const` for every `handleXyz = (event) => {..}` :)
- Test new component hardly, especially for corner cases.

10. _List a few ways styles can be used with components._

- inline styling `<Component style={{backgroundColor: #ccc}}/>`
- include .css file directly into component file and use `<Component className='classFromCss'/>`
- CSS Modules `import styles from './styles.css';` then `<Component className='styles.component'/>`
- Styled Components

```
const Button = styled.button`
  cursor: pointer;
  font-size: 16px;
	background-color: #ccc;
  border-radius: 3px;

  &:hover {
    background-color: #ccc;
    color: white;
  }
`;

```

- `useStyles()` hooks and `withStyle()` HOCs (Material UI, and similar)

Note: React future is **CSSinJS**

11. _How to render an HTML string coming from the server._

We can use `dangerouslySetInnerHTML` attribute

Sample form this project:

```
<li
	dangerouslySetInnerHTML={{ __html: this.renderHighlightedText(item, value) }}
/>
```
