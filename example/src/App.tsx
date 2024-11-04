import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { search } from 'rn-fuzzy-search';

export default function App() {
  const [result, setResult] = useState<string | undefined>();

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button
        title="Search"
        onPress={() => {
          // search(
          //   'Doe',
          //   [
          //     {
          //       id: '1',
          //       name: 'Steven Wilson',
          //     },
          //     {
          //       id: '2',
          //       name: 'John Doe',
          //     },
          //     {
          //       id: '3',
          //       name: 'Stephen Wilkson',
          //     },
          //   ],
          //   {
          //     keyField: 'id',
          //     fields: 'name',
          //     threshold: 0.1,
          //     onlyIdReturned: false,
          //   }
          // )
          //   .then((data) => {
          //     console.log('Search 1', data);
          //     setResult(JSON.stringify(data));
          //   })
          //   .catch((error) => {
          //     console.error(error);
          //     setResult(error.message);
          //   });
          search(
            'Steven Wilfson',
            ['Steven Wilson', 'John Doe', 'Stephen Wilfson'],
            {
              threshold: 0.4,
              fields: {
                name: null,
              },
              // onlyIdReturned: false,
            }
          )
            .then((data) => {
              console.log('Search 2', data);
              setResult(JSON.stringify(data));
            })
            .catch((error) => {
              console.error(error);
              setResult(error.message);
            });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
