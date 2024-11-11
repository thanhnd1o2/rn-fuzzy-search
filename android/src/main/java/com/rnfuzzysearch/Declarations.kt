package com.rnfuzzysearch

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap

fun ReadableMap.checkAndGetDouble(name: String): Double? {
  if (!this.hasKey(name)) return null
  return this.getDouble(name)
}

fun ReadableMap.checkAndGetDouble(name: String, default: Double): Double {
  if (!this.hasKey(name)) return default
  return this.getDouble(name)
}

fun ReadableMap.checkAndGetInt(name: String): Int? {
  if (!this.hasKey(name)) return null
  return this.getInt(name)
}

fun ReadableMap.checkAndGetInt(name: String, default: Int): Int {
  if (!this.hasKey(name)) return default
  return this.getInt(name)
}

fun ReadableMap.checkAndGetString(name: String): String? {
  if (!this.hasKey(name)) return null
  return this.getString(name)
}

fun ReadableMap.checkAndGetBoolean(name: String): Boolean? {
  if (!this.hasKey(name)) return null
  return this.getBoolean(name)
}

fun ReadableMap.checkAndGetBoolean(name: String, default: Boolean): Boolean {
  if (!this.hasKey(name)) return default
  return this.getBoolean(name)
}

fun ReadableMap.getEasyDynamic(name: String): Dynamic? {
  if (!this.hasKey(name)) return null
  return this.getDynamic(name)
}
