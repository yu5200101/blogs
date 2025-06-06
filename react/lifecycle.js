// 16.3之前
// 创建
constructor
componentWillMount
render
componentDidMount
// update
componentWillReceiveProps(nextProp)
shouldComponentUpdate(nextProp, nextState)
componentWillUpdate(nextProp, nextState)
render
componentDidUpdate(prevProp, prevState)
// 卸载
componentWillUnmount()

// 16.3后
// 创建
constructor
getDerivedStateFromProps(nextProp, prevState)
render
componentDidMount
// update
getDerivedStateFromProps(nextProp, prevState)
shouldComponentUpdate(nextProp, nextState)
render
getSnapshotBeforeUpdate(prevProp, prevState)
componentDidUpdate(prevProp, prevState, snapshot)
// 卸载
componentWillUnmount()

getDerivedStateFromError(error)
componentDidCatch(error, info)