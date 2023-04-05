import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import SeachBar from "../components/SeachBar";
import { Button } from "react-native";
import * as SQLite from "expo-sqlite";

export default function Home() {
  const db = SQLite.openDatabase("weather_data");

  const [serachResult, setSerachResult] = useState(null);
  const [data, setData] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    db.transaction((txt) => {
      txt.executeSql(
        "CREATE TABLE IF NOT EXISTS weather_reports (id INTEGER PRIMARY KEY AUTOINCREMENT , name VARCHAR(30),temp VARCHAR(10),humidity VARCHAR(10),windspeed VARCHAR(10),uniqueid VARCHAR(10))"
      );
    });

    db.transaction((txt) => {
      txt.executeSql(
        "SELECT * FROM weather_reports",
        null,
        (txtObj, resultSet) => setData(resultSet.rows._array),
        (txtObj, error) => console.log(error)
      );
    });
  }, []);

  let handleAddCity = () => {
    if (serachResult) {
      db.transaction((txt) => {
        txt.executeSql(
          "INSERT INTO weather_reports (name,temp,humidity,windspeed,uniqueid) values(?,?,?,?,?)",
          [
            serachResult.name,
            serachResult.main.temp,
            serachResult.main.humidity,
            serachResult.wind.speed,
            serachResult.id,
          ],
          (txtObj, resultSet) => {
            let existingData = [...data];
            existingData.push({
              id: resultSet.insertId,
              name: serachResult.name,
              temp: serachResult.main.temp,
              humidity: serachResult.main.humidity,
              windspeed: serachResult.wind.speed,
              uniqueid: serachResult.id,
            });
            setData(existingData);
          },
          (txtObj, error) => console.log(error)
        );
      });
    }
  };
  useEffect(() => {
    let city = data.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
    // console.log(city);
    setCities(city);
  }, [removeCity, handleAddCity]);
  const removeCity = (id) => {
    db.transaction((txt) => {
      txt.executeSql(
        "DELETE FROM weather_reports WHERE id = ?",
        [id],
        (txtObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...data].filter(
              (weather) => weather.id !== id
            );
            setData(existingNames);
          }
        },
        (txtObj, error) => console.log(error)
      );
    });
  };
  // console.log(data);

  return (
    <ImageBackground
      source={{
        uri: "https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77701414098.jpg",
      }}
      resizeMode="cover"
      style={styles.image}
    >
      <SafeAreaView style={styles.SafeAreaView}>
        <View style={styles.container}>
          <View
            style={{
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              padding: 5,
              position: "relative",
            }}
          >
            <SeachBar
              serachResult={serachResult}
              setSerachResult={setSerachResult}
            />
          </View>

          <View
            style={{
              height: 250,
              backgroundColor: "transparent",
              marginVertical: 5,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {serachResult && (
              <>
                <View style={styles.dashboard}>
                  <View style={styles.line}>
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      {serachResult.name}
                    </Text>
                  </View>
                  <View style={styles.miniBox}>
                    <Image
                      style={styles.WeatherImage}
                      source={{
                        uri: "https://raw.githubusercontent.com/sivasankar5456/weatherApp/main/public/images/sun.png",
                      }}
                    />
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      Temp: {serachResult.main.temp}
                      <View>
                        <Text style={{ color: "#fff", fontSize: 14 }}> 0</Text>
                      </View>
                      <Text style={{ color: "#fff", fontSize: 15 }}> C</Text>
                    </Text>
                  </View>
                  <View style={styles.miniBox}>
                    <Image
                      style={styles.WeatherImage}
                      source={{
                        uri: "https://github.com/sivasankar5456/weatherApp/blob/main/public/images/Humidity.png?raw=true",
                      }}
                    />
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      Humidity: {serachResult.main.humidity}{" "}
                      <View>
                        <Text style={{ color: "#fff", fontSize: 14 }}>0</Text>
                      </View>
                      <Text style={{ color: "#fff", fontSize: 15 }}> C</Text>
                    </Text>
                  </View>
                  <View style={styles.miniBox}>
                    <Image
                      style={styles.WeatherImage}
                      source={{
                        uri: "https://raw.githubusercontent.com/sivasankar5456/weatherApp/main/public/images/wind.png",
                      }}
                    />
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      Wind: speed: {serachResult.wind.speed}{" "}
                      <View>
                        <Text style={{ color: "#fff", fontSize: 14 }}>0</Text>
                      </View>
                      <Text style={{ color: "#fff", fontSize: 15 }}> C</Text>
                    </Text>
                  </View>
                  {serachResult && serachResult.name != "Bengaluru" && (
                    <Button title="Add city to list" onPress={handleAddCity} />
                  )}
                </View>
              </>
            )}
          </View>
          <View
            style={{ height: 100, flex: 2, backgroundColor: "transparent" }}
          >
            {cities && (
              <FlatList
                data={cities}
                keyExtractor={(item, index) => index + item}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.dashboard}>
                      <View style={styles.line}>
                        <Text style={{ color: "#fff", fontSize: 15 }}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={styles.miniBox}>
                        <Image
                          style={styles.WeatherImage}
                          source={{
                            uri: "https://raw.githubusercontent.com/sivasankar5456/weatherApp/main/public/images/sun.png",
                          }}
                        />
                        <Text style={{ color: "#fff", fontSize: 15 }}>
                          Temp: {item.temp}
                          <View>
                            <Text style={{ color: "#fff", fontSize: 14 }}>
                              {" "}
                              0
                            </Text>
                          </View>
                          <Text style={{ color: "#fff", fontSize: 15 }}>
                            {" "}
                            C
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.miniBox}>
                        <Image
                          style={styles.WeatherImage}
                          source={{
                            uri: "https://github.com/sivasankar5456/weatherApp/blob/main/public/images/Humidity.png?raw=true",
                          }}
                        />
                        <Text style={{ color: "#fff", fontSize: 15 }}>
                          Humidity: {item.humidity}{" "}
                          <View>
                            <Text style={{ color: "#fff", fontSize: 14 }}>
                              0
                            </Text>
                          </View>
                          <Text style={{ color: "#fff", fontSize: 15 }}>
                            {" "}
                            C
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.miniBox}>
                        <Image
                          style={styles.WeatherImage}
                          source={{
                            uri: "https://raw.githubusercontent.com/sivasankar5456/weatherApp/main/public/images/wind.png",
                          }}
                        />
                        <Text style={{ color: "#fff", fontSize: 15 }}>
                          Wind: speed: {item.windspeed}{" "}
                          <View>
                            <Text style={{ color: "#fff", fontSize: 14 }}>
                              0
                            </Text>
                          </View>
                          <Text style={{ color: "#fff", fontSize: 15 }}>
                            {" "}
                            C
                          </Text>
                        </Text>
                      </View>
                      <Button
                        color={"crimson"}
                        title="Remove city from list"
                        onPress={() => removeCity(item.id)}
                      />
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  dashboard: {
    height: 230,
    width: 340,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    margin: 5,
    padding: 10,
    alignItems: "center",
    position: "relative",
  },
  line: {
    width: 320,
    backgroundColor: "transparent",
    margin: 5,
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  miniBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  WeatherImage: {
    height: 40,
    width: 40,
  },
});

//rgba(0, 0, 100, 0.450)
