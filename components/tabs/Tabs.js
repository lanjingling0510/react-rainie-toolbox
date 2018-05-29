import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const factory = (Tab, TabContent) => {

  const isTab = child => child.type === Tab;
  const isTabContent = child => child.type === TabContent;

  class Tabs extends Component {
    static propTypes = {
      children: PropTypes.node,
      className: PropTypes.string,
      hideMode: PropTypes.oneOf(['display', 'unmounted']),
      index: PropTypes.number,
      onChange: PropTypes.func,
      isTab: PropTypes.func,
      theme: PropTypes.shape({
        navigation: PropTypes.string,
        navigationContainer: PropTypes.string,
        pointer: PropTypes.string,
        tabs: PropTypes.string,
      }),
    }

    static defaultProps = {
      hideMode: 'unmounted',
    }

    constructor(props) {
      super(props);

      let index = 0;
      if ('index' in props && 'onChange' in props) {
        index = props.index;
      }

      this.state = {
        pointer: {},
        index: index,
      }
    }

    componentDidMount() {
      this.updatePointer(this.state.index);
    }

    componentWillReceiveProps(nextProps) {
      if ('index' in nextProps && 'onChange' in nextProps) {
        this.updatePointer(nextProps.index);
        this.setState({
          index: nextProps.index,
        });
      }
    }

    parseChildren() {
      const headers = [];
      const contents = [];

      React.Children.forEach(this.props.children, (item) => {
        if ((this.props.isTab && this.props.isTab(item)) || isTab(item)) {
          headers.push(item);
          if (item.props.children) {
            contents.push(
              <TabContent theme={this.props.theme}>
                {item.props.children}
              </TabContent>
            );
          }
        } else if (isTabContent(item)) {
          contents.push(item);
        }
      });

      return { headers, contents };
    }

    updatePointer = (idx) => {
      if (this.navigationNode && this.navigationNode.children[idx]) {
        const nav = this.navigationNode.getBoundingClientRect();
        const label = this.navigationNode.children[idx].getBoundingClientRect();
        const scrollLeft = this.navigationNode.scrollLeft;
        this.setState({
          pointer: {
            top: `${nav.height}px`,
            left: `${label.left - (nav.left + scrollLeft)}px`,
            width: `${label.width}px`,
          },
        });
      }
    }

    handleHeaderClick = (item, idx) => (event, index) => {
      if ('onChange' in this.props) {
        this.props.onChange(idx);
      } else {
        this.updatePointer(idx);
        this.setState({index: idx});
      }

      if (item.props.onClick) item.props.onClick(event);
    }

    renderHeaders(headers) {
      return headers.map((item, idx) => React.cloneElement(item, {
        children: null,
        key: idx,
        index: idx,
        theme: this.props.theme,
        active: this.state.index === idx,
        onClick: this.handleHeaderClick(item, idx),
      }));
    }

    renderContents(contents) {
      const contentElements = contents.map((item, idx) => React.cloneElement(item, {
        key: idx,
        theme: this.props.theme,
        active: this.state.index === idx,
        hidden: this.state.index !== idx && this.props.hideMode === 'display',
        tabIndex: idx,
      }));

      return this.props.hideMode === 'display'
        ? contentElements
        : contentElements.filter((item, idx) => (idx === this.state.index));
    }

    render() {
      const {
        theme,
        className,
        hideMode,
        index,
        onChange,
        children,
        isTab,
        ...other
      } = this.props;

      const { headers, contents } = this.parseChildren();
      const classes = classnames(theme.tabs, className);

      return (
        <div data-react-toolbox="tabs" className={classes} {...other}>
          <div className={theme.navigationContainer}>
             <nav className={theme.navigation} ref={(node) => { this.navigationNode = node; }}>
               {this.renderHeaders(headers)}
               <span className={theme.pointer} style={this.state.pointer} />
             </nav>
          </div>
          {this.renderContents(contents)}
        </div>
      );
    }
  }

  return Tabs;
}

export { factory as tabsFactory };
