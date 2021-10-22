import React, { Component } from 'react';
import { Keyboard, Text, View } from 'react-native';
import OtpInput from './OtpInput';
import defaultStyles from './defaultStyles';
export default class OtpInputs extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            inputsArray: [],
            loading: false,
            otpCode: [],
        };
        this.maxIndex = this.props.numberOfInputs - 1;
        this.minIndex = 0;
        this.inputs = [];
        this._updateText = (text, index) => {
            if (text) {
                const otpCode = this.state.otpCode;
                otpCode[index] = text;
                this.props.handleChange && this.props.handleChange(otpCode.join(''));
                this.setState({ otpCode });
               
                if (index === this.maxIndex) {
                    return Keyboard.dismiss();
                }
                if (index >= this.minIndex && index < this.maxIndex) {
                    this._focusInput(index + 1);
                }
            }
        };

        this.cleanNonNumericChars = (text) => {
            if (!text || typeof text !== 'string') {
                return ""
            }
            // Remove non numeric and non .- chars
            text = text.replace(/[^\d.-]/g, '');
            // Remove extra periods ('.', only one, at most left allowed in the string)
            let splitText = text.split('.');
            text = splitText.shift() + (splitText.length ? '.' + splitText[0].slice(0, this.props.precision) : '');
            // Remove '-' signs if there is more than one, or if it is not most left char
            for (var i=1; i< text.length; i++)
            {
                   var char = text.substr(i,1);
                   if(char == '-')
                   {
                         text = text.substr(0,i) + text.substr(i+1);
                         // decrement value to avoid skipping character
                         i--;
                   }
            }
            // Remove leading zeros
            text = text.replace(/^(-)?0+(?=\d)/,'$1') //?=\d is a positive lookahead, which matches any digit 0-9
    
            return text
        };

        this._handleBackspace = ({ nativeEvent }, index) => {
            if (nativeEvent.key === 'Backspace') {
                const otpCode = this.state.otpCode;
                otpCode[index] = '';
                this.props.handleChange && this.props.handleChange(otpCode.join(''));
                this.setState({ otpCode });
                if (index > this.minIndex && index <= this.maxIndex) {
                    this._focusInput(index - 1);
                }
            }
        };
        this._focusInput = index => {
            this.inputs[index].input.focus();
        };
        this._renderInputs = () => {
            const { errorMessage, focusedBorderColor, inputContainerStyles, inputStyles, inputTextErrorColor, numberOfInputs, unFocusedBorderColor, } = this.props;
            const { otpCode } = this.state;
            let inputArray = [];
            for (let index = 0; index < numberOfInputs; index++) {
                inputArray[index] = (<OtpInput containerStyles={inputContainerStyles} error={!!errorMessage} focusedBorderColor={focusedBorderColor} handleBackspace={event => this._handleBackspace(event, index)} inputStyles={inputStyles} key={index} ref={input => (this.inputs[index] = input)} textErrorColor={inputTextErrorColor} unFocusedBorderColor={unFocusedBorderColor} updateText={text => this._updateText(text, index)} value={otpCode[index]}/>);
            }
            return inputArray.map(input => input);
        };
    }
    componentDidMount() {
        this._renderInputs();
    }
    render() {
        const { containerStyles, errorMessage, errorMessageContainerStyles, errorMessageTextStyles, } = this.props;
        return (<View style={[defaultStyles.container, containerStyles]}>
        {errorMessage && (<View style={[defaultStyles.errorMessageContainer, errorMessageContainerStyles]}>
            <Text testID="errorText" style={errorMessageTextStyles}>
              {errorMessage}
            </Text>
          </View>)}
        <View style={defaultStyles.inputsContainer}>{this._renderInputs()}</View>
      </View>);
    }
}
OtpInputs.defaultProps = {
    handleChange: console.log,
    focusedBorderColor: '#0000ff',
    unFocusedBorderColor: 'transparent',
    inputTextErrorColor: '#ff0000',
    numberOfInputs: 4,
};
//# sourceMappingURL=index.js.map