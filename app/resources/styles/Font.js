import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default Font = {
    xSmall: width * 0.03,
    Small: width * 0.03,
    Medium: width * 0.04,
    Large: width * 0.05,
    Xlarge: width * 0.06,
};