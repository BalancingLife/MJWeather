import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const API_KEY = "ee4e6940f4f2f8319bb46d25576819e7";
//이렇게 API key를 application 에 두는 것은 안전하지 못한 방법.const NAVY = "#003366";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Snow: "snow",
  Rain: "rains",
  Atmosphere: "cloudy-gusts",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

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
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`,
    );
    const json = await response.json();
    setDays(json);
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
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          // (
          //   days.map((day, index) => (
          //     <View key={index} style={styles.day}>
          //       <Text style={styles.temp}>{day.temp.day}</Text>
          //       <Text style={styles.description}>{day.weather[0].main}</Text>
          //     </View>
          //   ))
          // )

          <View style={styles.day}>
            <Text style={styles.temp}>
              {parseFloat(days.main.temp).toFixed(1)}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
                marginBottom: 10,
                width: "60%",
              }}
            >
              <Text style={styles.description}>{days.weather[0].main}</Text>
              <Fontisto
                name={icons[days.weather[0].main]}
                size={50}
                color="white"
              />
            </View>

            <Text style={styles.tinyText}>{days.weather[0].description}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },

  city: {
    flex: 1,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
  },

  cityName: {
    color: "white",
    fontSize: 40,
    fontWeight: "700",
  },

  weather: {
    backgroundColor: "tomato",
  },

  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },

  temp: {
    color: "white",
    marginTop: 50,
    fontSize: 158,
    fontWeight: "600",
  },

  description: {
    color: "white",
    marginTop: -30,
    fontSize: 80,
  },
  tinyText: {
    color: "white",
    fontSize: 25,
  },
});
