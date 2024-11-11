package com.rnfuzzysearch

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.whateverbest.search.FuzzySearcher
import com.whateverbest.search.Options
import com.whateverbest.search.PostProcessors

class RnFuzzySearchModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "RnFuzzySearch"
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun search(
    searchText: String,
    list: ReadableArray,
    options: ReadableMap,
    promise: Promise
  ) {
    try {
      val threshold = options.checkAndGetDouble("threshold", 0.5)
      val keys = options.getArray("keys")?.toArrayList() ?: emptyList()
      val includeScore = options.checkAndGetBoolean("includeScore", false)
      val orderByScore = options.checkAndGetBoolean("orderByScore", default = false)
      val limit = options.checkAndGetInt("limit")
      val fullSearch = options.checkAndGetBoolean("fullSearch", false)

      val data = list.toArrayList()

      val searcher = FuzzySearcher()
      searcher.addPostProcessor(
        PostProcessors::lowerCase,
        PostProcessors::removeSpecialCharacters,
        PostProcessors::removeExtraSpaces
      )

      val matches = searcher.match(
        searchText, data, options = Options(
          threshold,
          keys,
          includeScore,
          orderByScore,
          limit,
          fullSearch
        )
      )

      promise.resolve(matches)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }
}
