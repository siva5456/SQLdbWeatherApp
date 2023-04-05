import React, { useEffect, useState } from "react";
import { TextInput, View, StyleSheet, Button, Text } from "react-native";
import axios from "axios";

function SeachBar({ setSerachResult }) {
  const [searchVal, setSearchVal] = useState("");
  const [searchWord, setSearchWord] = useState("bengaluru");

  // console.log(searchWord);

  useEffect(() => {
    async function getWeather() {
      try {
        let { data } = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${searchWord}&units=metric&appid=1cb6532aea3c298a830a71380eace21e`
        );
        // console.log('=============================');
        // console.log(data);
        setSerachResult(data);
        setSearchVal("");
      } catch (e) {
        // console.log(e);
        alert("please enter valid city name");
      }
    }
    getWeather();
  }, [searchWord]);

  return (
    <View
      style={{
        flex: 1,
        width: 300,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      <TextInput
        onChangeText={setSearchVal}
        style={{
          height: 35,
          borderWidth: 1,
          borderColor: "#fff",
          width: 300,
          borderRadius: 8,
          paddingLeft: 25,
          backgroundColor: "transparent",
          color: "#fff",
        }}
        defaultValue={searchVal}
        placeholder="Search City"
        placeholderTextColor={"#fff"}
        keyboardType="numbers-and-punctuation"
        onSubmitEditing={() => setSearchWord(searchVal.toLowerCase().trim())}
      />
      {/* <Button title='Search' onPress={() => setSearchWord(searchVal.toLowerCase().trim())} /> */}
    </View>
  );
}

export default SeachBar;
