package com.rnfuzzysearch

import android.util.Log
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.intuit.fuzzymatcher.component.MatchService
import com.intuit.fuzzymatcher.domain.Document
import com.intuit.fuzzymatcher.domain.Element
import com.intuit.fuzzymatcher.domain.ElementType

class RnFuzzySearchModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  private fun createField(field: Any?, item: Any): Element<*>? {
    if (item is String) {
      return Element.Builder<String>().setValue(item).setType(ElementType.TEXT).createElement()
    }

    item as Map<*, *>
    val (fieldValue, weight, type) = when (field) {
      is String -> Triple(item[field].toString(), null, ElementType.TEXT)
      is Map<*, *> -> {
        val fieldKey = field["name"] as String
        val fieldValue = item[fieldKey]
        val weight = field["weight"] as Double?
        val type = field["type"] as String
        Triple(fieldValue, weight, ElementType.valueOf(type))
      }

      else -> Triple(item.toString(), null, ElementType.TEXT)
    }

    val elementBuilder: Element.Builder<Any> = when (type) {
      ElementType.NAME, ElementType.TEXT, ElementType.ADDRESS, ElementType.EMAIL, ElementType.PHONE ->
        Element.Builder<String>().setValue(fieldValue as String).setType(type)

      ElementType.NUMBER -> Element.Builder<Double>().setValue(fieldValue as Double).setType(type)
      ElementType.DATE -> Element.Builder<String>().setValue(fieldValue as String).setType(type)
      else -> Element.Builder<String>().setValue(fieldValue as String).setType(ElementType.TEXT)
    }
    if (weight != null) elementBuilder.setWeight(weight)
    return elementBuilder.createElement()
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
    val threshold = options.getEasyDouble("threshold", 0.2)
    val limit = options.getEasyInt("limit")
    val fields = options.getEasyDynamic("fields")
    val fieldsType = fields?.type ?: ReadableType.Null
    val keyField = options.getEasyString("keyField") ?: "id"
    val onlyIdReturned = options.getEasyBoolean("onlyIdReturned", true)

    val matchService = MatchService()
    val documentSearch = Document.Builder(searchText).addElement(
      Element.Builder<String>().setValue(searchText).setType(ElementType.TEXT).createElement()
    ).setThreshold(threshold).createDocument()

    val allowedFieldsType = listOf(ReadableType.Array, ReadableType.Map, ReadableType.String, ReadableType.Null)
    if (fieldsType !in allowedFieldsType) {
      return promise.reject("INVALID_FIELDS_TYPE", "Fields must be an array, object, string or null")
    }

    val fieldsList = when (fieldsType) {
      ReadableType.Null -> listOf(null)
      ReadableType.Array -> fields!!.asArray().toArrayList()
      ReadableType.Map -> listOf((fields as Dynamic).asMap().toHashMap())
      ReadableType.String -> listOf(fields!!.asString())
      else -> emptyList()
    }

    val documentList = list.toArrayList().map { item: Any ->
      val keyValue = when (item) {
        is String -> item
        is Map<*, *> -> item[keyField].toString()
        else -> item.toString()
      }

      Document.Builder(keyValue).apply {
        fieldsList.forEach { field ->
          addElement(createField(field, item))
        }
      }.createDocument()
    }

    val matchResults = matchService.applyMatch(documentSearch, documentList)[documentSearch]

    matchResults?.forEach { match ->
      val rs =
        (("Data: " + match.data) + " Matched With: " + match.matchedWith) + " Score: " + match.score.result
      Log.d("FuzzySearchModule", "search: $rs")
    }

    if (onlyIdReturned) {
      return promise.resolve(WritableNativeArray().apply {
        matchResults?.forEach { match ->
          pushString(match.matchedWith.key)
        }
      })
    }

    val keyValueMap = list.toArrayList().associateBy {
      when (it) {
        is String -> it
        is Map<*, *> -> it[keyField].toString()
        else -> it.toString()
      }
    }

    return promise.resolve(WritableNativeArray().apply {
      matchResults?.forEach { match ->
        pushMap(
          WritableNativeMap().apply {
            keyValueMap[match.matchedWith.key]?.let { item ->
              if (item is String) {
                putString("id", item)
                return@let
              }

              (item as Map<*, *>).forEach { (key, value) ->
                putString(key.toString(), value.toString())
              }
            }
          }
        )
      }
    })
  }

  companion object {
    const val NAME = "RnFuzzySearch"
  }
}
