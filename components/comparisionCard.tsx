import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface Product {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  price?: number;
  image_url?: string;
  description?: string;
}

interface ComparisionCardProps {
  product1: Product;
  product2: Product;
  reason?: string;
}

const ComparisionCard = ({
  product1,
  product2,
  reason,
}: ComparisionCardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Comparison</Text>
      {reason && <Text style={styles.reason}>{reason}</Text>}
      <View style={styles.row}>
        <View style={styles.productBox}>
          <Image source={{ uri: product1.image_url }} style={styles.image} />
          <Text style={styles.name}>{product1.name}</Text>
          <Text style={styles.price}>${product1.price}</Text>
          <Text style={styles.desc}>{product1.description}</Text>
        </View>
        <View style={styles.productBox}>
          <Image source={{ uri: product2.image_url }} style={styles.image} />
          <Text style={styles.name}>{product2.name}</Text>
          <Text style={styles.price}>${product2.price}</Text>
          <Text style={styles.desc}>{product2.description}</Text>
        </View>
      </View>
    </View>
  );
};

export default ComparisionCard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reason: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  row: {
    flexDirection: "column", // Changed from "row" to "column"
    justifyContent: "space-between",
  },
  productBox: {
    flex: 1,
    alignItems: "center",
    marginVertical: 10, // Changed from marginHorizontal to marginVertical
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 15,
    color: "#3fa4d1",
    marginBottom: 5,
  },
  desc: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
});
