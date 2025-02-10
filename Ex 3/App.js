import React, { useState, useEffect } from 'react';
import { StatusBar, Text, View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Gyroscope } from 'expo-sensors';

export default function App() {
    const [currentData, setCurrentData] = useState({ x: 0, y: 0, z: 0 });
    const [prevData, setPrevData] = useState({ x: 0, y: 0, z: 0 });
    const [mySound, setMySound] = useState();
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        Gyroscope.setUpdateInterval(100);
        const subscription = Gyroscope.addListener((data) => {
            setCurrentData(data);
            detectRealShake(data);
        });
        return () => subscription.remove();
    }, []);

    async function playSound() {
        const soundfile = require('../short1.wav');
        const { sound } = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }

    function detectRealShake({ x, y, z }) {
        const diff = Math.abs(x - prevData.x) + Math.abs(y - prevData.y) + Math.abs(z - prevData.z);
        setPrevData({ x, y, z });

        if (diff > 1.2) { // Adjust this sensitivity if needed
            setIsShaking(true);
            playSound();
        } else {
            setIsShaking(false);
        }
    }

    useEffect(() => {
        return mySound
            ? () => {
                mySound.unloadAsync();
            }
            : undefined;
    }, [mySound]);

    return (
        <View style={styles.container}>
            <StatusBar />
            <Text>x: {currentData.x}</Text>
            <Text>y: {currentData.y}</Text>
            <Text>z: {currentData.z}</Text>
            {isShaking && <Text style={styles.shakeText}>SHAKE</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    shakeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'red',
        marginTop: 20,
    },
});
