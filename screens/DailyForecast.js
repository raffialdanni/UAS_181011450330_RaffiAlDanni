import React, { useEffect, useState } from 'react';
import {
    View,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { fetchForecastAsync, getForecastEmoji } from '../api';
import { black } from '../colors';
import dayjs from 'dayjs';

function ForecastItem({
    time,
    summary,
    icon,
    temperatureHigh,
    temperatureLow,
    navigation,
}) {
    return ( <
        TouchableOpacity onPress = {
            () =>
            navigation.navigate('ForecastDetails', {
                time,
                summary,
                icon,
                temperatureHigh,
                temperatureLow,
            })
        } >
        <
        View style = { styles.weatherIconAndTempRow } >
        <
        Text style = { styles.weatherIcon } > { getForecastEmoji(icon) } < /Text> <
        View >
        <
        Text style = { styles.date } > { dayjs(new Date(time * 1000)).format('MMMM D, YYYY') } <
        /Text> <
        Text style = { styles.summary } > { summary.substr(0, 20) }... < /Text> <
        /View> <
        /View> <
        /TouchableOpacity>
    );
}

export function DailyForecast({ navigation }) {
    const [dailyForecast, setDailyForecast] = useState({
        daily: {
            summary: '',
            icon: 'clear-day',
            data: [],
        },
    });
    const [loading, setLoading] = useState(true);

    async function getForecast() {
        setLoading(true);
        try {
            const dailyForecastResult = await fetchForecastAsync();

            setLoading(false);
            setDailyForecast(dailyForecastResult);
        } catch (e) {
            setLoading(false);
        }
    }

    useEffect(function didMount() {
        getForecast();
    }, []);

    return ( <
        View style = { styles.container } >
        <
        FlatList keyExtractor = { item => `${item.time}` }
        data = { dailyForecast.daily.data }
        renderItem = {
            ({ item }) => ( <
                ForecastItem navigation = { navigation } {...item }
                />
            )
        }
        onRefresh = { getForecast }
        refreshing = { loading }
        ItemSeparatorComponent = {
            () => < View style = { styles.separator }
            />} /
            >
            <
            StatusBar barStyle = "dark-content" / >
            <
            /View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        separator: {
            height: StyleSheet.hairlineWidth,
            backgroundColor: black,
            opacity: 0.4,
        },
        weatherIcon: {
            fontSize: 64,
            marginRight: 16,
        },
        weatherIconAndTempRow: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 24,
        },
        date: {
            fontSize: 20,
            fontWeight: '600',
            marginBottom: 16,
        },
        summary: {
            fontSize: 16,
        },
    });