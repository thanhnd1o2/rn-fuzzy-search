@objc(RnFuzzySearch)
class RnFuzzySearch: NSObject {

  @objc(search:withList:withOptions:withResolver:withRejecter:)
  func search(searchText: String, list: [Any], options: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    // Implement your search logic here
    // For now, just resolving with an empty array as a placeholder
    resolve([])
  }
}
