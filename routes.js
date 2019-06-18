import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import Home from './Screens/Home';
import Result from './Screens/Result';
import Video from './Screens/Video';
import Series from './Screens/Series';
import Landing from './Screens/Landing';
import Login from './Screens/Login';
import Account from './Screens/Account';
import Favorites from './Screens/Favorites';
import ReportIssue from './Screens/ReportIssue';
import Search from './Screens/Search';

const AppStack = createStackNavigator({
    Home: Home,
    Search: Search,
    Result: Result,
    Video: Video,
    Series: Series,
    Account: Account,
    Favorites: Favorites,
    Issue: ReportIssue,
}, {
    initialRouteName: 'Home',
    headerMode: 'none'
});

export default createAppContainer(createSwitchNavigator({
    Landing: Landing,
    Login: Login,
    App: AppStack
}, {
    initialRouteName: 'Landing',
}))