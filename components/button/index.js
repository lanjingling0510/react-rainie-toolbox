import { themr } from 'react-css-themr';
import { BUTTON, BUTTONGROUP } from '../identifiers';
import { buttonFactory } from './Button';
import { buttonGroupFactory } from './ButtonGroup';
import themedRippleFactory from '../ripple';
import theme from './theme.css';
import FontIcon from '../font_icon';
import Tooltip from '../tooltip';
import Badge from '../badge';

const Button = buttonFactory(themedRippleFactory({ centered: false }), FontIcon);
const ThemedButton = themr(BUTTON, theme)(Button);
const ButtonGroup = buttonGroupFactory(ThemedButton);

const ThemeButtonGroup = themr(BUTTONGROUP, theme)(ButtonGroup);
const TooltipButton = Tooltip(ThemedButton);
const BadgeButton = Badge(ThemedButton);

export default ThemedButton;
export { ThemedButton as Button };
export { ThemeButtonGroup as ButtonGroup };
export { TooltipButton };
export { BadgeButton };
