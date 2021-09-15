window.addEventListener = jest.fn()
window.attachEvent = jest.fn()
jest.useFakeTimers();

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon')