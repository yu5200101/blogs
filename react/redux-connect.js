export default function connect(mapStateToProps, mapDispatchToProps) {
  return function wrapWithConnect(WrappedComponent) {
    class Connect extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.store = context.store; // 从 Context 获取 Store
        this.state = { storeState: this.store.getState() };
      }

      componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => {
          this.setState({ storeState: this.store.getState() });
        });
      }

      componentWillUnmount() {
        this.unsubscribe(); // 取消订阅
      }

      render() {
        // 计算合并后的 Props
        const stateProps = mapStateToProps(this.state.storeState, this.props);
        const dispatchProps = mapDispatchToProps(this.store.dispatch, this.props);
        const mergedProps = { ...this.props, ...stateProps, ...dispatchProps };

        return <WrappedComponent {...mergedProps} />;
      }
    }
    return Connect;
  };
}