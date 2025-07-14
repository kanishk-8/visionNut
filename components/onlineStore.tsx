import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const OnlineStore = () => {
  const products = [
    {
      id: "1",
      name: "Product 1",
      price: "$10.00",
      description: "this is a very good product please buy it",
      image:
        "https://eiyrsoxthiqotxtywdlr.supabase.co/storage/v1/object/public/product-images//d6284a21-8587-4c00-9be2-72cb1d7e5029.jpg",
    },
    {
      id: "2",
      name: "Product 2",
      price: "$20.00",
      description: "this is a very good product please buy it",
      image:
        "https://eiyrsoxthiqotxtywdlr.supabase.co/storage/v1/object/public/product-images//55370e6a-122a-403e-862e-6b271800722b.jpg",
    },
    {
      id: "3",
      name: "Product 3",
      price: "$30.00",
      description: "this is a very good product please buy it",
      image:
        "https://eiyrsoxthiqotxtywdlr.supabase.co/storage/v1/object/public/product-images//4f6dfcf7-edad-4258-8bb5-ecf3ba1405bb.jpg",
    },
    {
      id: "4",
      name: "Product 4",
      price: "$40.00",
      description: "this is a very good product please buy it",
      image:
        "https://eiyrsoxthiqotxtywdlr.supabase.co/storage/v1/object/public/product-images//31b582bb-1114-471f-a4a5-ccc7a256045d.jpg",
    },
    {
      id: "5",
      name: "Product 5",
      price: "$50.00",
      description: "this is a very good product please buy it",
      image:
        "https://eiyrsoxthiqotxtywdlr.supabase.co/storage/v1/object/public/product-images//8c1002b9-c336-472f-8719-7e54a00da120.jpg",
    },
    // Add more products as needed
  ];
  return (
    <View style={{ flex: 1 }}>
      <FlatList
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
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default OnlineStore;

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
  button: {
    backgroundColor: "#3fa4d1",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
