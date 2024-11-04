#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RnFuzzySearch, NSObject)

RCT_EXTERN_METHOD(search:(NSString *)searchText withList:(NSArray *)list withOptions:(NSDictionary *)options
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
