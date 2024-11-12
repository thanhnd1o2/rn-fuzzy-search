package com.rnfuzzysearch

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
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

      promise.resolve(WritableNativeArray().apply {
        matches.forEach { match ->
          pushMap(
            WritableNativeMap().apply {
              (match as Map<*, *>).forEach matchPropsForEach@{ (key, value) ->
                key as String
                if (value == null) {
                  putNull(key)
                  return@matchPropsForEach
                }

                when (value) {
                  is String -> putString(key, value)
                  is Int -> putInt(key, value)
                  is Double -> putDouble(key, value)
                  is Long -> putLong(key, value)
                  is Boolean -> putBoolean(key, value)
                  is ReadableArray -> putArray(key, value)
                  is ReadableMap -> putMap(key, value)
                  else -> putString(key, value.toString())
                }

              }
            }
          )
        }
      })
    } catch (e: Exception) {
      promise.reject(e)
    }
  }
}
