import React from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
};

type SimilarListProps = {
  products: Product[];
};

const SimilarList = ({ products }: SimilarListProps) => {
  return (
    <FlatList
      refreshControl={
        <RefreshControl
          colors={["#eeba15"]}
          refreshing={false}
          onRefresh={() => {
            Alert.alert("Refreshed");
          }}
        />
      }
      data={products}
      style={styles.itemlist}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.itemDetails}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
};

export default SimilarList;

const styles = StyleSheet.create({
  itemlist: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#888",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});
