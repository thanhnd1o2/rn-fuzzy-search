import { useMemo, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { search } from 'rn-fuzzy-search';
import my_data from './my_data';

export default function App() {
  const [result, setResult] = useState<string | undefined>();

  const data = useMemo(() => my_data.vi.map((item) => item.words).flat(), []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button
        title="Search"
        onPress={() => {
          search('water', data, {
            keyField: 'id',
            threshold: 0.1,
            fields: 'word',
            onlyIdReturned: false,
          })
            .then((data) => {
              console.log('Search', data);
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
