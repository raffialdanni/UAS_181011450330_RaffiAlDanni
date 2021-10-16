import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Alert, Platform } from 'react-native';

function confirmAsync({
    title,
    message,
    dismissButtonLabel,
    confirmButtonLabel,
}) {
    if (Platform.OS === 'web') {
        return Promise.resolve(confirm(message));
    }

    return new Promise((resolve, _reject) => {
        Alert.alert(
            title,
            message, [{
                    text: dismissButtonLabel ? ? 'Cancel',
                    style: 'cancel',
                    onPress: () => resolve(false),
                },
                { text: confirmButtonLabel ? ? 'OK', onPress: () => resolve(true) },
            ], { cancelable: false }
        );
    });
}

async function askForPermissions() {
    let permissionCheckResponse = await Permissions.getAsync(
        Permissions.LOCATION
    );

    if (permissionCheckResponse.status === 'granted') return true;

    if (!(await confirmAsync({
            title: 'Requesting Location Permissions',
            message: 'BrightSky needs access to your location for accurate weather reporting.',
            dismissButtonLabel: "Don't Allow",
            confirmButtonLabel: 'Allow',
        }))) {
        return false; // return early to guard against being denied permissions on iOS
    }

    let permissionRequestResponse = await Permissions.askAsync(
        Permissions.LOCATION
    );

    if (permissionRequestResponse.status === 'granted') {
        return true;
    }
    return false;
}

export function getForecastEmoji(iconName) {
    switch (iconName) {
        case 'clear-day':
            return '☀️';
        case 'clear-night':
            return '🌜';
        case 'rain':
            return '🌧';
        case 'snow':
            return '❄️';
        case 'sleet':
            return '⛸';
        case 'wind':
            return '💨';
        case 'fog':
            return '🌫';
        case 'cloudy':
            return '☁️';
        case 'partly-cloudy-day':
            return '🌤';
        case 'partly-cloudy-night':
            return '🌥';
        case 'error':
            return '😢';
        default:
            return '🌤';
    }
}

export async function fetchCurrentWeatherAsync() {
    // check for location permissions
    const hasPermissons = await askForPermissions();
    if (!hasPermissons) throw new Error('Location permission not granted');

    // get lat/lon
    const {
        coords: { longitude, latitude },
    } = await Location.getCurrentPositionAsync();

    return await (await fetch(
        `https://brightsky-api.fiberjw.now.sh/current?latitude=${latitude}&longitude=${longitude}`
    )).json();
}

export async function fetchForecastAsync() {
    // check for location permissions
    const hasPermissons = await askForPermissions();
    if (!hasPermissons) throw new Error('Location permission not granted');

    // get lat/lon
    const {
        coords: { longitude, latitude },
    } = await Location.getCurrentPositionAsync();

    return await (await fetch(
        `https:///brightsky-api.fiberjw.now.sh/forecast?latitude=${latitude}&longitude=${longitude}`
    )).json();
}