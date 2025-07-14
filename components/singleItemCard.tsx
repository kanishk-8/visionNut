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

interface SingleItemCardProps {
  product: Product;
}

const SingleItemCard = ({ product }: SingleItemCardProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image_url }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.desc}>{product.description}</Text>
      {product.brand && (
        <Text style={styles.brand}>Brand: {product.brand}</Text>
      )}
      {product.category && (
        <Text style={styles.category}>Category: {product.category}</Text>
      )}
    </View>
  );
};

export default SingleItemCard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    color: "#3fa4d1",
    marginBottom: 5,
  },
  desc: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  brand: {
    fontSize: 14,
    color: "#888",
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: "#888",
  },
});
