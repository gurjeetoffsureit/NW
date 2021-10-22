import React, { Component } from 'react';
import {
    StyleSheet,         // CSS-like styles
    Text,               // Renders text
    TouchableOpacity,   // Pressable container
    View                // Container component
} from 'react-native';

export default class Tabs extends Component {

    state = {
        activeTab: 0
    }

    // Pull children out of props passed from App component
    render({ children, callback } = this.props) {
        return (
            <View style={styles.container}>
                {/* Tabs row */}
                <View style={styles.tabsContainer}>
                    {children.map(({ props: { title } }, index) =>
                        <TouchableOpacity
                            style={[
                                // Default style for every tab
                                styles.tabContainer,
                                // Merge default style with styles.tabContainerActive for active tab
                                index === this.state.activeTab ? styles.tabContainerActive : []
                            ]}
                            // Change active tab
                            onPress={() => {
                                this.setState({ activeTab: index })
                                callback(title);
                            }}
                            // Required key prop for components generated returned by map iterator
                            key={index}
                        >
                            <Text style={styles.tabText}>
                                {title}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.contentContainer}>
                    {children[this.state.activeTab]}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#000000'

    },
    tabContainer: {
        flex: 1,
        paddingVertical: 15,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabContainerActive: {
        borderBottomColor: '#FDA02A',
    },
    tabText: {
        color: '#FDA02A',
        fontFamily: 'Avenir',
        // fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16
    },
    contentContainer: {
        flex: 1
    }
});
