import { useMemo, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { search as fuzzySearch } from 'rn-fuzzy-search';
import my_data from './my_data';
import Fuse from 'fuse.js';

export default function App() {
  const [result] = useState<string | undefined>();

  const data = useMemo(
    () =>
      my_data.zh
        .map((item) => item.words)
        .flat()
        .map((item) => {
          return {
            _id: item._id,
            translation: item.translation,
          };
        }) as Array<any>,
    []
  );

  const searchNative = () => {
    const startTime = performance.now();

    fuzzySearch('连', data, {
      keys: ['translation'],
      threshold: 0.5,
      limit: 4,
    })
      .then((rs) => {
        const endTime = performance.now();
        console.log('Search native', rs);
        console.log(`Search native took ${endTime - startTime} milliseconds`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const searchJS = () => {
    const fuse = new Fuse(data, {
      keys: ['translation'],
      threshold: 0.5,
    });
    const startTime = performance.now();
    const rs = fuse.search('连', {
      limit: 4,
    });
    const endTime = performance.now();
    console.log('Search JS', rs);
    console.log(`Search JS took ${endTime - startTime} milliseconds`);
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
