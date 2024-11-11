import { useMemo, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { search as fuzzySearch } from 'rn-fuzzy-search';
import my_data from './my_data';
import Fuse from 'fuse.js';

export default function App() {
  const [result, setResult] = useState<string | undefined>();

  const data = useMemo(() => my_data.vi.map((item) => item.words).flat(), []);

  const searchNative = () => {
    fuzzySearch('unlock', data, {
      keyField: 'id',
      fields: 'word',
      threshold: 3,
    })
      .then((rs) => {
        console.log('Search native', rs);
        setResult(JSON.stringify(rs));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const searchJS = () => {
    const fuse = new Fuse(data, {
      keys: ['translation'],
      threshold: 3,
    });
    const rs = fuse.search('连');
    console.log('Search JS', rs);

    setResult(JSON.stringify(rs));
  };

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button title="Search Native" onPress={searchNative} />
      <Button title="Search JS" onPress={searchJS} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
