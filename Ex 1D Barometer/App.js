import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';

import {Accelerometer, Barometer, Gyroscope} from "expo-sensors";
import gyroscope from "expo-sensors/src/Gyroscope";

const styles = StyleSheet.create({
    container: {

    },
});

export default function App() {

    const [{pressure,relativeAltitude}, setData] = useState({pressure:0,relativeAltitude:0});

    useEffect(() => {
        Barometer.setUpdateInterval(100)
        const subscription = Barometer.addListener(setData);
        return () => subscription.remove();
    }, []);

    return (
        <View>
            <StatusBar/>
            <Text>Pressure: {pressure}</Text>
            <Text>Relative Altitude: {relativeAltitude}</Text>
        </View>
    );
}


