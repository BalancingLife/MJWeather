import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Dimensions, View, StyleSheet, Text, ScrollView } from "react-native";

const API_KEY = "80d2be0a9e0c408e0e168fd716417e4d";
//이렇게 API key를 application 에 두는 것은 안전하지 못한 방법.
const NAVY = "#003366";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
//ES6 문법으로 const SCREEN_WIDTH = Dimensions.get("window").width; 와 동일한 의미

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false },
    );
    setCity(`${location[0].city} ${location[0].district}`);
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&APPID=${API_KEY}`,
    );
    const json = await response.json();
    console.log(json);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator="false"
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
  },

  city: {
    flex: 1,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
  },

  cityName: {
    fontSize: 40,
    fontWeight: "700",
  },

  weather: {
    backgroundColor: "teal",
  },

  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },

  temp: {
    marginTop: 50,
    fontSize: 178,
    fontWeight: "600",
  },

  description: {
    marginTop: -30,
    fontSize: 80,
  },
});
